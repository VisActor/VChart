import { verifySpec, verifyRendered } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0449
 * 验证目的：多系列比例尺定义域扩展。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'common',
      data: [
        {
          id: 'data0',
          values: [
            {
              x: 1270911,
              size: 219815,
              y: 5590,
              type: 'Office supplies',
              area: 'Central South'
            },
            {
              x: 919743,
              size: 148800,
              y: 1199,
              type: 'Furniture',
              area: 'North'
            },
            {
              x: 1676224,
              size: 163453,
              y: 2517,
              type: 'Furniture',
              area: 'East'
            },
            {
              x: 824673,
              size: 86067,
              y: 3622,
              type: 'Office supplies',
              area: 'Northeast'
            },
            {
              x: 745813,
              size: 137265,
              y: 3020,
              type: 'Office supplies',
              area: 'North'
            },
            {
              x: 267870,
              size: 49633,
              y: 970,
              type: 'Office supplies',
              area: 'Northwest'
            },
            {
              x: 1408628,
              size: 215585,
              y: 6341,
              type: 'Office supplies',
              area: 'East'
            },
            {
              x: 501533,
              size: 29303,
              y: 814,
              type: 'Furniture',
              area: 'Southwest'
            },
            {
              x: 920698,
              size: 72692,
              y: 1470,
              type: 'Furniture',
              area: 'Northeast'
            },
            {
              x: 316212,
              size: 24903,
              y: 468,
              type: 'Furniture',
              area: 'Northwest'
            },
            {
              x: 1399928,
              size: 199582,
              y: 2023,
              type: 'Furniture',
              area: 'Central South'
            },
            {
              x: 347692,
              size: 49272,
              y: 1858,
              type: 'Office supplies',
              area: 'Southwest'
            }
          ]
        },
        {
          id: 'data1',
          values: [
            {
              x: 936196,
              size: 83431,
              y: 1371,
              type: 'Technology',
              area: 'Northeast'
            },
            {
              x: 453898,
              size: 19061,
              y: 727,
              type: 'Technology',
              area: 'Southwest'
            },
            {
              x: 1466575,
              size: 251487,
              y: 2087,
              type: 'Technology',
              area: 'Central South'
            },
            {
              x: 230956,
              size: 24016,
              y: 347,
              type: 'Technology',
              area: 'Northwest'
            },
            {
              x: 1599653,
              size: 228179,
              y: 2183,
              type: 'Technology',
              area: 'East'
            },
            {
              x: 781743,
              size: 144986,
              y: 927,
              type: 'Technology',
              area: 'North'
            }
          ]
        }
      ],
      series: [
        {
          type: 'scatter',
          data: {
            id: 'data0'
          },
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          point: {
            style: {
              fill: {
                scale: 'color',
                field: 'y'
              },
              size: {
                field: 'size',
                scale: 'size'
              },
              shape: {
                scale: 'shape',
                field: 'area'
              }
            }
          }
        },
        {
          type: 'scatter',
          data: {
            id: 'data1'
          },
          seriesField: 'type',
          xField: 'x',
          yField: 'y',
          point: {
            style: {
              fill: {
                scale: 'color',
                field: 'y',
                changeDomain: 'expand'
              },
              size: {
                scale: 'size',
                field: 'size'
              },
              shape: {
                scale: 'shape',
                field: 'area'
              }
            }
          }
        }
      ],
      scales: [
        {
          id: 'size',
          type: 'linear',
          domain: [
            {
              dataId: 'data0',
              fields: ['size']
            }
          ],
          range: [10, 25]
        },
        {
          id: 'color',
          type: 'linear',
          domain: [
            {
              dataId: 'data0',
              fields: ['y']
            }
          ],
          range: ['red', 'blue']
        },
        {
          id: 'shape',
          type: 'ordinal',
          domain: [
            {
              dataId: 'data0',
              fields: ['area']
            },
            {
              dataId: 'data1',
              fields: ['area']
            }
          ],
          range: ['star', 'triangleLeft', 'diamond']
        }
      ],
      axes: [
        {
          orient: 'left',
          range: {
            min: 0
          },
          type: 'linear'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band'
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
