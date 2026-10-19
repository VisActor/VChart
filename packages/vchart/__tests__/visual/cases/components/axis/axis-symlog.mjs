import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64e85a47707420a88d0e692e
 * 验证目的：相同正负数据在线性轴和对称对数轴的布局。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const symexp = c => {
      return x => {
        return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
      };
    };
    const scale = symexp(10);

    const data = [];
    for (let i = -5; i < 6; i++) {
      data.push({
        x: scale(i),
        y: i
      });
    }
    const spec = {
      type: 'common',
      layout: {
        type: 'grid',
        col: 2,
        row: 6,
        rowHeight: [
          {
            index: 0,
            size: 30
          },
          {
            index: 3,
            size: 20
          }
        ],
        elements: [
          {
            modelId: 'title',
            col: 1,
            row: 0
          },
          {
            modelId: 'line-region-A',
            col: 1,
            row: 1
          },
          {
            modelId: 'axis-left-A',
            col: 0,
            row: 1
          },
          {
            modelId: 'axis-bottom-A',
            col: 1,
            row: 2
          },
          {
            modelId: 'line-region-B',
            col: 1,
            row: 4
          },
          {
            modelId: 'axis-left-B',
            col: 0,
            row: 4
          },
          {
            modelId: 'axis-bottom-B',
            col: 1,
            row: 5
          }
        ]
      },
      region: [
        {
          id: 'line-region-A'
        },
        {
          id: 'line-region-B'
        }
      ],
      series: [
        {
          regionId: 'line-region-A',
          type: 'line',
          xField: 'x',
          yField: 'y',
          data: {
            id: 'line-A',
            values: data
          }
        },
        {
          regionId: 'line-region-B',
          type: 'line',
          xField: 'x',
          yField: 'y',
          data: {
            id: 'line-B',
            values: data
          }
        }
      ],
      title: {
        text: 'the example shows difference of linear axis and symlog axis',
        id: 'title'
      },
      axes: [
        {
          id: 'axis-left-A',
          regionId: 'line-region-A',
          orient: 'left',
          type: 'linear'
        },

        {
          id: 'axis-bottom-A',
          regionId: 'line-region-A',
          orient: 'bottom',
          type: 'linear',
          title: 'log-axis'
        },
        {
          id: 'axis-left-B',
          regionId: 'line-region-B',
          orient: 'left',
          type: 'linear'
        },

        {
          id: 'axis-bottom-B',
          regionId: 'line-region-B',
          orient: 'bottom',
          type: 'symlog',
          title: 'log-axis'
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
