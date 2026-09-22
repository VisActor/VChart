import { verifySpec } from '../helpers.mjs';

/** 缺失值与折线连接（data-zoom-brush-line）。 */
export default {
  createSpec() {
    // 使用空值验证断点，保留标记点便于发现数据错位。
    return {
      type: 'line',
      data: { id: 'data', values: [12, 28, null, 18, 42].map((y, x) => ({ x: String(x), y })) },
      xField: 'x',
      yField: 'y',
      line: { style: { lineWidth: 3 } },
      point: { visible: true },
      invalidType: 'break'
    };
  },
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
