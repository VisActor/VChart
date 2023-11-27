import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const data1 = [
    { date: 'Day 1', workload: 7000 },
    { date: 'Day 2', workload: 1000 },
    { date: 'Day 3', workload: 6000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 6', workload: 3000 },
    { date: 'Day 7', workload: 9000 },
    { date: 'Day 8', workload: 2000 },
    { date: 'Day 9', workload: 5000 }
  ];

  const data2 = [
    { date: 'Day 1', workload: 1000 },
    { date: 'Day 2', workload: 2000 },
    { date: 'Day 3', workload: 3000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 5000 }
  ];

  const data3 = [
    { date: 'Day 0', workload: 3000 },
    { date: 'Day 1', workload: 4000 },
    { date: 'Day 2', workload: 5000 },
    { date: 'Day3', workload: 6000 },
    { date: 'Day4', workload: 7000 },
    { date: 'Day5', workload: 8000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 10', workload: 8000 }
  ];

  const spec = {
    type: 'bar',
    padding: {
      top: 24,
      right: 48,
      bottom: 48,
      left: 48
    },
    data: [
      {
        id: 'id0',
        values: data1
      }
    ],
    xField: 'date',
    yField: 'workload',
    axes: [
      {
        orient: 'bottom',
        label: {
          space: 8,
          style: {
            fill: '#505050',
            fontFamily: 'PingFang SC',
            angle: 0
          },
          type: 'rich',
          formatMethod: text => {
            return [
              {
                text: text,
                fontWeight: 'bold',
                fontSize: 12,
                fill: '#3f51b5'
              },
              {
                text: '🌞',
                fill: '#3f51b5'
              }
            ];
          }
        },
        tick: {
          visible: false
        },
        title: {
          visible: true,
          space: 20,
          style: {
            fill: '#333',
            fontFamily: 'PingFang SC',
            fontSize: 14,
            fontWeight: 'bold'
          },
          type: 'rich',
          text: [
            {
              text: 'Date',
              fontWeight: 'bold',
              fontSize: 25,
              fill: '#3f51b5'
            },
            {
              text: '日期',
              fontStyle: 'italic',
              textDecoration: 'underline',
              fill: '#3f51b5'
            }
          ]
        }
      },
      {
        orient: 'left',
        label: {
          space: 8,
          style: {
            fill: '#6F6F6F',
            fontFamily: 'PingFang SC'
          },
          formatMethod: label => `${label}K`
        },
        grid: {
          visible: true,
          style: {
            lineDash: [0]
          }
        },
        tick: {
          visible: false
        },
        title: {
          visible: true,
          space: 20,
          text: 'value',
          autoRotate: false,
          style: {
            fill: '#333',
            fontFamily: 'PingFang SC',
            fontSize: 14,
            fontWeight: 'bold',
            textBaseline: 'bottom',
            angle: -90
          }
        }
      }
    ],
    dataZoom: {
      orient: 'bottom',
      showDetail: true,
      middleHandler: {
        visible: true
      },
      backgroundChart: {
        area: {
          style: {
            fill: '#EAEAEA',
            fillOpacity: 0.5
          }
        },
        line: {
          style: {
            stroke: '#EAEAEA',
            lineWidth: 3
          }
        }
      },
      selectedBackgroundChart: {
        area: {
          style: {
            fill: '#EAEAEA'
          }
        },
        line: {
          style: {
            stroke: '#EAEAEA',
            lineWidth: 1
          }
        }
      },
      background: {
        style: {
          fill: '#fff',
          lineWidth: 1,
          stroke: '#EAEAEA'
        }
      },
      selectedBackground: {
        style: {
          fillOpacity: 0.1
        }
      }
    },
    crosshair: {
      xField: {
        visible: true,
        label: {
          visible: false
        }
        // line: {
        //   width: '120%'
        // }
      },
      yField: {
        visible: false
      }
    },
    tooltip: {
      enterable: true,
      renderMode: 'canvas',
      mark: {
        title: {
          value: {
            type: 'rich',
            text: [
              {
                text: 'TOOLTIP',
                fontWeight: 'bold',
                fill: '#3f51b5'
              },
              {
                text: '替代方案',
                fontStyle: 'italic',
                textDecoration: 'underline',
                fill: '#3f51b5'
              }
            ]
          }
        }
      }
    },
    bar: {
      style: {
        fill: '#00924F'
      },
      state: {
        hover: {
          fill: '#1664FF'
        }
      }
    },
    label: {
      visible: true,
      formatter: '{date}'
    }
  };

  const percent_area_spec = {
    type: 'area',
    data: {
      values: [
        { type: 'Nail polish', country: 'Africa', value: 4229 },
        { type: 'Nail polish', country: 'EU', value: 4376 },
        { type: 'Nail polish', country: 'China', value: 3054 },
        { type: 'Nail polish', country: 'USA', value: 12814 },
        { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
        { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
        { type: 'Eyebrow pencil', country: 'China', value: 5067 },
        { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
        { type: 'Rouge', country: 'Africa', value: 5221 },
        { type: 'Rouge', country: 'EU', value: 3574 },
        { type: 'Rouge', country: 'China', value: 7004 },
        { type: 'Rouge', country: 'USA', value: 11624 },
        { type: 'Lipstick', country: 'Africa', value: 9256 },
        { type: 'Lipstick', country: 'EU', value: 4376 },
        { type: 'Lipstick', country: 'China', value: 9054 },
        { type: 'Lipstick', country: 'USA', value: 8814 },
        { type: 'Eyeshadows', country: 'Africa', value: 3308 },
        { type: 'Eyeshadows', country: 'EU', value: 4572 },
        { type: 'Eyeshadows', country: 'China', value: 12043 },
        { type: 'Eyeshadows', country: 'USA', value: 12998 },
        { type: 'Eyeliner', country: 'Africa', value: 5432 },
        { type: 'Eyeliner', country: 'EU', value: 3417 },
        { type: 'Eyeliner', country: 'China', value: 15067 },
        { type: 'Eyeliner', country: 'USA', value: 12321 },
        { type: 'Foundation', country: 'Africa', value: 13701 },
        { type: 'Foundation', country: 'EU', value: 5231 },
        { type: 'Foundation', country: 'China', value: 10119 },
        { type: 'Foundation', country: 'USA', value: 10342 },
        { type: 'Lip gloss', country: 'Africa', value: 4008 },
        { type: 'Lip gloss', country: 'EU', value: 4572 },
        { type: 'Lip gloss', country: 'China', value: 12043 },
        { type: 'Lip gloss', country: 'USA', value: 22998 },
        { type: 'Mascara', country: 'Africa', value: 18712 },
        { type: 'Mascara', country: 'EU', value: 6134 },
        { type: 'Mascara', country: 'China', value: 10419 },
        { type: 'Mascara', country: 'USA', value: 11261 }
      ]
    },
    title: {
      visible: true,
      text: '100% stacked area chart of cosmetic products sales'
    },
    percent: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'country',
    legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
    axes: [
      {
        orient: 'left',
        label: {
          formatMethod(val) {
            return `${(val * 100).toFixed(2)}%`;
          }
        }
      }
    ],
    label: {
      visible: true,
      formatter: '{_percent_}'
    }
  };

  const cs = new VChart(percent_area_spec, {
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
