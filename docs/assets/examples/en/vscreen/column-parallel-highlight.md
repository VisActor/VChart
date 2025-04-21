---
category: examples
group: vscreen
title: Column Parallel With HightLight
keywords: barChart,comparison,composition,proportion,animation
cover: /vchart/preview/column-parallel-highlight.gif
option: vscreen
---

# Column Parallel With HightLight

Animation execution process:

1. Entrance animation: executed during the first rendering

- Growth: The height of the primitive starts from 0 and grows upward/right
- Move in: All primitives keep their relative positions and are moved into the canvas as a whole.

2. Normal animation: Carousel animation every interval.
   Normal animations for bar charts include:

- Group highlighting: Taking dimensions as the grouping unit, highlight in sequence
- Streamer: The streamer primitive moves from the starting point of the column primitive to the end point
- Move in: All primitives keep their relative positions and are moved into the canvas as a whole.

This case includes:
Admission: Growth + Normality: Group Highlighting

## Key option

- `animationAppear`: entrance animation, animation effect during first rendering
- `animationNormal`: Normal animation, after the initial rendering, the animation effect of the chart without any status update, usually executed in a fixed interval rotation
- `animationUpdate`: When the chart updates state, the animation effect of the graphic elements when updating
- `animationEnter`: When the chart updates state, the animation effect of new elements is added
- `animationExit`: When the chart updates state, the animation effect of the primitive when it exits

## Demo source

