import { barSpec, graphicCenter } from '../../../helpers.mjs';

/**
 * 验证目的：图例点击筛选（multiple-legend-layout）。
 * 图表类型：bar。
 * 关键配置：legends.orient、legends.position、seriesField。
 * 场景条件：固定两组数据和两个离散图例项。
 * 最终检查：点击真实图例，验证选中项减少一个且可视数据变为三条。
 * 覆盖边界：不验证连续图例、多图例或自定义图例项。
 */
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
