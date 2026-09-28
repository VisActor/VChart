import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 67b72068fe6e6600b22e2df8
 * 验证目的：折线末端标签。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'line',
      lineLabel: {
        visible: true
      },
      data: {
        values: [
          {
            time: '2:00',
            value: 8
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value'
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
  }
};
