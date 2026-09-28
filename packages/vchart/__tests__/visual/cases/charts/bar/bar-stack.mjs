import { barSpec, verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：正负值、堆叠与零基准线（bar）。
 * 图表类型：bar。
 * 关键配置：stack、seriesField，使用默认坐标轴。
 * 场景条件：固定两组数据，包含正负值。
 * 最终检查：核对堆叠 spec、有效绘制与最终截图。
 * 覆盖边界：不验证百分比堆叠或数据更新。
 */
export default {
  createSpec: barSpec,
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
