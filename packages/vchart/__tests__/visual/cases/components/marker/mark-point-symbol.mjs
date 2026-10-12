import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 683ea46983f5b200a644bb87
 * 验证目的：标注点文字、端点配置与动态轴标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：不单独宣称隐藏连接线下的端点符号已显示；仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'bar',
      height: 300,
      data: [
        {
          id: 'barData',
          values: [
            { time: '10:20', cost: 2 },
            { time: '10:30', cost: 1 },
            { time: '10:40', cost: 1 },
            { time: '10:50', cost: 2 },
            { time: '11:00', cost: 2 },
            { time: '11:10', cost: 2 },
            { time: '11:20', cost: 1 },
            { time: '11:30', cost: 1 },
            { time: '11:40', cost: 2 },
            { time: '11:50', cost: 1 }
          ]
        }
      ],
      xField: 'time',
      yField: 'cost',
      crosshair: {
        xField: {
          visible: true,
          line: {
            type: 'rect',
            style: {
              fill: 'rgb(85,208,93)',
              fillOpacity: 0.1
            }
          },
          bindingAxesIndex: [1],
          defaultSelect: {
            axisIndex: 1,
            datum: '10:20'
          }
        }
      },
      label: {
        visible: true,
        animation: false,
        formatMethod: datum => `${datum} minutes`,
        style: {
          fill: 'rgb(155,155,155)'
        }
      },
      bar: {
        style: {
          fill: 'rgb(85,208,93)',
          cornerRadius: [4, 4, 0, 0],
          width: 30
        }
      },
      markPoint: [
        {
          coordinate: {
            time: '10:20',
            cost: 2
          },
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetY: -10,
            text: {
              dy: 14,
              text: '2 minutes',
              style: {
                fill: 'white',
                fontSize: 14
              },
              labelBackground: {
                padding: [5, 10, 5, 10],
                style: {
                  fill: '#000',
                  cornerRadius: 5
                }
              }
            }
          },
          itemLine: {
            endSymbol: {
              visible: true,
              style: {
                angle: Math.PI,
                scaleY: 0.4,
                fill: '#000',
                dy: 4,
                stroke: '#000'
              }
            },
            startSymbol: { visible: false },
            line: {
              style: {
                visible: false
              }
            }
          }
        }
      ],
      animationUpdate: false,
      axes: [
        {
          orient: 'left',
          max: 10,
          label: { visible: false },
          grid: {
            style: { lineDash: [4, 4] }
          }
        },
        {
          orient: 'bottom',
          label: {
            formatMethod: datum => {
              return datum === '10:20' ? 'Current' : datum;
            },
            style: (datum, a, b) => {
              return {
                fontSize: datum === '10:20' ? 14 : 12,
                fill: datum === '10:20' ? 'black' : 'grey'
              };
            }
          },
          paddingOuter: 0.5,
          paddingInner: 0,
          grid: {
            visible: true,
            alignWithLabel: false,
            style: { lineDash: [4, 4] }
          }
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'mark-point');
  }
};
