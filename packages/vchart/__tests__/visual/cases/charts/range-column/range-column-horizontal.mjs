import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e040a
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：横向区间柱与端点标签。
 * 保留条件：八个原始区间、min/max、双轴及标签。
 * 改写说明：仅替换说明中提及的通用类目或标题文本；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'rangeColumn',
      data: [
        {
          id: 'data0',
          values: [
            {
              type: 'Category 1',
              min: 76,
              max: 100
            },
            {
              type: 'Category 2',
              min: 56,
              max: 108
            },
            {
              type: 'Category 3',
              min: 38,
              max: 129
            },
            {
              type: 'Category 4',
              min: 58,
              max: 155
            },
            {
              type: 'Category 5',
              min: 45,
              max: 120
            },
            {
              type: 'Category 6',
              min: 23,
              max: 99
            },
            {
              type: 'Category 7',
              min: 18,
              max: 56
            },
            {
              type: 'Category 8',
              min: 18,
              max: 34
            }
          ]
        }
      ],
      direction: 'horizontal',
      yField: 'type',
      minField: 'min',
      maxField: 'max',
      axes: [
        {
          orient: 'left',
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
      label: {
        visible: true
      }
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
  }
};
