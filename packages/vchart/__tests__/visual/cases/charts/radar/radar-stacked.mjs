import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f1552a1e9eec95f9ef4
 * 验证目的：雷达面积堆叠与圆形径向网格。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'radar',
      data: [
        {
          values: [
            {
              month: 'Month 1',
              value: 45,
              type: 'A'
            },
            {
              month: 'Month 2',
              value: 61,
              type: 'A'
            },
            {
              month: 'Month 3',
              value: 92,
              type: 'A'
            },
            {
              month: 'Month 4',
              value: 57,
              type: 'A'
            },
            {
              month: 'Month 5',
              value: 46,
              type: 'A'
            },
            {
              month: 'Month 6',
              value: 36,
              type: 'A'
            },
            {
              month: 'Month 7',
              value: 33,
              type: 'A'
            },
            {
              month: 'Month 8',
              value: 63,
              type: 'A'
            },
            {
              month: 'Month 9',
              value: 57,
              type: 'A'
            },
            {
              month: 'Month 10',
              value: 53,
              type: 'A'
            },
            {
              month: 'Month 11',
              value: 69,
              type: 'A'
            },
            {
              month: 'Month 12',
              value: 40,
              type: 'A'
            },
            {
              month: 'Month 1',
              value: 31,
              type: 'B'
            },
            {
              month: 'Month 2',
              value: 39,
              type: 'B'
            },
            {
              month: 'Month 3',
              value: 81,
              type: 'B'
            },
            {
              month: 'Month 4',
              value: 39,
              type: 'B'
            },
            {
              month: 'Month 5',
              value: 64,
              type: 'B'
            },
            {
              month: 'Month 6',
              value: 21,
              type: 'B'
            },
            {
              month: 'Month 7',
              value: 58,
              type: 'B'
            },
            {
              month: 'Month 8',
              value: 72,
              type: 'B'
            },
            {
              month: 'Month 9',
              value: 47,
              type: 'B'
            },
            {
              month: 'Month 10',
              value: 37,
              type: 'B'
            },
            {
              month: 'Month 11',
              value: 80,
              type: 'B'
            },
            {
              month: 'Month 12',
              value: 74,
              type: 'B'
            },
            {
              month: 'Month 1',
              value: 90,
              type: 'C'
            },
            {
              month: 'Month 2',
              value: 95,
              type: 'C'
            },
            {
              month: 'Month 3',
              value: 62,
              type: 'C'
            },
            {
              month: 'Month 4',
              value: 52,
              type: 'C'
            },
            {
              month: 'Month 5',
              value: 74,
              type: 'C'
            },
            {
              month: 'Month 6',
              value: 87,
              type: 'C'
            },
            {
              month: 'Month 7',
              value: 80,
              type: 'C'
            },
            {
              month: 'Month 8',
              value: 69,
              type: 'C'
            },
            {
              month: 'Month 9',
              value: 74,
              type: 'C'
            },
            {
              month: 'Month 10',
              value: 84,
              type: 'C'
            },
            {
              month: 'Month 11',
              value: 94,
              type: 'C'
            },
            {
              month: 'Month 12',
              value: 23,
              type: 'C'
            }
          ]
        }
      ],
      categoryField: 'month',
      valueField: 'value',
      seriesField: 'type', // 声明分组字段
      stack: true,
      area: {
        visible: true // 展示面积
      },
      axes: [
        {
          orient: 'radius', // 半径轴配置
          min: 0,
          domainLine: {
            visible: true
          },
          label: {
            visible: true
          },
          grid: {
            smooth: true // 平滑的网格线
          }
        },
        {
          orient: 'angle', // 角度轴配置
          tick: {
            visible: false
          },
          grid: {
            style: {
              lineDash: [0]
            }
          }
        }
      ],
      legends: {
        visible: true,
        orient: 'top'
      }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
