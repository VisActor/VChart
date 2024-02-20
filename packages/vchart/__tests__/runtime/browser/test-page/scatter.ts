import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';
import bigData from './data/datazoom-big-data.json';
import bigData2 from './data/datazoom-big-data-2.json';
import { createButton } from '../../../util/dom';
import { truncate } from 'fs';

const data = [
  { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
  { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
  { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
  { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
  { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
  { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
  { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
  { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
];

const history = [];
// const spec = {
//   type: 'scatter',
//       padding: [0, 30, 30, 30],
//       data: {
//         values: [
//       {
//         "type": "锋兰达-触点名称",
//         "index_name": "养车分享",
//         "x_rate": 0.02278189988504546,
//         "y_rate": 0.47089560037621486,
//         "select_index_list": [
//           {
//             "name": "有效阅读线索用户数",
//             "key": "valid_read_a4_did_cnt",
//             "value": 218
//           },
//           {
//             "name": "有效阅读兴趣用户数",
//             "key": "valid_read_a3_did_cnt",
//             "value": 4506
//           },
//           {
//             "name": "内容有效阅读率",
//             "key": "valid_read_rate",
//             "value": 0.8021736858605915
//           }
//         ],
//         "valid_read_a4_did_cnt": 218,
//         "valid_read_a3_did_cnt": 4506,
//         "valid_read_rate": 0.8021736858605915
//       },
//       {
//         "type": "锋兰达-触点名称",
//         "index_name": "市场行情",
//         "x_rate": 0.010450032030749519,
//         "y_rate": 0.2418822069186419,
//         "select_index_list": [
//           {
//             "name": "有效阅读线索用户数",
//             "key": "valid_read_a4_did_cnt",
//             "value": 1044
//           },
//           {
//             "name": "有效阅读兴趣用户数",
//             "key": "valid_read_a3_did_cnt",
//             "value": 24165
//           },
//           {
//             "name": "内容有效阅读率",
//             "key": "valid_read_rate",
//             "value": 0.5806674407431134
//           }
//         ],
//         "valid_read_a4_did_cnt": 1044,
//         "valid_read_a3_did_cnt": 24165,
//         "valid_read_rate": 0.5806674407431134
//       },
//       {
//         "type": "锋兰达-触点名称",
//         "index_name": "用车分享",
//         "x_rate": 0.022584228063680118,
//         "y_rate": 0.6319881525360977,
//         "select_index_list": [
//           {
//             "name": "有效阅读线索用户数",
//             "key": "valid_read_a4_did_cnt",
//             "value": 61
//           },
//           {
//             "name": "有效阅读兴趣用户数",
//             "key": "valid_read_a3_did_cnt",
//             "value": 1707
//           },
//           {
//             "name": "内容有效阅读率",
//             "key": "valid_read_rate",
//             "value": 0.8326545723805998
//           }
//         ],
//         "valid_read_a4_did_cnt": 61,
//         "valid_read_a3_did_cnt": 1707,
//         "valid_read_rate": 0.8326545723805998
//       },
//       {
//         "type": "锋兰达-触点名称",
//         "index_name": "懂车分",
//         "x_rate": 0.02366974186935048,
//         "y_rate": 0.7568912496505451,
//         "select_index_list": [
//           {
//             "name": "有效阅读线索用户数",
//             "key": "valid_read_a4_did_cnt",
//             "value": 1270
//           },
//           {
//             "name": "有效阅读兴趣用户数",
//             "key": "valid_read_a3_did_cnt",
//             "value": 40611
//           },
//           {
//             "name": "内容有效阅读率",
//             "key": "valid_read_rate",
//             "value": 0.7571521759388687
//           }
//         ],
//         "valid_read_a4_did_cnt": 1270,
//         "valid_read_a3_did_cnt": 40611,
//         "valid_read_rate": 0.7571521759388687
//       }],
//       },
//       color: ['#0C5DFF', '#FF995A'],
//       xField: 'x_rate',
//       yField: 'y_rate',
//       size: 48,
//       seriesField: 'type',
//       legends: [
//         {
//           visible: true,
//           orient: 'top',
//           position: 'middle',
//         },
//       ],
//       axes: [
//         {
//           type: 'linear',
//           orient: 'left',
//           max: 1,
//           min: 0,
//           // label: {
//           //   formatMethod: (n: number) => {
//           //     return formatRate(n);
//           //   },
//           // },
//           id: 'yAxis',
//           // zero: false,
//           // nice: false
//         },
//         {
//           type: 'linear',
//           orient: 'bottom',
//           // zero: false,
//           // nice: false
//           max: 1,
//           min: 0,
//           // label: {
//           //   formatMethod: (n: number) => {
//           //     return formatRate(n);
//           //   },
//           // },
//         },
//       ],
//       dataZoom: [
//         {
//           filterMode: 'axis',
//           orient: 'bottom',
//           // start: 0,
//           // end: 1,
//           id: 'xDataZoom',
//           offsetY: 20,
//           showDetail: true,
//         },
//         {
//           filterMode: 'axis',
//           orient: 'right',
//           axisId: 'yAxis',
//           offsetX: 20,
//           // offsetY: -10,
//           // start: lastDataZoomState?.current.yDataZoom[0],
//           // end: lastDataZoomState?.current.yDataZoom[1],
//           id: 'yDataZoom',
//           showDetail: true,
//         },
//       ],
//       brush: {
//         visible: true,
//         brushType: 'rect',
//         inBrush: {
//           colorAlpha: 1,
//         },
//         outOfBrush: {
//           colorAlpha: 0.2,
//         },
//         dataZoomIndex: [0, 1],
//         // filterMode: 'filter'
//       }
//     }

const spec = {
  ...bigData,
  dataZoom: [
    {
      ...bigData.dataZoom[0],
      realTime: true,
      maxSpan: 0.05
      // filterMode: 'axis'
      // showDetail: true
      // showDetail: false
      // domain:
    }
  ]
};

// const spec = {
//   type: 'pie',
//   padding: {
//     left: 50
//   },
//   data: [
//     {
//       id: 'id0',
//       values: data
//     }
//   ],
//   outerRadius: 0.8,
//   innerRadius: 0.5,
//   padAngle: 0.6,
//   valueField: 'value',
//   categoryField: 'type',
//   pie: {
//     style: {
//       cornerRadius: 10,
//       texture: datum => datum['texture']
//     },
//     state: {
//       hover: {
//         outerRadius: 0.85,
//         stroke: '#000',
//         lineWidth: 1
//       },
//       selected: {
//         outerRadius: 0.85,
//         stroke: '#000',
//         lineWidth: 1
//       }
//     }
//   },
//   title: {
//     visible: true,
//     text: 'Statistics of Surface Element Content'
//   },
//   indicator: {
//     visible: true,
//     trigger: 'hover',
//     limitRatio: 0.4,
//     title: {
//       visible: true,
//       autoFit: true,
//       style: {
//         fontWeight: 'bolder',
//         fontFamily: 'Times New Roman',
//         fill: '#888',
//         text: datum => {
//           const d = datum ?? data[0];
//           return d['formula'];
//         }
//       }
//     },
//     content: [
//       {
//         visible: true,
//         style: {
//           fontSize: 20,
//           fill: 'orange',
//           fontWeight: 'bolder',
//           fontFamily: 'Times New Roman',
//           text: datum => {
//             const d = datum ?? data[0];
//             return d['type'];
//           }
//         }
//       },
//       {
//         visible: true,
//         style: {
//           fontSize: 18,
//           fill: 'orange',
//           fontFamily: 'Times New Roman',
//           text: datum => {
//             const d = datum ?? data[0];
//             return d['value'] + '%';
//           }
//         }
//       }
//     ]
//   },
//   legends: {
//     visible: true,
//     orient: 'left',
//     item: {
//       shape: {
//         style: {
//           symbolType: 'circle',
//           texture: datum => datum['texture']
//         }
//       }
//     }
//   }
//   // tooltip: {
//   //   mark: {
//   //     content: [
//   //       {
//   //         key: datum => datum['type'],
//   //         value: datum => datum['value'] + '%'
//   //       }
//   //     ]
//   //   }
//   // }
// };

// const spec = {
//   color: [
//     '#3855df',
//     '#ffc52b',
//     '#5ecf78',
//     '#fb7a00',
//     '#0acffd',
//     '#217dfd',
//     '#98dd61',
//     '#3150e0',
//     '#714efd',
//     '#0bcfff',
//     '#3d0dde',
//     '#ffc527',
//     '#f5c13f',
//     '#fb7a08',
//     '#95d8fd'
//   ],
//   type: 'rangeColumn',
//   direction: 'horizontal',
//   yField: 'type',
//   minField: 'start_time',
//   maxField: 'end_time',
//   seriesField: 'color',
//   dataZoom: [
//     {
//       orient: 'bottom',
//       height: 20,
//       start: 0.1,
//       end: 0.3,
//       filterMode: 'axis',
//       endValue: 1681956000,
//       realTime: false,
//       maxSpan: 0.4,
//       // startText: {
//       //   formatMethod: text => Math.floor(text)
//       // },
//       // endText: {
//       //   formatMethod: text => Math.floor(text)
//       // }
//     }
//   ],
//   axes: [
//     { orient: 'left', type: 'band', bandPadding: 0.5, visible: false },
//     {
//       type: 'time',
//       orient: 'bottom',
//       layers: [
//         {
//           tickStep: 28800,
//           timeFormat: '%Y%m%d %H:%M'
//         }
//       ]
//     }
//   ],
//   title: {
//     textStyle: {
//       character: [
//         {
//           text: 'Time-Consuming Distribution',
//           fontWeight: 400,
//           fill: '#222'
//         },
//         {
//           text: 'Show the SQL distribution of TOP 100',
//           fontWeight: 200,
//           fontSize: 10,
//           fill: '#555'
//         }
//       ]
//     }
//   },
//   tooltip: {
//     visible: true,
//     dimension: {
//       visible: false
//     },
//     mark: {
//       title: {
//         key: 'Query ID',
//         value: datum => 'Query ID: ' + datum['id']
//       },
//       content: [
//         {
//           key: 'Time Consuming',
//           value: datum => datum['useTime']
//         },
//         {
//           key: 'start time',
//           value: datum => datum['start_time']
//         },
//         {
//           key: 'end time',
//           value: datum => datum['end_time']
//         }
//       ]
//     }
//   },
//   data: [
//     {
//       id: 'data0',
//       values: [
//         {
//           start_time: 1681926000,
//           end_time: 1681927200,
//           type: 'TOP 1',
//           color: 'A',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681926000,
//           end_time: 1681959600,
//           type: 'TOP 2',
//           color: 'B',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681925400,
//           end_time: 1681974000,
//           type: 'TOP 3',
//           color: 'C',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681924800,
//           end_time: 1681933200,
//           type: 'TOP 4',
//           color: 'D',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681959600,
//           end_time: 1681963200,
//           type: 'TOP 5',
//           color: 'E',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681970400,
//           end_time: 1681971000,
//           type: 'TOP 5',
//           color: 'F',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681992000,
//           end_time: 1681992600,
//           type: 'TOP 5',
//           color: 'G',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681956000,
//           end_time: 1681963200,
//           type: 'TOP 6',
//           color: 'H',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681990200,
//           end_time: 1681993800,
//           type: 'TOP 7',
//           color: 'I',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681948800,
//           end_time: 1681959600,
//           type: 'TOP 8',
//           color: 'J',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         },
//         {
//           start_time: 1681945200,
//           end_time: 1681956000,
//           type: 'TOP 9',
//           color: 'K',
//           id: 'a90292870-9282',
//           useTime: '100ms'
//         }
//       ].reverse()
//     }
//   ]
// };

const run = () => {
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement
    // mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    // theme: 'dark'
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  // cs.on('brushEnd', (event) => {
  //   const inBrushData =
  //     event?.value.inBrushData.filter(
  //       (item: any) => !!item.index_name
  //     )

  //   console.log(
  //     '触发brushEnd事件, inBrushData ->',
  //     inBrushData,
  //     event.value.inBrushData,
  //   );

  //   const brush = cs.getChart().getComponentsByKey('brush')[0];

  //   if (!inBrushData.length) {
  //     brush.clearGraphic();
  //     return;
  //   }

  //   const xRate: number[] = inBrushData.map((item) => item.x_rate!);
  //   const yRate: number[] = inBrushData.map((item) => item.y_rate!);

  //   const nextDataZoom = {
  //     xDataZoom: [
  //       Math.max(Math.min(...xRate) - 0.05, 0),
  //       Math.min(Math.max(...xRate) + 0.05, 1),
  //     ],
  //     yDataZoom: [
  //       Math.max(Math.min(...yRate) - 0.05, 0),
  //       Math.min(Math.max(...yRate) + 0.05, 1),
  //     ],
  //   };

  //   history.push(nextDataZoom)

  //   cs.updateSpec({
  //     ...spec,
  //     dataZoom: [{
  //       ...spec.dataZoom[0],
  //       start: nextDataZoom.xDataZoom[0],
  //       end: nextDataZoom.xDataZoom[1]
  //     },
  //     { ...spec.dataZoom[1],
  //       start: nextDataZoom.yDataZoom[0],
  //       end: nextDataZoom.yDataZoom[1]
  //     }]
  //   })

  // })

  const button = createButton('回退', () => {
    const nextDataZoom = history[history.length - 1];
    console.log('回退', nextDataZoom, cs);
    cs.updateSpec({
      ...spec,
      dataZoom: [
        {
          ...spec.dataZoom[0],
          start: nextDataZoom.xDataZoom[0],
          end: nextDataZoom.xDataZoom[1]
        },
        { ...spec.dataZoom[1], start: nextDataZoom.yDataZoom[0], end: nextDataZoom.yDataZoom[1] }
      ]
    });
  }) as HTMLButtonElement;

  window['vchart'] = cs;
  console.log(cs);
};
run();
