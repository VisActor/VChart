import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  const dataView = new DataView(dataSet);
  const type1 = ['A', 'B'];
  const type2 = ['A', 'B'];
  const color = {
    A: {
      A: 'A',
      B: 'B'
    },
    B: {
      A: 'C',
      B: 'D'
    }
  };

  let data = 'y,x,y2,type,type2,color';
  type2.forEach(t2 => {
    type1.forEach(t => {
      for (let i = 0; i < 10; i++) {
        data += `\n${Math.floor(Math.random() * 300) + 600},${i},0,${t},${t2},${color[t][t2]}`;
      }
    });
  });

  dataView.parse(data, {
    type: 'csv'
  });
  // const spec = {
  //   type: 'scatter',
  //   data: [
  //     {
  //       values: [
  //         { x: 936196, size: 83431, y: 1371, type: '技术', area: '东北' },
  //         { x: 1270911, size: 219815, y: 5590, type: '办公用品', area: '中南' },
  //         { x: 453898, size: 19061, y: 727, type: '技术', area: '西南' },
  //         { x: 919743, size: 148800, y: 1199, type: '家具', area: '华北' },
  //         { x: 1676224, size: 163453, y: 2517, type: '家具', area: '华东' },
  //         { x: 1466575, size: 251487, y: 2087, type: '技术', area: '中南' },
  //         { x: 824673, size: 86067, y: 3622, type: '办公用品', area: '东北' },
  //         { x: 230956, size: 24016, y: 347, type: '技术', area: '西北' },
  //         { x: 1599653, size: 228179, y: 2183, type: '技术', area: '华东' },
  //         { x: 745813, size: 137265, y: 3020, type: '办公用品', area: '华北' },
  //         { x: 267870, size: 49633, y: 970, type: '办公用品', area: '西北' },
  //         { x: 1408628, size: 215585, y: 6341, type: '办公用品', area: '华东' },
  //         { x: 781743, size: 144986, y: 927, type: '技术', area: '华北' },
  //         { x: 501533, size: 29303, y: 814, type: '家具', area: '西南' },
  //         { x: 920698, size: 72692, y: 1470, type: '家具', area: '东北' },
  //         { x: 316212, size: 24903, y: 468, type: '家具', area: '西北' },
  //         { x: 1399928, size: 199582, y: 2023, type: '家具', area: '中南' },
  //         { x: 347692, size: 49272, y: 1858, type: '办公用品', area: '西南' }
  //       ]
  //     }
  //   ],
  //   xField: 'x',
  //   yField: 'y',
  //   seriesField: 'type',
  //   sizeField: 'size',
  //   size: [10, 25],
  //   shapeField: 'type',
  //   shape: ['circle', 'triangle'],
  //   axes: [
  //     { orient: 'left', range: { min: 0 }, type: 'linear' },
  //     { orient: 'bottom', label: { visible: true }, type: 'linear' }
  //   ],
  //   legends: [
  //     {
  //       visible: true,
  //       orient: 'left',
  //       position: 'start',
  //       title: {
  //         visible: true,
  //         style: {
  //           text: '标题'
  //         }
  //       },
  //       item: {
  //         visible: true
  //       }
  //     }
  //   ],
  //   direction: 'horizontal',
  //   brush: {
  //     brushType: 'polygon',
  //     inBrush: {
  //       colorAlpha: 1
  //     },
  //     outOfBrush: {
  //       colorAlpha: 0.2
  //     }
  //   }
  // };

  // const spec = {
  //   type: 'pie',
  //   data: [
  //     {
  //       id: 'id0',
  //       values: [
  //         { type: 'oxygen', value: '46.60' },
  //         { type: 'silicon', value: '27.72' },
  //         { type: 'aluminum', value: '8.13' },
  //         { type: 'iron', value: '5' },
  //         { type: 'calcium', value: '3.63' },
  //         { type: 'sodium', value: '2.83' },
  //         { type: 'potassium', value: '2.59' },
  //         { type: 'others', value: '3.5' }
  //       ]
  //     }
  //   ],
  //   outerRadius: 0.8,
  //   valueField: 'value',
  //   categoryField: 'type',
  //   title: {
  //     visible: true,
  //     text: 'Statistics of Surface Element Content'
  //   },
  //   legends: {
  //     visible: true,
  //     orient: 'left'
  //   },
  //   label: {
  //     visible: true,
  //     formatMethod: (test, datum) => {
  //       console.log('datum', datum);
  //       return datum.type + '-' + datum.value;
  //     }
  //   },
  //   tooltip: {
  //     mark: {
  //       content: [
  //         {
  //           key: datum => datum['type'],
  //           value: datum => datum['value'] + '%'
  //         }
  //       ]
  //     }
  //   }
  // };

  // const spec = {
  //   type: 'pie',
  //   width: 300,
  //   // height: 200,
  //   outerRadius: 0.68,
  //   innerRadius: 0.45,
  //   pie: {
  //     style: {
  //       cornerRadius: 0
  //     },
  //     state: {
  //       hover: {
  //         stroke: '#000',
  //         lineWidth: 1
  //       }
  //     }
  //   },
  //   indicator: {
  //     visible: true,
  //     fixed: true,
  //     title: {
  //       visible: true,
  //       autoLimit: true,
  //       autoFit: true,
  //       style: {
  //         fontSize: 20,
  //         text: '城市'
  //       }
  //     },
  //     content: {
  //       visible: true,
  //       autoLimit: true,
  //       autoFit: true,
  //       style: {
  //         fontSize: 16,
  //         text: '25,360'
  //       }
  //     }
  //   },
  //   height: 500,
  //   isNewVersion: true,
  //   categoryField: 'key',
  //   valueField: 'value',
  //   data: [
  //     {
  //       name: 'pie-chart',
  //       values: [
  //         {
  //           value: 10976,
  //           key: 'fe403a33afe6da0a562eeda813c9fa67'
  //         },
  //         {
  //           value: 5882,
  //           key: '21e2ac7dbc01a2c491ed4c6a6398a260'
  //         },
  //         {
  //           value: 4322,
  //           key: '66b3fd00925c17a370e704f425384ead'
  //         },
  //         {
  //           value: 822,
  //           key: 'f8171bb296acb1a6c9430e3aeaf36e0c'
  //         },
  //         {
  //           value: 609,
  //           key: '533c0e77e06e41a4583783b52c6f34aa'
  //         },
  //         {
  //           value: 391,
  //           key: '5238acbf106c1ef22e650c08b171fe07'
  //         },
  //         {
  //           value: 353,
  //           key: '07d82c53883ca5f8dd51c63cfe7a3e3a'
  //         },
  //         {
  //           value: 252,
  //           key: '3aceffbb3c3fe207c5a83bd1adde2024'
  //         },
  //         {
  //           value: 190,
  //           key: 'd125515cf36f311463e96923e680c8d9'
  //         },
  //         {
  //           value: 119,
  //           key: 'f684e1caa5b819199c9886477740bae9'
  //         },
  //         {
  //           value: 107,
  //           key: '2e9c8d22df77a6aeef58138b8fb798da'
  //         },
  //         {
  //           value: 71,
  //           key: '8b597bad10c33281cc1b8d87f675a025'
  //         },
  //         {
  //           value: 69,
  //           key: '2e5adfd03494e5ead069ac46623d37ad'
  //         },
  //         {
  //           value: 66,
  //           key: 'ff7a8dd527195597b4e92a8dfedbb63c'
  //         },
  //         {
  //           value: 63,
  //           key: '5f2d838dbcbfda4b792332a925d3acc0'
  //         },
  //         {
  //           value: 63,
  //           key: '740bd13b4783e9a1bfe287e9058b9962'
  //         },
  //         {
  //           value: 58,
  //           key: 'd57579289fb2da4f28996fb13af3a65c'
  //         },
  //         {
  //           value: 56,
  //           key: 'e35b345f27e28e80bf4999a43c374b89'
  //         },
  //         {
  //           value: 55,
  //           key: '101edc9fcfc13ac16209a0c3b3d3e114'
  //         },
  //         {
  //           value: 54,
  //           key: 'c609e66a63b4820140ef590a935b3c7d'
  //         },
  //         {
  //           value: 782,
  //           key: 'other'
  //         }
  //       ]
  //     }
  //   ],
  //   tooltip: {
  //     target: {
  //       title: {
  //         key: 'name'
  //       },
  //       content: [
  //         {
  //           key: 'name',
  //           value: 'tooltip'
  //         }
  //       ]
  //     }
  //   },
  //   label: {
  //     visible: true,
  //     style: {}
  //   },
  //   legends: []
  // };

  const spec_flower = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'a', value: 100 },
          { type: 'b', value: 89 },
          { type: 'c', value: 123 },
          { type: 'd', value: 300 }
        ]
      }
    ],
    valueField: 'value',
    categoryField: 'type',

    radius: 0.8,
    // innerRadius: 0.2,
    cornerRadius: 0.2,

    center: { x: 150, y: 200 },
    // centerOffset: 10,

    startAngle: 90,
    endAngle: 270,
    padAngle: 10,

    label: {
      visible: true,
      // position: 'inside',
      style: {
        fontSize: 16,
        text: args => '123123123'
      },
      state: {
        hover: {
          fill: 'red'
        }
      },
      line: {
        visible: true,
        style: {
          // stroke: 'blue',
          lineWidth: 2
        },
        state: {
          hover: {
            stroke: 'red'
          }
        }
      },
      layout: {}
    },
    pie: {
      style: {
        stroke: '#aaa',
        lineWidth: 2,
        fill: {
          gradient: 'radial',
          r0: 0,
          x0: 0.5,
          y0: 0.5,
          x1: 0.5,
          y1: 0.5,
          r1: 0.5,
          stops: [
            {
              offset: 0,
              opacity: 0.2
            },
            {
              offset: 0.5,
              opacity: 0.6
            },
            {
              offset: 1,
              opacity: 1
            }
          ]
        }
      },
      state: {
        hover: {
          outerRadius: 0.85,
          fill: {
            gradient: 'radial',
            r0: 0,
            x0: 0.5,
            y0: 0.5,
            x1: 0.5,
            y1: 0.5,
            r1: 0.5,
            stops: [
              {
                offset: 0,
                color: 'red'
              },
              {
                offset: 0.5,
                color: 'yellow'
              },
              {
                offset: 1,
                color: 'blue'
              }
            ]
          }
        },
        selected: {
          stroke: 'blue',
          lineWidth: 2
        }
      }
    }
  };

  const spec_solar_pie = {
    type: 'pie',
    data: [
      {
        values: [
          {
            value: '159',
            type: 'Tradition Industries',
            percentage: '71.6%'
          },
          {
            value: '50',
            type: 'Business Companies',
            percentage: '22.5%'
          },
          {
            value: '13',
            type: 'Customer-facing Companies',
            percentage: '5.9%'
          }
        ]
      }
    ],
    radius: 0.8,
    innerRadius: 0.5,
    valueField: 'value',
    categoryField: 'type',
    label: {
      visible: true,
      style: {
        fontSize: 16
      },
      line: {
        style: {},
        line1MinLength: 30
      },
      layout: {
        align: 'edge'
      }
    },
    pie: {
      state: {
        selected: {
          outerRadius: 0.85
        }
      }
    },
    indicator: {
      visible: true,
      fixed: false,
      trigger: 'select',
      gap: 10,
      title: {
        field: 'type',
        autoLimit: true,
        style: {
          fontSize: 16
        }
      },
      content: [
        {
          field: 'value',
          style: {
            fontSize: 42,
            fontWeight: 'bolder'
          }
        },
        {
          field: 'percentage',
          style: {
            fontSize: 20
          }
        }
      ]
    }
  };

  const spec_rose = {
    type: 'rose',
    data: [
      {
        values: [
          {
            value: '159',
            type: 'Tradition Industries'
          },
          {
            value: '50',
            type: 'Business Companies'
          },
          {
            value: '13',
            type: 'Customer-facing Companies'
          }
        ]
      }
    ],
    outerRadius: 0.8,
    innerRadius: 0.2,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    label: {
      visible: true
      // position: 'inside',
      // style: {
      //   fill: 'black'
      // }
    }
  };

  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    outerRadius: 0.8,
    valueField: 'value',
    categoryField: 'type',
    // centerOffset: 10,
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content'
    },
    legends: {
      visible: true,
      orient: 'left'
    },
    label: {
      visible: true
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum['type'],
            value: datum => datum['value'] + '%'
          }
        ]
      }
    }
  };

  const cs = new VChart(spec_flower, {
    dataSet,
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
