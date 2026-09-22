import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7eef52a1e9eec95f9e84
 * 验证目的：百分比堆叠柱图与百分数刻度格式。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              State: 'WY',
              年龄段: 'Under 5',
              人口数量: 25635
            },
            {
              State: 'WY',
              年龄段: '5 to 13',
              人口数量: 1890
            },
            {
              State: 'WY',
              年龄段: '14 to 17',
              人口数量: 9314
            },
            {
              State: 'DC',
              年龄段: 'Under 5',
              人口数量: 30352
            },
            {
              State: 'DC',
              年龄段: '5 to 13',
              人口数量: 20439
            },
            {
              State: 'DC',
              年龄段: '14 to 17',
              人口数量: 10225
            },
            {
              State: 'VT',
              年龄段: 'Under 5',
              人口数量: 38253
            },
            {
              State: 'VT',
              年龄段: '5 to 13',
              人口数量: 42538
            },
            {
              State: 'VT',
              年龄段: '14 to 17',
              人口数量: 15757
            },
            {
              State: 'ND',
              年龄段: 'Under 5',
              人口数量: 51896
            },
            {
              State: 'ND',
              年龄段: '5 to 13',
              人口数量: 67358
            },
            {
              State: 'ND',
              年龄段: '14 to 17',
              人口数量: 18794
            },
            {
              State: 'AK',
              年龄段: 'Under 5',
              人口数量: 72083
            },
            {
              State: 'AK',
              年龄段: '5 to 13',
              人口数量: 85640
            },
            {
              State: 'AK',
              年龄段: '14 to 17',
              人口数量: 22153
            }
          ]
        }
      ],
      xField: 'State',
      yField: '人口数量',
      seriesField: '年龄段',
      percent: true,
      stack: true,
      legends: {
        visible: true
      },
      axes: [
        {
          orient: 'left',
          label: {
            formatMethod: val => {
              return `${(val * 100).toFixed(2)}%`;
            }
          }
        }
      ],
      tooltip: {
        mark: { visible: false }
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
