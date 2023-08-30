import { STATE_HOVER_REVERSE } from './../../../../cjs/compile/mark/interface.d';
import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec1 = {
    type: 'sankey',
    data: [
      {
        name: 'data',
        values: [
          {
            nodes: [
              {
                // value: 100,
                name: 'A',
                children: [
                  {
                    name: 'top',
                    // value: 40,
                    children: [
                      { name: '00', value: 15 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'middle',
                    // value: 30,
                    children: [
                      { name: '00', value: 10 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                // value: 80,
                name: 'B',
                children: [
                  {
                    name: 'top',
                    // value: 40,
                    children: [
                      { name: '00', value: 100 },
                      { name: '01', value: 40 }
                    ]
                  },
                  {
                    name: 'middle',
                    value: 10
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                value: 50,
                name: 'C',
                children: [
                  {
                    name: 'top',
                    value: 20
                  },
                  {
                    name: 'middle',
                    value: 20
                  },
                  {
                    name: 'bottom',
                    value: 10
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    categoryField: 'name',
    valueField: 'value',

    nodeAlign: 'left',
    nodeGap: 8,
    nodeWidth: 10,
    minNodeHeight: 4,
    nodeKey: datum => datum.name,

    label: {
      visible: true,
      formatMethod: (text, datum) => {
        // console.log('text', text);
        // console.log('datum', datum);
        return datum.name + '-' + datum.value;
      },
      state: {
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    legends: {
      visible: true
    },

    node: {
      state: {
        hover: {
          fill: 'red'
        },
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    link: {
      state: {
        selected: {
          backgroundStyle: { fill: '#e8e8e8' }
        },
        hover: {
          stroke: '#000000'
        },
        blur: {
          fill: '#e8e8e8'
        }
      }
    },

    emphasis: {
      enable: true,
      effect: 'related'
    }
  };

  const data = [
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 11,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 8,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 2,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 1,
            color: 'orange'
          }
        ]
      }
    ],
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 8,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 2,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 1,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 1,
            color: 'orange'
          }
        ]
      }
    ],
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 11,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 80,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 20,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 10,
            color: 'red'
          }
        ]
      }
    ]
  ];
  const createData = () => {
    return data.map(values => {
      return {
        data: {
          id: 'data',
          values: values
        }
      };
    });
  };
  const specs = createData();

  console.log(specs, specs[0].data);

  const spec = {
    type: 'sankey',
    data: [specs[0].data],
    categoryField: 'name',
    valueField: 'value',
    sourceField: 'source',
    targetField: 'target',

    nodeAlign: 'justify',
    nodeGap: 8,
    nodeWidth: 15,
    minNodeHeight: 4,
    nodeKey: datum => datum.name,
    iterations: 20,

    title: {
      text: 'Job application process'
    },

    label: {
      visible: true,
      style: {
        fontSize: 10,
        fill: 'black'
      },
      state: {
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    node: {
      style: {
        fill: '#b9b9b9',
        stroke: 'white',
        lineWidth: 1,
        strokeOpacity: 1
      },
      state: {
        custom_unSelected: {
          fill: 'red',
          fillOpacity: 0.05
        }
      }
    },

    link: {
      style: {
        fill: data => {
          return data.color ?? data.datum.color;
        },
        fillOpacity: 1
      },
      state: {
        custom_unSelected: {
          fill: 'red',
          fillOpacity: 0.05
        }
      }
    }
  };

  const vChart = new VChart(spec1, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  vChart.renderAsync();
  window['vchart'] = vChart;
  // 监听点击事件
  // vChart.on('click', { level: 'mark' }, ctx => {
  //   console.log('mark', ctx);
  //   vChart.updateState({
  //     // 名称与上方配置要对应
  //     custom_unSelected: {
  //       filter: datum => {
  //         // 数据 type 不相等的进入这个状态
  //         console.log('datum', datum);
  //         return datum.source !== ctx.datum.key && datum.target !== ctx.datum.key;
  //       }
  //     }
  //   });
  // });

  // setTimeout(() => {
  //   console.log(111, data[2]);
  //   vChart.updateData('data', data[2]);
  // }, 2000);

  // vChart.on('click', ctx => {
  //   console.log('click-ctx', ctx);
  //   vChart.updateData('data', [
  //     {
  //       name: 'data',
  //       values: [
  //         {
  //           nodes: [
  //             {
  //               // value: 80,
  //               name: 'B',
  //               children: [
  //                 {
  //                   name: 'top',
  //                   // value: 40,
  //                   children: [
  //                     { name: '00', value: 100 },
  //                     { name: '01', value: 40 }
  //                   ]
  //                 },
  //                 {
  //                   name: 'middle',
  //                   value: 10
  //                 },
  //                 {
  //                   name: 'bottom',
  //                   value: 30
  //                 }
  //               ]
  //             },
  //             {
  //               value: 50,
  //               name: 'C',
  //               children: [
  //                 {
  //                   name: 'top',
  //                   value: 20
  //                 },
  //                 {
  //                   name: 'middle',
  //                   value: 20
  //                 },
  //                 {
  //                   name: 'bottom',
  //                   value: 10
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]);
  // });
};
run();
