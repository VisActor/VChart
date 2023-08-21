import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
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
      formatMethod: () => '123123123',
      style: {
        fontSize: 16
        // text: args => '123123123'
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

  const spec_huazhu = {
    type: 'pie',
    data: [
      {
        name: 'data1',
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
    valueField: 'value',
    categoryField: 'name',
    // radius: 0.8,
    outerRadius: 0.8,
    innerRadius: 0.5,
    color: ['#87DBDD', '#FF8406', '#468DFF'],
    pie: {
      state: {
        hover: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1
        },
        selected: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    legends: {
      visible: true,
      orient: 'right',
      title: {
        visible: false
      },
      item: {
        visible: true
      }
    },
    tooltip: {
      transitionDuration: 0
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
      visible: true,
      style: {
        fontSize: 16
      },
      line: {
        style: {},
        line1MinLength: 30
      },
      layout: {
        // align: 'edge'
      }
      // formatMethod: () => {
      //   return 'test';
      // },
      // style: {
      //   // text: datum => {
      //   //   return '12345678';
      //   // }
      // }
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

  const cs = new VChart(spec_huazhu, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
  // cs.on('click', event => {
  //   console.log(event);
  // });
};
run();
