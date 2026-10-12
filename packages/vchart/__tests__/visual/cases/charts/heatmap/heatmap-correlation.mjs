import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0352a1e9eec95f9ebb
 * 验证目的：相关矩阵热力图与固定区域及旋转标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const items = [
      'Debt to assets',
      'Debt to assets excluding advances',
      'Long term debt ratio',
      'Long term asset ratio',
      'Equity multiplier',
      'Current debt to equity',
      'Interest debt to capital',
      'Current debt share',
      'Fixed capital ratio',
      'Expected default frequency'
    ];
    const rawData = [
      1.0, 0.594527, 0.492963, -0.160995, 0.723664, 0.658646, -0.857474, 0.320706, -0.284634, -0.091423, 0.594527, 1.0,
      0.724546, -0.099318, 0.540639, 0.49214, -0.554039, 0.17127, -0.265259, 0.068577, 0.492963, 0.724546, 1.0,
      -0.091338, 0.450542, 0.375839, -0.524955, 0.300627, -0.198362, 0.033209, -0.160995, -0.099318, -0.091338, 1.0,
      -0.049872, -0.028452, 0.157157, 0.009742, -0.162374, 0.155095, 0.723664, 0.540639, 0.450542, -0.049872, 1.0,
      0.951933, -0.651767, 0.079052, -0.535984, 0.00798, 0.658646, 0.49214, 0.375839, -0.028452, 0.951933, 1.0,
      -0.543147, -0.106139, -0.52232, 0.011466, -0.857474, -0.554039, -0.524955, 0.157157, -0.651767, -0.543147, 1.0,
      -0.595016, 0.310521, 0.066397, 0.320706, 0.17127, 0.300627, 0.009742, 0.079052, -0.106139, -0.595016, 1.0,
      -0.105199, -0.064886, -0.284634, -0.265259, -0.198362, -0.162374, -0.535984, -0.52232, 0.310521, -0.105199, 1.0,
      -0.080153, -0.091423, 0.068577, 0.033209, 0.155095, 0.00798, 0.011466, 0.066397, -0.064886, -0.080153, 1.0
    ];
    const data = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        data.push({
          var1: items[i],
          var2: items[j],
          value: rawData[i * items.length + j]
        });
      }
    }

    const spec = {
      type: 'common',
      padding: 12,
      data: [
        {
          id: 'data0',
          values: data
        }
      ],
      series: [
        {
          type: 'heatmap',
          regionId: 'region0',
          xField: 'var1',
          yField: 'var2',
          valueField: 'value',
          cell: {
            style: {
              fill: {
                field: 'value',
                scale: 'color'
              }
            }
          }
        }
      ],
      region: [
        {
          id: 'region0',
          width: 200, // 限定 region 的宽度
          height: 200 // 限定 region 的高度
        }
      ],
      color: {
        type: 'linear',
        domain: [
          {
            dataId: 'data0',
            fields: ['value']
          }
        ],
        range: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603']
      },
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          label: {
            space: 10,
            style: {
              textAlign: 'left',
              textBaseline: 'middle',
              angle: 90
            }
          },
          bandPadding: 0,
          height: layoutRect => {
            // 将底部轴的高度设置为画布的高度 - region 高度 - paddingTop - paddingBottom
            return layoutRect.height - 224;
          }
        },
        {
          orient: 'left',
          type: 'band',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          maxWidth: '50%',
          label: {
            autoLimit: false,
            space: 10
          },
          bandPadding: 0
        }
      ],
      legends: {
        visible: false,
        orient: 'right',
        type: 'color',
        field: 'value',
        title: {
          visible: true,
          text: `Correlation Coefficient`
        }
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
