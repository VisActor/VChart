import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import Scene3TitleImage from '../assets/scene3/title-image.png';
import Scene3Decoration from '../assets/scene3/decoration.png';
import Scene3TextTop from '../assets/scene3/text-zh.png';
import Scene3TextBottom from '../assets/scene3/text-en.png';
import Scene3ChartImage1 from '../assets/scene3/chart-1.png';
import Scene3ChartImage2 from '../assets/scene3/chart-2.png';
import Scene3ChartImage3 from '../assets/scene3/chart-3.png';
import Scene3ChartImage4 from '../assets/scene3/chart-4.png';
import Scene3ChartImage5 from '../assets/scene3/chart-5.png';

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
          zIndex: 1,
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
          zIndex: 1,
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
          zIndex: 1,
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
          zIndex: 1,
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
        // scene2
        {
          type: 'TextComponent',
          id: `scene2-title2`,
          zIndex: 1,
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
        },
        // scene3
        {
          type: 'TextComponent',
          id: `scene3-title1`,
          zIndex: 1,
          position: {
            top: 100,
            left: 200,
            width: 500,
            height: 200
          },
          options: {
            graphic: { text: 'Proto Bar', fontSize: 55, fontWeight: 'bold', textAlign: 'left' }
          }
        },
        {
          type: 'LineComponent',
          id: `scene3-line-top`,
          zIndex: 1,
          position: {
            top: 102,
            left: 100,
            width: 500,
            height: 200
          },
          options: {
            graphic: {
              lineWidth: 1,
              points: [
                { x: 100, y: 34 },
                { x: 350, y: 34 }
              ]
            }
          }
        },
        {
          type: 'LineComponent',
          id: `scene3-line-bottom`,
          zIndex: 1,
          position: {
            top: 130,
            left: 100,
            width: 500,
            height: 200
          },
          options: {
            graphic: {
              lineWidth: 1,
              points: [
                { x: 100, y: 34 },
                { x: 350, y: 34 }
              ]
            }
          }
        },
        {
          type: 'TextComponent',
          id: `scene3-title-Nicole`,
          zIndex: 1,
          position: {
            top: 150,
            left: 200,
            width: 500,
            height: 200
          },
          options: {
            graphic: { text: 'Nicole Oresme', fontSize: 12, fontWeight: 'bold', textAlign: 'left' }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-text-image-top`,
          zIndex: 1,
          position: {
            top: 160,
            left: 560,
            width: 570,
            height: 65
          },
          options: {
            graphic: {
              image: Scene3TextTop
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-text-image-top`,
          zIndex: 1,
          position: {
            top: 160,
            left: 560,
            width: 570,
            height: 65
          },
          options: {
            graphic: {
              image: Scene3TextTop
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-chart-image-1`,
          zIndex: 1,
          position: {
            top: 250,
            left: 560,
            width: 200,
            height: 160
          },
          options: {
            graphic: {
              image: Scene3ChartImage1
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-chart-image-2`,
          zIndex: 1,
          position: {
            top: 250,
            left: 780,
            width: 200,
            height: 160
          },
          options: {
            graphic: {
              image: Scene3ChartImage2
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-chart-image-3`,
          zIndex: 1,
          position: {
            top: 425,
            left: 560,
            width: 200,
            height: 160
          },
          options: {
            graphic: {
              image: Scene3ChartImage3
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-chart-image-4`,
          zIndex: 1,
          position: {
            top: 425,
            left: 780,
            width: 200,
            height: 160
          },
          options: {
            graphic: {
              image: Scene3ChartImage4
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-chart-image-5`,
          zIndex: 1,
          position: {
            top: 250,
            left: 1000,
            width: 200,
            height: 335
          },
          options: {
            graphic: {
              image: Scene3ChartImage5
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-text-image-bottom`,
          zIndex: 1,
          position: {
            top: 620,
            left: 560,
            width: 570,
            height: 60
          },
          options: {
            graphic: {
              image: Scene3TextBottom
            }
          }
        },
        {
          type: 'TextComponent',
          id: `scene3-title-1486`,
          zIndex: 1,
          position: {
            top: 150,
            left: 420,
            width: 500,
            height: 200
          },
          options: {
            graphic: { text: '1486', fontSize: 12, fontWeight: 'bold', textAlign: 'left' }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-title-image`,
          zIndex: 1,
          position: {
            top: 180,
            left: 200,
            width: 250,
            height: 260
          },
          options: {
            graphic: {
              image: Scene3TitleImage
            }
          }
        },
        {
          type: 'RectComponent',
          id: `scene3-background`,
          zIndex: 0,
          position: {
            top: 0,
            left: 170,
            width: 1200,
            height: 800
          },
          options: {
            graphic: {
              stroke: false,
              fill: '#D9D4CA'
            }
          }
        },
        {
          type: 'ImageComponent',
          id: `scene3-background-decoration`,
          zIndex: 0,
          position: {
            top: 120,
            left: 270,
            width: 1000,
            height: 500
          },
          options: {
            graphic: {
              image: Scene3Decoration
            }
          }
        }
      ],
      acts: [
        {
          id: 'default-chapter',
          scenes: [
            // {
            //   id: 'scene1',
            //   actions: [
            //     ...new Array(5).fill(0).map(
            //       (_, i) =>
            //         ({
            //           characterId: `chart${i}`,
            //           characterActions: [
            //             {
            //               startTime: i * 300 + 500,
            //               duration: 1000,
            //               action: 'appear',
            //               payload: {
            //                 animation: {
            //                   duration: 1000
            //                 }
            //               }
            //             }
            //           ]
            //         } as ICharacterLink)
            //     ),
            //     ...new Array(5).fill(0).map(
            //       (_, i) =>
            //         ({
            //           characterId: `chart${9 - i}`,
            //           characterActions: [
            //             {
            //               startTime: i * 300 + 500,
            //               duration: 1000,
            //               action: 'appear',
            //               payload: {
            //                 animation: {
            //                   duration: 1000
            //                 }
            //               }
            //             }
            //           ]
            //         } as ICharacterLink)
            //     ),
            //     {
            //       characterId: `title1`,
            //       characterActions: [
            //         {
            //           startTime: 1500,
            //           duration: 500,
            //           action: 'appear',
            //           payload: {
            //             animation: {
            //               duration: 500,
            //               effect: 'typewriter',
            //               easing: 'quadIn'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `title2`,
            //       characterActions: [
            //         {
            //           startTime: 2000,
            //           duration: 500,
            //           action: 'appear',
            //           payload: {
            //             animation: {
            //               duration: 500,
            //               effect: 'typewriter',
            //               easing: 'quadIn'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     ...new Array(5).fill(0).map((_, i) => ({
            //       characterId: `chart${9 - i}`,
            //       characterActions: [
            //         {
            //           startTime: i * 100 + 2500,
            //           duration: 2000,
            //           action: 'bounce',
            //           payload: {
            //             animation: {
            //               duration: 2000
            //             }
            //           }
            //         }
            //       ]
            //     })),
            //     ...new Array(5).fill(0).map((_, i) => ({
            //       characterId: `chart${i}`,
            //       characterActions: [
            //         {
            //           startTime: i * 100 + 2500,
            //           duration: 2000,
            //           action: 'bounce',
            //           payload: {
            //             animation: {
            //               duration: 2000
            //             }
            //           }
            //         }
            //       ]
            //     })),
            //     {
            //       characterId: `titlesubtitle`,
            //       characterActions: [
            //         {
            //           startTime: 2700,
            //           duration: 500,
            //           action: 'appear',
            //           payload: {
            //             animation: {
            //               duration: 200,
            //               easing: 'linear',
            //               effect: 'fade'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     ...new Array(10).fill(0).map((_, i) => ({
            //       characterId: `chart${9 - i}`,
            //       characterActions: [
            //         {
            //           startTime: 6000,
            //           duration: 1000,
            //           action: 'disappear',
            //           payload: {
            //             animation: {
            //               duration: 1000
            //             }
            //           }
            //         }
            //       ]
            //     })),
            //     {
            //       characterId: `titlesubtitle`,
            //       characterActions: [
            //         {
            //           startTime: 6000,
            //           duration: 1000,
            //           action: 'disappear',
            //           payload: {
            //             animation: {
            //               duration: 1000,
            //               easing: 'linear',
            //               effect: 'fade'
            //             }
            //           }
            //         }
            //       ]
            //     }
            //   ]
            // },
            // {
            //   id: 'scene2',
            //   actions: [
            //     {
            //       characterId: `title1`,
            //       characterActions: [
            //         {
            //           startTime: 0,
            //           duration: 800,
            //           action: 'moveTo',
            //           destination: {
            //             x: 250,
            //             y: 80
            //           },
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         },
            //         {
            //           startTime: 0,
            //           duration: 800,
            //           action: 'style',
            //           payload: {
            //             graphic: {
            //               fontSize: 40
            //             },
            //             animation: {
            //               duration: 800
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `title2`,
            //       characterActions: [
            //         {
            //           startTime: 0,
            //           duration: 800,
            //           action: 'moveTo',
            //           destination: {
            //             x: 550,
            //             y: 80
            //           },
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         },
            //         {
            //           startTime: 0,
            //           duration: 800,
            //           action: 'style',
            //           payload: {
            //             graphic: {
            //               fontSize: 40
            //             },
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `scene2-title2`,
            //       characterActions: [
            //         {
            //           startTime: 800,
            //           duration: 800,
            //           action: 'appear',
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'linear',
            //               effect: 'fade'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `title1`,
            //       characterActions: [
            //         {
            //           startTime: 2000,
            //           duration: 800,
            //           action: 'moveTo',
            //           destination: {
            //             x: -650,
            //             y: 80
            //           },
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `title2`,
            //       characterActions: [
            //         {
            //           startTime: 2000,
            //           duration: 800,
            //           action: 'moveTo',
            //           destination: {
            //             x: -350,
            //             y: 80
            //           },
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         }
            //       ]
            //     },
            //     {
            //       characterId: `scene2-title2`,
            //       characterActions: [
            //         {
            //           startTime: 2000,
            //           duration: 800,
            //           action: 'moveTo',
            //           destination: {
            //             x: -750,
            //             y: 80
            //           },
            //           payload: {
            //             animation: {
            //               duration: 800,
            //               easing: 'quadInOut'
            //             }
            //           }
            //         }
            //       ]
            //     }
            //   ]
            // },
            {
              id: 'scene3',
              actions: [
                // 第二个 scene 的内容，写在这里仅用作测试
                {
                  characterId: `scene3-background`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 800,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-background-decoration`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 800,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-title1`,
                  characterActions: [
                    {
                      action: 'appear',
                      startTime: 1,
                      duration: 700,
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-line-top`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 700,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-line-bottom`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 700,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-title-Nicole`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 700,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-title-1486`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 700,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-title-image`,
                  characterActions: [
                    {
                      startTime: 1,
                      duration: 700,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 700,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'right'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-text-image-top`,
                  characterActions: [
                    {
                      startTime: 300,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-chart-image-1`,
                  characterActions: [
                    {
                      startTime: 330,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    },
                    {
                      startTime: 1500,
                      duration: 1000,
                      action: 'style',
                      payload: {
                        graphic: {
                          width: 150
                        },
                        animation: {
                          duration: 1000,
                          easing: 'easeInOutQuad'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-chart-image-2`,
                  characterActions: [
                    {
                      startTime: 330,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    },
                    {
                      startTime: 1500,
                      duration: 1000,
                      action: 'style',
                      payload: {
                        graphic: {
                          width: 150,
                          dx: -50
                        },
                        animation: {
                          duration: 1000,
                          easing: 'easeInOutQuad'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-chart-image-3`,
                  characterActions: [
                    {
                      startTime: 330,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    },
                    {
                      startTime: 1500,
                      duration: 1000,
                      action: 'style',
                      payload: {
                        graphic: {
                          width: 150
                        },
                        animation: {
                          duration: 1000,
                          easing: 'easeInOutQuad'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-chart-image-4`,
                  characterActions: [
                    {
                      startTime: 330,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    },
                    {
                      startTime: 1500,
                      duration: 1000,
                      action: 'style',
                      payload: {
                        graphic: {
                          width: 150,
                          dx: -50
                        },
                        animation: {
                          duration: 1000,
                          easing: 'easeInOutQuad'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-chart-image-5`,
                  characterActions: [
                    {
                      startTime: 330,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    },
                    {
                      startTime: 1500,
                      duration: 1000,
                      action: 'style',
                      payload: {
                        graphic: {
                          width: 260,
                          dx: -100
                        },
                        animation: {
                          duration: 1000,
                          easing: 'easeInOutQuad'
                        }
                      }
                    }
                  ]
                },
                {
                  characterId: `scene3-text-image-bottom`,
                  characterActions: [
                    {
                      startTime: 360,
                      duration: 500,
                      action: 'appear',
                      payload: {
                        animation: {
                          duration: 500,
                          easing: 'easeInOutQuad',
                          move: {
                            from: 'bottom'
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    console.log(111, tempSpec);
    const story = new Story(tempSpec, { dom: id });
    window.story = story;
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
