import { verifyRendered } from '../../../helpers.mjs';
/**
 * 验证目的：三节点发散色域的连续图例覆盖完整 [-1, 1]。
 * 图表类型：heatmap。关键配置：scales.domain 含中间节点，图例仅绑定 scale。
 * 最终检查：实际图例组件的最小/最大值、真实绘制及截图；不测试拖动过滤。
 */
export default {
  createSpec() {
    return {
      type: 'heatmap',
      animation: false,
      data: {
        id: 'matrix',
        values: [
          { x: 'negative', y: 'r', value: -1 },
          { x: 'zero', y: 'r', value: 0 },
          { x: 'positive', y: 'r', value: 1 }
        ]
      },
      xField: 'x',
      yField: 'y',
      valueField: 'value',
      cell: { style: { fill: { scale: 'correlation', field: 'value' } } },
      scales: [{ id: 'correlation', type: 'linear', domain: [-1, 0, 1], range: ['#C35A54', '#F5F4EE', '#3D7EB0'] }],
      legends: { type: 'color', scale: 'correlation', orient: 'right', filter: false, slidable: false }
    };
  },
  async verify(page) {
    await verifyRendered(page);
    await page.evaluate(() => {
      const legend = window.__visualChart
        .getChart()
        .getAllComponents()
        .find(c => c.type === 'colorLegend')
        .getVRenderComponents()[0];
      if (legend.attribute.min !== -1 || legend.attribute.max !== 1) {
        throw new Error(`Expected full [-1,1] legend, got ${legend.attribute.min},${legend.attribute.max}`);
      }
    });
  }
};
