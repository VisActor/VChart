import { verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：外侧标签与引导线（pie-label）。
 * 图表类型：pie。
 * 关键配置：label.position、label.visible、outerRadius。
 * 场景条件：固定大扇区与多个小扇区，标签位置为 outside。
 * 最终检查：核对 spec、有效绘制，比较外侧标签与引导线的最终截图。
 * 覆盖边界：不验证标签点击，也不代表全部避让分支。
 */
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
