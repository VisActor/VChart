import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb765f97cc3d008de5b3fe
 * 验证目的：轴标题标签及标注区域富文本。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const data1 = [
      { date: 'Day 1', workload: 7000 },
      { date: 'Day 2', workload: 1000 },
      { date: 'Day 3', workload: 6000 },
      { date: 'Day 4', workload: 4000 },
      { date: 'Day 5', workload: 8000 },
      { date: 'Day 6', workload: 3000 },
      { date: 'Day 7', workload: 9000 },
      { date: 'Day 8', workload: 2000 },
      { date: 'Day 9', workload: 5000 }
    ];
    const richTextConfig = text => [
      {
        text,
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'red'
      },
      {
        text: 'Alternative',
        fontSize: 10,
        lineThrough: true,
        underline: true,
        fill: 'green'
      }
    ];
    const spec = {
      type: 'bar',
      height: 500,
      markLine: [
        {
          y: 5000,
          label: {
            visible: true,
            position: 'end',
            type: 'rich',
            text: {
              type: 'rich',
              text: richTextConfig('Safe sugar intake 50g/day')
            },
            style: {
              textAlign: 'right',
              textBaseline: 'bottom',
              fill: '#000'
            },
            labelBackground: {
              visible: false
            }
          },
          line: {
            style: {
              stroke: '#000',
              lineDash: [0]
            }
          }
        }
      ],
      markPoint: [
        {
          coordinate: {
            date: 'Day 3',
            workload: 5000
          },
          itemContent: {
            offsetY: 40,
            offsetX: -200,
            autoRotate: false,
            text: {
              type: 'rich',
              text: [
                {
                  text: '111\n',
                  fontWeight: 'bold',
                  fontSize: 13,
                  fill: '#E8346D',
                  fontFamily: 'Times New Roman'
                },
                {
                  text: 'population was 899447',
                  fontSize: 10,
                  fill: '#E8346D',
                  fontFamily: 'Times New Roman'
                }
              ],
              style: {
                textConfig: [
                  {
                    text: '333\n',
                    fontWeight: 'bold',
                    fontSize: 13,
                    fill: '#E8346D',
                    fontFamily: 'Times New Roman'
                  },
                  {
                    text: 'population was 899447',
                    fontSize: 10,
                    fill: '#E8346D',
                    fontFamily: 'Times New Roman'
                  }
                ]
              }
            }
          },
          itemLine: {
            type: 'type-do',
            startSymbol: {
              size: 24,
              style: {
                stroke: '#E8346D'
              }
            },
            line: {
              style: {
                stroke: '#E8346D'
              }
            }
          }
        }
      ],
      markArea: [
        {
          coordinates: [
            {
              date: 'Day 1',
              workload: 1000
            },
            {
              date: 'Day 3',
              workload: 1000
            },
            {
              date: 'Day 3',
              workload: 8000
            },
            {
              date: 'Day 1',
              workload: 8000
            }
          ],
          label: {
            position: 'top',
            type: 'rich',
            text: {
              type: 'rich',
              text: [
                {
                  text: 'RICHTEXT',
                  fontWeight: 'bold',
                  fontSize: 25,
                  fill: '#3f51b5'
                },
                {
                  text: 'Alternative',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  fill: '#3f51b5'
                }
              ]
            }
          }
        }
      ],
      padding: {
        top: 24,
        right: 48,
        bottom: 48,
        left: 48
      },
      data: [
        {
          id: 'id0',
          values: data1
        }
      ],
      label: {
        visible: true,
        formatMethod: (text, ...args) => {
          if (!Array.isArray(text)) {
            return {
              type: 'rich',
              text: [
                {
                  text: `${text}`,
                  fill: 'red',
                  fontSize: 20
                },
                {
                  image:
                    '<svg t="1706521185596" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4214" width="200" height="200"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z m111.6-567.3C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z" p-id="4215" fill="#8a8a8a"></path></svg>',
                  width: 20,
                  height: 20
                }
              ]
            };
          }
          return [];
        }
      },
      xField: 'date',
      yField: 'workload',
      axes: [
        {
          orient: 'left',
          label: {
            visible: true,
            space: 8,
            style: {
              fill: '#6F6F6F',
              fontFamily: 'PingFang SC',
              _debug_bounds: true
            },
            formatMethod: text => {
              return {
                type: 'rich',
                text: [
                  {
                    text,
                    fontWeight: 'bold',
                    fontSize: 12,
                    fill: '#3f51b5'
                  },
                  {
                    text: '🌞',
                    fill: '#3f51b5'
                  },
                  {
                    text: '\nLargeLarge',
                    fill: 'red',
                    fontSize: 30
                  }
                ]
              };
            }
          },
          title: {
            visible: true,
            space: 20,
            text: {
              type: 'rich',
              text: [
                {
                  text: 'text',
                  fontWeight: 'bold',
                  fontSize: 12,
                  fill: '#3f51b5'
                },
                {
                  text: '🌞',
                  fill: '#3f51b5'
                },
                {
                  text: '\nLargeLarge',
                  fill: 'red',
                  fontSize: 30
                }
              ]
            },
            autoRotate: false
          }
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          visible: true,
          label: {
            space: 8,
            style: {
              fill: '#6F6F6F',
              fontFamily: 'PingFang SC',
              _debug_bounds: true
            },
            type: 'rich',
            formatMethod: (text, datum) => {
              return [
                {
                  text: `${text}`,
                  fill: 'black',
                  fontSize: 12
                },
                {
                  image:
                    '<svg t="1706521185596" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4214" width="200" height="200"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z m111.6-567.3C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z" p-id="4215" fill="#3a3a3a"></path></svg>',
                  width: 12,
                  height: 12,
                  margin: [0, 0, 8, 4]
                }
              ];
            }
          },
          title: {
            visible: true,
            space: 20,
            text: 'value',
            autoRotate: false,
            style: {
              dx: -100,
              fill: '#333',
              fontFamily: 'PingFang SC',
              fontSize: 14,
              fontWeight: 'bold',
              textBaseline: 'bottom',
              angle: -90
            }
          }
        }
      ],
      tooltip: {
        enterable: true,
        renderMode: 'canvas',
        mark: {
          title: {
            value: {
              type: 'rich',
              text: [
                {
                  text: 'TOOLTIP',
                  fontWeight: 'bold',
                  fill: '#3f51b5'
                },
                {
                  text: 'Alternative',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  fill: '#3f51b5'
                }
              ]
            }
          }
        }
      },
      bar: {
        style: {
          fill: '#00924F'
        },
        state: {
          hover: {
            fill: '#1664FF'
          }
        }
      }
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (
        !window.__visualChart
          .getStage()
          .findAll(g => g.type === 'richtext' && g.attribute.visible !== false && g.globalAABBBounds.width() > 0, true)
          .length
      )
        throw new Error('富文本未实际绘制');
    });
  }
};
