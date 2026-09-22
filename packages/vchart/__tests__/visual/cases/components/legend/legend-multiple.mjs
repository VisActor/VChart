import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0366
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：五个图例在四个方向同时布局。
 * 保留条件：两个左侧及上右下图例、padding=30、line 系列名称。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'line',
      padding: 30,
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
      series: [
        {
          type: 'line',
          name: '77'
        }
      ],
      legends: [
        {
          visible: true,
          orient: 'left'
        },
        {
          visible: true,
          orient: 'left'
        },
        {
          visible: true,
          orient: 'top'
        },
        {
          visible: true,
          orient: 'right'
        },
        {
          visible: true,
          orient: 'bottom'
        }
      ]
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
