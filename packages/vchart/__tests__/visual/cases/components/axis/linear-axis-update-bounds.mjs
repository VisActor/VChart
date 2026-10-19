import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：数据和数值轴显式范围同时更新时，实际 scale 应用新的 min/max。
 * 图表类型：bar。关键配置：连续横轴、x2Field、nice:false。
 * 场景条件：初始区间 [0,4]，同一实例切换为常数样本的 [-0.5,0.5] 区间。
 * 最终检查：实际 scale 域、柱宽与频数；未执行更新或仅更新 spec 均不能通过。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      animation: false,
      data: {
        id: 'bins',
        values: [
          { start: 0, end: 2, count: 2 },
          { start: 2, end: 4, count: 3 }
        ]
      },
      xField: 'start',
      x2Field: 'end',
      yField: 'count',
      barMinWidth: '0%',
      axes: [{ orient: 'bottom', type: 'linear', min: 0, max: 4, nice: false, zero: false }]
    };
  },
  async exercise(page) {
    await page.evaluate(async () => {
      const chart = window.__visualChart;
      await chart.updateSpec({
        ...chart.getSpec(),
        data: { id: 'bins', values: [{ start: -0.5, end: 0.5, count: 3 }] },
        axes: [{ orient: 'bottom', type: 'linear', min: -0.5, max: 0.5, nice: false, zero: false }]
      });
    });
    await interactionFrame(page);
  },
  async verify(page) {
    await verifyRendered(page);
    await page.evaluate(() => {
      const series = window.__visualChart.getChart().getAllSeries()[0];
      const axis = series.getXAxisHelper();
      const domain = axis.getScale(0).domain();
      const bars = series.getSeriesMark().getGraphics();
      const expectedWidth = Math.abs(axis.valueToPosition(0.5) - axis.valueToPosition(-0.5));
      if (
        domain[0] !== -0.5 ||
        domain[1] !== 0.5 ||
        bars.length !== 1 ||
        bars[0].context.data[0].count !== 3 ||
        Math.abs(Math.abs(bars[0].attribute.x1 - bars[0].attribute.x) - expectedWidth) > 1e-6
      ) {
        throw new Error('Updated explicit bounds must control the actual scale and bar geometry');
      }
    });
  }
};
