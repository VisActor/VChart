import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03f6
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：渐变线性进度图与显式双轴。
 * 保留条件：0.6、线性渐变、圆角、bandWidth=30、轴标签。
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
              value: 0.6
            }
          ]
        }
      ],
      direction: 'horizontal',
      xField: 'value',
      yField: 'type',
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
          type: 'linear'
        }
      ],
      progress: {
        style: {
          fill: {
            gradient: 'linear',
            x0: 0.4,
            y0: 0.5,
            x1: 1,
            y1: 0.5,
            stops: [
              {
                offset: 0,
                color: '#4FC6B4'
              },
              {
                offset: 1,
                color: '#31679E'
              }
            ]
          }
        }
      },
      animation: false
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
