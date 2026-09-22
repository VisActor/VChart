import { graphicCenter } from '../../../helpers.mjs';

/**
 * 验证目的：拖动后的可视范围（datazoom）。
 * 图表类型：bar。
 * 关键配置：dataZoom[].start、dataZoom[].end、dataZoom[].filterMode。
 * 场景条件：固定十二条数据，初始范围为完整区间。
 * 最终检查：拖动起始手柄，验证 start 大于 0.1 且可视数据少于十二条。
 * 覆盖边界：不验证滚动条、缩放后更新数据或全部交互组合。
 */
export default {
  createSpec() {
    // 给缩放控件留出明确的初始范围。
    return {
      type: 'bar',
      data: {
        id: 'data',
        values: Array.from({ length: 12 }, (_, i) => ({ x: `M${i + 1}`, y: 10 + ((i * 13) % 40) }))
      },
      xField: 'x',
      yField: 'y',
      dataZoom: [{ orient: 'bottom', start: 0, end: 1, filterMode: 'filter' }]
    };
  },
  async exercise(page) {
    // 监听公开事件，只有拖动真正改变范围才完成测试。
    await page.evaluate(() => {
      window.__visualChart.on('dataZoomChange', event => {
        window.__zoomResult = event.value;
      });
    });
    const point = await graphicCenter(page, 'startHandler');
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x + 180, point.y, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 缩放事件和可视数据必须均已改变。
    await page.waitForFunction(() => window.__zoomResult?.start > 0.1);
    await page.waitForFunction(
      () => window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData.length < 12
    );
  }
};
