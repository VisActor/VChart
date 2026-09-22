import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 66385433b19f5100ced6a64f
 * 验证目的：极坐标角度半径标注线和标注点。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'MIDNIGHT',
              value: 1
            },
            {
              type: '1 AM',
              value: 1
            },
            {
              type: '2 AM',
              value: 1
            },
            {
              type: '3 AM',
              value: 1
            },
            {
              type: '4 AM',
              value: 1
            },
            {
              type: '5 AM',
              value: 1
            },
            {
              type: '6 AM',
              value: 1
            },
            {
              type: '7 AM',
              value: 1
            },
            {
              type: '8 AM',
              value: 1
            },
            {
              type: '9 AM',
              value: 1
            },
            {
              type: '10 AM',
              value: 1
            },
            {
              type: '11 AM',
              value: 1
            },
            {
              type: 'NOON',
              value: 1
            },
            {
              type: '13 AM',
              value: 1
            },
            {
              type: '14 AM',
              value: 1
            },
            {
              type: '15 AM',
              value: 1
            },
            {
              type: '16 AM',
              value: 1
            },
            {
              type: '17 AM',
              value: 1
            },
            {
              type: '18 AM',
              value: 1
            },
            {
              type: '19 AM',
              value: 1
            },
            {
              type: '20 AM',
              value: 1
            },
            {
              type: '21 AM',
              value: 1
            },
            {
              type: '22 AM',
              value: 1
            },
            {
              type: '23 AM',
              value: 1
            }
          ]
        },
        {
          id: 'id1',
          values: [
            {
              type: 'a',
              value: 1
            }
          ]
        }
      ],
      dataIndex: 0,
      type: 'rose',
      outerRadius: 0.7,
      innerRadius: 0.5,
      valueField: 'value',
      categoryField: 'type',
      seriesField: 'type',
      startAngle: -97.5,
      title: {
        text: 'History of Earth in 24-hour clock',
        textStyle: {
          height: 50,
          lineWidth: 2,
          fill: '#333',
          fontSize: 20,
          fontFamily: 'Times New Roman'
        },
        subtextStyle: {
          character: [
            {
              text: '',
              fontFamily: 'Times New Roman',
              fontSize: 14,
              fill: '#333'
            }
          ]
        }
      },
      axes: [
        {
          orient: 'angle',
          type: 'band',
          zIndex: 999,
          tick: {
            visible: true,
            tickSize: 10,
            inside: true,
            style: {
              stroke: '#fff'
            }
          },
          label: {
            visible: true,
            inside: true,
            style: {
              fill: '#fff'
            }
          },
          grid: {
            visible: true,
            style: {
              lineDash: [0],
              stroke: '#fff',
              lineWidth: 1
            },
            alignWithLabel: false
          },
          style: {
            zIndex: 400
          }
        }
      ],
      label: {
        visible: false,
        position: 'inside'
      },
      tooltip: {
        visible: false
      },
      rose: {
        style: {
          fill: 'rgb(129, 216, 208)'
        }
      },
      markLine: [
        {
          radius: 1.1,
          angle: 'MIDNIGHT',
          angle1: '3 AM'
        },
        {
          radius: 1.1,
          angle: '6 AM',
          angle1: '13 AM'
        }
      ],
      markPoint: [
        {
          position: {
            x: '50%',
            y: '50%'
          },
          regionRelative: true,
          itemLine: {
            visible: false
          },
          itemContent: {
            type: 'symbol',
            symbol: {
              style: {
                dx: -80,
                dy: -40,
                size: 60,
                symbolType:
                  '<svg t="1713519181357" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13552" width="200" height="200"><path d="M707.11808 590.9504l-160.67072-56.04864v-257.1776c0-17.28512-14.09024-31.32928-31.4368-31.32928-17.28512 0-31.37536 14.04416-31.37536 31.32928v279.5264a31.46752 31.46752 0 0 0 21.05856 29.59872l181.71904 63.40096a31.70816 31.70816 0 0 0 10.36288 1.73056 31.36 31.36 0 0 0 29.5936-21.05856c5.76-16.31232-2.87744-34.23232-19.2512-39.97184z" p-id="13553"></path></svg>',
                fill: 'rgb(129, 216, 208)'
              }
            }
          }
        },
        {
          angle: '4 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: 5,
            offsetY: -20,
            text: {
              text: '4: 00 Origin of life'
            }
          }
        },
        {
          angle: '5 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: 5,
            offsetY: -20,
            text: {
              text: '5: 00 Oldest Fossils'
            }
          }
        },
        {
          angle: '14 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: 20,
            text: {
              text: 'Single-Celled Algae(Acritarchs)',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '18 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: -20,
            text: {
              text: 'Sexual Reproduction',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '20 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: -20,
            text: {
              text: 'Seaweeds',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '21 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: -20,
            text: {
              text: 'Trilobites',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '22 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: -20,
            text: {
              text: 'Coal Swamps',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '23 AM',
          radius: 1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: -5,
            offsetY: -20,
            text: {
              text: 'Humans',
              style: {
                textAlign: 'right'
              }
            }
          }
        },
        {
          angle: '2 AM',
          radius: 1.1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: 10,
            offsetY: -20,
            text: {
              text: 'Meteorite Bombardment 0:00 to 3 am'
            }
          }
        },
        {
          angle: '10 AM',
          radius: 1.1,
          itemContent: {
            type: 'text',
            autoRotate: false,
            offsetX: 10,
            offsetY: 20,
            text: {
              text: '6:00 to 1: Abundant Banded Iron- Formations'
            }
          }
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
