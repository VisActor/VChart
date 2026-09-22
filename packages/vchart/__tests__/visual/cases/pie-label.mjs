import { verifySpec } from '../helpers.mjs';

/** 外侧标签与引导线（pie-label）。 */
export default {
  createSpec() {
    // 小扇区与大扇区混合验证标签避让。
    return {
      type: 'pie',
      data: { id: 'data', values: [60, 20, 8, 5, 4, 3].map((value, i) => ({ name: `Category ${i + 1}`, value })) },
      categoryField: 'name',
      valueField: 'value',
      outerRadius: 0.7,
      label: { visible: true, position: 'outside' },
      legends: { visible: false }
    };
  },
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
