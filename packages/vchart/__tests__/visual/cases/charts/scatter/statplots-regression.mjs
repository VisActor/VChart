import { verifySpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';

/**
 * 验证目的：统计图编译产物的点/线/带配色及共同筛选。
 * 图表类型：common。
 * 关键配置：seriesField=series、共享 legend.seriesId、linear 数值轴。
 * 场景条件：来自原始分组示例的已审阅原生 spec；不依赖未发布的 StatPlots 包。
 * 最终检查：真实点击图例，所有实际系列仅保留模型 B，图元共用同一颜色。
 * 覆盖边界：统计数值由 StatPlots/Python 单测验证，此例只覆盖原生显示与交互。
 */
export default {
  createSpec() {
    return {
      type: 'common',
      theme: 'light',
      color: [
        '#0173B2',
        '#DE8F05',
        '#029E73',
        '#D55E00',
        '#CC78BC',
        '#CA9161',
        '#FBAFE4',
        '#949494',
        '#ECE133',
        '#56B4E9'
      ],
      padding: 16,
      title: {
        visible: true,
        text: '原始回归：点线带同步筛选',
        subtext: '',
        padding: {
          bottom: 16
        }
      },
      axes: [
        {
          orient: 'bottom',
          type: 'linear',
          zero: false,
          nice: true,
          title: {
            visible: true,
            text: 'x'
          },
          grid: {
            visible: false
          },
          label: {
            flush: true
          }
        },
        {
          orient: 'left',
          type: 'linear',
          zero: false,
          nice: true,
          title: {
            visible: true,
            text: 'y'
          },
          grid: {
            visible: true
          },
          label: {
            flush: true
          }
        }
      ],
      series: [
        {
          type: 'rangeArea',
          stack: false,
          id: 'fit-band',
          data: {
            id: 'fit-band',
            values: [
              {
                x: 0,
                estimate: 1.0337033750614375,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 0.7758843524388973,
                upper: 1.3243268571404903
              },
              {
                x: 1.5833333333333333,
                estimate: 2.132027803573186,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 1.9755722226667838,
                upper: 2.330087100858155
              },
              {
                x: 3.1666666666666665,
                estimate: 3.2303522320849347,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.0876641358142085,
                upper: 3.3795606112710725
              },
              {
                x: 4.75,
                estimate: 4.328676660596684,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.120871325172316,
                upper: 4.554001833258699
              },
              {
                x: 6.333333333333333,
                estimate: 5.4270010891084315,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 5.105542390085528,
                upper: 5.769479013957872
              },
              {
                x: 0,
                estimate: 5.033703375061438,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.775884352438898,
                upper: 5.32432685714049
              },
              {
                x: 1.5833333333333333,
                estimate: 4.469527803573187,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.313072222666784,
                upper: 4.667587100858155
              },
              {
                x: 3.1666666666666665,
                estimate: 3.905352232084935,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.762664135814209,
                upper: 4.054560611271072
              },
              {
                x: 4.75,
                estimate: 3.3411766605966835,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.133371325172316,
                upper: 3.566501833258699
              },
              {
                x: 6.333333333333333,
                estimate: 2.777001089108432,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 2.4555423900855287,
                upper: 3.1194790139578727
              }
            ]
          },
          xField: 'x',
          yField: ['lower', 'upper'],
          seriesField: 'series',
          area: {
            style: {
              fillOpacity: 0.18
            }
          },
          tooltip: {
            visible: false
          },
          animation: false
        },
        {
          type: 'line',
          id: 'fit',
          data: {
            id: 'fit',
            values: [
              {
                x: 0,
                estimate: 1.0337033750614375,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 0.7758843524388973,
                upper: 1.3243268571404903
              },
              {
                x: 1.5833333333333333,
                estimate: 2.132027803573186,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 1.9755722226667838,
                upper: 2.330087100858155
              },
              {
                x: 3.1666666666666665,
                estimate: 3.2303522320849347,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.0876641358142085,
                upper: 3.3795606112710725
              },
              {
                x: 4.75,
                estimate: 4.328676660596684,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.120871325172316,
                upper: 4.554001833258699
              },
              {
                x: 6.333333333333333,
                estimate: 5.4270010891084315,
                series: '模型 A',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 5.105542390085528,
                upper: 5.769479013957872
              },
              {
                x: 0,
                estimate: 5.033703375061438,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.775884352438898,
                upper: 5.32432685714049
              },
              {
                x: 1.5833333333333333,
                estimate: 4.469527803573187,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 4.313072222666784,
                upper: 4.667587100858155
              },
              {
                x: 3.1666666666666665,
                estimate: 3.905352232084935,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.762664135814209,
                upper: 4.054560611271072
              },
              {
                x: 4.75,
                estimate: 3.3411766605966835,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 3.133371325172316,
                upper: 3.566501833258699
              },
              {
                x: 6.333333333333333,
                estimate: 2.777001089108432,
                series: '模型 B',
                method: '线性回归',
                interval: '95% 均值响应置信带（成对 bootstrap）',
                sampleCount: 20,
                lower: 2.4555423900855287,
                upper: 3.1194790139578727
              }
            ]
          },
          xField: 'x',
          yField: 'estimate',
          seriesField: 'series',
          point: {
            visible: false
          },
          line: {
            style: {
              curveType: 'linear',
              lineWidth: 2
            }
          },
          tooltip: {
            visible: false
          },
          animation: false
        },
        {
          type: 'scatter',
          id: 'observations',
          data: {
            id: 'observations',
            values: [
              {
                id: '0',
                x: 0,
                y: 1,
                series: '模型 A'
              },
              {
                id: '1',
                x: 0.3333333333333333,
                y: 1.7291657385595678,
                series: '模型 A'
              },
              {
                id: '2',
                x: 0.6666666666666666,
                y: 1.338896115653251,
                series: '模型 A'
              },
              {
                id: '3',
                x: 1,
                y: 1.2370926588361335,
                series: '模型 A'
              },
              {
                id: '4',
                x: 1.3333333333333333,
                y: 2.1803900089026373,
                series: '模型 A'
              },
              {
                id: '5',
                x: 1.6666666666666667,
                y: 2.5659102229784123,
                series: '模型 A'
              },
              {
                id: '6',
                x: 2,
                y: 2.0500626562032283,
                series: '模型 A'
              },
              {
                id: '7',
                x: 2.3333333333333335,
                y: 2.3242647772148164,
                series: '模型 A'
              },
              {
                id: '8',
                x: 2.6666666666666665,
                y: 3.296247574094914,
                series: '模型 A'
              },
              {
                id: '9',
                x: 3,
                y: 3.298370286565307,
                series: '模型 A'
              },
              {
                id: '10',
                x: 3.3333333333333335,
                y: 2.8526345873935552,
                series: '模型 A'
              },
              {
                id: '11',
                x: 3.6666666666666665,
                y: 3.492167153759567,
                series: '模型 A'
              },
              {
                id: '12',
                x: 4,
                y: 4.299896450071334,
                series: '模型 A'
              },
              {
                id: '13',
                x: 4.333333333333333,
                y: 3.979015035621295,
                series: '模型 A'
              },
              {
                id: '14',
                x: 4.666666666666667,
                y: 3.7807674437947343,
                series: '模型 A'
              },
              {
                id: '15',
                x: 5,
                y: 4.6795291770110845,
                series: '模型 A'
              },
              {
                id: '16',
                x: 5.333333333333333,
                y: 5.172969864158695,
                series: '模型 A'
              },
              {
                id: '17',
                x: 5.666666666666667,
                y: 4.673847996679518,
                series: '模型 A'
              },
              {
                id: '18',
                x: 6,
                y: 4.835819616084202,
                series: '模型 A'
              },
              {
                id: '19',
                x: 6.333333333333333,
                y: 5.819997278116443,
                series: '模型 A'
              },
              {
                id: '0',
                x: 0,
                y: 5,
                series: '模型 B'
              },
              {
                id: '1',
                x: 0.3333333333333333,
                y: 5.379165738559568,
                series: '模型 B'
              },
              {
                id: '2',
                x: 0.6666666666666666,
                y: 4.638896115653251,
                series: '模型 B'
              },
              {
                id: '3',
                x: 1,
                y: 4.187092658836134,
                series: '模型 B'
              },
              {
                id: '4',
                x: 1.3333333333333333,
                y: 4.780390008902637,
                series: '模型 B'
              },
              {
                id: '5',
                x: 1.6666666666666667,
                y: 4.815910222978412,
                series: '模型 B'
              },
              {
                id: '6',
                x: 2,
                y: 3.9500626562032286,
                series: '模型 B'
              },
              {
                id: '7',
                x: 2.3333333333333335,
                y: 3.874264777214817,
                series: '模型 B'
              },
              {
                id: '8',
                x: 2.6666666666666665,
                y: 4.496247574094914,
                series: '模型 B'
              },
              {
                id: '9',
                x: 3,
                y: 4.148370286565307,
                series: '模型 B'
              },
              {
                id: '10',
                x: 3.3333333333333335,
                y: 3.352634587393555,
                series: '模型 B'
              },
              {
                id: '11',
                x: 3.6666666666666665,
                y: 3.6421671537595675,
                series: '模型 B'
              },
              {
                id: '12',
                x: 4,
                y: 4.099896450071335,
                series: '模型 B'
              },
              {
                id: '13',
                x: 4.333333333333333,
                y: 3.4290150356212954,
                series: '模型 B'
              },
              {
                id: '14',
                x: 4.666666666666667,
                y: 2.8807674437947357,
                series: '模型 B'
              },
              {
                id: '15',
                x: 5,
                y: 3.429529177011084,
                series: '模型 B'
              },
              {
                id: '16',
                x: 5.333333333333333,
                y: 3.5729698641586958,
                series: '模型 B'
              },
              {
                id: '17',
                x: 5.666666666666667,
                y: 2.7238479966795177,
                series: '模型 B'
              },
              {
                id: '18',
                x: 6,
                y: 2.535819616084202,
                series: '模型 B'
              },
              {
                id: '19',
                x: 6.333333333333333,
                y: 3.169997278116444,
                series: '模型 B'
              }
            ]
          },
          xField: 'x',
          yField: 'y',
          seriesField: 'series',
          size: 7,
          tooltip: {
            visible: false
          },
          animation: false
        }
      ],
      legends: {
        visible: true,
        seriesId: ['fit-band', 'fit', 'observations'],
        orient: 'top'
      }
    };
  },
  async exercise(page) {
    const target = await graphicCenter(page, 'legendItem');
    await page.mouse.click(target.x, target.y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const chart = window.__visualChart;
      const selected = chart.getLegendSelectedDataByIndex();
      return (
        selected.length === 1 &&
        selected[0] === '模型 B' &&
        chart
          .getChart()
          .getAllSeries()
          .every(s => {
            const rows = s.getViewData().latestData;
            return rows.length > 0 && rows.every(row => row.series === '模型 B');
          })
      );
    });
    await verifyRendered(page);
    await page.evaluate(() => {
      const colors = window.__visualChart
        .getChart()
        .getAllSeries()
        .map(s => {
          const g = s.getSeriesMark().getGraphics()[0];
          return s.type === 'line' ? g.attribute.stroke : g.attribute.fill;
        });
      if (new Set(colors).size !== 1 || !colors[0]) throw new Error('点、曲线或带的系列颜色不一致');
    });
  }
};
