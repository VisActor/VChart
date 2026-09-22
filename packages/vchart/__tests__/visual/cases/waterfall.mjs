import { verifySpec } from '../helpers.mjs';

/** 累计、总计与连接线（waterfall）。 */
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
