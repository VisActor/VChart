import { barSpec, verifySpec } from '../helpers.mjs';

/** 正负值、堆叠与零基准线（bar）。 */
export default {
  createSpec: barSpec,
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
