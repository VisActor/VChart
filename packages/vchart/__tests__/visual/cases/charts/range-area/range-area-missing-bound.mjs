import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65f295d9603de700d1d8ba7e
 * 验证目的：区间面积上界缺失并叠加两条折线。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    // Original issue link omitted.
    const spec = {
      type: 'common',
      data: [
        {
          id: 'areaData',
          values: [
            { year: '1700', exports: 35, imports: 70 },
            { year: '1710', exports: 59, imports: 81 },
            { year: '1720', exports: 76, imports: 26 },
            { year: '1730', exports: 65, imports: 197 },
            { year: '1740', exports: 67, imports: 93 },
            { year: '1750', exports: 79, imports: 90 },
            { year: '1753', exports: 87 },
            { year: '1760', exports: 115 },
            { year: '1770', exports: 163 },
            { year: '1780', exports: 185 }
          ]
        }
      ],
      series: [
        {
          type: 'rangeArea',
          xField: 'year',
          invalidType: 'break',
          yField: ['exports', 'imports'],
          area: {
            style: {
              curveType: 'monotone',
              fillOpacity: 0.5,
              fill: 'pink'
            }
          }
        },
        {
          type: 'line',
          xField: 'year',
          yField: 'exports',
          point: {
            style: {
              size: 0
            }
          },
          line: {
            style: {
              curveType: 'monotone',
              stroke: '#5541FF',
              lineDash: [5, 5]
            }
          }
        },
        {
          type: 'line',
          xField: 'year',
          yField: 'imports',
          point: {
            style: {
              size: 0
            }
          },
          line: {
            style: {
              curveType: 'monotone',
              stroke: '#25C3EA'
            }
          }
        }
      ],
      axes: [
        {
          orient: 'left',
          visible: false,
          type: 'linear'
        },
        {
          orient: 'bottom',
          grid: {
            visible: true,
            style: {
              stroke: '#4C50D2',
              lineWidth: 35,
              opacity: 0.05
            }
          },
          domainLine: false,
          tick: false
        }
      ],
      background: '#080550',
      width: 800
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
