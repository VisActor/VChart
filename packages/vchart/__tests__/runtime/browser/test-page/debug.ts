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

  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'China (regional and medium)', value: '13.1' },
          { type: 'China (long haul)', value: '3.9' },
          { type: 'Rest of Asia', value: '55' },
          { type: 'Rest of the world', value: '60' }
        ]
      }
    ],
    outerRadius: 0.65,
    valueField: 'value',
    categoryField: 'type',
    color: ['rgb(233,178,200)', 'rgb(248,218,226)', 'rgb(163,219,218)', 'rgb(210,210,210)'],
    title: {
      visible: true,
      text: 'Plane deliveries to China by region and type (2016–2035, % forecast)',
      subtext:
        'source: https://multimedia.scmp.com/news/china/article/2170344/china-2025-aviation/index.html?src=follow-chapter'
    },
    legends: {
      visible: true,
      orient: 'top'
    },
    label: {
      visible: true
    },
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
          type: 'image',
          imageStyle: {
            dx: -50,
            dy: 40,
            image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/airplane.png'
          }
        }
      }
    ]
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID, onError: null });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