```javascript livedemo
// normal animation config and util
const totalDuration = 5000;
const fillColor = '#FFAE29';
const strokeColor = '#FFAE29';
const interval = 1000;
function getGroupInfo(chartInstance, datum) {
  const series = chartInstance.getChart().getAllSeries()[0];
  const indexField = series.direction === 'horizontal' ? series.fieldY[0] : series.fieldX[0];
  const indexValue = datum?.[indexField];
  const scale = series.direction === 'horizontal' ? series.scaleY : series.scaleX;
  const index = (scale?.domain?.() ?? []).indexOf(indexValue) || 0;
  const count = (scale?.domain?.() ?? []).length ?? 1;
  return { index, count };
}

const spec = {
  // default size
  // width: 400,
  // height: 225,
  // data mapping
  type: 'bar',
  xField: ['HqlYadRdHJ5c', '30001'],
  yField: ['10002'],
  direction: 'vertical',
  seriesField: '30001',
  // animation
  animation: true,
  animationAppear: {
    bar: {
      type: 'growHeightIn',
      oneByOne: false,
      duration: 1000,
      loop: false
    }
  },
  animationNormal: {
    bar: [
      {
        loop: true,
        startTime: 0,
        controlOptions: {
          immediatelyApply: false
        },
        timeSlices: [
          {
            effects: {
              channel: {
                fill: {
                  to: fillColor
                },
                stroke: {
                  to: strokeColor
                }
              },
              easing: 'linear'
            },
            delay: (datum, element, context, global) => {
              // console.log('context', datum, context, global);
              const { count, index } = getGroupInfo(global.vchart, datum);
              // console.log('loopDuration', loopDuration, count)
              // initial delay + one by one delay
              if (count === 0) {
                return 0;
              }
              return (index * totalDuration) / count;
            },
            // delayAfter: 6000,
            duration: (datum, element, context, global) => {
              const { count, index } = getGroupInfo(global.vchart, datum);
              // initial delay + one by one delay
              if (count === 0) {
                return 1000;
              }
              return totalDuration / count / 2;
            }
          },
          {
            effects: {
              channel: {
                fill: {
                  from: fillColor,
                  to: (...p) => {
                    return p[1].attribute.fill;
                  }
                },
                stroke: {
                  from: strokeColor,
                  to: (...p) => {
                    return p[1].attribute.fill;
                  }
                }
              },
              easing: 'linear'
            },
            delayAfter: (datum, element, context, global) => {
              const { count, index } = getGroupInfo(global.vchart, datum);
              // rest one by one delay
              if (count === 0) {
                return 0;
              }
              return interval * 1000 + ((count - index - 1) * totalDuration) / count;
            },
            duration: (datum, element, context, global) => {
              const { count, index } = getGroupInfo(global.vchart, datum);
              // initial delay + one by one delay
              if (count === 0) {
                return 1000;
              }
              return totalDuration / count / 2;
            }
          }
        ]
      }
    ]
  },
  // global style
  padding: {
    left: 6,
    right: 6,
    top: 6,
    bottom: 6
  },
  background: 'rgba(0, 0, 0, 1)',
  // chart style
  barWidth: '40%',
  barBackground: {
    fieldLevel: 0,
    visible: false,
    interactive: false,
    style: {
      cornerRadius: 0,
      fill: 'rgba(255,255,255,1)',
      fillOpacity: 0.25
    }
  },
  // color mapping
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
  bar: {
    state: {
      hover: {
        cursor: 'pointer',
        fillOpacity: 0.8,
        stroke: '#58595B',
        lineWidth: 1,
        zIndex: 500
      },
      selected: {
        cursor: 'pointer',
        fillOpacity: 1,
        stroke: '#58595B',
        lineWidth: 1
      },
      selected_reverse: {
        fillOpacity: 0.3,
        lineWidth: 0.3
      }
    },
    style: {
      cornerRadius: 0,
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 1,
        x1: (datum, context) => {
          return context.vchart.getChart()._globalScale.getScale('gradientX1').scale(datum['30001']);
        },
        y1: (datum, context) => {
          return context.vchart.getChart()._globalScale.getScale('gradientY1').scale(datum['30001']);
        },
        stops: [
          {
            offset: 0,
            color: (datum, context) => {
              return context.vchart.getChart()._globalScale.getScale('gradientFillStop0').scale(datum['30001']);
            }
          },
          {
            offset: 1,
            color: (datum, context) => {
              return context.vchart.getChart()._globalScale.getScale('gradientFillStop1').scale(datum['30001']);
            }
          }
        ]
      },
      lineWidth: 2,
      stroke: {
        gradient: 'linear',
        x0: 0,
        y0: 1,
        x1: (datum, context) => {
          return context.vchart.getChart()._globalScale.getScale('gradientX1').scale(datum['30001']);
        },
        y1: (datum, context) => {
          return context.vchart.getChart()._globalScale.getScale('gradientY1').scale(datum['30001']);
        },
        stops: [
          {
            offset: 0,
            color: (datum, context) => {
              return context.vchart.getChart()._globalScale.getScale('gradientFillStop0').scale(datum['30001']);
            }
          },
          {
            offset: 1,
            color: (datum, context) => {
              return context.vchart.getChart()._globalScale.getScale('gradientFillStop1').scale(datum['30001']);
            }
          }
        ]
      }
    }
  },
  // component style
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
          stroke: '#FFFFFF',
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
          stroke: '#d5d7e2'
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
      paddingInner: 0.18,
      paddingOuter: 0.18,
      ticks: true
    },
    {
      type: 'linear',
      tick: {
        size: 4,
        visible: true,
        tickMode: 'd3',
        style: (...args) => {
          return {
            lineWidth: args[1] === 0 || args[1] === args[3].length - 1 ? 2 : 0,
            stroke: 'rgba(0,110,255,1)'
          };
        }
      },
      niceType: 'rough',
      zIndex: 200,
      grid: {
        visible: true,
        style: (...args) => {
          return {
            stroke: 'rgba(255,255,255,0.15)',
            lineWidth: 1,
            lineDash: args[1] === 0 || args[1] === 5 ? [] : [3, 3]
          };
        }
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
        tighten: false,
        formatMethod: text => text + '.00'
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
        top: 0
      },
      zero: true,
      nice: true,
      paddingInner: 0.18,
      paddingOuter: 0.18,
      maxWidth: 180,
      ticks: true
    },
    {
      type: 'linear',
      tick: {
        size: 4,
        visible: true,
        tickMode: 'd3',
        style: (...args) => {
          return {
            lineWidth: args[1] === 0 || args[1] === args[3].length - 1 ? 2 : 0,
            stroke: 'rgba(0,110,255,1)'
          };
        }
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
        top: 0
      },
      zero: true,
      nice: true,
      paddingInner: 0.18,
      paddingOuter: 0.18,
      maxWidth: 180,
      ticks: true
    }
  ],
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
            size: 12,
            fillOpacity: 1,
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
  tooltip: {
    visible: true,
    renderMode: 'canvas',
    mark: {
      visible: true,
      updateContent: (prev, datum, context) => {
        prev.forEach(p => {
          // p.shapeType = tooltipShape
          p.value = p.value + '.00';
        });
        return prev;
      }
    },
    style: {
      panel: {
        padding: {
          top: 5,
          bottom: 10,
          left: 10,
          right: 10
        },
        backgroundColor: 'rgba(8, 28, 48, 0.95)',
        border: {
          color: '#CFCFCF',
          width: 0,
          radius: 2
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
        fontSize: 14,
        fontColor: '#FFF',
        fontWeight: 'bold',
        fontFamily: 'D-DIN',
        align: 'left',
        lineHeight: 18
      },
      keyLabel: {
        fontSize: 12,
        fontColor: 'rgba(255,255,255,0.65)',
        fontWeight: 'normal',
        fontFamily: 'SourceHanSansCN-Normal',
        align: 'left',
        lineHeight: 18
      },
      valueLabel: {
        fontSize: 12,
        fontColor: '#FFF',
        fontWeight: 'normal',
        fontFamily: 'D-DIN',
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
      visible: true,
      updateContent: (prev, datum, context) => {
        prev.forEach(p => {
          // p.shapeType = tooltipShape
          p.value = p.value + '.00';
        });
        return prev;
      }
    }
  },
  crosshair: {
    xField: {
      visible: true,
      line: {
        type: 'rect',
        style: {
          fillOpacity: 1,
          fill: 'rgba(80,156,255,0.1)'
        }
      }
    },
    gridZIndex: 100,
    yField: {
      line: {
        style: {
          fillOpacity: 1,
          fill: 'rgba(80,156,255,0.1)'
        }
      },
      visible: false
    }
  },
  // origianl data
  data: [
    {
      id: 'data',
      values: [
        {
          10001: 'Sales',
          10002: 30,
          10003: 'Tn97A7q0XVDq',
          30001: '2023',
          HqlYadRdHJ5c: 'Labels',
          Tn97A7q0XVDq: 30,
          '7ti8XuX4kcY1': '2023'
        },
        {
          10001: 'Sales',
          10002: 24,
          10003: 'Tn97A7q0XVDq',
          30001: '2022',
          HqlYadRdHJ5c: 'Labels',
          Tn97A7q0XVDq: 24,
          '7ti8XuX4kcY1': '2022'
        },
        {
          10001: 'Sales',
          10002: 20,
          10003: 'Tn97A7q0XVDq',
          30001: '2023',
          HqlYadRdHJ5c: 'Tables',
          Tn97A7q0XVDq: 20,
          '7ti8XuX4kcY1': '2023'
        },
        {
          10001: 'Sales',
          10002: 10,
          10003: 'Tn97A7q0XVDq',
          30001: '2022',
          HqlYadRdHJ5c: 'Tables',
          Tn97A7q0XVDq: 10,
          '7ti8XuX4kcY1': '2022'
        },
        {
          10001: 'Sales',
          10002: 40,
          10003: 'Tn97A7q0XVDq',
          30001: '2023',
          HqlYadRdHJ5c: 'Storage',
          Tn97A7q0XVDq: 40,
          '7ti8XuX4kcY1': '2023'
        },
        {
          10001: 'Sales',
          10002: 20,
          10003: 'Tn97A7q0XVDq',
          30001: '2022',
          HqlYadRdHJ5c: 'Storage',
          Tn97A7q0XVDq: 20,
          '7ti8XuX4kcY1': '2022'
        },
        {
          10001: 'Sales',
          10002: 10,
          10003: 'Tn97A7q0XVDq',
          30001: '2023',
          HqlYadRdHJ5c: 'Furn',
          Tn97A7q0XVDq: 10,
          '7ti8XuX4kcY1': '2023'
        },
        {
          10001: 'Sales',
          10002: 10,
          10003: 'Tn97A7q0XVDq',
          30001: '2022',
          HqlYadRdHJ5c: 'Furn',
          Tn97A7q0XVDq: 10,
          '7ti8XuX4kcY1': '2022'
        },
        {
          10001: 'Sales',
          10002: 50,
          10003: 'Tn97A7q0XVDq',
          30001: '2023',
          HqlYadRdHJ5c: 'Art',
          Tn97A7q0XVDq: 50,
          '7ti8XuX4kcY1': '2023'
        },
        {
          10001: 'Sales',
          10002: 30,
          10003: 'Tn97A7q0XVDq',
          30001: '2022',
          HqlYadRdHJ5c: 'Art',
          Tn97A7q0XVDq: 30,
          '7ti8XuX4kcY1': '2022'
        }
      ],
      fields: {
        10001: {
          alias: '指标名称'
        },
        10002: {
          alias: '指标值'
        },
        30001: {
          alias: '图例项',
          domain: ['2023', '2022'],
          sortIndex: 0,
          lockStatisticsByDomain: true
        },
        HqlYadRdHJ5c: {
          alias: 'Product',
          domain: ['Labels', 'Labels', 'Tables', 'Tables', 'Storage', 'Storage', 'Furn', 'Furn', 'Art', 'Art'],
          sortIndex: 0,
          lockStatisticsByDomain: true
        },
        '7ti8XuX4kcY1': {
          alias: 'Year'
        },
        Tn97A7q0XVDq: {
          alias: 'Sales'
        }
      }
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[柱状图](link)
