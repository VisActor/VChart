import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0552a1e9eec95f9ec1
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：零值堆叠柱标签与边界移动避让。
 * 保留条件：30 条原始数据、inside、白色描边、bound/moveY 策略。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      stack: true,
      data: [
        {
          name: 'allData',
          values: [
            {
              name: 'A',
              value: 0.12,
              group: '7+'
            },
            {
              name: 'B',
              value: 0.34,
              group: '7+'
            },
            {
              name: 'C',
              value: 0.25,
              group: '7+'
            },
            {
              name: 'D',
              value: 0.48,
              group: '7+'
            },
            {
              name: 'E',
              value: 0.55,
              group: '7+'
            },
            {
              name: 'F',
              value: 0.42,
              group: '7+'
            },
            {
              name: 'A',
              value: 0.23,
              group: '6-7'
            },
            {
              name: 'B',
              value: 0.25,
              group: '6-7'
            },
            {
              name: 'C',
              value: 0.18,
              group: '6-7'
            },
            {
              name: 'D',
              value: 0.19,
              group: '6-7'
            },
            {
              name: 'E',
              value: 0.15,
              group: '6-7'
            },
            {
              name: 'F',
              value: 0.12,
              group: '6-7'
            },
            {
              name: 'A',
              value: 0.31,
              group: '4-5'
            },
            {
              name: 'B',
              value: 0.33,
              group: '4-5'
            },
            {
              name: 'C',
              value: 0.4,
              group: '4-5'
            },
            {
              name: 'D',
              value: 0.24,
              group: '4-5'
            },
            {
              name: 'E',
              value: 0.18,
              group: '4-5'
            },
            {
              name: 'F',
              value: 0.2,
              group: '4-5'
            },
            {
              name: 'A',
              value: 0.56,
              group: '2-3'
            },
            {
              name: 'B',
              value: 0.29,
              group: '2-3'
            },
            {
              name: 'C',
              value: 0.15,
              group: '2-3'
            },
            {
              name: 'D',
              value: 0.01,
              group: '2-3'
            },
            {
              name: 'E',
              value: 0.14,
              group: '2-3'
            },
            {
              name: 'F',
              value: 0.16,
              group: '2-3'
            },
            {
              name: 'A',
              value: 0.15,
              group: '1'
            },
            {
              name: 'B',
              value: 0.11,
              group: '1'
            },
            {
              name: 'C',
              value: 0.015,
              group: '1'
            },
            {
              name: 'D',
              value: 0.02,
              group: '1'
            },
            {
              name: 'E',
              value: 0,
              group: '1'
            },
            {
              name: 'F',
              value: 0.05,
              group: '1'
            }
          ]
        }
      ],
      color: ['#009DB5', '#F0B71F', '#EB6F02', '#1E5273', '#3BA140'],
      label: {
        visible: true,
        position: 'inside',
        style: {
          stroke: 'white',
          lineWidth: 2
        },
        overlap: {
          strategy: [
            {
              type: 'bound',
              position: ['top']
            },
            {
              type: 'moveY',
              offset: [-2, -4, -8, -10, -12]
            }
          ]
        }
      },
      type: 'bar',
      xField: 'name',
      yField: 'value',
      seriesField: 'group'
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
  }
};
