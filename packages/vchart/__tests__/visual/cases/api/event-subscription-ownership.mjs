/**
 * 验证目的：复用同一回调的跨 source 订阅完整解绑，并保留其他 Event 实例的监听。
 * 图表类型：bar；固定数据，关闭动画和 tooltip。
 * 场景条件：两个 Event 实例共享真实 Dispatcher；Chromium 鼠标输入同时触发 chart/canvas。
 * 最终检查：chart.off、Event.off、指定 source 解绑和 release 隔离；保留的回调将柱数据改为 20。
 * 覆盖边界：延迟回调取消及 window source 由真实事件链单测覆盖。
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
      const sibling = new window.VChart.Event(chart.event._eventDispatcher, 'desktop-browser');
      const state = { sibling, phase: 'before', calls: {}, observers: {}, userEntries: -1 };
      const callback = params => {
        (state.calls[state.phase] ??= []).push(params.source);
      };
      state.callback = callback;
      for (const source of ['chart', 'canvas']) {
        chart.on('pointermove', { source }, callback);
        sibling.on('pointermove', { source }, callback);
      }
      sibling.on('pointermove', () => {
        state.observers[state.phase] = (state.observers[state.phase] ?? 0) + 1;
        if (state.phase === 'afterDirectOff') chart.updateData('data', [{ x: 'A', y: 20 }]);
      });
      window.__subscriptionOwnership = state;
      const box = chart.getCanvas().getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    });
    try {
      await page.mouse.move(point.x, point.y);
      await page.evaluate(() => {
        const chart = window.__visualChart;
        const s = window.__subscriptionOwnership;
        chart.off('pointermove', s.callback);
        s.userEntries = chart._userEvents.filter(e => e.handler === s.callback).length;
        s.phase = 'afterPublicOff';
      });
      await page.mouse.move(point.x + 2, point.y);
      await page.evaluate(() => {
        const s = window.__subscriptionOwnership;
        for (const source of ['chart', 'canvas']) window.__visualChart.event.on('pointermove', { source }, s.callback);
        s.phase = 'beforeDirectOff';
      });
      await page.mouse.move(point.x + 4, point.y);
      await page.evaluate(() => {
        window.__visualChart.event.off('pointermove');
        window.__subscriptionOwnership.phase = 'afterDirectOff';
      });
      await page.mouse.move(point.x + 6, point.y);
      await page.evaluate(() => {
        const s = window.__subscriptionOwnership;
        s.sibling.off('pointermove', { source: 'chart' }, s.callback);
        s.phase = 'afterSourceOff';
      });
      await page.mouse.move(point.x + 8, point.y);
      await page.evaluate(() => {
        const s = window.__subscriptionOwnership;
        s.sibling.release();
        s.phase = 'afterRelease';
      });
      await page.mouse.move(point.x + 10, point.y);
      await page.mouse.move(900, 700);
    } finally {
      await page.evaluate(() => window.__subscriptionOwnership.sibling.release());
    }
  },
  async verify(page) {
    await page.evaluate(async () => {
      const s = window.__subscriptionOwnership;
      const expected = {
        before: ['canvas', 'canvas', 'chart', 'chart'],
        afterPublicOff: ['canvas', 'chart'],
        beforeDirectOff: ['canvas', 'canvas', 'chart', 'chart'],
        afterDirectOff: ['canvas', 'chart'],
        afterSourceOff: ['canvas'],
        afterRelease: []
      };
      const data = window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData;
      if (
        !s ||
        s.userEntries !== 0 ||
        data[0].y !== 20 ||
        Object.entries(expected).some(
          ([phase, sources]) =>
            JSON.stringify([...(s.calls[phase] ?? [])].sort()) !== JSON.stringify(sources) ||
            (s.observers[phase] ?? 0) !== (phase === 'afterRelease' ? 0 : 1)
        )
      ) {
        const { assertionError } = await import('/suite/assertions.mjs');
        throw assertionError(
          '订阅解绑或实例隔离异常：' +
            JSON.stringify({ calls: s?.calls, observers: s?.observers, userEntries: s?.userEntries, value: data[0].y })
        );
      }
    });
  }
};
