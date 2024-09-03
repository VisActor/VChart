import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  // const spec = {
  //   height: 400,
  //   type: 'bar',
  //   data: {
  //     values: [
  //       {
  //         country: 'USA',
  //         visits: 23725
  //       },
  //       {
  //         country: 'China',
  //         visits: 1882
  //       },
  //       {
  //         country: 'Japan',
  //         visits: 1809
  //       },
  //       {
  //         country: 'Germany',
  //         visits: 1322
  //       },
  //       {
  //         country: 'UK',
  //         visits: 1122
  //       },
  //       {
  //         country: 'France',
  //         visits: 1114
  //       },
  //       {
  //         country: 'India',
  //         visits: 984
  //       },
  //       {
  //         country: 'Spain',
  //         visits: 711
  //       },
  //       {
  //         country: 'Netherlands',
  //         visits: 665
  //       },
  //       {
  //         country: 'Russia',
  //         visits: 580
  //       },
  //       {
  //         country: 'South Korea',
  //         visits: 443
  //       },
  //       {
  //         country: 'Canada',
  //         visits: 441
  //       }
  //     ]
  //   },
  //   xField: 'country',
  //   yField: 'visits',
  //   axes: [
  //     {
  //       orient: 'left',
  //       breaks: [
  //         {
  //           range: [2100, 22900]
  //         },
  //         {
  //           range: [700, 900]
  //         }
  //       ],
  //       domainLine: {
  //         visible: true
  //       }

  //       // sampling: false
  //       // max: 24000
  //     }
  //   ]
  // };

  // const spec = {
  //   type: 'line',
  //   data: [
  //     {
  //       name: 'line',

  //       values: [
  //         {
  //           x: '回合1',
  //           y: 15,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合1',
  //           y: 13,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合2',
  //           y: 41,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合2',
  //           y: 10,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合3',
  //           y: 19,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合3',
  //           y: 15,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合4',
  //           y: 24,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合4',
  //           y: 38,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合5',
  //           y: 87,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合5',
  //           y: 66,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合6',
  //           y: 480,
  //           c: '绿水灵',
  //           latest: true
  //         },
  //         {
  //           x: '回合6',
  //           y: 490,
  //           c: '飘飘猪',
  //           latest: true
  //         }
  //       ]
  //     }
  //   ],

  //   axes: [
  //     {
  //       orient: 'left',
  //       domain: true,
  //       domainWidth: 1,
  //       breaks: [
  //         {
  //           visible: true,
  //           range: [100, 470]
  //         }
  //       ],
  //       zero: true,
  //       nice: true,
  //       domainLine: {
  //         visible: true
  //       }
  //     },
  //     {
  //       orient: 'bottom'
  //     }
  //   ],
  //   xField: 'x',
  //   yField: 'y',
  //   seriesField: 'c',
  //   width: 539,
  //   height: 377.8
  // };

  // const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // const dataGroup1 = [44, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 420, 240, 80];
  // const dataGroup2 = [64, 138, 164, 408, 3120, 3540, 3875, 3420, 720, 320, 160, 20];

  // const source: any = [];
  // for (let index = 0; index < monthes.length; index++) {
  //   const month = monthes[index];

  //   source.push({
  //     month,
  //     value: dataGroup1[index],
  //     type: 'Attraction 1'
  //   });

  //   source.push({
  //     month,
  //     value: dataGroup2[index],
  //     type: 'Attraction 2'
  //   });
  // }
  // const spec = {
  //   type: 'bar',
  //   height: 500,
  //   data: {
  //     values: source
  //   },
  //   xField: ['month', 'type'],
  //   yField: 'value',
  //   seriesField: 'type',
  //   axes: [
  //     {
  //       orient: 'left',
  //       breaks: [
  //         {
  //           range: [500, 3000]
  //         }
  //       ],
  //       domainLine: {
  //         visible: true
  //       }
  //       // max: 4200,
  //       // tick: {
  //       //   tickCount: 10
  //       // }
  //     }
  //   ]
  // };

  // const spec = {
  //   direction: 'vertical',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'vertical',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       totalLabel: {
  //         visible: true,
  //         position: 'top',
  //         overlap: false,
  //         clampForce: false,
  //         formatConfig: {
  //           fixed: 0,
  //           content: 'value'
  //         },
  //         style: {
  //           lineHeight: '100%',
  //           lineWidth: 1,
  //           fill: '#1F2329',
  //           stroke: '#ffffff',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: true,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: 'visits',
  //       seriesField: '_editor_type_field'
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: false,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     }
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4',
  //           pickStrokeBuffer: 2
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       breaks: [
  //         {
  //           range: [1882, 9218.762819705807]
  //         }
  //       ]
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'band',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4',
  //           pickStrokeBuffer: 2
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       trimPadding: false,
  //       paddingInner: [0.2, 0],
  //       paddingOuter: [0.2, 0]
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: 'visits',
  //       values: [
  //         {
  //           _editor_dimension_field: 'USA',
  //           _editor_value_field: 23725,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'China',
  //           _editor_value_field: 1882,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Japan',
  //           _editor_value_field: 1809,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Germany',
  //           _editor_value_field: 1322,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'UK',
  //           _editor_value_field: 1122,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'France',
  //           _editor_value_field: 1114,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'India',
  //           _editor_value_field: 984,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Spain',
  //           _editor_value_field: 711,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Netherlands',
  //           _editor_value_field: 665,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Russia',
  //           _editor_value_field: 580,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'South Korea',
  //           _editor_value_field: 443,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Canada',
  //           _editor_value_field: 441,
  //           _editor_type_field: 'visits'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   labelLayout: 'region',
  //   width: 640,
  //   height: 360,
  //   background: 'transparent'
  // };

  // const spec = {
  //   direction: 'vertical',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'vertical',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       xField: ['_editor_dimension_field', '_editor_type_field'],
  //       yField: '_editor_value_field',
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: 'a',
  //       seriesField: '_editor_type_field'
  //     },
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'vertical',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       xField: ['_editor_dimension_field', '_editor_type_field'],
  //       yField: '_editor_value_field',
  //       dataId: '1',
  //       id: 'series-1',
  //       EDITOR_SERIES_DATA_KEY: 'b',
  //       seriesField: '_editor_type_field'
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: true,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     }
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   tooltip: {
  //     visible: true,
  //     mark: {
  //       content: [{}],
  //       title: {}
  //     },
  //     dimension: {
  //       content: [{}],
  //       title: {}
  //     }
  //   },
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       breaks: [
  //         {
  //           range: [26, 4529.51091609589],
  //           gap: 5,
  //           breakSymbol: {
  //             visible: true,
  //             style: {
  //               size: 14,
  //               stroke: '#000',
  //               lineWidth: 1,
  //               pickable: false
  //             }
  //           }
  //         },
  //         {
  //           range: [20, 22.691902025911865],
  //           gap: 5,
  //           breakSymbol: {
  //             visible: true,
  //             style: {
  //               size: 14,
  //               stroke: '#000',
  //               lineWidth: 1,
  //               pickable: false
  //             }
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'band',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       trimPadding: false,
  //       paddingInner: [0.2, 0],
  //       paddingOuter: [0.2, 0]
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: 'a',
  //       values: [
  //         {
  //           _editor_dimension_field: 'x1',
  //           _editor_value_field: 20,
  //           _editor_type_field: 'a'
  //         },
  //         {
  //           _editor_dimension_field: 'x2',
  //           _editor_value_field: 23,
  //           _editor_type_field: 'a'
  //         },
  //         {
  //           _editor_dimension_field: 'x3',
  //           _editor_value_field: 26,
  //           _editor_type_field: 'a'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     },
  //     {
  //       id: '1',
  //       sourceKey: 'b',
  //       values: [
  //         {
  //           _editor_dimension_field: 'x1',
  //           _editor_value_field: 20,
  //           _editor_type_field: 'b'
  //         },
  //         {
  //           _editor_dimension_field: 'x2',
  //           _editor_value_field: 24,
  //           _editor_type_field: 'b'
  //         },
  //         {
  //           _editor_dimension_field: 'x3',
  //           _editor_value_field: 5000,
  //           _editor_type_field: 'b'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   markLine: [],
  //   markArea: [],
  //   labelLayout: 'region',
  //   width: 640,
  //   height: 360,
  //   background: 'transparent'
  // };

  // const spec = {
  //   direction: 'vertical',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'vertical',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       totalLabel: {
  //         visible: true,
  //         position: 'top',
  //         overlap: false,
  //         clampForce: false,
  //         formatConfig: {
  //           fixed: 0,
  //           content: 'value'
  //         },
  //         style: {
  //           lineHeight: '100%',
  //           lineWidth: 1,
  //           fill: '#1F2329',
  //           stroke: '#ffffff',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: true,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: 'visits',
  //       seriesField: '_editor_type_field'
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: false,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     }
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   tooltip: {
  //     visible: true,
  //     mark: {
  //       content: [{}],
  //       title: {}
  //     },
  //     dimension: {
  //       content: [{}],
  //       title: {}
  //     }
  //   },
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {},
  //         autoHide: true
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       breaks: [
  //         {
  //           range: [1882, 2688.5568279109593],
  //           gap: 5,
  //           breakSymbol: {
  //             visible: true,
  //             style: {
  //               size: 14,
  //               stroke: '#000',
  //               lineWidth: 1,
  //               pickable: false
  //             }
  //           }
  //         }
  //       ],
  //       sampling: true
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'band',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       trimPadding: false,
  //       paddingInner: [0.2, 0],
  //       paddingOuter: [0.2, 0]
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: 'visits',
  //       values: [
  //         {
  //           _editor_dimension_field: 'USA',
  //           _editor_value_field: 23725,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'China',
  //           _editor_value_field: 1882,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Japan',
  //           _editor_value_field: 1809,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Germany',
  //           _editor_value_field: 1322,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'UK',
  //           _editor_value_field: 1122,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'France',
  //           _editor_value_field: 1114,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'India',
  //           _editor_value_field: 984,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Spain',
  //           _editor_value_field: 711,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Netherlands',
  //           _editor_value_field: 665,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Russia',
  //           _editor_value_field: 580,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'South Korea',
  //           _editor_value_field: 443,
  //           _editor_type_field: 'visits'
  //         },
  //         {
  //           _editor_dimension_field: 'Canada',
  //           _editor_value_field: 441,
  //           _editor_type_field: 'visits'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   labelLayout: 'region',
  //   customMark: [
  //     {
  //       type: 'component',
  //       componentType: 'seriesLabel',
  //       interactive: false,
  //       style: {
  //         id: '65b2164f-86ec-40ab-9539-0c19c4f4d9b9',
  //         position: 'end',
  //         label: {
  //           space: 10,
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           }
  //         }
  //       }
  //     }
  //   ],
  //   width: 640,
  //   height: 360,
  //   background: 'transparent'
  // };

  // const spec = {
  //   direction: 'horizontal',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'horizontal',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       xField: '_editor_value_field',
  //       yField: ['_editor_dimension_field', '_editor_type_field'],
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: 'a',
  //       seriesField: '_editor_type_field'
  //     },
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'horizontal',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       xField: '_editor_value_field',
  //       yField: ['_editor_dimension_field', '_editor_type_field'],
  //       dataId: '1',
  //       id: 'series-1',
  //       EDITOR_SERIES_DATA_KEY: 'b',
  //       seriesField: '_editor_type_field'
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: true,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     }
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   tooltip: {
  //     visible: true,
  //     mark: {
  //       content: [{}],
  //       title: {}
  //     },
  //     dimension: {
  //       content: [{}],
  //       title: {}
  //     }
  //   },
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'band',
  //       trimPadding: false,
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       zIndex: 550
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       breaks: [
  //         {
  //           range: [7.7241309503590845, 13.724130950359084],
  //           gap: 5,
  //           breakSymbol: {
  //             visible: true,
  //             style: {
  //               size: 8,
  //               stroke: '#000',
  //               lineWidth: 1,
  //               pickable: false
  //             }
  //           }
  //         }
  //       ],
  //       zIndex: 550
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: 'a',
  //       values: [
  //         {
  //           _editor_dimension_field: 'x1',
  //           _editor_value_field: 20,
  //           _editor_type_field: 'a'
  //         },
  //         {
  //           _editor_dimension_field: 'x2',
  //           _editor_value_field: 23,
  //           _editor_type_field: 'a'
  //         },
  //         {
  //           _editor_dimension_field: 'x3',
  //           _editor_value_field: 26,
  //           _editor_type_field: 'a'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     },
  //     {
  //       id: '1',
  //       sourceKey: 'b',
  //       values: [
  //         {
  //           _editor_dimension_field: 'x1',
  //           _editor_value_field: 20,
  //           _editor_type_field: 'b'
  //         },
  //         {
  //           _editor_dimension_field: 'x2',
  //           _editor_value_field: 24,
  //           _editor_type_field: 'b'
  //         },
  //         {
  //           _editor_dimension_field: 'x3',
  //           _editor_value_field: 29,
  //           _editor_type_field: 'b'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   markArea: [],
  //   markLine: [],
  //   labelLayout: 'region',
  //   customMark: [
  //     {
  //       type: 'component',
  //       componentType: 'seriesBreak',
  //       interactive: true,
  //       zIndex: 500,
  //       style: {}
  //     }
  //   ],
  //   width: 640,
  //   height: 360,
  //   background: 'transparent'
  // };

  // const spec = {
  //   direction: 'vertical',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       direction: 'vertical',
  //       type: 'line',
  //       stack: false,
  //       line: {
  //         style: {
  //           lineCap: 'butt',
  //           curveType: 'linear'
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'top',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'normal',
  //           background: null,
  //           fill: '#1F2329',
  //           fontStyle: '',
  //           lineWidth: 1,
  //           stroke: '#ffffff',
  //           underline: 0
  //         },
  //         overlap: false,
  //         smartInvert: true,
  //         formatConfig: {
  //           content: 'value',
  //           fixed: 1,
  //           postfix: ['k'],
  //           prefix: ['$']
  //         },
  //         styleMap: {
  //           '0-0': {
  //             visible: false
  //           },
  //           '0-1': {
  //             visible: false
  //           },
  //           '0-2': {
  //             visible: false
  //           },
  //           '0-3': {
  //             visible: false
  //           },
  //           '1-10': {
  //             visible: false
  //           },
  //           '1-3': {
  //             visible: false
  //           },
  //           '1-4': {
  //             visible: false
  //           },
  //           '1-6': {
  //             visible: false
  //           },
  //           '1-8': {
  //             visible: false
  //           },
  //           '2-10': {
  //             style: {
  //               dx: 4,
  //               dy: 31
  //             },
  //             visible: false
  //           },
  //           '2-11': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           },
  //           '2-3': {
  //             visible: false
  //           },
  //           '2-4': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             },
  //             visible: false
  //           },
  //           '2-5': {
  //             style: {
  //               dx: 2,
  //               dy: 30
  //             }
  //           },
  //           '2-6': {
  //             style: {
  //               dx: 1,
  //               dy: 32
  //             },
  //             visible: false
  //           },
  //           '2-7': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             }
  //           },
  //           '2-8': {
  //             style: {
  //               dx: 1,
  //               dy: 33
  //             },
  //             visible: false
  //           },
  //           '2-9': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           }
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: false,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       invalidType: 'break',
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: 'Actuals',
  //       seriesField: '_editor_type_field',
  //       point: {
  //         style: {
  //           visible: false
  //         }
  //       }
  //     },
  //     {
  //       direction: 'vertical',
  //       type: 'line',
  //       stack: false,
  //       line: {
  //         style: {
  //           lineCap: 'butt',
  //           curveType: 'linear',
  //           lineDash: [12, 6],
  //           stroke: '#32a645'
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'top',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'normal',
  //           background: null,
  //           fill: '#1F2329',
  //           fontStyle: '',
  //           lineWidth: 1,
  //           stroke: '#ffffff',
  //           underline: 0
  //         },
  //         overlap: false,
  //         smartInvert: true,
  //         formatConfig: {
  //           content: 'value',
  //           fixed: 1,
  //           postfix: ['k'],
  //           prefix: ['$']
  //         },
  //         styleMap: {
  //           '0-0': {
  //             visible: false
  //           },
  //           '0-1': {
  //             visible: false
  //           },
  //           '0-2': {
  //             visible: false
  //           },
  //           '0-3': {
  //             visible: false
  //           },
  //           '1-10': {
  //             visible: false
  //           },
  //           '1-3': {
  //             visible: false
  //           },
  //           '1-4': {
  //             visible: false
  //           },
  //           '1-6': {
  //             visible: false
  //           },
  //           '1-8': {
  //             visible: false
  //           },
  //           '2-10': {
  //             style: {
  //               dx: 4,
  //               dy: 31
  //             },
  //             visible: false
  //           },
  //           '2-11': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           },
  //           '2-3': {
  //             visible: false
  //           },
  //           '2-4': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             },
  //             visible: false
  //           },
  //           '2-5': {
  //             style: {
  //               dx: 2,
  //               dy: 30
  //             }
  //           },
  //           '2-6': {
  //             style: {
  //               dx: 1,
  //               dy: 32
  //             },
  //             visible: false
  //           },
  //           '2-7': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             }
  //           },
  //           '2-8': {
  //             style: {
  //               dx: 1,
  //               dy: 33
  //             },
  //             visible: false
  //           },
  //           '2-9': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           }
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: false,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       invalidType: 'break',
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '1',
  //       id: 'series-1',
  //       EDITOR_SERIES_DATA_KEY: 'Target',
  //       seriesField: '_editor_type_field',
  //       point: {
  //         style: {
  //           visible: false
  //         }
  //       }
  //     },
  //     {
  //       direction: 'vertical',
  //       type: 'line',
  //       stack: false,
  //       line: {
  //         style: {
  //           lineCap: 'butt',
  //           curveType: 'linear',
  //           lineDash: [12, 6],
  //           stroke: '#f54a45'
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'top',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'normal',
  //           background: null,
  //           fill: '#1F2329',
  //           fontStyle: '',
  //           lineWidth: 1,
  //           stroke: '#ffffff',
  //           underline: 0
  //         },
  //         overlap: false,
  //         smartInvert: true,
  //         formatConfig: {
  //           content: 'value',
  //           fixed: 1,
  //           postfix: ['k'],
  //           prefix: ['$']
  //         },
  //         styleMap: {
  //           '0-0': {
  //             visible: false
  //           },
  //           '0-1': {
  //             visible: false
  //           },
  //           '0-2': {
  //             visible: false
  //           },
  //           '0-3': {
  //             visible: false
  //           },
  //           '1-10': {
  //             visible: false
  //           },
  //           '1-3': {
  //             visible: false
  //           },
  //           '1-4': {
  //             visible: false
  //           },
  //           '1-6': {
  //             visible: false
  //           },
  //           '1-8': {
  //             visible: false
  //           },
  //           '2-10': {
  //             style: {
  //               dx: 4,
  //               dy: 31
  //             },
  //             visible: false
  //           },
  //           '2-11': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           },
  //           '2-3': {
  //             visible: false
  //           },
  //           '2-4': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             },
  //             visible: false
  //           },
  //           '2-5': {
  //             style: {
  //               dx: 2,
  //               dy: 30
  //             }
  //           },
  //           '2-6': {
  //             style: {
  //               dx: 1,
  //               dy: 32
  //             },
  //             visible: false
  //           },
  //           '2-7': {
  //             style: {
  //               dx: 2,
  //               dy: 34
  //             }
  //           },
  //           '2-8': {
  //             style: {
  //               dx: 1,
  //               dy: 33
  //             },
  //             visible: false
  //           },
  //           '2-9': {
  //             style: {
  //               dx: 3,
  //               dy: 34
  //             }
  //           }
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: false,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       invalidType: 'break',
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '2',
  //       id: 'series-2',
  //       EDITOR_SERIES_DATA_KEY: 'Forecast',
  //       seriesField: '_editor_type_field',
  //       point: {
  //         style: {
  //           visible: false
  //         }
  //       }
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: true,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     }
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   tooltip: {
  //     visible: true,
  //     mark: {
  //       content: [{}],
  //       title: {}
  //     },
  //     dimension: {
  //       content: [{}],
  //       title: {}
  //     }
  //   },
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {
  //           postfix: ['k'],
  //           prefix: ['$']
  //         }
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       breaks: [
  //         {
  //           breakSymbol: {
  //             style: {
  //               lineWidth: 1,
  //               pickable: false,
  //               size: 8,
  //               stroke: '#000'
  //             },
  //             visible: true
  //           },
  //           gap: 5,
  //           range: [0, 100]
  //         }
  //       ],
  //       visible: true,
  //       zIndex: 550
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'band',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       trimPadding: true,
  //       paddingInner: [0.2, 0],
  //       paddingOuter: [0.2, 0],
  //       visible: true
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: 'Actuals',
  //       values: [
  //         {
  //           _editor_dimension_field: '2022/1/1',
  //           _editor_value_field: 98.4774862,
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/2/1',
  //           _editor_value_field: 103.401361,
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/3/1',
  //           _editor_value_field: 108.571429,
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/4/1',
  //           _editor_value_field: 114,
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/5/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/6/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/7/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/8/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/9/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/10/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/11/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         },
  //         {
  //           _editor_dimension_field: '2022/12/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Actuals'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     },
  //     {
  //       id: '1',
  //       sourceKey: 'Target',
  //       values: [
  //         {
  //           _editor_dimension_field: '2022/1/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/2/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/3/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/4/1',
  //           _editor_value_field: 114,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/5/1',
  //           _editor_value_field: 124.26,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/6/1',
  //           _editor_value_field: 135.4434,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/7/1',
  //           _editor_value_field: 147.633306,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/8/1',
  //           _editor_value_field: 160.920304,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/9/1',
  //           _editor_value_field: 175.403131,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/10/1',
  //           _editor_value_field: 191.189413,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/11/1',
  //           _editor_value_field: 208.39646,
  //           _editor_type_field: 'Target'
  //         },
  //         {
  //           _editor_dimension_field: '2022/12/1',
  //           _editor_value_field: 227.152141,
  //           _editor_type_field: 'Target'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     },
  //     {
  //       id: '2',
  //       sourceKey: 'Forecast',
  //       values: [
  //         {
  //           _editor_dimension_field: '2022/1/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/2/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/3/1',
  //           _editor_value_field: '',
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/4/1',
  //           _editor_value_field: 114,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/5/1',
  //           _editor_value_field: 119.7,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/6/1',
  //           _editor_value_field: 125.685,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/7/1',
  //           _editor_value_field: 131.96925,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/8/1',
  //           _editor_value_field: 138.567713,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/9/1',
  //           _editor_value_field: 145.496098,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/10/1',
  //           _editor_value_field: 152.770903,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/11/1',
  //           _editor_value_field: 160.409448,
  //           _editor_type_field: 'Forecast'
  //         },
  //         {
  //           _editor_dimension_field: '2022/12/1',
  //           _editor_value_field: 168.429921,
  //           _editor_type_field: 'Forecast'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   markArea: [],
  //   markLine: [
  //     {
  //       _originValue_: [227.152141, 168.429921],
  //       connectDirection: 'right',
  //       coordinates: [
  //         {
  //           VGRAMMAR_DATA_ID_KEY_1259: 11,
  //           __VCHART_DEFAULT_DATA_INDEX: 11,
  //           __VCHART_DEFAULT_DATA_KEY: 11,
  //           _editor_dimension_field: '2022/12/1',
  //           _editor_type_field: 'Target',
  //           _editor_value_field: 227.152141,
  //           refRelativeSeriesId: 'series-1'
  //         },
  //         {
  //           VGRAMMAR_DATA_ID_KEY_1266: 11,
  //           __VCHART_DEFAULT_DATA_INDEX: 11,
  //           __VCHART_DEFAULT_DATA_KEY: 11,
  //           _editor_dimension_field: '2022/12/1',
  //           _editor_type_field: 'Forecast',
  //           _editor_value_field: 168.429921,
  //           refRelativeSeriesId: 'series-2'
  //         }
  //       ],
  //       endSymbol: {
  //         refX: -4,
  //         size: 8,
  //         style: {
  //           fill: '#000',
  //           lineWidth: 0,
  //           stroke: null
  //         },
  //         symbolType: 'triangleUp',
  //         visible: true
  //       },
  //       expandDistance: '0%',
  //       expression: null,
  //       id: '54f09606-73e4-48b5-8571-94d9ed6e2119',
  //       interactive: true,
  //       label: {
  //         childrenPickable: false,
  //         labelBackground: {
  //           padding: {
  //             bottom: 2,
  //             left: 4,
  //             right: 4,
  //             top: 2
  //           },
  //           style: {
  //             cornerRadius: 4,
  //             fill: '#fff',
  //             fillOpacity: 1,
  //             lineWidth: 1,
  //             stroke: '#000'
  //           }
  //         },
  //         pickable: true,
  //         position: 'middle',
  //         refX: 0,
  //         refY: 0,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16,
  //           fontStyle: 'normal',
  //           fontWeight: 'bold'
  //         },
  //         text: '-26%'
  //       },
  //       line: {
  //         mainSegmentIndex: 1,
  //         multiSegment: true,
  //         style: [
  //           {
  //             lineDash: [3, 3],
  //             lineWidth: 1,
  //             pickStrokeBuffer: 10,
  //             stroke: '#000'
  //           },
  //           {
  //             lineWidth: 1,
  //             pickStrokeBuffer: 10,
  //             stroke: '#000'
  //           },
  //           {
  //             lineDash: [3, 3],
  //             lineWidth: 1,
  //             pickStrokeBuffer: 10,
  //             stroke: '#000'
  //           }
  //         ]
  //       },
  //       name: 'hierarchy-diff-line',
  //       startSymbol: {
  //         refX: -4,
  //         size: 12,
  //         style: {
  //           fill: '#000',
  //           lineWidth: 0,
  //           stroke: null
  //         },
  //         symbolType:
  //           'M -0.0625 -0.3167 C -0.0625 -0.2821 -0.0346 -0.2542 0 -0.2542 C 0.0346 -0.2542 0.0625 -0.2821 0.0625 -0.3167 C 0.0625 -0.3167 -0.0625 -0.3167 -0.0625 -0.3167 Z M 0.0442 -0.4025 C 0.0196 -0.4271 -0.0196 -0.4271 -0.0442 -0.4025 C -0.0442 -0.4025 -0.4421 -0.0046 -0.4421 -0.0046 C -0.4662 0.0196 -0.4662 0.0592 -0.4421 0.0838 C -0.4175 0.1079 -0.3779 0.1079 -0.3538 0.0838 C -0.3538 0.0838 0 -0.27 0 -0.27 C 0 -0.27 0.3538 0.0838 0.3538 0.0838 C 0.3779 0.1079 0.4175 0.1079 0.4421 0.0838 C 0.4662 0.0592 0.4662 0.0196 0.4421 -0.0046 C 0.4421 -0.0046 0.0442 -0.4025 0.0442 -0.4025 Z M 0.0625 -0.3167 C 0.0625 -0.3167 0.0625 -0.3583 0.0625 -0.3583 C 0.0625 -0.3583 -0.0625 -0.3583 -0.0625 -0.3583 C -0.0625 -0.3583 -0.0625 -0.3167 -0.0625 -0.3167 C -0.0625 -0.3167 0.0625 -0.3167 0.0625 -0.3167 Z',
  //         visible: false
  //       },
  //       type: 'type-step',
  //       zIndex: 510
  //     }
  //   ],
  //   markPoint: [],
  //   labelLayout: 'region',

  //   width: 640,
  //   height: 360,
  //   background: 'transparent'
  // };

  const spec = {
    direction: 'vertical',
    type: 'common',
    color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
    series: [
      {
        type: 'waterfall',
        stack: true,
        bar: {
          state: {
            hover: {
              stroke: '#000',
              lineWidth: 1
            }
          }
        },
        label: {
          visible: true,
          position: 'inside',
          style: {
            lineHeight: '100%',
            lineWidth: 1,
            fontSize: 16,
            fontWeight: 'bold'
          },
          overlap: {
            strategy: []
          },
          smartInvert: true,
          formatConfig: {},
          interactive: true
        },
        totalLabel: {
          visible: true,
          position: 'withChange',
          overlap: false,
          clampForce: false,
          formatConfig: {
            fixed: 0,
            content: 'value'
          },
          style: {
            lineHeight: '100%',
            lineWidth: 1,
            fill: '#1F2329',
            stroke: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold'
          },
          interactive: true
        },
        stackLabel: {
          visible: false
        },
        direction: 'vertical',
        xField: '_editor_dimension_field',
        yField: '_editor_value_field',
        dataId: 'waterfall',
        id: 'series-waterfall',
        seriesField: '_editor_type_field',
        total: {
          type: 'field',
          tagField: '_editor_waterfall_total',
          valueField: '_editor_waterfall_total_value'
        },
        addLastTotal: false,
        stackType: 'stack'
      }
    ],
    legends: {
      id: 'legend-discrete',
      visible: false,
      autoPage: false,
      position: 'start',
      interactive: false,
      item: {
        label: {
          style: {
            fill: '#1F2329',
            fontSize: 16
          }
        }
      }
    },
    region: [
      {
        id: 'region-0'
      }
    ],
    tooltip: {
      visible: true,
      mark: {
        content: [{}],
        title: {}
      },
      dimension: {
        content: [{}],
        title: {}
      }
    },
    axes: [
      {
        orient: 'left',
        id: 'axis-left',
        type: 'linear',
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16
          },
          formatConfig: {}
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#000000'
          }
        },
        tick: {
          visible: true,
          style: {
            stroke: '#000000'
          },
          tickCount: 10
        },
        grid: {
          visible: false,
          style: {
            stroke: '#bbbfc4',
            pickStrokeBuffer: 2
          }
        },
        autoIndent: false,
        maxWidth: null,
        maxHeight: null,
        breaks: [
          {
            breakSymbol: {
              style: {
                lineWidth: 1,
                pickable: false,
                size: 8,
                stroke: '#000'
              },
              visible: true
            },
            gap: 5,
            range: [5.07, 35.07]
          }
        ],
        visible: true,
        zIndex: 550
      },
      {
        orient: 'bottom',
        id: 'axis-bottom',
        type: 'band',
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16
          },
          formatConfig: {}
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#000000'
          },
          onZero: true
        },
        tick: {
          visible: true,
          style: {
            stroke: '#000000'
          }
        },
        grid: {
          visible: false,
          style: {
            stroke: '#bbbfc4',
            pickStrokeBuffer: 2
          }
        },
        autoIndent: false,
        maxWidth: null,
        maxHeight: null,
        trimPadding: false,
        paddingInner: [0.2, 0],
        paddingOuter: [0.2, 0],
        visible: true
      }
    ],
    data: [
      {
        id: 'waterfall',
        sourceKey: 'total',
        values: [
          {
            _editor_dimension_field: 'Hospitals',
            _editor_value_field: 57,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 57,
            _editor_dimension_field_waterfall_raw: 'Hospitals'
          },
          {
            _editor_dimension_field: 'Aged Care',
            _editor_value_field: 17,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 17,
            _editor_dimension_field_waterfall_raw: 'Aged Care'
          },
          {
            _editor_dimension_field: 'GPs',
            _editor_value_field: 14,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 14,
            _editor_dimension_field_waterfall_raw: 'GPs'
          },
          {
            _editor_dimension_field: 'Dental',
            _editor_value_field: 9,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 9,
            _editor_dimension_field_waterfall_raw: 'Dental'
          },
          {
            _editor_dimension_field: 'Path. & Diagnostic',
            _editor_value_field: 6.1,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 6.1,
            _editor_dimension_field_waterfall_raw: 'Path. & Diagnostic'
          },
          {
            _editor_dimension_field: 'Path. & Diagnostic (1)',
            _editor_value_field: 6.1,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 6.1,
            _editor_dimension_field_waterfall_raw: 'Path. & Diagnostic (1)'
          },
          {
            _editor_dimension_field: 'Optometry',
            _editor_value_field: 3,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 3,
            _editor_dimension_field_waterfall_raw: 'Optometry'
          },
          {
            _editor_dimension_field: 'Physio',
            _editor_value_field: 2,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 2,
            _editor_dimension_field_waterfall_raw: 'Physio'
          },
          {
            _editor_dimension_field: 'Chiros & Osteos',
            _editor_value_field: 1,
            _editor_type_field: 'Industry turnover ($b)_fieldLink_正值',
            _editor_type_field_waterfall_raw: 1,
            _editor_dimension_field_waterfall_raw: 'Chiros & Osteos'
          },
          {
            _editor_dimension_field: 'Total providers',
            _editor_value_field: 'e',
            _editor_type_field: '_editor_waterfall_total',
            _editor_waterfall_total: true
          }
        ],
        fields: {
          _editor_dimension_field: {
            domain: [
              '类别',
              'Hospitals',
              'Aged Care',
              'GPs',
              'Dental',
              'Path. & Diagnostic',
              'Path. & Diagnostic (1)',
              'Optometry',
              'Physio',
              'Chiros & Osteos',
              'Total providers',
              '_editor_waterfall_total'
            ],
            sortIndex: 0
          }
        }
      }
    ],
    labelLayout: 'region',
    customMark: [
      {
        type: 'component',
        componentType: 'seriesBreak',
        interactive: true,
        zIndex: 500,
        style: {}
      }
    ],
    width: 640,
    height: 360,
    background: 'transparent'
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
  window['vchart'] = vchart;
};
run();
