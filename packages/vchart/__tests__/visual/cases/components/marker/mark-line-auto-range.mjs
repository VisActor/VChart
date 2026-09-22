import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0360
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：横纵坐标的四条标注线自动扩轴。
 * 保留条件：x 字符串 2/5、y 数值 20/220、四个 autoRange 开关。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'line',
      data: {
        id: 'data2',
        values: [
          {
            x: 1,
            y: 80
          },
          {
            x: 2,
            y: 40
          },
          {
            x: 3,
            y: 10
          },
          {
            x: 4,
            y: 20
          }
        ]
      },
      xField: 'x',
      yField: 'y',
      markLine: [
        {
          x: '2',
          autoRange: true
        },
        {
          x: '5',
          autoRange: true
        },
        {
          y: 20,
          autoRange: true
        },
        {
          y: 220,
          autoRange: true
        }
      ]
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
