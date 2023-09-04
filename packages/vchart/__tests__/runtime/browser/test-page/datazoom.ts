import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
  const getSpec = () => ({
    type: 'scatter',
    xField: '230726155928016',
    yField: '230726162719025',
    data: [
      {
        id: 'data',
        values: [
          {
            '30001': '西北',
            '230726155928016': '2368978',
            '230726155928024': '西北',
            '230726160142009': '815039.5979347229',
            '230726162719025': '53.40000084042549',
            '230726162719105': '西北'
          },
          {
            '30001': '中南',
            '230726155928016': '13157091',
            '230726155928024': '中南',
            '230726160142009': '4137415.0951108932',
            '230726162719025': '232.15000347048044',
            '230726162719105': '中南'
          },
          {
            '30001': '东北1',
            '230726155928016': '8296805',
            '230726155928024': '东北1',
            '230726160142009': '2681567.4745378494',
            '230726162719025': '234.75000359117985',
            '230726162719105': '东北1'
          },
          {
            '30001': '西南',
            '230726155928016': '4503658',
            '230726155928024': '西南',
            '230726160142009': '1303124.5089645386',
            '230726162719025': '134.2000020891428',
            '230726162719105': '西南'
          },
          {
            '30001': '华东',
            '230726155928016': '14550225',
            '230726155928024': '华东',
            '230726160142009': '4684506.442247391',
            '230726162719025': '331.10000520944595',
            '230726162719105': '华东'
          },
          {
            '30001': '华北',
            '230726155928016': '6939587',
            '230726155928024': '华北',
            '230726160142009': '2447301.0141382217',
            '230726162719025': '74.10000109672546',
            '230726162719105': '华北'
          }
        ],
        transform: [
          {
            type: 'fields',
            options: {
              fields: {
                '30001': {
                  alias: '图例项 '
                },
                '230726155928016': {
                  alias: '行 ID'
                },
                '230726155928024': {
                  alias: '地区'
                },
                '230726160142009': {
                  alias: '销售额'
                },
                '230726162719025': {
                  alias: '折扣'
                },
                '230726162719105': {
                  alias: '地区',
                  domain: ['西北', '中南', '东北1', '西南', '华东', '华北']
                }
              }
            }
          }
        ]
      }
    ],
    dataZoom: [
      {
        orient: 'bottom',
        backgroundColor: {
          style: {}
        },
        backgroundChart: {
          area: {
            style: {}
          }
        },
        selectedBackground: {
          style: {}
        },
        startHandler: {
          style: {}
        },
        endHandler: {
          style: {}
        }
      }
    ],
    axes: [
      {
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: '#8D8D8D'
          }
        },
        niceType: 'accurateFirst',
        grid: {
          visible: true,
          style: {
            stroke: '#f5222d',
            lineWidth: 5,
            lineDash: [5, 5]
          }
        },
        orient: 'left',
        visible: false,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#8D8D8D'
          }
        },
        title: {
          visible: false,
          text: '折扣',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            textAlign: 'center'
          }
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: '#3772ff'
          }
        },
        niceType: 'accurateFirst',
        grid: {
          visible: true,
          style: {
            stroke: '#f5222d',
            lineWidth: 5,
            lineDash: [5, 5]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#3772ff'
          }
        },
        title: {
          visible: true,
          text: '行 ID',
          style: {
            fontSize: 16,
            fill: '#479044',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 22,
            fill: '#6F6F6F',
            angle: 10,
            fontWeight: 'normal',
            textAlign: 'center'
          }
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      }
    ],
    label: {
      visible: true,
      overlap: {
        hideOnHit: true,
        clampForce: true
      },
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        fill: '#363839',
        stroke: 'rgba(255, 255, 255, 0.8)',
        lineWidth: 2,
        strokeOpacity: 1
      },
      offset: 6,
      position: 'top'
    },
    legends: [
      {
        type: 'discrete',
        orient: 'top',
        position: 'start',
        layoutType: 'normal',
        visible: true,
        hover: false,
        maxRow: 2,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        item: {
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 4,
            bottom: 4,
            left: 4,
            right: 22
          },
          background: {
            style: {
              fillOpacity: 0.001
            }
          },
          label: {
            style: {
              fontSize: 12,
              fill: '#6F6F6F'
            }
          },
          shape: {
            style: {
              symbolType: 'square'
            }
          }
        },
        pager: {
          textStyle: {},
          handler: {
            style: {},
            state: {
              disable: {}
            }
          }
        },
        padding: { left: 0 }
      },
      {
        type: 'size',
        slidable: true,
        title: {
          visible: true,
          text: '销售额',
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        orient: 'top',
        position: 'start',
        layoutType: 'normal',
        visible: true,
        field: ['230726160142009'],
        layoutLevel: 50,
        handlerText: {
          style: {
            maxLineWidth: 80,
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        padding: {
          top: 0,
          bottom: 16,
          left: 0,
          right: 0
        },
        rail: {
          width: 200
        }
      }
    ],
    seriesField: '230726162719105',
    color: {
      field: '230726162719105',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA'],
      specified: {}
    },
    sizeField: '230726160142009',
    size: {
      type: 'linear',
      range: [4, 16]
    },
    point: {
      state: {
        hover: {
          cursor: 'pointer',
          fillOpacity: 0.8,
          stroke: '#58595B',
          lineWidth: 1,
          zIndex: 500
        }
      }
    },
    hover: {
      enable: true
    },
    select: {
      enable: true
    },
    animation: false,
    hash: '7bf797a052eec40bd3955861c7d8e1f2'
  });

  const cs = new VChart(getSpec(), {
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
