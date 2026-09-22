import { barSpec, graphicCenter } from '../helpers.mjs';

/** 图例点击筛选（multiple-legend-layout）。 */
export default {
  createSpec() {
    // 使用固定顺序的两个图例项。
    return { ...barSpec(), legends: { visible: true, orient: 'bottom', position: 'start' } };
  },
  async exercise(page) {
    // 点击真实图例，并移出鼠标以稳定最终截图。
    await page.evaluate(() => {
      window.__legendBefore = window.__visualChart.getLegendSelectedDataByIndex().length;
    });
    const point = await graphicCenter(page, 'legendItem');
    await page.mouse.click(point.x, point.y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 筛选必须同时改变选中项和实际数据。
    await page.waitForFunction(
      () =>
        window.__visualChart.getLegendSelectedDataByIndex().length === window.__legendBefore - 1 &&
        window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData.length === 3
    );
  }
};
