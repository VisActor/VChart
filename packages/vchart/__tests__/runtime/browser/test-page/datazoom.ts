import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
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
        values: []
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
            angle: -60,
            textAlign: 'end',
            textBaseline: 'middle'
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
          }
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
      enterable: true
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
    }
  };

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    onError: null,
    logLevel: 5
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
