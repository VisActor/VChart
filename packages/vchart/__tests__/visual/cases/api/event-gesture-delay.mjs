/**
 * 验证目的：延迟手势回调保留完整 pinch 载荷，缩放回调能够实际更新图表数据。
 * 图表类型：bar；固定数据，关闭动画和 tooltip。
 * 关键配置：gestureConfig、pinch debounce 和 throttle 尾调用。
 * 场景条件：Chromium 原生双指输入，先放大到 1.5 倍，再放大到 2 倍。
 * 最终检查：scale、center、points 完整，柱数据由 10 更新为 20；截图检查更新后的图表。
 * 覆盖边界：不替代移动真机验证；同步传播及注入事件池另有独立用例。
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
    const session = await page.context().newCDPSession(page);
    try {
      await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
      await page.evaluate(() => {
        const spec = window.__visualChart.getSpec();
        window.__visualChart.release();
        const chart = new window.VChart.default(spec, {
          dom: 'chart',
          autoFit: false,
          animation: false,
          gestureConfig: {}
        });
        window.__visualChart = chart;
        chart.renderSync();
        chart.getCanvas().style.touchAction = 'none';
        const state = { syncCalls: 0, throttleCalls: 0 };
        const payload = event => ({ scale: event.scale, center: event.center, points: event.points });
        chart.on('pinch', () => state.syncCalls++);
        chart.on('pinch', { debounce: 1000 }, ({ event }) => {
          state.debounced = payload(event);
          chart.updateData('data', [{ x: 'A', y: event.scale * 10 }]);
        });
        chart.on('pinch', { throttle: 1000 }, ({ event }) => {
          state.throttleCalls++;
          state.throttled = payload(event);
        });
        window.__gestureDelay = state;
      });
      const points = x => [
        { x: 100, y: 180, id: 1 },
        { x, y: 180, id: 2 }
      ];
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(200) });
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(250) });
      await page.waitForFunction(() => window.__gestureDelay.syncCalls === 1);
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(300) });
      await page.waitForFunction(() => window.__gestureDelay.syncCalls === 2);
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(() => window.__gestureDelay.debounced && window.__gestureDelay.throttleCalls === 2);
      await page.evaluate(() => window.__visualChart.off('pinch'));
    } finally {
      await session.detach();
    }
  },
  async verify(page) {
    await page.evaluate(async () => {
      const state = window.__gestureDelay;
      const expected = JSON.stringify({
        scale: 2,
        center: { x: 150, y: 180 },
        points: [
          { x: 100, y: 180 },
          { x: 300, y: 180 }
        ]
      });
      const data = window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData;
      if (
        JSON.stringify(state?.debounced) !== expected ||
        JSON.stringify(state?.throttled) !== expected ||
        data[0].y !== 20
      ) {
        const { assertionError } = await import('/suite/assertions.mjs');
        throw assertionError('延迟 pinch 载荷丢失或图表数据未更新：' + JSON.stringify({ state, value: data[0].y }));
      }
    });
  }
};
