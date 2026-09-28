import { verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：散点位置、大小及符号（scatter）。
 * 图表类型：scatter。
 * 关键配置：sizeField、size、point.style.symbolType。
 * 场景条件：固定三个数值坐标和三种大小，使用 diamond 符号。
 * 最终检查：核对编码 spec、有效绘制与最终截图。
 * 覆盖边界：不覆盖全部符号、重叠和采样策略。
 */
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
