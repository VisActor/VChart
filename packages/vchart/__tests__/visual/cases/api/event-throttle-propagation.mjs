/**
 * 验证目的：throttle 首次同步回调仍能通过原事件拦截后续 Stage 监听器。
 * 图表类型：bar；固定数据，关闭动画和 tooltip。
 * 关键配置：公开 pointerdown 订阅设置 throttle: 20，调用 stopImmediatePropagation。
 * 场景条件：真实 Chromium 点击；Stage capture 先记录原事件，宿主监听器在图表订阅后注册。
 * 最终检查：图表回调同步收到原事件一次，后续宿主回调为零；截图检查固定图表。
 * 覆盖边界：延迟尾调用的数据保存另由 injected-stage 和单元测试覆盖。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      width: 400,
      height: 300,
      autoFit: false,
      animation: false,
      xField: 'x',
      yField: 'y',
      data: { id: 'data', values: [{ x: 'A', y: 10 }] },
      tooltip: { visible: false }
    };
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const chart = window.__visualChart;
      const stage = chart.getStage();
      const state = { chartCalls: 0, hostCalls: 0, originalPreserved: false };
      state.onCapture = event => {
        state.original = event;
      };
      state.onChart = params => {
        state.chartCalls++;
        state.originalPreserved = params.event === state.original;
        params.event.stopImmediatePropagation();
      };
      state.onHost = () => state.hostCalls++;
      stage.addEventListener('pointerdown', state.onCapture, { capture: true });
      chart.on('pointerdown', { throttle: 20 }, state.onChart);
      stage.addEventListener('pointerdown', state.onHost);
      window.__throttlePropagation = state;
      const box = chart.getCanvas().getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    });
    await page.mouse.click(point.x, point.y);
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const stage = chart.getStage();
      const state = window.__throttlePropagation;
      chart.off('pointerdown', state.onChart);
      stage.removeEventListener('pointerdown', state.onCapture, { capture: true });
      stage.removeEventListener('pointerdown', state.onHost);
    });
    await page.mouse.move(900, 700);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { chartCalls, hostCalls, originalPreserved } = window.__throttlePropagation;
      if (chartCalls !== 1 || hostCalls !== 0 || !originalPreserved) {
        const { assertionError } = await import('/suite/assertions.mjs');
        throw assertionError(
          'throttle 同步回调未保留原事件的传播控制：' + JSON.stringify({ chartCalls, hostCalls, originalPreserved })
        );
      }
    });
  }
};
