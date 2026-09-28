import { verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：累计、总计与连接线（waterfall）。
 * 图表类型：waterfall。
 * 关键配置：total.type、total.tagField、label.visible。
 * 场景条件：固定正负增量和一个由字段标记的总计项。
 * 最终检查：核对累计与总计输入，比较连接线和标签的最终截图。
 * 覆盖边界：不验证横向瀑布图或所有总计模式。
 */
export default {
  createSpec() {
    // 总计项使用字段标记，不重复计算累计值。
    return {
      type: 'waterfall',
      data: {
        id: 'data',
        values: [
          { x: 'Start', y: 80 },
          { x: 'Growth', y: 25 },
          { x: 'Cost', y: -35 },
          { x: 'Other', y: 10 },
          { x: 'Total', total: true }
        ]
      },
      xField: 'x',
      yField: 'y',
      total: { type: 'field', tagField: 'total' },
      label: { visible: true }
    };
  },
  async verify(page) {
    // 核对目标输入，避免错误 spec 或空数据通过图片对比。
    await verifySpec(page, this.createSpec());
  }
};
