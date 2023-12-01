import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  // const spec = {
  //   type: 'scatter',
  //   padding: [12, 20, 12, 12],
  //   xField: 'x',
  //   yField: 'y',
  //   sizeField: 'z',
  //   size: {
  //     type: 'linear',
  //     range: [20, 80]
  //   },
  //   axes: [
  //     { orient: 'bottom', type: 'linear', min: 60, max: 95 },
  //     { orient: 'left', type: 'linear', min: 0, max: 200 }
  //   ],
  //   point: {
  //     style: {
  //       fillOpacity: 0.25,
  //       lineWidth: 1,
  //       stroke: '#6690F2',
  //       fill: '#6690F2'
  //     }
  //   },
  //   label: {
  //     visible: true,
  //     position: 'center',
  //     overlap: {
  //       avoidBaseMark: false
  //     },
  //     style: {
  //       stroke: '#fff',
  //       lineWidth: 1
  //     }
  //   },
  //   markLine: [
  //     {
  //       x: 65,
  //       // y: 50,
  //       // y1: 150,
  //       label: {
  //         visible: true,
  //         position: 'end',
  //         text: 'Safe fat intake 65g/day',
  //         style: {
  //           textAlign: 'left',
  //           textBaseline: 'top',
  //           fill: '#000',
  //           dx: 10
  //         },
  //         labelBackground: {
  //           visible: false
  //         }
  //       },
  //       line: {
  //         style: {
  //           stroke: '#000',
  //           lineDash: [0]
  //         }
  //       }
  //     },
  //     {
  //       y: 50,
  //       x: 70,
  //       x1: 85,
  //       label: {
  //         visible: true,
  //         position: 'end',
  //         text: 'Safe sugar intake 50g/day',
  //         style: {
  //           textAlign: 'right',
  //           textBaseline: 'bottom',
  //           fill: '#000'
  //         },
  //         labelBackground: {
  //           visible: false
  //         }
  //       },
  //       line: {
  //         style: {
  //           stroke: '#000',
  //           lineDash: [0]
  //         }
  //       }
  //     },
  //     {
  //       x: '0%',
  //       x1: '100%',
  //       y: '100%',
  //       y1: '0%',
  //       label: {
  //         visible: true,
  //         autoRotate: true,
  //         // position: 'end',
  //         text: 'Safe sugar intake 50g/day',
  //         style: {
  //           textAlign: 'right',
  //           textBaseline: 'bottom',
  //           fill: '#000'
  //         },
  //         labelBackground: {
  //           visible: false
  //         }
  //       },
  //       line: {
  //         style: {
  //           stroke: '#000',
  //           lineDash: [0]
  //         }
  //       }
  //     }
  //   ],
  //   tooltip: {
  //     mark: {
  //       title: {
  //         value: datum => datum.country
  //       }
  //     }
  //   },
  //   data: {
  //     id: 'data',
  //     values: [
  //       { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
  //       { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
  //       { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
  //       { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
  //       { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
  //       { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
  //       { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
  //       { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
  //       { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
  //       { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
  //       { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
  //       { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
  //       { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
  //       { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
  //       { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
  //     ]
  //   }
  // };

  // const spec = {
  //   type: 'line',
  //   data: {
  //     id: 'data2',
  //     values: [
  //       { x: 1, y: 80 },
  //       { x: 2, y: 40 },
  //       { x: 3, y: 10 },
  //       { x: 4, y: 20 }
  //     ]
  //   },
  //   xField: 'x',
  //   yField: 'y',
  //   markLine: [
  //     {
  //       positions: [
  //         {
  //           x: '0%',
  //           y: '50%'
  //         },
  //         {
  //           x: '100%',
  //           y: '50%'
  //         }
  //       ],
  //       regionRelative: true
  //     }
  //     // {
  //     //   coordinates: [
  //     //     {
  //     //       x: '1',
  //     //       y: 50
  //     //     },
  //     //     {
  //     //       x: '3',
  //     //       y: 120
  //     //     }
  //     //   ],
  //     //   autoRange: true
  //     // },
  //     // {
  //     //   coordinates: [
  //     //     {
  //     //       x: '1',
  //     //       y: 50
  //     //     },
  //     //     {
  //     //       x: '6',
  //     //       y: 100
  //     //     }
  //     //   ],
  //     //   autoRange: true
  //     // }
  //   ]
  // };

  // const spec = {
  //   type: 'pie',
  //   data: [
  //     {
  //       id: 'id0',
  //       values: [
  //         { type: 'China (regional and medium)', value: '13.1' },
  //         { type: 'China (long haul)', value: '3.9' },
  //         { type: 'Rest of Asia', value: '55' },
  //         { type: 'Rest of the world', value: '60' }
  //       ]
  //     }
  //   ],
  //   outerRadius: 0.65,
  //   valueField: 'value',
  //   categoryField: 'type',
  //   color: ['rgb(233,178,200)', 'rgb(248,218,226)', 'rgb(163,219,218)', 'rgb(210,210,210)'],
  //   title: {
  //     visible: true,
  //     text: 'Plane deliveries to China by region and type (2016–2035, % forecast)',
  //     subtext:
  //       'source: https://multimedia.scmp.com/news/china/article/2170344/china-2025-aviation/index.html?src=follow-chapter'
  //   },
  //   legends: {
  //     visible: true,
  //     orient: 'top'
  //   },
  //   label: {
  //     visible: true
  //   },
  //   markPoint: [
  //     {
  //       position: {
  //         x: '50%',
  //         y: '50%'
  //       },
  //       regionRelative: true,
  //       itemLine: {
  //         visible: false
  //       },
  //       itemContent: {
  //         type: 'image',
  //         imageStyle: {
  //           dx: -50,
  //           dy: 40,
  //           image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/airplane.png'
  //         }
  //       }
  //     }
  //   ]
  // };

  // const spec = {
  //   type: 'line',
  //   data: {
  //     id: 'data2',
  //     values: [
  //       { x: 1, y: 80 },
  //       { x: 2, y: 40 },
  //       { x: 3, y: 10 },
  //       { x: 4, y: 20 }
  //     ]
  //   },
  //   xField: 'x',
  //   yField: 'y',
  //   markLine: [
  //     {
  //       coordinates: [
  //         {
  //           x: (data, series) => {
  //             const scale = series.getXAxisHelper().getScale(0);
  //             console.log(scale.domain());

  //             return scale.domain()[1];
  //           },
  //           y: (data, series) => {
  //             const scale = series.getYAxisHelper().getScale();
  //             console.log(scale.domain());

  //             return scale.domain()[1];
  //           }
  //         },
  //         {
  //           x: '4',
  //           y: 10
  //         }
  //       ]
  //     }
  //   ],
  //   markArea: [
  //     {
  //       coordinates: [
  //         {
  //           x: data => data[0].x,
  //           y: data => data[0].y
  //         },
  //         {
  //           x: data => data[1].x,
  //           y: data => data[1].y
  //         },
  //         {
  //           x: data => data[2].x,
  //           y: data => data[2].y
  //         },
  //         {
  //           x: data => data[3].x,
  //           y: data => data[3].y
  //         }
  //       ]
  //     }
  //   ],
  //   markPoint: {
  //     coordinate: {
  //       x: data => data[1].x,
  //       y: data => {
  //         let a = 0;
  //         data.forEach(datum => (a += datum.y));

  //         return a / data.length;
  //       }
  //     }
  //   }
  // };

  const spec = {
    type: 'common',
    layout: {
      type: 'grid',
      col: 2,
      row: 4,
      elements: [
        {
          modelId: 'DAU rate',
          col: 1,
          row: 0
        },
        {
          modelId: 'Active time',
          col: 1,
          row: 1
        },
        {
          modelId: 'Total number of active users',
          col: 1,
          row: 2
        },
        {
          modelId: 'DAU rateleft',
          col: 0,
          row: 0
        },
        {
          modelId: 'Active timeleft',
          col: 0,
          row: 1
        },
        {
          modelId: 'Total number of active usersleft',
          col: 0,
          row: 2
        },
        {
          modelId: 'Total number of active usersbottom',
          col: 1,
          row: 3
        }
      ]
    },
    region: [
      {
        id: 'DAU rate'
      },
      {
        id: 'Active time'
      },

      {
        id: 'Total number of active users'
      }
    ],
    series: [
      {
        id: 'DAU rateseries0',
        regionId: 'DAU rate',
        dataId: 'Deep use of user DAU rate',
        type: 'line',
        xField: ['x'],
        yField: 'y',
        seriesField: 'type'
      },
      {
        id: 'Active timeseries0',
        regionId: 'Active time',
        dataId: 'Active time per user in deep use',
        type: 'bar',
        xField: ['x', 'type'],
        yField: 'y',
        seriesField: 'type'
      },
      {
        id: 'Total number of active usersseries0',
        regionId: 'Total number of active users',
        dataId: 'Total number of active users',
        type: 'line',
        xField: ['x'],
        yField: 'y',
        seriesField: 'type'
      }
    ],
    axes: [
      {
        grid: {
          visible: true,
          style: {
            lineDash: [2, 2]
          }
        },
        id: 'DAU rateleft',
        regionId: 'DAU rate',
        seriesId: ['DAU rateseries0'],
        orient: 'left',
        range: {
          min: 0,
          max: 34.5055333688
        },
        tick: {
          visible: false
        },
        forceTickCount: 3
      },
      {
        grid: {
          visible: true,
          style: {
            lineDash: [2, 2]
          }
        },
        id: 'Active timeleft',
        regionId: ['Active time'],
        seriesId: ['Active timeseries0'],
        orient: 'left',
        range: {
          min: 0,
          max: 32.4656226827
        },
        tick: {
          visible: false
        },
        forceTickCount: 3
      },
      {
        grid: {
          visible: true,
          style: {
            lineDash: [2, 2]
          }
        },
        id: 'Total number of active usersleft',
        regionId: 'Total number of active users',
        seriesId: ['Total number of active usersseries0'],
        orient: 'left',
        range: {
          min: 0,
          max: 4053
        },
        tick: {
          visible: false
        },
        forceTickCount: 3
      },
      {
        id: 'Total number of active usersbottom',
        regionId: ['DAU rate', 'Active time', 'Active time1', 'Total number of active users'],
        orient: 'bottom',
        label: {
          firstVisible: true,
          lastVisible: true,
          visible: true
        },
        tick: {
          visible: false
        }
      }
    ],
    markLine: [
      {
        coordinates: [
          { x: 2, y: 15, refRelativeSeriesId: 'DAU rateseries0' },
          { x: 8, y: 10, refRelativeSeriesId: 'Total number of active usersseries0' }
        ]
      },
      {
        x: data => data[Math.ceil(data.length / 2)].x,
        startRelativeSeriesIndex: 0,
        endRelativeSeriesIndex: 2
      }
    ],
    markArea: {
      x: 10,
      x1: 20,
      startRelativeSeriesIndex: 0,
      endRelativeSeriesIndex: 2
    },
    data: [
      {
        id: 'Deep use of user DAU rate',
        values: [
          {
            x: 0,
            y: 0.4384762505,
            originXData: '2022-08-01',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 1,
            y: 34.5055333688,
            originXData: '2022-08-02',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 2,
            y: 16.5189204722,
            originXData: '2022-08-03',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 3,
            y: 7.2681771912,
            originXData: '2022-08-04',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 4,
            y: 20.075672734,
            originXData: '2022-08-05',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 5,
            y: 20.075672734,
            originXData: '2022-08-06',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 6,
            y: 7.2681771912,
            originXData: '2022-08-07',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 7,
            y: 16.1287204022,
            originXData: '2022-08-08',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 8,
            y: 9.3422975894,
            originXData: '2022-08-09',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 9,
            y: 1.8136225235,
            originXData: '2022-08-10',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 10,
            y: 14.5715901472,
            originXData: '2022-08-11',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 11,
            y: 6.8325998786,
            originXData: '2022-08-12',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 12,
            y: 23.5616379458,
            originXData: '2022-08-13',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 13,
            y: 1.0948417472,
            originXData: '2022-08-14',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 14,
            y: 22.1355598163,
            originXData: '2022-08-15',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 15,
            y: 15.2996959776,
            originXData: '2022-08-16',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 16,
            y: 2.4856271694,
            originXData: '2022-08-17',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 17,
            y: 22.1355598163,
            originXData: '2022-08-18',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 18,
            y: 33.9041478366,
            originXData: '2022-08-19',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 19,
            y: 10.0719470274,
            originXData: '2022-08-20',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 20,
            y: 32.9413035888,
            originXData: '2022-08-21',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 21,
            y: 29.942335273,
            originXData: '2022-08-22',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 22,
            y: 17.4256097561,
            originXData: '2022-08-23',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 23,
            y: 1.7212070789,
            originXData: '2022-08-24',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 24,
            y: 21.5984819213,
            originXData: '2022-08-25',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 25,
            y: 15.4113885394,
            originXData: '2022-08-26',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 26,
            y: 15.4113885394,
            originXData: '2022-08-27',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 27,
            y: 18.3841937372,
            originXData: '2022-08-28',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 28,
            y: 18.3841937372,
            originXData: '2022-08-29',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 29,
            y: 18.3841937372,
            originXData: '2022-08-30',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 30,
            y: 22.4698864164,
            originXData: '2022-08-31',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 31,
            y: 20.432927062,
            originXData: '2022-09-01',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 32,
            y: 15.5161507751,
            originXData: '2022-09-02',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 33,
            y: 14.7165986868,
            originXData: '2022-09-03',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 34,
            y: 5.9399681276,
            originXData: '2022-09-04',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 35,
            y: 29.0753736462,
            originXData: '2022-09-05',
            type: 'Deep use of user DAU rate'
          },
          {
            x: 36,
            y: 14.2242265758,
            originXData: '2022-09-06',
            type: 'Deep use of user DAU rate'
          }
        ]
      },
      {
        id: 'Active time per user in deep use',
        values: [
          {
            x: 0,
            y: 11.4706453569,
            originXData: '2022-08-01',
            type: 'Active time per user in deep use'
          },
          {
            x: 1,
            y: 1.0113886479,
            originXData: '2022-08-02',
            type: 'Active time per user in deep use'
          },
          {
            x: 2,
            y: 0.6261438656,
            originXData: '2022-08-03',
            type: 'Active time per user in deep use'
          },
          {
            x: 3,
            y: 1.2594126034,
            originXData: '2022-08-04',
            type: 'Active time per user in deep use'
          },
          {
            x: 4,
            y: 1.110347076,
            originXData: '2022-08-05',
            type: 'Active time per user in deep use'
          },
          {
            x: 5,
            y: 1.7606185008000002,
            originXData: '2022-08-06',
            type: 'Active time per user in deep use'
          },
          {
            x: 6,
            y: 3.1996649894,
            originXData: '2022-08-07',
            type: 'Active time per user in deep use'
          },
          {
            x: 7,
            y: 1.8309153124000002,
            originXData: '2022-08-08',
            type: 'Active time per user in deep use'
          },
          {
            x: 8,
            y: 1.6276907644,
            originXData: '2022-08-09',
            type: 'Active time per user in deep use'
          },
          {
            x: 9,
            y: 2.0344430598,
            originXData: '2022-08-10',
            type: 'Active time per user in deep use'
          },
          {
            x: 10,
            y: 1.8143243486,
            originXData: '2022-08-11',
            type: 'Active time per user in deep use'
          },
          {
            x: 11,
            y: 2.3653753082,
            originXData: '2022-08-12',
            type: 'Active time per user in deep use'
          },
          {
            x: 12,
            y: 0.8402003552,
            originXData: '2022-08-13',
            type: 'Active time per user in deep use'
          },
          {
            x: 13,
            y: 12.2934695311,
            originXData: '2022-08-14',
            type: 'Active time per user in deep use'
          },
          {
            x: 14,
            y: 0.1023576737,
            originXData: '2022-08-15',
            type: 'Active time per user in deep use'
          },
          {
            x: 15,
            y: 0.8511935553000001,
            originXData: '2022-08-16',
            type: 'Active time per user in deep use'
          },
          {
            x: 16,
            y: 10.1146320918,
            originXData: '2022-08-17',
            type: 'Active time per user in deep use'
          },
          {
            x: 17,
            y: 0.1586464168,
            originXData: '2022-08-18',
            type: 'Active time per user in deep use'
          },
          {
            x: 18,
            y: 0.1545275253,
            originXData: '2022-08-19',
            type: 'Active time per user in deep use'
          },
          {
            x: 19,
            y: 1.1788916147,
            originXData: '2022-08-20',
            type: 'Active time per user in deep use'
          },
          {
            x: 20,
            y: 0.6540454701,
            originXData: '2022-08-21',
            type: 'Active time per user in deep use'
          },
          {
            x: 21,
            y: 0.327335478,
            originXData: '2022-08-22',
            type: 'Active time per user in deep use'
          },
          {
            x: 22,
            y: 0.4438853958,
            originXData: '2022-08-23',
            type: 'Active time per user in deep use'
          },
          {
            x: 23,
            y: 19.1209711562,
            originXData: '2022-08-24',
            type: 'Active time per user in deep use'
          },
          {
            x: 24,
            y: 0.23479017370000002,
            originXData: '2022-08-25',
            type: 'Active time per user in deep use'
          },
          {
            x: 25,
            y: 0.2585826425,
            originXData: '2022-08-26',
            type: 'Active time per user in deep use'
          },
          {
            x: 26,
            y: 0.44290894680000004,
            originXData: '2022-08-27',
            type: 'Active time per user in deep use'
          },
          {
            x: 27,
            y: 1.0068737375,
            originXData: '2022-08-28',
            type: 'Active time per user in deep use'
          },
          {
            x: 28,
            y: 0.5147067161000001,
            originXData: '2022-08-29',
            type: 'Active time per user in deep use'
          },
          {
            x: 29,
            y: 1.4896572078,
            originXData: '2022-08-30',
            type: 'Active time per user in deep use'
          },
          {
            x: 30,
            y: 0.0596243413,
            originXData: '2022-08-31',
            type: 'Active time per user in deep use'
          },
          {
            x: 31,
            y: 0.7171793368,
            originXData: '2022-09-01',
            type: 'Active time per user in deep use'
          },
          {
            x: 32,
            y: 0.6769330853000001,
            originXData: '2022-09-02',
            type: 'Active time per user in deep use'
          },
          {
            x: 33,
            y: 1.4653552176,
            originXData: '2022-09-03',
            type: 'Active time per user in deep use'
          },
          {
            x: 34,
            y: 3.2344905318,
            originXData: '2022-09-04',
            type: 'Active time per user in deep use'
          },
          {
            x: 35,
            y: 0.4517085496,
            originXData: '2022-09-05',
            type: 'Active time per user in deep use'
          },
          {
            x: 36,
            y: 0.7326924535,
            originXData: '2022-09-06',
            type: 'Active time per user in deep use'
          }
        ]
      },
      {
        id: 'Total number of active users',
        values: [
          {
            x: 0,
            y: 196,
            originXData: '2022-08-01',
            type: 'Total number of active users'
          },
          {
            x: 1,
            y: 683,
            originXData: '2022-08-02',
            type: 'Total number of active users'
          },
          {
            x: 2,
            y: 1115,
            originXData: '2022-08-03',
            type: 'Total number of active users'
          },
          {
            x: 3,
            y: 781,
            originXData: '2022-08-04',
            type: 'Total number of active users'
          },
          {
            x: 4,
            y: 993,
            originXData: '2022-08-05',
            type: 'Total number of active users'
          },
          {
            x: 5,
            y: 997,
            originXData: '2022-08-06',
            type: 'Total number of active users'
          },
          {
            x: 6,
            y: 103,
            originXData: '2022-08-07',
            type: 'Total number of active users'
          },
          {
            x: 7,
            y: 827,
            originXData: '2022-08-08',
            type: 'Total number of active users'
          },
          {
            x: 8,
            y: 1256,
            originXData: '2022-08-09',
            type: 'Total number of active users'
          },
          {
            x: 9,
            y: 1197,
            originXData: '2022-08-10',
            type: 'Total number of active users'
          },
          {
            x: 10,
            y: 657,
            originXData: '2022-08-11',
            type: 'Total number of active users'
          },
          {
            x: 11,
            y: 440,
            originXData: '2022-08-12',
            type: 'Total number of active users'
          },
          {
            x: 12,
            y: 1343,
            originXData: '2022-08-13',
            type: 'Total number of active users'
          },
          {
            x: 13,
            y: 245,
            originXData: '2022-08-14',
            type: 'Total number of active users'
          },
          {
            x: 14,
            y: 1459,
            originXData: '2022-08-15',
            type: 'Total number of active users'
          },
          {
            x: 15,
            y: 742,
            originXData: '2022-08-16',
            type: 'Total number of active users'
          },
          {
            x: 16,
            y: 1096,
            originXData: '2022-08-17',
            type: 'Total number of active users'
          },
          {
            x: 17,
            y: 603,
            originXData: '2022-08-18',
            type: 'Total number of active users'
          },
          {
            x: 18,
            y: 625,
            originXData: '2022-08-19',
            type: 'Total number of active users'
          },
          {
            x: 19,
            y: 477,
            originXData: '2022-08-20',
            type: 'Total number of active users'
          },
          {
            x: 20,
            y: 557,
            originXData: '2022-08-21',
            type: 'Total number of active users'
          },
          {
            x: 21,
            y: 1621,
            originXData: '2022-08-22',
            type: 'Total number of active users'
          },
          {
            x: 22,
            y: 734,
            originXData: '2022-08-23',
            type: 'Total number of active users'
          },
          {
            x: 23,
            y: 888,
            originXData: '2022-08-24',
            type: 'Total number of active users'
          },
          {
            x: 24,
            y: 493,
            originXData: '2022-08-25',
            type: 'Total number of active users'
          },
          {
            x: 25,
            y: 1800,
            originXData: '2022-08-26',
            type: 'Total number of active users'
          },
          {
            x: 26,
            y: 79,
            originXData: '2022-08-27',
            type: 'Total number of active users'
          },
          {
            x: 27,
            y: 2620,
            originXData: '2022-08-28',
            type: 'Total number of active users'
          },
          {
            x: 28,
            y: 2566,
            originXData: '2022-08-29',
            type: 'Total number of active users'
          },
          {
            x: 29,
            y: 2514,
            originXData: '2022-08-30',
            type: 'Total number of active users'
          },
          {
            x: 30,
            y: 1431,
            originXData: '2022-08-31',
            type: 'Total number of active users'
          },
          {
            x: 31,
            y: 3108,
            originXData: '2022-09-01',
            type: 'Total number of active users'
          },
          {
            x: 32,
            y: 4053,
            originXData: '2022-09-02',
            type: 'Total number of active users'
          },
          {
            x: 33,
            y: 1863,
            originXData: '2022-09-03',
            type: 'Total number of active users'
          },
          {
            x: 34,
            y: 2588,
            originXData: '2022-09-04',
            type: 'Total number of active users'
          },
          {
            x: 35,
            y: 2855,
            originXData: '2022-09-05',
            type: 'Total number of active users'
          },
          {
            x: 36,
            y: 10,
            originXData: '2022-09-06',
            type: 'Total number of active users'
          }
        ]
      }
    ]
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID, onError: null });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
