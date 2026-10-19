import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65e0335b1baf7300adb86304
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：堆叠柱图反转数值轴并显示总计标签。
 * 保留条件：stack、左轴 inverse、totalLabel、15 条原始数据。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              State: 'WY',
              Age: 'Under 5 Years',
              Population: 25635
            },
            {
              State: 'WY',
              Age: '5 to 13 Years',
              Population: 1890
            },
            {
              State: 'WY',
              Age: '14 to 17 Years',
              Population: 9314
            },
            {
              State: 'DC',
              Age: 'Under 5 Years',
              Population: 30352
            },
            {
              State: 'DC',
              Age: '5 to 13 Years',
              Population: 20439
            },
            {
              State: 'DC',
              Age: '14 to 17 Years',
              Population: 10225
            },
            {
              State: 'VT',
              Age: 'Under 5 Years',
              Population: 38253
            },
            {
              State: 'VT',
              Age: '5 to 13 Years',
              Population: 42538
            },
            {
              State: 'VT',
              Age: '14 to 17 Years',
              Population: 15757
            },
            {
              State: 'ND',
              Age: 'Under 5 Years',
              Population: 51896
            },
            {
              State: 'ND',
              Age: '5 to 13 Years',
              Population: 67358
            },
            {
              State: 'ND',
              Age: '14 to 17 Years',
              Population: 18794
            },
            {
              State: 'AK',
              Age: 'Under 5 Years',
              Population: 72083
            },
            {
              State: 'AK',
              Age: '5 to 13 Years',
              Population: 85640
            },
            {
              State: 'AK',
              Age: '14 to 17 Years',
              Population: 22153
            }
          ]
        }
      ],
      xField: 'State',
      yField: 'Population',
      seriesField: 'Age',
      stack: true,
      legends: {
        visible: true
      },
      bar: {
        state: {
          hover: {
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      totalLabel: {
        visible: true
      },
      axes: [
        {
          orient: 'left',
          inverse: true
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
