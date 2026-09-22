import { verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：缺失值与折线连接（data-zoom-brush-line）。
 * 图表类型：line。
 * 关键配置：invalidType、line.style、point.visible。
 * 场景条件：两个有效值之间包含 null，invalidType 固定为 break。
 * 最终检查：核对断点 spec、有效绘制与最终截图。
 * 覆盖边界：不验证连接缺失值或其他插值策略。
 */
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
