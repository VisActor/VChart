import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0552a1e9eec95f9ec2
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：三区域折线标签与独立轴布局。
 * 保留条件：三区域五系列、八轴、labelLayout=region、末系列 top/overlap=false。
 * 改写说明：仅替换说明中提及的通用类目或标题文本；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'common',
      stackField: 'stack',
      seriesField: 'type',
      layout: {
        type: 'grid',
        col: 9,
        row: 9,
        colWidth: [
          {
            index: 0,
            size: 50
          },
          {
            index: 4,
            size: 50
          },
          {
            index: 8,
            size: 50
          }
        ],
        rowHeight: [
          {
            index: 0,
            size: 50
          },
          {
            index: 4,
            size: 50
          },
          {
            index: 8,
            size: 50
          }
        ],
        elements: [
          {
            modelId: 'legend0',
            col: 2,
            row: 3
          },
          {
            modelId: 'legend1',
            col: 6,
            row: 3
          },
          {
            modelId: 'legend2',
            col: 2,
            row: 7
          },
          {
            modelId: 'region0',
            col: 2,
            row: 1
          },
          {
            modelId: 'region1',
            col: 6,
            row: 1
          },
          {
            modelId: 'region2',
            col: 2,
            row: 5
          },
          {
            modelId: 'axesLeft0',
            col: 1,
            row: 1
          },
          {
            modelId: 'axesLeft1',
            col: 5,
            row: 1
          },
          {
            modelId: 'axesRight0',
            col: 3,
            row: 1
          },
          {
            modelId: 'axesRight1',
            col: 7,
            row: 1
          },
          {
            modelId: 'axesRight2',
            col: 3,
            row: 5
          },
          {
            modelId: 'axesBottom0',
            col: 2,
            row: 2
          },
          {
            modelId: 'axesBottom1',
            col: 6,
            row: 2
          },
          {
            modelId: 'axesBottom2',
            col: 2,
            row: 6
          }
        ]
      },
      region: [
        {
          id: 'region0'
        },
        {
          id: 'region1'
        },
        {
          id: 'region2'
        }
      ],
      legends: [
        {
          visible: true,
          orient: 'bottom',
          id: 'legend0',
          position: 'start',
          regionIndex: [0],
          item: {
            visible: true
          }
        },
        {
          visible: true,
          orient: 'bottom',
          id: 'legend1',
          position: 'start',
          regionIndex: [1],
          item: {
            visible: true
          }
        },
        {
          visible: true,
          orient: 'bottom',
          id: 'legend2',
          position: 'start',
          regionIndex: [2],
          item: {
            visible: true
          }
        }
      ],
      labelLayout: 'region',
      series: [
        {
          type: 'line',
          data: {
            id: 'A',
            values: [
              {
                x: 0,
                y: 13,
                type: 'A'
              },
              {
                x: 1,
                y: 42,
                type: 'A'
              },
              {
                x: 2,
                y: 159,
                type: 'A'
              },
              {
                x: 3,
                y: 135,
                type: 'A'
              },
              {
                x: 4,
                y: 66,
                type: 'A'
              },
              {
                x: 5,
                y: 43,
                type: 'A'
              },
              {
                x: 6,
                y: 280,
                type: 'A'
              },
              {
                x: 7,
                y: 200,
                type: 'A'
              },
              {
                x: 8,
                y: 16,
                type: 'A'
              },
              {
                x: 9,
                y: 109,
                type: 'A'
              }
            ]
          },
          regionIndex: 0,
          label: {
            visible: true
          },
          id: 'line0',
          xField: 'x',
          yField: 'y',
          seriesField: 'type'
        },
        {
          type: 'line',
          data: {
            id: 'B',
            values: [
              {
                x: 0,
                y: 67,
                type: 'B'
              },
              {
                x: 1,
                y: 268,
                type: 'B'
              },
              {
                x: 2,
                y: 175,
                type: 'B'
              },
              {
                x: 3,
                y: 179,
                type: 'B'
              },
              {
                x: 4,
                y: 41,
                type: 'B'
              },
              {
                x: 5,
                y: 142,
                type: 'B'
              },
              {
                x: 6,
                y: 142,
                type: 'B'
              },
              {
                x: 7,
                y: 236,
                type: 'B'
              },
              {
                x: 8,
                y: 215,
                type: 'B'
              },
              {
                x: 9,
                y: 196,
                type: 'B'
              }
            ]
          },
          regionIndex: 0,
          id: 'line1',
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true
          }
        },
        {
          type: 'line',
          data: {
            id: 'C',
            values: [
              {
                x: 0,
                y: 55,
                type: 'C'
              },
              {
                x: 1,
                y: 136,
                type: 'C'
              },
              {
                x: 2,
                y: 265,
                type: 'C'
              },
              {
                x: 3,
                y: 106,
                type: 'C'
              },
              {
                x: 4,
                y: 154,
                type: 'C'
              },
              {
                x: 5,
                y: 86,
                type: 'C'
              },
              {
                x: 6,
                y: 89,
                type: 'C'
              },
              {
                x: 7,
                y: 104,
                type: 'C'
              },
              {
                x: 8,
                y: 100,
                type: 'C'
              },
              {
                x: 9,
                y: 166,
                type: 'C'
              }
            ]
          },
          regionIndex: 1,
          id: 'line2',
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true
          }
        },
        {
          type: 'line',
          data: {
            id: 'D',
            values: [
              {
                x: 0,
                y: 124,
                type: 'D'
              },
              {
                x: 1,
                y: 242,
                type: 'D'
              },
              {
                x: 2,
                y: 182,
                type: 'D'
              },
              {
                x: 3,
                y: 179,
                type: 'D'
              },
              {
                x: 4,
                y: 143,
                type: 'D'
              },
              {
                x: 5,
                y: 291,
                type: 'D'
              },
              {
                x: 6,
                y: 248,
                type: 'D'
              },
              {
                x: 7,
                y: 90,
                type: 'D'
              },
              {
                x: 8,
                y: 74,
                type: 'D'
              },
              {
                x: 9,
                y: 291,
                type: 'D'
              }
            ]
          },
          regionIndex: 1,
          id: 'line3',
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true
          }
        },
        {
          type: 'line',
          data: {
            id: 'E',
            values: [
              {
                x: 0,
                y: 13,
                type: 'E'
              },
              {
                x: 1,
                y: 243,
                type: 'E'
              },
              {
                x: 2,
                y: 282,
                type: 'E'
              },
              {
                x: 3,
                y: 252,
                type: 'E'
              },
              {
                x: 4,
                y: 217,
                type: 'E'
              },
              {
                x: 5,
                y: 282,
                type: 'E'
              },
              {
                x: 6,
                y: 49,
                type: 'E'
              },
              {
                x: 7,
                y: 26,
                type: 'E'
              },
              {
                x: 8,
                y: 115,
                type: 'E'
              },
              {
                x: 9,
                y: 114,
                type: 'E'
              }
            ]
          },
          regionIndex: 2,
          id: 'line4',
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true,
            position: 'top',
            overlap: false
          }
        }
      ],
      axes: [
        {
          orient: 'left',
          regionIndex: 0,
          seriesId: 'line0',
          id: 'axesLeft0'
        },
        {
          orient: 'left',
          regionIndex: 1,
          seriesId: 'line2',
          id: 'axesLeft1'
        },
        {
          orient: 'right',
          regionIndex: 0,
          seriesId: 'line1',
          id: 'axesRight0'
        },
        {
          orient: 'right',
          regionIndex: 1,
          seriesId: 'line3',
          id: 'axesRight1'
        },
        {
          orient: 'right',
          regionIndex: 2,
          seriesId: 'line4',
          id: 'axesRight2'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          regionIndex: [0],
          id: 'axesBottom0'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          regionIndex: [1],
          id: 'axesBottom1'
        },
        {
          orient: 'bottom',
          title: {
            visible: true,
            style: {
              text: 'Axis 1'
            }
          },
          regionIndex: [2],
          id: 'axesBottom2'
        }
      ]
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
    await page.evaluate(() => {
      const chart = window.__visualChart.getChart();
      if (chart.getAllRegions().length !== 3 || chart.getAllSeries().length !== 5)
        throw new Error('网格区域或系列丢失');
      const components = chart.getAllComponents();
      if (
        components.filter(c => c.type.startsWith('cartesianAxis-')).length !== 8 ||
        components.filter(c => c.type === 'discreteLegend').length !== 3
      )
        throw new Error('网格布局的轴或图例数量改变');
      const regions = ['region0', 'region0', 'region1', 'region1', 'region2'];
      if (chart.getAllSeries().some((series, i) => series.getRegion().getSpec().id !== regions[i]))
        throw new Error('折线系列的区域绑定改变');
    });
  }
};
