import { graphicCenter } from '../../../helpers.mjs';

/**
 * 验证目的：标题重测后，图例过滤触发增量布局时不复用可用区尺寸。
 * 图表类型：line。
 * 关键配置：普通标题、两个离散图例、自动数值轴。
 * 场景条件：resize 一次且标题高度不变，然后取消包含最大值的首个图例。
 * 最终检查：图例与数据确实被过滤，标题缓存和绘图区高度保持 resize 后的正常尺寸。
 * 覆盖边界：不验证浮动标题、动态字体和自定义布局。
 */
export default {
  createSpec() {
    // 使用不依赖业务环境的固定数据。
    return {
      type: 'line',
      animation: false,
      title: { text: 'Regional sales', textStyle: { fontSize: 12, lineHeight: 16 } },
      legends: { visible: true, orient: 'bottom' },
      data: {
        id: 'data',
        values: [
          { month: 'Jan', value: 120, region: 'Alpha' },
          { month: 'Feb', value: 150, region: 'Alpha' },
          { month: 'Jan', value: 80, region: 'Beta' },
          { month: 'Feb', value: 90, region: 'Beta' }
        ]
      },
      xField: 'month',
      yField: 'value',
      seriesField: 'region'
    };
  },
  async exercise(page) {
    // 先保留正常布局尺寸，再通过公开 resize API 触发相同高度的标题重测。
    await page.evaluate(async () => {
      const instance = window.__visualChart;
      const chart = instance.getChart();
      window.__titleLayoutBefore = {
        titleHeight: chart.getComponentsByType('title')[0].getLayoutRect().height,
        regionHeight: chart.getAllRegions()[0].getLayoutRect().height
      };
      document.getElementById('chart').style.width = '801px';
      await instance.resize(801, 600);
    });
    const point = await graphicCenter(page, 'legendItem');
    await page.mouse.click(point.x, point.y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 同时核对交互发生与布局结果，动作被抑制时也必须失败。
    await page.waitForFunction(() => {
      const instance = window.__visualChart;
      const chart = instance.getChart();
      const data = chart.getAllSeries()[0].getViewData().latestData;
      const before = window.__titleLayoutBefore;
      return (
        instance.getLegendSelectedDataByIndex().length === 1 &&
        data.length === 2 &&
        data.every(item => item.region === 'Beta') &&
        chart.getComponentsByType('title')[0].getLayoutRect().height === before.titleHeight &&
        chart.getAllRegions()[0].getLayoutRect().height === before.regionHeight &&
        before.regionHeight > 0
      );
    });
  }
};
