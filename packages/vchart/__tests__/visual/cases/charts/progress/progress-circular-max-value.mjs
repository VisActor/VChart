import { verifyRendered, verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：防止圆形进度图忽略 maxValue 并画成整圈（#3037）。
 * 图表类型：circularProgress。
 * 关键配置：maxValue 为 1000，保留 seriesField 及圆角端点。
 * 场景条件：单条值为 10 的数据，未配置角度轴上限。
 * 最终检查：进度弧实际跨度为 3.6°，截图检查圆环渲染。
 * 覆盖边界：只检查初次渲染及 maxValue 的回退路径。
 */
export default {
  createSpec() {
    // 保留问题报告中的数值比例及触发堆叠的 seriesField。
    return {
      type: 'circularProgress',
      data: [{ id: 'progress', values: [{ category: 'A', value: 10 }] }],
      valueField: 'value',
      categoryField: 'category',
      seriesField: 'category',
      radius: 0.8,
      innerRadius: 0.7,
      roundCap: true,
      cornerRadius: 5,
      maxValue: 1000
    };
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
    // 读取实际进度图元的角度，避免只验证输入 spec。
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const series = window.__visualChart.getChart().getAllSeries()[0];
      const [progress] = series.getSeriesMark().getGraphics();
      const { startAngle, endAngle } = progress.attribute;
      const degrees = ((endAngle - startAngle) * 180) / Math.PI;
      if (!Number.isFinite(degrees)) throw new Error('进度弧的起止角无效');
      if (Math.abs(degrees - 3.6) > 1e-6) {
        throw assertionError(`进度弧跨度应为 3.6°，实际为 ${degrees}°`);
      }
    });
  }
};
