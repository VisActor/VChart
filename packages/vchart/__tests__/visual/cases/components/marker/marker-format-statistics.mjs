import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 64ccc170d28093658a4ab0ff
 * 验证目的：统计标注区域与标注线标签回调。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'line',
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      data: {
        id: 'data2',
        values: [
          { x: 'Mon', y: 14000, type: 'A' },
          { x: 'Tue', y: 14500, type: 'A' },
          { x: 'Wed', y: 24000, type: 'A' },
          { x: 'Thu', y: 13000, type: 'A' },
          { x: 'Fri', y: 15000, type: 'A' },
          { x: 'Sat', y: 19000, type: 'A' },
          { x: 'Sun', y: 21000, type: 'A' },
          { x: 'Mon', y: 15000, type: 'B' },
          { x: 'Tue', y: 14800, type: 'B' },
          { x: 'Wed', y: 25000, type: 'B' },
          { x: 'Thu', y: 9000, type: 'B' },
          { x: 'Fri', y: 15000, type: 'B' },
          { x: 'Sat', y: 20000, type: 'B' },
          { x: 'Sun', y: 19000, type: 'B' }
        ]
      },
      markLine: [
        {
          x: (relativeSeriesData, startRelativeSeriesData, endRelativeSeriesData) => {
            console.log('relativeSeriesData', relativeSeriesData);
            console.log('startRelativeSeriesData', startRelativeSeriesData);
            console.log('endRelativeSeriesData', endRelativeSeriesData);
            return 'Wed';
          },
          label: {
            text: 'National holiday',
            position: 'insideEndBottom',
            reY: 10,
            labelBackground: {
              padding: 5,
              style: {
                stroke: '#6690F2',
                fillOpacity: 0
              }
            },
            style: {
              fill: '#6690F2'
            }
          },
          line: {
            style: {
              stroke: '#6690F2',
              lineDash: []
            }
          },
          endSymbol: {
            style: {}
          }
        },
        {
          y: 'average',
          label: {
            position: 'insideEndBottom',
            refY: -10,
            formatMethod: datum => {
              console.log('caculate-datum', datum);
              return 'Average Visit Num:' + datum?.[0]['y'];
            },
            labelBackground: {
              padding: 2,
              style: {
                fill: '#6690F2'
              }
            },
            style: {
              fontSize: 12
            }
          },
          line: {
            style: {
              stroke: '#6690F2',
              lineDash: []
            }
          },
          startSymbol: {
            visible: true,
            symbolType: 'triangleDown',
            autoRotate: false,
            style: {
              visible: true
            }
          },
          endSymbol: {
            style: {}
          }
        }
      ],
      markArea: [
        {
          y: 'average',
          y1: 'min',
          label: {
            position: 'insideEndBottom',
            refY: -10,
            formatMethod: datum => {
              console.log('datum', datum?.[0]['y']);
              return 'Average Visit Num:' + datum?.[0]['y'];
            },
            labelBackground: {
              padding: 2,
              style: {
                fill: '#6690F2'
              }
            },
            style: {
              fontSize: 12
            }
          },
          line: {
            style: {
              stroke: '#6690F2',
              lineDash: []
            }
          },
          endSymbol: {
            style: {
              visible: false
            }
          }
        }
      ],
      line: {
        style: {
          curveType: 'monotone'
        }
      }
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await verifyRendered(page, 'mark-line');
  }
};
