import React, { useEffect } from 'react';
import { ICharacterLink, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';

const chartSpecList = [
  {
    title: 'Timeline Chart',
    characterType: 'RangeColumnChart',
    options: {
      title: {
        text: 'Timeline Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'id0',
          values: [
            { type: 'a', value: 0.36, value2: 0.06 },
            { type: 'b', value: 0.66, value2: 0.26 },
            { type: 'c', value: 0.4, value2: 0.0 },
            { type: 'd', value: 0.6, value2: 0.2 }
          ]
        }
      ],
      direction: 'horizontal',
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            minField: 'value',
            maxField: 'value2',
            yField: 'type',
            bar: {
              maxWidth: 2,
              style: {
                maxWidth: 2
              }
            },
            label: {
              style: {
                visible: false
              }
            }
          }
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'bottom' },
          spec: {
            domainLine: { visible: true },
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'left' },
          spec: {
            domainLine: { visible: false },
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        }
      ]
    }
  },
  {
    title: 'Bar Chart',
    characterType: 'BarChart',
    options: {
      title: {
        text: 'BarChart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data',
          values: [
            {
              x: 'Mon',
              y: 100,
              type: '销售额'
            },
            {
              x: 'Tues',
              y: 66,
              type: '销售额'
            },
            {
              x: 'Wed',
              y: 95,
              type: '销售额'
            },
            {
              x: 'Mon',
              y: 43,
              type: '利润'
            },
            {
              x: 'Tues',
              y: 80,
              type: '利润'
            },
            {
              x: 'Wed',
              y: 68,
              type: '利润'
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            xField: ['x', 'type'],
            yField: 'y',
            seriesField: 'type',
            bar: {
              style: {
                fill: {
                  gradient: 'linear',
                  stops: [
                    {
                      offset: 1
                    },
                    {
                      offset: 0,
                      opacity: 0.6
                    }
                  ]
                }
              },
              state: {
                selected: {
                  stroke: '#000',
                  strokeWidth: 1
                }
              }
            },
            label: {
              style: {
                visible: false
              }
            }
          }
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'bottom' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'left' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        }
      ],
      color: ['#4CC9E4', '#4954E6']
    }
  },
  {
    title: 'Line/Area Chart',
    characterType: 'AreaChart',
    options: {
      title: {
        text: 'Line/Area Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data2',
          values: [
            { x: 1, y: 70, type: 'a' },
            { x: 2, y: 20, type: 'a' },
            { x: 3, y: 30, type: 'a' },
            { x: 4, y: 10, type: 'a' },

            { x: 1, y: 70, type: 'b' },
            { x: 2, y: 20, type: 'b' },
            { x: 3, y: 30, type: 'b' },
            { x: 4, y: 10, type: 'b' }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            point: {
              visible: false
            }
          }
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'bottom' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'left' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        }
      ]
    }
  },
  {
    title: 'Pie Chart',
    characterType: 'PieChart',
    options: {
      title: {
        text: 'Pie Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data1',
          values: [
            {
              value: 348,
              name: '中介渠道: 34.8%'
            },
            {
              value: 152,
              name: '会员: 15.2%'
            },
            {
              value: 500,
              name: '散客: 50%'
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: { valueField: 'value', categoryField: 'name', radius: 1, innerRadius: 0 }
        }
      ]
    }
  },
  {
    title: 'Scatter Chart',
    characterType: 'ScatterChart',
    options: {
      title: {
        text: 'Scatter Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data2',
          values: [
            { x: 1, y: 70, type: 'a' },
            { x: 2, y: 20, type: 'a' },
            { x: 3, y: 30, type: 'a' },
            { x: 4, y: 10, type: 'a' },

            { x: 1, y: 70, type: 'b' },
            { x: 2, y: 20, type: 'b' },
            { x: 3, y: 30, type: 'b' },
            { x: 4, y: 10, type: 'b' }
          ]
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'bottom' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'left' },
          spec: {
            tick: { visible: false },
            label: { visible: false },
            grid: { visible: false }
          }
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            point: {
              style: {
                size: 4
              }
            }
          }
        }
      ]
    }
  },
  {
    title: 'Rose Chart',
    characterType: 'RoseChart',
    options: {
      title: {
        text: 'Rose Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data1',
          values: [
            {
              value: 348,
              name: '中介渠道: 34.8%'
            },
            {
              value: 152,
              name: '会员: 15.2%'
            },
            {
              value: 500,
              name: '散客: 50%'
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: { valueField: 'value', seriesField: 'name', categoryField: 'name', radius: 1, innerRadius: 0 }
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'radius' },
          spec: {
            domainLine: { visible: false, smooth: false },
            label: {
              visible: false
            },
            tick: {
              visible: false
            },
            grid: { visible: false }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'angle' },
          spec: {
            domainLine: { visible: false, smooth: false },
            label: {
              visible: false
            },
            tick: {
              visible: false
            },
            grid: { visible: false }
          }
        }
      ]
    }
  },
  {
    title: 'Radar Chart',
    characterType: 'RadarChart',
    options: {
      title: {
        text: 'Radar Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data2',
          values: [
            {
              theta: 0,
              type: 'A',
              value: 833
            },
            {
              theta: 1,
              type: 'A',
              value: 898
            },
            {
              theta: 2,
              type: 'A',
              value: 672
            },
            {
              theta: 3,
              type: 'A',
              value: 889
            },
            {
              theta: 4,
              type: 'A',
              value: 889
            },
            {
              theta: 5,
              type: 'A',
              value: 658
            },
            {
              theta: 6,
              type: 'A',
              value: 822
            },
            {
              theta: 7,
              type: 'A',
              value: 825
            },
            {
              theta: 0,
              type: 'B',
              value: 659
            },
            {
              theta: 1,
              type: 'B',
              value: 896
            },
            {
              theta: 2,
              type: 'B',
              value: 822
            },
            {
              theta: 3,
              type: 'B',
              value: 874
            },
            {
              theta: 4,
              type: 'B',
              value: 742
            },
            {
              theta: 5,
              type: 'B',
              value: 878
            },
            {
              theta: 6,
              type: 'B',
              value: 643
            },
            {
              theta: 7,
              type: 'B',
              value: 604
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            categoryField: 'theta',
            valueField: 'value',
            seriesField: 'type',
            line: {
              style: {
                strokeWidth: 2
              }
            },
            legends: {
              visible: false
            },
            label: {
              visible: false
            },
            animationAppear: {
              preset: 'clipIn'
            },
            point: {
              style: {
                size: 2,
                strokeWidth: 1
              }
            },
            startAngle: 90
          }
        }
      ],
      componentSpec: [
        {
          specKey: 'axes',
          matchInfo: { orient: 'radius' },
          spec: {
            domainLine: { visible: true, smooth: false },
            label: {
              visible: false
            },
            tick: {
              visible: false
            },
            grid: { visible: true }
          }
        },
        {
          specKey: 'axes',
          matchInfo: { orient: 'angle' },
          spec: {
            domainLine: { visible: false, smooth: false },
            label: {
              visible: false
            },
            grid: { visible: false }
          }
        }
      ]
    }
  },
  {
    title: 'Word Cloud',
    characterType: 'WordCloudChart',
    options: {
      title: {
        text: 'Word Cloud',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data1',
          values: [
            {
              challenge_id: 1658490688121879,
              challenge_name: '宅家剧场',
              sum_count: 128
            },
            {
              challenge_id: 1640007327696910,
              challenge_name: '我的观影报告',
              sum_count: 103
            },
            {
              challenge_id: 1557656100811777,
              challenge_name: '抖瓜小助手',
              sum_count: 76
            },
            {
              challenge_id: 1553513807372289,
              challenge_name: '搞笑',
              sum_count: 70
            },
            {
              challenge_id: 1599321527572563,
              challenge_name: '我要上热门',
              sum_count: 69
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            valueField: 'sum_count',
            seriesField: 'challenge_name',
            nameField: 'challenge_name',
            wordCloudConfig: {
              drawOutOfBound: 'clip'
            },
            maskShape: 'circle',
            fontSizeRange: [5, 8]
          }
        }
      ]
    }
  },
  {
    title: 'TreeMap Chart',
    characterType: 'TreeMapChart',
    options: {
      title: {
        text: 'TreeMap Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data',
          values: [
            {
              name: 'Second',
              children: [
                {
                  name: 'B2',
                  value: 98
                },
                {
                  name: 'B3',
                  value: 56
                }
              ]
            },
            {
              name: 'First',
              children: [
                {
                  name: 'A2',
                  value: 60
                },
                {
                  name: 'A3',
                  value: 30
                }
              ]
            },
            {
              name: 'Third',
              children: [
                {
                  name: 'C1',
                  value: 33
                },
                {
                  name: 'C2',
                  value: 30
                },
                {
                  name: 'C3',
                  value: 40
                }
              ]
            },
            {
              name: 'Fourth',
              children: [
                {
                  name: 'D4',
                  value: 64
                },
                {
                  name: 'D5',
                  value: 60
                }
              ]
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            categoryField: 'name',
            valueField: 'value',
            legends: { visible: false },
            nodePadding: 1,
            nonLeaf: {
              visible: false
            },
            nonLeafLabel: {
              visible: false
            },
            label: {
              visible: false
            }
          }
        }
      ]
    }
  },
  {
    title: 'Sunburst Chart',
    characterType: 'SunburstChart',
    options: {
      title: {
        text: 'Sunburst Chart',
        orient: 'bottom',
        align: 'center',
        textStyle: {
          fontSize: 10,
          lineHeight: 10
        }
      },
      padding: 12,
      data: [
        {
          id: 'data',
          values: [
            {
              name: 'Grandpa',
              children: [
                {
                  name: 'Uncle Leo',
                  value: 15,
                  children: [
                    {
                      name: 'Cousin Jack',
                      value: 2
                    },
                    {
                      name: 'Cousin Mary',
                      value: 5,
                      children: [
                        {
                          name: 'Jackson',
                          value: 2
                        }
                      ]
                    },
                    {
                      name: 'Cousin Ben',
                      value: 4
                    }
                  ]
                },
                {
                  name: 'Father',
                  value: 10,
                  children: [
                    {
                      name: 'Me',
                      value: 5
                    },
                    {
                      name: 'Brother Peter',
                      value: 1
                    }
                  ]
                }
              ]
            },
            {
              name: 'Nancy',
              children: [
                {
                  name: 'Uncle Nike',
                  children: [
                    {
                      name: 'Cousin Betty',
                      value: 1
                    },
                    {
                      name: 'Cousin Jenny',
                      value: 2
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      seriesSpec: [
        {
          matchInfo: { specIndex: 'all' },
          spec: {
            offsetX: 0,
            offsetY: 0,
            categoryField: 'name',
            valueField: 'value',
            outerRadius: 1,
            innerRadius: 0,
            label: {
              visible: false
            }
          }
        }
      ]
    }
  }
].map(item => ({
  ...item,
  options: {
    ...item.options,
    panel: {
      fill: 'white',
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowBlur: 10,
      shadowOffsetX: 4,
      shadowOffsetY: 4
    }
  }
}));

export const VChartSiteDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const tempSpec: IStorySpec = {
      characters: [
        ...chartSpecList.map((item, i) => ({
          type: item.characterType ?? 'CharacterChart',
          id: `chart${i}`,
          zIndex: 0,
          position: {
            top: i < 5 ? 50 : 570,
            left: 100 + (i % 5) * 170 + 20,
            width: 110,
            height: 110
          },
          options: {
            spec: item.spec,
            // data: data1,
            // @ts-ignore
            attribute: {},
            // @ts-ignore
            ...(item.options ?? {})
          }
        })),
        {
          type: 'TextComponent',
          id: `title1`,
          zIndex: 0,
          position: {
            top: 300,
            left: 500,
            width: 500,
            height: 200
          },
          options: {
            graphic: { text: 'A BRIEF HISTORY', fontSize: 55, fontWeight: 'bold' }
          }
        },
        {
          type: 'TextComponent',
          id: `title2`,
          zIndex: 0,
          position: {
            top: 380,
            left: 500,
            width: 400,
            height: 60
          },
          options: {
            graphic: { text: 'OF CHARTS', fontSize: 55, fontWeight: 'bold' }
          }
        },
        // RichTextComponent2
        {
          type: 'RichTextComponent',
          id: `titlesubtitle`,
          zIndex: 0,
          position: {
            top: 450,
            left: 600,
            width: 400,
            height: 80
          },
          options: {
            graphic: {
              width: 400,
              fontSize: 22,
              fontWeight: 'bold',
              textConfig: [
                {
                  text: 'Powered By '
                },
                {
                  text: 'VChart',
                  fill: 'blue'
                }
              ]
            }
          }
        },
        // scene1 title
        {
          type: 'TextComponent',
          id: `title3`,
          zIndex: 0,
          position: {
            top: 50,
            left: 150,
            width: 200,
            height: 20
          },
          options: {
            graphic: {
              width: 400,
              fontSize: 12,
              fill: '#292729',
              text: 'DEVELOPMENT ROADMAP'
            }
          }
        }
      ],
      acts: [
        {
          id: 'default-chapter',
          scenes: [
            {
              id: 'scene1',
              actions: [
                ...new Array(5).fill(0).map(
                  (_, i) =>
                    ({
                      characterId: `chart${i}`,
                      characterActions: [
                        {
                          startTime: i * 300,
                          duration: 1000,
                          action: 'appear'
                        }
                      ]
                    } as ICharacterLink)
                ),
                ...new Array(5).fill(0).map(
                  (_, i) =>
                    ({
                      characterId: `chart${9 - i}`,
                      characterActions: [
                        {
                          startTime: i * 300,
                          duration: 1000,
                          action: 'appear'
                        }
                      ]
                    } as ICharacterLink)
                ),
                {
                  characterId: `title1`,
                  characterActions: [
                    {
                      startTime: 1500,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          effect: 'typewriter'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `title2`,
                  characterActions: [
                    {
                      startTime: 2000,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          effect: 'typewriter'
                        }
                      }
                    }
                  ]
                },
                ...new Array(5).fill(0).map((_, i) => ({
                  characterId: `chart${9 - i}`,
                  characterActions: [
                    {
                      startTime: i * 100 + 2500,
                      duration: 2000,
                      action: 'bounce',
                      payload: {
                        animation: {
                          duration: 2000
                        }
                      }
                    }
                  ]
                })),
                ...new Array(5).fill(0).map((_, i) => ({
                  characterId: `chart${i}`,
                  characterActions: [
                    {
                      startTime: i * 100 + 2500,
                      duration: 2000,
                      action: 'bounce',
                      payload: {
                        animation: {
                          duration: 2000
                        }
                      }
                    }
                  ]
                })),
                {
                  characterId: `titlesubtitle`,
                  characterActions: [
                    {
                      startTime: 2700,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 200,
                          easing: 'linear',
                          effect: 'fade'
                        }
                      }
                    }
                  ]
                }
              ]
            }
            // [

            //   // {
            //   //   characterId: `title1`,
            //   //   characterActions: [
            //   //     {
            //   //       startTime: 1500,
            //   //       duration: 500,
            //   //       action: 'appear'
            //   //     }
            //   //   ]
            //   // },
            //   // {
            //   //   characterId: `title2`,
            //   //   characterActions: [
            //   //     {
            //   //       startTime: 2000,
            //   //       duration: 500,
            //   //       action: 'appear'
            //   //     }
            //   //   ]
            //   // },
            //   // ...new Array(5).fill(0).map(
            //   //   (_, i) =>
            //   //     ({
            //   //       characterId: `chart${i}`,
            //   //       characterActions: [
            //   //         {
            //   //           startTime: i * 100 + 2500,
            //   //           duration: 1000,
            //   //           action: 'bounce'
            //   //         }
            //   //       ]
            //   //     } as IRoleLink)
            //   // ),
            //   // ...new Array(5).fill(0).map(
            //   //   (_, i) =>
            //   //     ({
            //   //       characterId: `chart${9 - i}`,
            //   //       characterActions: [
            //   //         {
            //   //           startTime: i * 100 + 2500,
            //   //           duration: 1000,
            //   //           action: 'bounce'
            //   //         }
            //   //       ]
            //   //     } as IRoleLink)
            //   // ),
            //   // {
            //   //   characterId: `subtitle`,
            //   //   characterActions: [
            //   //     {
            //   //       startTime: 2700,
            //   //       duration: 500,
            //   //       action: 'appear'
            //   //     }
            //   //   ]
            //   // }
            // ]
            // [
            //   ...new Array(10).fill(0).map(
            //     (_, i) =>
            //       ({
            //         characterId: `chart${i}`,
            //         characterActions: [
            //           {
            //             startTime: 0,
            //             duration: 0,
            //             action: 'disappear'
            //           }
            //         ]
            //       } as IRoleLink)
            //   ),
            //   {
            //     characterId: `titlesubtitle`,
            //     characterActions: [
            //       {
            //         startTime: 0,
            //         duration: 200,
            //         action: 'disappear',
            //         payload: {
            //           animation: {
            //             effect: 'fade',
            //             duration: 200,
            //             easing: 'linear'
            //           }
            //         }
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title1`,
            //     characterActions: [
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'moveTo',
            //         destination: { left: 200, top: 100 }
            //       },
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'style',
            //         graphic: { fontSize: 40 }
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title2`,
            //     characterActions: [
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'moveTo',
            //         destination: { left: 400, top: 100 }
            //       },
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'style',
            //         graphic: { fontSize: 40 }
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title3`,
            //     characterActions: [
            //       {
            //         startTime: 1000,
            //         duration: 500,
            //         action: 'appear'
            //       }
            //     ]
            //   }
            //   // {
            //   //   characterId: `roadmap`,
            //   //   characterActions: [
            //   //     {
            //   //       startTime: 1000,
            //   //       duration: 500,
            //   //       action: 'appear'
            //   //     },
            //   //     {
            //   //       startTime: 1000,
            //   //       duration: 500,
            //   //       action: 'stream'
            //   //     }
            //   //   ]
            //   // }
            // ]
          ]
        }
      ]
    };
    const story = new Story(tempSpec, { dom: id });
    story.play();
    const btn1 = document.createElement('button');
    btn1.innerText = 'replay';
    btn1.addEventListener('click', () => {
      story.play();
    });
    const btn2 = document.createElement('button');
    btn2.innerText = 'export';
    btn2.addEventListener('click', () => {
      story
        .encodeToVideo(0, 5000, 15)
        .then(objUrl => {
          const video = document.createElement('video');
          (video as any).muted = 'muted';
          video.controls = true;
          video.src = objUrl;
          video.play();
          video.style.width = '500px';
          video.style.height = '300px';
          document.body.appendChild(video);
        })
        .catch(err => {
          console.log(err);
        });
    });
    document.body.appendChild(btn1);
    document.body.appendChild(btn2);

    // let i = 0;
    // story.getPlayer().setCurrentChapter(0);
    // setInterval(() => {
    //   story.getPlayer().tickTo(300 * i++);
    // }, 300);
  }, []);

  return <div style={{ width: '100%', height: '100%' }} id={id}></div>;
};
