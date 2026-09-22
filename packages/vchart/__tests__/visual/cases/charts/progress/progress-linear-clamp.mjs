import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6800fda1281bec00b05008bd
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：超出数值轴上限的进度截断。
 * 保留条件：原值 5、数值轴 2..4、clamp=true、圆角及双轴。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'linearProgress',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'A',
              value: 5
            }
          ]
        }
      ],
      direction: 'horizontal',
      xField: 'value',
      yField: 'type',
      clamp: true,
      cornerRadius: 20,
      bandWidth: 30,
      axes: [
        {
          orient: 'left',
          label: {
            visible: true
          },
          type: 'band'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'linear',
          min: 2,
          max: 4
        }
      ],
      animation: false
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
