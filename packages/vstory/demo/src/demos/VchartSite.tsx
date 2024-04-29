import React, { useEffect } from 'react';
import { ICharacterLink, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';

const chartSpecList = [
  {
    title: 'Timeline Chart',
    characterType: 'RangeColumnChart',
    options: {
      padding: 8,
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
      padding: 8,
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
      padding: 8,
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
      padding: 8,
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
      padding: 8,
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
    // characterType: 'RoseChart',
    spec: {
      padding: 8,
      type: 'rose',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'A', value: 608 },
            { type: 'B', value: 680 },
            { type: 'C', value: 727 },
            { type: 'D', value: 673 },
            { type: 'E', value: 815 }
          ]
        }
      ],
      radius: 1,
      innerRadius: 0.2,
      categoryField: 'type',
      valueField: 'value',
      seriesField: 'type'
    }
  },
  {
    title: 'Radar Chart',
    // characterType: 'RadarChart',
    spec: {
      padding: 0,
      type: 'radar',
      data: [
        {
          id: 'id0',
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
      categoryField: 'theta',
      valueField: 'value',
      seriesField: 'type',
      line: {
        style: {
          strokeWidth: 2
        }
      },
      point: {
        style: {
          size: 2,
          strokeWidth: 1
        }
      },
      startAngle: 90,
      axes: [
        {
          orient: 'angle',
          domainLine: { visible: true, smooth: false },
          label: {
            visible: false
          },
          tick: {
            visible: false
          },
          grid: { visible: true }
        },
        {
          orient: 'radius',
          domainLine: { visible: false, smooth: false },
          label: {
            visible: false
          },
          grid: { visible: false }
        }
      ],
      legends: {
        visible: false
      },
      label: {
        visible: false
      },
      animationAppear: {
        preset: 'clipIn'
      }
    }
  },
  {
    title: 'Word Cloud',
    // characterType: 'WordCloudChart',
    spec: {
      padding: 5,
      type: 'wordCloud',
      data: {
        name: 'baseData',
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
      },
      nameField: 'challenge_name',
      valueField: 'sum_count',
      seriesField: 'challenge_name',
      wordCloudConfig: {
        drawOutOfBound: 'clip'
      },
      maskShape: 'circle',
      fontSizeRange: [5, 8]
    }
  },
  {
    title: 'Treemap Chart',
    // characterType: 'TreemapChart',
    spec: {
      padding: 8,
      type: 'treemap',
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
  },
  {
    title: 'Sunburst Chart',
    // characterType: 'SunburstChart',
    spec: {
      padding: 8,
      type: 'sunburst',

      offsetX: 0,
      offsetY: 0,

      categoryField: 'name',
      valueField: 'value',
      outerRadius: 1,
      innerRadius: 0,
      gap: 0,
      labelLayout: {
        align: 'start',
        rotate: 'radial',
        offset: 60
      },
      sunburst: {
        visible: true,
        style: {
          fillOpacity: (datum: any) => {
            return datum.isLeaf ? 0.4 : 0.8;
          }
        }
      },
      label: {
        visible: false
      },
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
      ]
    }
  }
];

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
            left: 100 + (i % 5) * 150 + 20,
            width: 80,
            height: 80
          },
          options: {
            spec: item.spec,
            // data: data1,
            // @ts-ignore
            attribute: {},
            // @ts-ignore
            ...(item.options ?? {})
          }
        }))

        // TextComponent2
        // {
        //   type: 'TextComponent',
        //   id: `title1`,
        //   zIndex: 0,
        //   position: {
        //     top: 300,
        //     left: 400,
        //     width: 80,
        //     height: 80
        //   },
        //   options: {
        //     text: 'A BRIEF HISTORY',
        //     fill: 'black',
        //     textAlign: 'center'
        //   }
        // },
        // {
        //   type: 'TextComponent',
        //   id: `title2`,
        //   zIndex: 0,
        //   position: {
        //     top: 400,
        //     left: 400,
        //     width: 80,
        //     height: 80
        //   },
        //   options: {
        //     text: 'OF CHARTS',
        //     fill: 'black',
        //     textAlign: 'center'
        //   }
        // },

        // RichTextComponent2
        // {
        //   type: 'RichTextComponent',
        //   id: `titlesubtitle`,
        //   zIndex: 0,
        //   position: {
        //     top: 450,
        //     left: 400,
        //     width: 80,
        //     height: 80
        //   },
        //   options: {
        //     text: [{ text: 'Powered By', fill: 'black' }, { text: 'VChart', fill: 'blue' }],
        //     textAlign: 'center'
        //   }
        // },

        // scene1 title
        // {
        //   type: 'TextComponent',
        //   id: `title3`,
        //   zIndex: 0,
        //   position: {
        //     top: 50,
        //     left: 150,
        //     width: 80,
        //     height: 80
        //   },
        //   options: {
        //     text: 'DEVELOPMENT ROADMAP',
        //     fill: 'black',
        //     textAlign: 'center'
        //   }
        // },

        //
        // {
        //   type: 'timeAxisChart',
        //   id: `timeAxis`,
        //   zIndex: 0,
        //   position: {
        //     top: 450,
        //     left: 150,
        //     width: 880,
        //     height: 80
        //   },
        //   options: {

        //   }
        // },
      ],
      acts: [
        {
          id: 'default-chapter',
          scenes: [
            [
              ...new Array(5).fill(0).map(
                (_, i) =>
                  ({
                    characterId: `chart${i}`,
                    actions: [
                      {
                        startTime: i * 300,
                        duration: 1000,
                        action: 'appear'
                      }
                    ]
                  } as IRoleLink)
              ),
              ...new Array(5).fill(0).map(
                (_, i) =>
                  ({
                    characterId: `chart${9 - i}`,
                    actions: [
                      {
                        startTime: i * 300,
                        duration: 1000,
                        action: 'appear'
                      }
                    ]
                  } as IRoleLink)
              )
              // {
              //   characterId: `title1`,
              //   actions: [
              //     {
              //       startTime: 1500,
              //       duration: 500,
              //       action: 'appear'
              //     }
              //   ]
              // },
              // {
              //   characterId: `title2`,
              //   actions: [
              //     {
              //       startTime: 2000,
              //       duration: 500,
              //       action: 'appear'
              //     }
              //   ]
              // },
              // ...new Array(5).fill(0).map(
              //   (_, i) =>
              //     ({
              //       characterId: `chart${i}`,
              //       actions: [
              //         {
              //           startTime: i * 100 + 2500,
              //           duration: 1000,
              //           action: 'bounce'
              //         }
              //       ]
              //     } as IRoleLink)
              // ),
              // ...new Array(5).fill(0).map(
              //   (_, i) =>
              //     ({
              //       characterId: `chart${9 - i}`,
              //       actions: [
              //         {
              //           startTime: i * 100 + 2500,
              //           duration: 1000,
              //           action: 'bounce'
              //         }
              //       ]
              //     } as IRoleLink)
              // ),
              // {
              //   characterId: `subtitle`,
              //   actions: [
              //     {
              //       startTime: 2700,
              //       duration: 500,
              //       action: 'appear'
              //     }
              //   ]
              // }
            ]
            // [
            //   ...new Array(10).fill(0).map(
            //     (_, i) =>
            //       ({
            //         characterId: `chart${i}`,
            //         actions: [
            //           {
            //             startTime: 0,
            //             duration: 0,
            //             action: 'disappear'
            //           }
            //         ]
            //       } as IRoleLink)
            //   ),
            //   {
            //     characterId: `subtitle`,
            //     actions: [
            //       {
            //         startTime: 0,
            //         duration: 0,
            //         action: 'disappear'
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title1`,
            //     actions: [
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'move',
            //         position: { left: 200, top: 100 }
            //       },
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'style',
            //         style: { fontSize: 40 }
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title2`,
            //     actions: [
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'move',
            //         position: { left: 400, top: 100 }
            //       },
            //       {
            //         startTime: 0,
            //         duration: 500,
            //         action: 'style',
            //         style: { fontSize: 40 }
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `title3`,
            //     actions: [
            //       {
            //         startTime: 1000,
            //         duration: 500,
            //         action: 'appear'
            //       }
            //     ]
            //   },
            //   {
            //     characterId: `roadmap`,
            //     actions: [
            //       {
            //         startTime: 1000,
            //         duration: 500,
            //         action: 'appear'
            //       },
            //       {
            //         startTime: 1000,
            //         duration: 500,
            //         action: 'stream'
            //       }
            //     ]
            //   }
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
