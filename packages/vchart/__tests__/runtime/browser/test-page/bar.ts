import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec = {
    type: 'area',
    xField: ['UuBUiPeJdQLo'],
    yField: ['10002'],
    direction: 'vertical',
    sortDataByAxis: true,
    seriesField: '30001',
    padding: {
      left: 6,
      right: 6,
      top: 6,
      bottom: 6
    },
    labelLayout: 'region',
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': 'Profit',
            '10002': 20,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2023',
            UuBUiPeJdQLo: 'Labels',
            LCiUpX9NRGSE: 20,
            T9x55yGuZtg9: '2023'
          },
          {
            '10001': 'Profit',
            '10002': 44,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2022',
            UuBUiPeJdQLo: 'Labels',
            LCiUpX9NRGSE: 44,
            T9x55yGuZtg9: '2022'
          },
          {
            '10001': 'Profit',
            '10002': 15,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2023',
            UuBUiPeJdQLo: 'Tables',
            LCiUpX9NRGSE: 15,
            T9x55yGuZtg9: '2023'
          },
          {
            '10001': 'Profit',
            '10002': 20,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2022',
            UuBUiPeJdQLo: 'Tables',
            LCiUpX9NRGSE: 20,
            T9x55yGuZtg9: '2022'
          },
          {
            '10001': 'Profit',
            '10002': 50,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2023',
            UuBUiPeJdQLo: 'Storage',
            LCiUpX9NRGSE: 50,
            T9x55yGuZtg9: '2023'
          },
          {
            '10001': 'Profit',
            '10002': 65,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2022',
            UuBUiPeJdQLo: 'Storage',
            LCiUpX9NRGSE: 65,
            T9x55yGuZtg9: '2022'
          },
          {
            '10001': 'Profit',
            '10002': 15,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2023',
            UuBUiPeJdQLo: 'Furn',
            LCiUpX9NRGSE: 15,
            T9x55yGuZtg9: '2023'
          },
          {
            '10001': 'Profit',
            '10002': 40,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2022',
            UuBUiPeJdQLo: 'Furn',
            LCiUpX9NRGSE: 40,
            T9x55yGuZtg9: '2022'
          },
          {
            '10001': 'Profit',
            '10002': 57,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2023',
            UuBUiPeJdQLo: 'Art',
            LCiUpX9NRGSE: 57,
            T9x55yGuZtg9: '2023'
          },
          {
            '10001': 'Profit',
            '10002': 35,
            '10003': 'LCiUpX9NRGSE',
            '30001': '2022',
            UuBUiPeJdQLo: 'Art',
            LCiUpX9NRGSE: 35,
            T9x55yGuZtg9: '2022'
          }
        ],
        fields: {
          '10001': {
            alias: '指标名称'
          },
          '10002': {
            alias: '指标值'
          },
          '30001': {
            alias: '图例项',
            domain: ['2023', '2022'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          UuBUiPeJdQLo: {
            alias: 'Product',
            domain: ['Labels', 'Labels', 'Tables', 'Tables', 'Storage', 'Storage', 'Furn', 'Furn', 'Art', 'Art'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          T9x55yGuZtg9: {
            alias: 'Year'
          },
          LCiUpX9NRGSE: {
            alias: 'Profit'
          }
        }
      }
    ],
    stackInverse: true,
    percent: true,
    axes: [
      {
        type: 'band',
        tick: {
          style: {
            strokeOpacity: 0.2
          },
          visible: false
        },
        grid: {
          visible: false,
          style: {
            zIndex: 150,
            stroke: 'rgba(57,57,57,1)',
            lineWidth: 1,
            lineDash: []
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: false,
          style: {
            lineWidth: 1,
            stroke: '#FFFFFF'
          }
        },
        title: {
          visible: false,
          space: 5,
          text: '',
          style: {
            fontSize: 12,
            fill: 'rgba(255,255,255,0.5)',
            fontFamily: 'D-DIN',
            fontWeight: 'normal'
          }
        },
        maxHeight: null,
        autoIndent: false,
        sampling: false,
        zIndex: 200,
        label: {
          visible: true,
          space: 4,
          style: {
            fontSize: 12,
            fill: 'rgba(255,255,255,0.65)',
            angle: 0,
            fontFamily: 'D-DIN',
            fontWeight: 'normal',
            direction: 'horizontal',
            maxLineWidth: 174
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true,
          lastVisible: true,
          autoHideSeparation: 4
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        paddingInner: 0.8,
        paddingOuter: 0.05,
        ticks: true
      },
      {
        type: 'linear',
        tick: {
          size: 4,
          visible: true,
          tickMode: 'd3'
        },
        niceType: 'rough',
        zIndex: 200,
        grid: {
          visible: true
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: false,
          style: {
            lineWidth: 1,
            stroke: '#d5d7e2'
          }
        },
        title: {
          visible: false,
          text: '',
          space: 8,
          style: {
            fontSize: 12,
            fill: 'rgba(255,255,255,0.5)',
            fontFamily: 'D-DIN',
            fontWeight: 'normal'
          }
        },
        autoIndent: false,
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: 'rgba(255,255,255,0.65)',
            angle: 0,
            fontFamily: 'D-DIN',
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          autoHideSeparation: 4,
          rotateAngle: [null],
          labelOverlap: 'custom',
          tighten: false
        },
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        innerOffset: {
          top: 4.4311346272637895,
          right: 4.4311346272637895
        },
        zero: true,
        nice: true,
        ticks: true
      },
      {
        type: 'linear',
        tick: {
          size: 4,
          visible: true,
          tickMode: 'd3'
        },
        niceType: 'rough',
        zIndex: 200,
        grid: {
          visible: false
        },
        orient: 'right',
        visible: true,
        domainLine: {
          visible: false
        },
        title: {
          visible: false,
          text: '',
          space: 8,
          style: {
            fontSize: 12,
            fill: 'rgba(255,255,255,0.5)',
            fontFamily: 'D-DIN',
            fontWeight: 'normal'
          }
        },
        autoIndent: false,
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            visible: false,
            fontSize: 12,
            maxLineWidth: 174,
            fill: 'rgba(255,255,255,0.65)',
            angle: 0,
            fontFamily: 'D-DIN',
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          autoHideSeparation: 4,
          rotateAngle: [null],
          labelOverlap: 'custom',
          tighten: false
        },
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        innerOffset: {
          top: 4.4311346272637895,
          right: 4.4311346272637895
        },
        zero: true,
        nice: true,
        ticks: true
      }
    ],
    color: {
      field: '30001',
      type: 'ordinal',
      range: ['rgb(0,110,255)', 'rgb(0,229,229)'],
      specified: {}
    },
    colorGradient: {
      type: 'linear',
      x0: {
        field: '30001',
        type: 'ordinal',
        range: [0, 0]
      },
      y0: {
        field: '30001',
        type: 'ordinal',
        range: [1, 1]
      },
      x1: {
        field: '30001',
        type: 'ordinal',
        range: [0.00001, 0.00001]
      },
      y1: {
        field: '30001',
        type: 'ordinal',
        range: [0, 0]
      },
      stops: [
        {
          offset: 0,
          color: {
            field: '30001',
            type: 'ordinal',
            range: ['rgba(0,110,255,0.2)', 'rgba(0,229,229,0.2)']
          }
        },
        {
          offset: 1,
          color: {
            field: '30001',
            type: 'ordinal',
            range: ['rgb(0,110,255)', 'rgb(0,229,229)']
          }
        }
      ]
    },
    legends: [
      {
        type: 'discrete',
        visible: true,
        id: 'legend-discrete',
        orient: 'top',
        position: 'end',
        layoutType: 'normal',
        maxRow: 1,
        title: {
          textStyle: {
            fontSize: 12,
            fill: 'rgba(255,255,255,0.45)'
          }
        },
        layoutLevel: 70,
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 400,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            left: 10,
            right: -10,
            top: 0,
            bottom: 5
          },
          background: {
            visible: false,
            style: {
              fillOpacity: 0.001
            }
          },
          label: {
            style: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.45)',
              fontFamily: 'D-DIN',
              fontWeight: 'normal'
            },
            state: {
              unSelected: {
                fillOpacity: 0.2
              }
            }
          },
          shape: {
            style: {
              lineWidth: 0,
              symbolType: 'square',
              fillOpacity: 1,
              size: 12,
              width: 12,
              height: 7.416
            }
          }
        },
        pager: {
          layout: 'horizontal',
          padding: 0,
          textStyle: {},
          space: 0,
          handler: {
            preShape: 'triangleLeft',
            nextShape: 'triangleRight',
            style: {},
            state: {
              disable: {}
            }
          }
        },
        alignSelf: 'end',
        padding: {
          left: 10,
          right: 0,
          top: 0,
          bottom: 12
        }
      }
    ],
    label: {
      visible: false,
      offset: 3,
      overlap: {
        hideOnHit: true,
        avoidBaseMark: false,
        strategy: [
          {
            type: 'position',
            position: ['top', 'bottom']
          }
        ],
        clampForce: true
      },
      style: {
        fontSize: 12,
        fontFamily: 'D-DIN',
        fontWeight: 'normal',
        zIndex: 400,
        lineHeight: '100%',
        fill: 'rgba(255,255,255,1)',
        strokeOpacity: 0
      },
      position: 'top',
      smartInvert: false,
      fontWeight: 'normal'
    },
    tooltip: {
      visible: true,
      renderMode: 'canvas',
      mark: {
        visible: true
      },
      style: {
        panel: {
          padding: {
            top: 5,
            bottom: 10,
            left: 10,
            right: 10
          },
          backgroundColor: '#f8e71c',
          border: {
            color: '#d0021b',
            width: 10,
            radius: 10
          },
          shadow: {
            x: 0,
            y: 4,
            blur: 12,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.2)'
          }
        },
        titleLabel: {
          fontSize: 30,
          fontColor: '#f5a623',
          fontWeight: 'bold',
          fontFamily: 'SimSun, Songti SC',
          align: 'left',
          lineHeight: 18
        },
        keyLabel: {
          fontSize: 30,
          fontColor: '#7ed321',
          fontWeight: 'bold',
          fontFamily: 'SimSun, Songti SC',
          align: 'left',
          lineHeight: 18
        },
        valueLabel: {
          fontSize: 30,
          fontColor: '#bd10e0',
          fontWeight: 'bold',
          fontFamily: 'SimSun, Songti SC',
          align: 'right',
          lineHeight: 18
        },
        shape: {
          size: 10,
          spacing: 10
        },
        spaceRow: 10
      },
      dimension: {
        visible: true
      }
    },
    point: {
      style: {
        shape: {
          type: 'ordinal',
          field: '30001',
          range: ['circle'],
          domain: ['2023', '2022']
        },
        size: {
          type: 'ordinal',
          field: '30001',
          range: [7.0898154036220635],
          domain: ['2023', '2022']
        },
        fill: 'white',
        stroke: {
          field: '30001',
          type: 'ordinal',
          range: ['rgb(0,110,255)', 'rgb(0,229,229)'],
          specified: {}
        },
        strokeOpacity: {
          type: 'ordinal',
          field: '30001',
          range: [0],
          domain: ['2023', '2022']
        },
        fillOpacity: {
          type: 'ordinal',
          field: '30001',
          range: [0],
          domain: ['2023', '2022']
        }
      },
      state: {
        hover: {
          lineWidth: 2,
          fillOpacity: 1,
          strokeOpacity: 1,
          scaleX: 1.5,
          scaleY: 1.5
        }
      }
    },
    line: {
      style: {
        curveType: {
          type: 'ordinal',
          field: '30001',
          range: ['linear'],
          domain: ['2023', '2022']
        },
        lineWidth: {
          type: 'ordinal',
          field: '30001',
          range: [2],
          domain: ['2023', '2022']
        },
        lineDash: {
          type: 'ordinal',
          field: '30001',
          range: [[0, 0]],
          domain: ['2023', '2022']
        }
      }
    },
    seriesMark: 'line',
    markOverlap: true,
    area: {
      visible: true,
      style: {
        fillOpacity: 0.35,
        curveType: {
          type: 'ordinal',
          field: '30001',
          range: ['linear'],
          domain: ['2023', '2022']
        },
        fill: {
          gradient: 'linear',
          x0: 0,
          y0: 1,
          stops: [
            {
              offset: 0
            },
            {
              offset: 1
            }
          ]
        }
      }
    },
    region: [
      {
        clip: true
      }
    ],
    background: 'rgba(0, 0, 0, 1)',
    invalidType: 'break',
    animation: false,
    crosshair: {
      xField: {
        visible: true,
        line: {
          type: 'rect',
          style: {
            fillOpacity: 1,
            fill: '#d0021b'
          }
        }
      },
      gridZIndex: 100,
      yField: {
        line: {
          style: {
            fillOpacity: 1,
            fill: '#d0021b'
          }
        },
        visible: false
      }
    },
    morph: {
      enable: false
    },
    axesPadding: true,
    plotLayout: {
      clip: false
    },
    select: {
      enable: true
    },
    scales: [
      {
        id: 'gradientFillStop0',
        type: 'ordinal',
        range: [
          'rgba(0,110,255,0.2)',
          'rgba(0,229,229,0.2)',
          'rgba(46,85,234,0.2)',
          'rgba(184,231,254,0.2)',
          'rgba(0,214,137,0.2)',
          'rgba(183,249,245,0.2)',
          'rgba(251,204,113,0.2)',
          'rgba(244,110,80,0.2)'
        ],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      },
      {
        id: 'gradientFillStop1',
        type: 'ordinal',
        range: [
          'rgb(0,110,255)',
          'rgb(0,229,229)',
          'rgb(46,85,234)',
          'rgb(184,231,254)',
          'rgb(0,214,137)',
          'rgb(183,249,245)',
          'rgb(251,204,113)',
          'rgb(244,110,80)'
        ],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      },
      {
        id: 'gradientStrokeStop0',
        type: 'ordinal',
        range: [
          'rgba(51, 139, 255, 0.2)',
          'rgba(25, 255, 255, 0.2)',
          'rgba(92, 123, 239, 0.2)',
          'rgba(234, 248, 255, 0.2)',
          'rgba(10, 255, 167, 0.2)',
          'rgba(230, 253, 252, 0.2)',
          'rgba(252, 222, 163, 0.2)',
          'rgba(247, 150, 128, 0.2)'
        ],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      },
      {
        id: 'gradientStrokeStop1',
        type: 'ordinal',
        range: [
          'rgba(51, 139, 255, 1)',
          'rgba(25, 255, 255, 1)',
          'rgba(92, 123, 239, 1)',
          'rgba(234, 248, 255, 1)',
          'rgba(10, 255, 167, 1)',
          'rgba(230, 253, 252, 1)',
          'rgba(252, 222, 163, 1)',
          'rgba(247, 150, 128, 1)'
        ],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      },
      {
        id: 'gradientX1',
        type: 'ordinal',
        range: [0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      },
      {
        id: 'gradientY1',
        type: 'ordinal',
        range: [0, 0, 0, 0, 0, 0, 0, 0],
        domain: [
          {
            dataId: 'data',
            fields: ['30001']
          }
        ]
      }
    ],
    hash: '68fa40c4bcc309376f9be118cd26e15c'
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
