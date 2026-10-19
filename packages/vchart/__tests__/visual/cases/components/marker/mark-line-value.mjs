import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 67fe1cc42b0c7600a7633c8e
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：折线点标签与水平参考线共存。
 * 保留条件：九条原始时间数据、y=9、x=null、红色标注线、标签。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'line',
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
      yField: 'value',
      label: {
        visible: true
      },
      markLine: {
        x: null,
        line: {
          style: {
            stroke: '#FF0000'
          }
        },
        y: 9
      }
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
