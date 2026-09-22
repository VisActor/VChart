import { verifySpec } from '../helpers.mjs';

/** 散点位置、大小及符号（scatter）。 */
export default {
  createSpec() {
    // 使用数值坐标和大小通道覆盖散点绘制。
    return {
      type: 'scatter',
      data: {
        id: 'data',
        values: [
          { x: 1, y: 4, size: 12 },
          { x: 3, y: 2, size: 24 },
          { x: 5, y: 7, size: 36 }
        ]
      },
      xField: 'x',
      yField: 'y',
      sizeField: 'size',
      size: [12, 36],
      point: { style: { symbolType: 'diamond' } }
    };
  },
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
