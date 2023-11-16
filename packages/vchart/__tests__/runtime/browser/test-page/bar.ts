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
    title: {
      textType: 'rich',
      text: [
        {
          text: 'RICHTEXT',
          fontWeight: 'bold',
          fontSize: 25,
          fill: '#3f51b5'
        },
        {
          text: '替代方案',
          fontStyle: 'italic',
          textDecoration: 'underline',
          fill: '#3f51b5'
        }
      ]
    },
    label: {
      visible: true,
      textType: 'rich',
      formatMethod: text => {
        return [
          {
            text: text + '',
            fontWeight: 'bold',
            fontSize: 12,
            fill: '#3f51b5'
          },
          {
            text: 'K',
            fontStyle: 'italic',
            textDecoration: 'underline',
            fill: '#3f51b5'
          }
        ];
      }
    }
  };

  const cs = new VChart(spec, {
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
