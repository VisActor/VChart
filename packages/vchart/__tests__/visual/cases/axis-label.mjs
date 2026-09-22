import { verifySpec } from '../helpers.mjs';

/** 长文本、旋转和轴布局（axis-label-layout）。 */
export default {
  createSpec() {
    // 显式旋转长标签，避免依赖自动阈值才能触发目标行为。
    return {
      type: 'bar',
      data: {
        id: 'data',
        values: ['North America', 'South America', 'Central Europe', 'South East Asia', 'Western Pacific'].map(
          (x, i) => ({ x, y: 10 + i * 7 })
        )
      },
      xField: 'x',
      yField: 'y',
      axes: [
        { orient: 'bottom', label: { autoRotate: false, style: { angle: -35 } } },
        { orient: 'left', title: { visible: true, text: 'Revenue' } }
      ]
    };
  },
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
