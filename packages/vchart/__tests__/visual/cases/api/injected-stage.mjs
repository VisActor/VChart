/**
 * 验证目的：调用方提供 Stage 时保留调度权、执行图表绘制准备，并正确解绑注入的事件源。
 * 图表类型：bar；固定默认 crosshair 验证 beforeRender 的实际图元结果。
 * 场景条件：复用一个真实 Stage，暂停原生事件监听后 canvas/window 订阅不能绕过该输入源。
 * 最终检查：默认 crosshair 可见；拒绝期间零事件、恢复后有事件；释放图表不释放 Stage 或遗留订阅。
 * 覆盖边界：不验证宿主坐标映射、冻结窗格或原生 HTML Tooltip 定位。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      width: 800,
      height: 600,
      autoFit: false,
      animation: false,
      xField: ['x', 's'],
      seriesField: 's',
      yField: 'y',
      data: {
        id: 'data',
        values: [
          { x: 'A', s: 'Gold', y: 9 },
          { x: 'A', s: 'Silver', y: 5 },
          { x: 'B', s: 'Gold', y: 7 },
          { x: 'B', s: 'Silver', y: 4 }
        ]
      },
      tooltip: { visible: true, renderMode: 'html' }
    };
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const owner = window.__visualChart;
      const stage = owner.getStage();
      let subscriptions = 0;
      const wrap = source => ({
        on(type, listener) {
          subscriptions++;
          source.on(type, listener);
        },
        off(type, listener) {
          subscriptions--;
          source.off(type, listener);
        }
      });
      const source = { canvas: wrap(stage.eventSystem.input.canvas), window: wrap(stage.eventSystem.input.window) };
      const count = () => subscriptions;
      const initialListeners = count();
      const initialChildren = stage.defaultLayer.childrenCount;
      const initialHooks = stage.hooks.beforeRender.taps.length;
      stage.disableIncrementalAutoRender();
      const chart = new window.VChart.default(
        {
          ...owner.getSpec(),
          crosshair: { xField: { visible: true, defaultSelect: { axisIndex: 0, datum: 'A' }, line: { type: 'rect' } } }
        },
        { stage, eventSource: source, autoFit: false, animation: false, poptip: false }
      );
      chart.renderSync();
      stage.render();
      const keepsScheduling = stage.pluginService.findPluginsByName('IncrementalAutoRenderPlugin').length === 0;
      const rect = stage.find(g => g.name === 'crosshair-rect', true);
      const crosshairVisible =
        !!rect && rect.attribute.visible !== false && rect.attribute.width > 0 && rect.attribute.height > 0;
      const counts = { canvas: 0, window: 0 };
      const dimensions = [];
      chart.on('dimensionHover', p => dimensions.push(p.action));
      chart.on('pointermove', { source: 'canvas' }, () => counts.canvas++);
      chart.on('pointerup', { source: 'window' }, () => counts.window++);
      window.__injectedStage = {
        chart,
        stage,
        count,
        counts,
        dimensions,
        initialListeners,
        initialChildren,
        initialHooks,
        crosshairVisible,
        keepsScheduling,
        target: stage.eventSystem.domElement
      };
      stage.eventSystem.setTargetElement(null);
      const box = owner.getCanvas().getBoundingClientRect();
      const bars = chart
        .getChart()
        .getAllMarks()
        .flatMap(mark => mark.getGraphics?.() || [])
        .filter(g => g.type === 'rect' && g.globalAABBBounds.height() > 2)
        .sort((a, b) => a.globalAABBBounds.x1 - b.globalAABBBounds.x1);
      const center = g => ({
        x: box.x + (g.globalAABBBounds.x1 + g.globalAABBBounds.x2) / 2,
        y: box.y + (g.globalAABBBounds.y1 + g.globalAABBBounds.y2) / 2
      });
      return { ...center(bars[0]), sibling: center(bars[1]) };
    });
    await page.mouse.click(point.x, point.y);
    await page.evaluate(() => {
      const state = window.__injectedStage;
      state.blocked = { ...state.counts };
      state.stage.eventSystem.setTargetElement(state.target);
    });
    await page.mouse.move(point.x + 1, point.y + 1);
    await page.mouse.click(point.x + 1, point.y + 1);
    await page.mouse.move(point.sibling.x, point.sibling.y);
    await page.evaluate(() => {
      const state = window.__injectedStage;
      state.sameDimension = state.dimensions[0] === 'enter' && !state.dimensions.includes('leave');
      state.stage.eventSystem.cancelPointer(1);
      state.stage.eventSystem.cancelPointer(1);
      state.cancelledOnce = state.dimensions.filter(action => action === 'leave').length === 1;
      state.allowed = { ...state.counts };
      // Cleanup must use the source actually subscribed, even if options have since been replaced.
      const unexpected = {
        on() {},
        off() {
          throw new Error('unsubscribed from the wrong source');
        }
      };
      state.chart.getCompiler().getOption().eventSource = { canvas: unexpected, window: unexpected };
      state.chart.release();
      state.cleaned =
        state.stage.releaseStatus !== 'released' &&
        state.count() === state.initialListeners &&
        state.stage.defaultLayer.childrenCount === state.initialChildren &&
        state.stage.hooks.beforeRender.taps.length === state.initialHooks;
      state.stage.render();
    });
  },
  async verify(page) {
    await page.evaluate(() => {
      const s = window.__injectedStage;
      if (
        !s.sameDimension ||
        !s.cancelledOnce ||
        !s.crosshairVisible ||
        !s.keepsScheduling ||
        s.blocked.canvas !== 0 ||
        s.blocked.window !== 0 ||
        !s.allowed.canvas ||
        !s.allowed.window ||
        !s.cleaned
      ) {
        throw new Error(
          '传入 Stage 的绘制、输入或释放边界异常：' +
            JSON.stringify({
              dimensions: s.dimensions,
              sameDimension: s.sameDimension,
              cancelledOnce: s.cancelledOnce,
              crosshairVisible: s.crosshairVisible,
              keepsScheduling: s.keepsScheduling,
              blocked: s.blocked,
              allowed: s.allowed,
              cleaned: s.cleaned
            })
        );
      }
    });
  }
};
