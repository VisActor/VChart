import { verifyRendered } from '../../../helpers.mjs';

/**
 * 验证目的：折线图按最终轴域分配断轴两侧的长度。
 * 关键配置：线性轴的 min、max 及 breaks.scopeType: 'length'。
 * 场景条件：单个极端值紧邻断轴上边界，下边界仍有多条折线。
 * 最终检查：断点共享像素位置，且上下两段的长度为 7:1。
 */
export default {
  createSpec() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return {
      type: 'line',
      xField: 'month',
      yField: 'value',
      seriesField: 'series',
      data: {
        values: months.flatMap((month, i) => [
          { month, value: [0, -1, 23100.7, 2, 0][i], series: 'A' },
          { month, value: [1, 8, 4, 53, 2][i], series: 'B' }
        ])
      },
      axes: [
        { orient: 'bottom', type: 'band' },
        {
          id: 'value-axis',
          orient: 'left',
          type: 'linear',
          min: -20,
          max: 23120,
          nice: false,
          breaks: [{ range: [120, 23100], scopeType: 'length' }],
          tick: { tickMode: 'd3' },
          domainLine: { visible: true }
        }
      ]
    };
  },
  async verify(page) {
    await verifyRendered(page, 'series');
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const axis = window.__visualChart.getChart().getComponentByUserId('value-axis');
      const [min, lowerBreak, upperBreak, max] = [-20, 120, 23100, 23120].map(value => axis.valueToPosition(value));
      const expectedBreak = min + (max - min) * (7 / 8);
      if (Math.abs(lowerBreak - expectedBreak) > 0.01 || Math.abs(upperBreak - expectedBreak) > 0.01) {
        throw assertionError(`截断位置应为 ${expectedBreak}，实际为 ${lowerBreak}、${upperBreak}`);
      }
    });
  }
};
