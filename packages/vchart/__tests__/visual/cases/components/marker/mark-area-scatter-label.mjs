import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64fadcfee8a02e06c62a07a4
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：隐藏坐标轴时散点标签与三块坐标标注共存。
 * 保留条件：30 条原始数据、三组坐标、透明外框及半透明分区、标签。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'scatter',
      xField: 'x',
      yField: 'y',
      label: {
        visible: true,
        overlap: {
          avoidBaseMark: false,
          overlapPadding: 10
        },
        style: {
          fill: '#222'
        }
      },
      axes: [
        {
          orient: 'bottom',
          type: 'linear',
          range: {
            min: 140,
            max: 220
          },
          visible: false
        },
        {
          orient: 'left',
          visible: false
        }
      ],
      markArea: [
        {
          coordinates: [
            {
              x: 140,
              y: 0
            },
            {
              x: 220,
              y: 0
            },
            {
              x: 220,
              y: 80
            },
            {
              x: 140,
              y: 80
            }
          ],
          area: {
            style: {
              fill: '#5B8FF9',
              fillOpacity: 0,
              stroke: '#5B8FF9'
            }
          }
        },
        {
          coordinates: [
            {
              x: 140,
              y: 0
            },
            {
              x: 180,
              y: 0
            },
            {
              x: 180,
              y: 40
            },
            {
              x: 140,
              y: 40
            }
          ],
          area: {
            style: {
              fill: '#5B8FF9',
              fillOpacity: 0.15
            }
          }
        },
        {
          coordinates: [
            {
              x: 180,
              y: 40
            },
            {
              x: 220,
              y: 40
            },
            {
              x: 220,
              y: 80
            },
            {
              x: 180,
              y: 80
            }
          ],
          area: {
            style: {
              fill: '#5B8FF9',
              fillOpacity: 0.15
            }
          }
        }
      ],
      data: {
        id: 'data2',
        values: [
          {
            name: 'Denmark',
            x: 201.53,
            y: 26.84
          },
          {
            name: 'Switzerland',
            x: 196.44,
            y: 21.73
          },
          {
            name: 'Australia',
            x: 196.4,
            y: 24.09
          },
          {
            name: 'New Zealand',
            x: 196.09,
            y: 19.43,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Germany',
            x: 189.87,
            y: 27.68
          },
          {
            name: 'Austria',
            x: 187,
            y: 25.43
          },
          {
            name: 'Netherlands',
            x: 186.46,
            y: 29.08,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Spain',
            x: 184.69,
            y: 40.37,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Finland',
            x: 183.98,
            y: 14.57
          },
          {
            name: 'United States',
            x: 181.91,
            y: 32.73,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Portugal',
            x: 180.66,
            y: 29.87
          },
          {
            name: 'Sweden',
            x: 177.93,
            y: 16.59
          },
          {
            name: 'United Kingdom',
            x: 177.73,
            y: 34.24
          },
          {
            name: 'Norway',
            x: 176.23,
            y: 19.28,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Canada',
            x: 172.83,
            y: 28.17,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Japan',
            x: 172.72,
            y: 40.9
          },
          {
            name: 'France',
            x: 172.3,
            y: 42.04,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Estonia',
            x: 171.71,
            y: 19.19
          },
          {
            name: 'Ireland',
            x: 170.83,
            y: 27.47
          },
          {
            name: 'Czech Republic',
            x: 167.77,
            y: 42.17
          },
          {
            name: 'South Korea',
            x: 167.52,
            y: 50.28,
            label: {
              anchor: 'left'
            }
          },
          {
            name: 'Croatia',
            x: 167.51,
            y: 30.69
          },
          {
            name: 'Belgium',
            x: 162.57,
            y: 50.46,
            label: {
              anchor: 'top',
              offsetX: 0,
              offsetY: 3
            }
          },
          {
            name: 'Israel',
            x: 160.72,
            y: 61.91
          },
          {
            name: 'Italy',
            x: 160.21,
            y: 52.96
          },
          {
            name: 'Saudi Arabia',
            x: 156.98,
            y: 72.12
          },
          {
            name: 'Greece',
            x: 156.8,
            y: 49.1
          },
          {
            name: 'Slovakia',
            x: 154.13,
            y: 44.28
          },
          {
            name: 'Taiwan',
            x: 150.62,
            y: 64.3
          },
          {
            name: 'Poland',
            x: 150.13,
            y: 50.79
          }
        ]
      }
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-area');
  }
};
