import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：updateSpec 切换主题和分类轴样式后，轴应用新 spec。
 * 图表类型：bar。关键配置：显式 band 轴、theme.component.axis；轴 spec 保持不变。
 * 场景条件：初始深色文字；更新为深背景与浅色文字。
 * 最终检查：实际轴标签 fill 与可见边界；未执行更新不能通过。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      animation: false,
      data: {
        id: 'data',
        values: [
          { category: 'A', value: 2 },
          { category: 'B', value: 4 }
        ]
      },
      xField: 'category',
      yField: 'value',
      theme: { type: 'light', component: { axis: { label: { style: { fill: '#17212B' } } } } },
      axes: [{ orient: 'bottom', type: 'band' }]
    };
  },
  async exercise(page) {
    await page.evaluate(async () => {
      const chart = window.__visualChart;
      await chart.updateSpec({
        ...chart.getSpec(),
        theme: { type: 'dark', background: '#17212B', component: { axis: { label: { style: { fill: '#CFD8E3' } } } } },
        axes: [{ orient: 'bottom', type: 'band' }]
      });
    });
    await interactionFrame(page);
  },
  async verify(page) {
    await verifyRendered(page);
    await page.evaluate(() => {
      const labels = window.__visualChart
        .getStage()
        .findAll(g => g.name === 'axis-label' && ['A', 'B'].includes(g.attribute.text), true);
      if (labels.length !== 2 || labels.some(g => g.attribute.fill !== '#CFD8E3' || g.AABBBounds.width() <= 0)) {
        throw new Error('Band axis must apply the new spec after theme update');
      }
    });
  }
};
