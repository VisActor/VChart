---
category: examples
group: theme
title: 主题注册、切换
order: 39-0
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/theme/theme-switch.png
option: commonChart#theme
---

# 主题注册、切换

## 代码演示

```javascript livedemo
const spec = {
  type: 'common',
  data: [
    {
      id: 'id0',
      values: [
        {
          time: '2:00',
          value: 8,
          type: 'Douyin'
        },
        {
          time: '4:00',
          value: 9,
          type: 'Douyin'
        },
        {
          time: '6:00',
          value: 11,
          type: 'Douyin'
        },
        {
          time: '8:00',
          value: 14,
          type: 'Douyin'
        },
        {
          time: '10:00',
          value: 16,
          type: 'Douyin'
        },
        {
          time: '12:00',
          value: 17,
          type: 'Douyin'
        },
        {
          time: '14:00',
          value: 17,
          type: 'Douyin'
        },
        {
          time: '16:00',
          value: 16,
          type: 'Douyin'
        },
        {
          time: '18:00',
          value: 15,
          type: 'Douyin'
        },

        {
          time: '2:00',
          value: 7,
          type: 'Bilibili'
        },
        {
          time: '4:00',
          value: 8,
          type: 'Bilibili'
        },
        {
          time: '6:00',
          value: 9,
          type: 'Bilibili'
        },
        {
          time: '8:00',
          value: 10,
          type: 'Bilibili'
        },
        {
          time: '10:00',
          value: 9,
          type: 'Bilibili'
        },
        {
          time: '12:00',
          value: 12,
          type: 'Bilibili'
        },
        {
          time: '14:00',
          value: 14,
          type: 'Bilibili'
        },
        {
          time: '16:00',
          value: 12,
          type: 'Bilibili'
        },
        {
          time: '18:00',
          value: 14,
          type: 'Bilibili'
        }
      ]
    },
    {
      id: 'id1',
      values: [
        {
          time: '2:00',
          value: 15,
          type: 'Total'
        },
        {
          time: '4:00',
          value: 17,
          type: 'Total'
        },
        {
          time: '6:00',
          value: 20,
          type: 'Total'
        },
        {
          time: '8:00',
          value: 24,
          type: 'Total'
        },
        {
          time: '10:00',
          value: 25,
          type: 'Total'
        },
        {
          time: '12:00',
          value: 29,
          type: 'Total'
        },
        {
          time: '14:00',
          value: 31,
          type: 'Total'
        },
        {
          time: '16:00',
          value: 28,
          type: 'Total'
        },
        {
          time: '18:00',
          value: 29,
          type: 'Total'
        }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      dataIndex: 0,
      xField: ['time', 'type'],
      yField: 'value',
      seriesField: 'type'
    },
    {
      type: 'line',
      dataIndex: 1,
      xField: 'time',
      yField: 'value',
      seriesField: 'type'
    }
  ],
  legends: {
    visible: true,
    orient: 'right'
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear'
    }
  ]
};

const fontFamily =
  // eslint-disable-next-line max-len
  'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol';

const getNewTheme = () => {
  /** 所有系列的主题 */
  const series = {
    scatter: {
      size: 10,
      shape: 'circle',
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        offset: 5,
        position: 'top',
        style: {
          lineWidth: 2,
          stroke: 'white',
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    line: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        position: 'top',
        offset: 5,
        style: {
          lineWidth: 2,
          stroke: 'white',
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    area: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      area: { style: { fillOpacity: 0.2 } },
      label: {
        visible: false,
        offset: 5,
        position: 'top',
        style: {
          stroke: 'white',
          lineWidth: 2,
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    bar: {
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        position: 'outside',
        offset: 5,
        style: {
          lineWidth: 2,
          stroke: 'white',
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    bar3d: {
      fillOpacity: 1,
      strokeOpacity: 1,
      bar3d: { style: { length: 3 } },
      label: {
        visible: false,
        style: {
          fontFamily: fontFamily,
          fontSize: 11,
          offset: 12,
          position: 'outside'
        }
      }
    },
    pie: {
      fillOpacity: 1,
      outerRadius: 0.6,
      label: {
        visible: false,
        position: 'outside',
        style: {
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    pie3d: {
      fillOpacity: 1,
      outerRadius: 0.6,
      pie3d: { style: { height: 10 } },
      label: {
        visible: false,
        position: 'outside',
        style: {
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    map: {
      defaultFillColor: '#f3f3f3',
      area: { style: { lineWidth: 0.5, strokeOpacity: 1, stroke: 'black' } },
      label: {
        interactive: false,
        style: {
          fontFamily: fontFamily,
          fontSize: 11,
          textBaseline: 'middle',
          fill: 'black',
          stroke: 'white'
        }
      }
    },
    radar: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      area: { style: { fillOpacity: 0.2 } },
      label: {
        visible: false,
        offset: 5,
        style: {
          lineWidth: 2,
          stroke: 'white',
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    dot: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      title: {
        style: { textAlign: 'left', textBaseline: 'middle', fontSize: 10 }
      },
      subTitle: {
        style: { textAlign: 'left', textBaseline: 'top', fontSize: 10 }
      }
    },
    link: { size: 10, fillOpacity: 1, strokeOpacity: 1 },
    wordCloud: {
      word: {
        padding: 1,
        style: { textAlign: 'center', textBaseline: 'alphabetic' }
      }
    },
    wordCloud3d: {
      word3d: {
        padding: 1,
        style: { textAlign: 'center', textBaseline: 'alphabetic' }
      }
    },
    funnel: {
      transform: { style: { fill: '#f5f5f5' } },
      label: {
        style: {
          fontFamily: 'sans-serif',
          fontSize: 11,
          fill: 'white',
          textBaseline: 'middle',
          lineWidth: 2
        }
      },
      outerLabel: {
        style: { fontFamily: 'sans-serif', fontSize: 11, fill: '#707070' },
        line: { style: { stroke: '#ddd' } }
      },
      transformLabel: {
        style: {
          fontFamily: 'sans-serif',
          fontSize: 11,
          fill: '#707070',
          textBaseline: 'middle'
        }
      }
    },
    funnel3d: {
      transform: { style: { fill: '#f5f5f5' } },
      label: {
        style: {
          fontFamily: 'sans-serif',
          fontSize: 11,
          fill: 'white',
          textBaseline: 'middle',
          lineWidth: 2
        }
      },
      outerLabel: {
        style: { fontFamily: 'sans-serif', fontSize: 11, fill: '#707070' },
        line: { style: { stroke: '#ddd' } }
      },
      transformLabel: {
        style: {
          fontFamily: 'sans-serif',
          fontSize: 11,
          fill: '#707070',
          textBaseline: 'middle'
        }
      }
    },
    linearProgress: {
      bandWidth: 30,
      track: { style: { fill: '#E7EBED', fillOpacity: 1 } }
    },
    circularProgress: { outerRadius: 0.8, innerRadius: 0.6 },
    waterfall: {
      seriesFieldName: {
        total: 'total',
        increase: 'increase',
        decrease: 'decrease'
      },
      fillOpacity: 1,
      strokeOpacity: 1,
      leaderLine: {
        style: { stroke: 'black', lineWidth: 1, lineDash: [4, 4] }
      },
      stackLabel: {
        offset: 12,
        position: 'withChange',
        style: {
          fill: 'black',
          fontFamily: fontFamily,
          fontSize: 11
        }
      },
      label: {
        visible: false,
        offset: 12,
        position: 'inside',
        style: {
          fontFamily: fontFamily,
          fontSize: 11
        }
      }
    },
    gauge: { outerRadius: 0.8, innerRadius: 0.6, padAngle: 0.02 },
    gaugePointer: {
      pointer: {
        type: 'path',
        width: 0.4,
        height: 0.4,
        style: {
          // eslint-disable-next-line max-len
          path: 'M-0.020059 -0.978425 C-0.018029 -0.9888053 -0.013378 -1 0 -1 C0.01342 -1 0.01812 -0.989146 0.0201 -0.978425 C0.02161 -0.9702819 0.0692 -0.459505 0.09486 -0.184807 C0.10298 -0.097849 0.1089 -0.034548 0.11047 -0.018339 C0.11698 0.04908 0.07373 0.11111 0.00002 0.11111 C-0.07369 0.11111 -0.117184 0.04991 -0.110423 -0.018339 C-0.103662 -0.086591 -0.022089 -0.9680447 -0.020059 -0.978425Z'
        }
      },
      pin: {
        width: 0.025,
        height: 0.025,
        style: {
          // eslint-disable-next-line max-len
          path: 'M1 0 C1 0.55228 0.55228 1 0 1 C-0.552285 1 -1 0.55228 -1 0 C-1 -0.552285 -0.552285 -1 0 -1 C0.55228 -1 1 -0.552285 1 0Z',
          fill: '#888'
        }
      },
      pinBackground: {
        width: 0.06,
        height: 0.06,
        style: {
          // eslint-disable-next-line max-len
          path: 'M1 0 C1 0.55228 0.55228 1 0 1 C-0.552285 1 -1 0.55228 -1 0 C-1 -0.552285 -0.552285 -1 0 -1 C0.55228 -1 1 -0.552285 1 0Z',
          fill: '#ddd'
        }
      }
    },
    treemap: {
      fillOpacity: 1,
      strokeOpacity: 1,
      gapWidth: 1,
      nodePadding: [5],
      nonLeaf: { visible: false, style: { fillOpacity: 0.5 } },
      label: {
        style: {
          fontFamily: fontFamily,
          fontSize: 11,
          fill: 'white',
          textBaseline: 'middle',
          textAlign: 'center'
        }
      },
      nonLeafLabel: {
        padding: 22,
        style: {
          fill: 'black',
          stroke: 'white',
          lineWidth: 2,
          fontFamily: fontFamily,
          fontSize: 11,
          textBaseline: 'middle',
          textAlign: 'center'
        }
      }
    },
    sunburst: {
      innerRadius: 0,
      outerRadius: 1,
      startAngle: -90,
      endAngle: 270,
      gap: 0,
      labelLayout: { align: 'center', offset: 0, rotate: 'radial' },
      sunburst: {
        style: { stroke: '#ffffff', fillOpacity: 1, cursor: 'pointer' }
      },
      label: { visible: true, style: { cursor: 'pointer', fill: '#000000' } }
    },
    rangeColumn: {
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        offset: 5,
        position: 'inside',
        style: {
          fill: '#ffffff',
          fontFamily: fontFamily,
          fontSize: 11
        },
        minLabel: { position: 'end' },
        maxLabel: { position: 'start' }
      }
    },
    circlePacking: {
      layoutPadding: 5,
      circlePacking: {
        visible: true,
        style: { cursor: 'pointer', stroke: '#ffffff' }
      },
      label: { visible: true, style: { cursor: 'pointer', fill: '#000000' } }
    },
    heatmap: {
      fillOpacity: 1,
      strokeOpacity: 1,
      cell: { style: { shape: 'square' } },
      cellBackground: { visible: false }
    }
  };

  /** 所有组件的主题 */
  const component = {
    discreteLegend: {
      title: {
        visible: false,
        padding: 0,
        textStyle: { fontSize: 12, fill: '#333333', fontWeight: 'normal' },
        space: 12
      },
      item: {
        visible: true,
        spaceCol: 10,
        spaceRow: 10,
        padding: { top: 2, bottom: 2, left: 2, right: 2 },
        background: {
          state: {
            selectedHover: { fill: 'gray', fillOpacity: 0.7 },
            unSelectedHover: { fill: 'gray', fillOpacity: 0.2 }
          }
        },
        shape: { space: 4, state: { unSelected: { fillOpacity: 0.5 } } },
        label: {
          space: 4,
          style: { fill: 'black', fontSize: 12 },
          state: { unSelected: { fillOpacity: 0.5 } }
        }
      },
      allowAllCanceled: false
    },
    colorLegend: {
      horizontal: {
        title: {
          visible: false,
          padding: 0,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(46, 47, 50, 1)'
          },
          space: 12
        },
        handler: { visible: true },
        rail: { width: 200, height: 8, style: { fill: 'rgba(0,0,0,0.04)' } }
      },
      vertical: {
        title: {
          visible: false,
          padding: 0,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(46, 47, 50, 1)'
          },
          space: 12
        },
        handler: { visible: true },
        rail: { width: 8, height: 200, style: { fill: 'rgba(0,0,0,0.04)' } }
      }
    },
    sizeLegend: {
      horizontal: {
        sizeBackground: { fill: '#cdcdcd' },
        track: { style: { fill: 'rgba(20,20,20,0.1)' } },
        rail: { width: 200, height: 4, style: { fill: 'rgba(0,0,0,0.04)' } },
        title: {
          visible: false,
          padding: 0,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(46, 47, 50, 1)'
          },
          space: 12
        },
        handler: { visible: true }
      },
      vertical: {
        sizeBackground: { fill: '#cdcdcd' },
        track: { style: { fill: 'rgba(20,20,20,0.1)' } },
        rail: { width: 4, height: 200, style: { fill: 'rgba(0,0,0,0.04)' } },
        title: {
          visible: false,
          padding: 0,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(46, 47, 50, 1)'
          },
          space: 12
        },
        handler: { visible: true }
      }
    },
    axis: {
      domainLine: {
        visible: true,
        style: { lineWidth: 1, stroke: '#dfdfdf', strokeOpacity: 1 }
      },
      grid: {
        visible: true,
        style: {
          lineWidth: 1,
          stroke: '#dfdfdf',
          strokeOpacity: 1,
          lineDash: [4, 4]
        }
      },
      subGrid: {
        visible: false,
        style: {
          lineWidth: 1,
          stroke: '#dfdfdf',
          strokeOpacity: 1,
          lineDash: [4, 4]
        }
      },
      tick: {
        visible: true,
        tickSize: 4,
        style: { lineWidth: 1, stroke: '#D8DCE3', strokeOpacity: 1 }
      },
      subTick: {
        visible: false,
        tickSize: 2,
        style: { lineWidth: 1, stroke: '#D8DCE3', strokeOpacity: 1 }
      },
      label: {
        visible: true,
        space: 4,
        style: {
          fontSize: 12,
          fill: '#6F6F6F',
          fontWeight: 'normal',
          fillOpacity: 1
        }
      },
      title: {
        space: 4,
        autoRotate: true,
        style: {
          fontSize: 12,
          fill: '#333333',
          fontWeight: 'normal',
          fillOpacity: 1
        }
      }
    },
    axisX: { grid: { visible: false } },
    axisY: {
      domainLine: { visible: true },
      tick: { visible: true },
      label: { space: 4 }
    },
    markLine: {
      line: { style: { lineDash: [3, 3], stroke: 'rgba(46, 47, 50)' } },
      startSymbol: {
        visible: false,
        symbolType: 'triangle',
        style: {
          stroke: null,
          lineWidth: 0,
          fill: 'rgba(46, 47, 50)',
          size: 10
        }
      },
      endSymbol: {
        visible: true,
        symbolType: 'triangle',
        style: {
          stroke: null,
          lineWidth: 0,
          fill: 'rgba(46, 47, 50)',
          size: 10
        }
      },
      label: {
        refY: 5,
        style: {
          fontSize: 14,
          fontWeight: 'normal',
          fontStyle: 'normal',
          fill: '#fff',
          stroke: '#fff',
          lineWidth: 0
        },
        labelBackground: {
          padding: { top: 2, bottom: 2, right: 4, left: 4 },
          style: { cornerRadius: 0, fill: 'rgb(48, 115, 242)' }
        }
      }
    },
    markArea: {
      area: { style: { fill: 'rgba(46, 47, 50, 0.1)' } },
      label: {
        style: {
          fontSize: 14,
          fontWeight: 'normal',
          fontStyle: 'normal',
          fill: '#fff',
          stroke: '#fff',
          lineWidth: 0
        },
        labelBackground: {
          padding: { top: 2, bottom: 2, right: 4, left: 4 },
          style: { cornerRadius: 0, fill: '#F68484' }
        }
      }
    },
    markPoint: {
      itemLine: {
        decorativeLine: { visible: false },
        startSymbol: {
          size: 5,
          visible: true,
          style: { fill: '#eee', stroke: '#eee' }
        },
        line: { style: { stroke: '#eee' } }
      },
      itemContent: { offsetY: -50 }
    },
    tooltip: {
      panel: {
        padding: { top: 10, left: 10, right: 10, bottom: 10 },
        backgroundColor: '#fff',
        border: { color: '#ffffff', width: 0, radius: 3 },
        shadow: {
          x: 0,
          y: 4,
          blur: 12,
          spread: 0,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      spaceRow: 6,
      titleLabel: {
        fontFamily: fontFamily,
        fontSize: 14,
        fontColor: '#4E5969',
        textAlign: 'left',
        lineHeight: 18,
        textBaseline: 'middle',
        spacing: 0
      },
      shape: { size: 8, spacing: 6 },
      keyLabel: {
        fontFamily: fontFamily,
        fontSize: 12,
        fontColor: '#4E5969',
        textAlign: 'left',
        lineHeight: 18,
        textBaseline: 'middle',
        spacing: 26
      },
      valueLabel: {
        fontFamily: fontFamily,
        fontSize: 12,
        fontColor: '#4E5969',
        lineHeight: 18,
        textBaseline: 'middle',
        spacing: 0
      }
    },
    dataZoom: {
      showDetail: 'auto',
      middleHandler: {
        visible: false,
        background: { size: 5, style: { stroke: '#D1D5DA', cornerRadius: 2 } },
        icon: {
          style: {
            size: 8,
            fill: 'white',
            stroke: '#D1D5DA',
            symbolType:
              // eslint-disable-next-line max-len
              'M 0.3 -0.5 C 0.41 -0.5 0.5 -0.41 0.5 -0.3 C 0.5 -0.3 0.5 0.3 0.5 0.3 C 0.5 0.41 0.41 0.5 0.3 0.5 C 0.3 0.5 -0.3 0.5 -0.3 0.5 C -0.41 0.5 -0.5 0.41 -0.5 0.3 C -0.5 0.3 -0.5 -0.3 -0.5 -0.3 C -0.5 -0.41 -0.41 -0.5 -0.3 -0.5 C -0.3 -0.5 0.3 -0.5 0.3 -0.5 Z',
            lineWidth: 0.5
          }
        }
      },
      background: {
        size: 20,
        style: { fill: '#F6F8FA', stroke: '#F6F8FA', lineWidth: 1 }
      },
      startHandler: {
        style: {
          symbolType:
            // eslint-disable-next-line max-len
            'M-651.40493822 1451.33576377m0-418.93088554l0-2094.65442779q0-418.93088556 418.93088555-418.93088733l418.93088556 0q418.93088556 0 418.93088553 418.93088733l0 2094.65442779q0 418.93088556-418.93088553 418.93088554l-418.93088556 0q-418.93088556 0-418.93088555-418.93088554Z M-546.67221684 1032.40487819a314.19816417 314.19816417 0 0 0 314.19816418 314.19816421l418.93088555 1e-8a314.19816417 314.19816417 0 0 0 314.19816418-314.19816418l-1e-8-2094.65442779a314.19816417 314.19816417 0 0 0-314.19816417-314.19816596l-418.93088556 0a314.19816417 314.19816417 0 0 0-314.19816417 314.19816596l0 2094.65442775m-104.73272138 4e-8l0-2094.65442779a418.93088556 418.93088556 0 0 1 418.93088555-418.93088733l418.93088556 0a418.93088556 418.93088556 0 0 1 418.93088553 418.93088733l0 2094.65442779a418.93088556 418.93088556 0 0 1-418.93088553 418.93088554l-418.93088556 0a418.93088556 418.93088556 0 0 1-418.93088555-418.93088554z M-232.47405266 404.00854987l-1e-8-837.86177109 104.73272138 0 0 837.86177109z M81.72411149 404.00854987l0-837.86177109 104.7327214 0 0 837.8617711z',
          fill: '#FFF',
          stroke: '#AEB8C6',
          lineWidth: 0.8
        }
      },
      endHandler: {
        style: {
          symbolType:
            // eslint-disable-next-line max-len
            'M-651.40493822 1451.33576377m0-418.93088554l0-2094.65442779q0-418.93088556 418.93088555-418.93088733l418.93088556 0q418.93088556 0 418.93088553 418.93088733l0 2094.65442779q0 418.93088556-418.93088553 418.93088554l-418.93088556 0q-418.93088556 0-418.93088555-418.93088554Z M-546.67221684 1032.40487819a314.19816417 314.19816417 0 0 0 314.19816418 314.19816421l418.93088555 1e-8a314.19816417 314.19816417 0 0 0 314.19816418-314.19816418l-1e-8-2094.65442779a314.19816417 314.19816417 0 0 0-314.19816417-314.19816596l-418.93088556 0a314.19816417 314.19816417 0 0 0-314.19816417 314.19816596l0 2094.65442775m-104.73272138 4e-8l0-2094.65442779a418.93088556 418.93088556 0 0 1 418.93088555-418.93088733l418.93088556 0a418.93088556 418.93088556 0 0 1 418.93088553 418.93088733l0 2094.65442779a418.93088556 418.93088556 0 0 1-418.93088553 418.93088554l-418.93088556 0a418.93088556 418.93088556 0 0 1-418.93088555-418.93088554z M-232.47405266 404.00854987l-1e-8-837.86177109 104.73272138 0 0 837.86177109z M81.72411149 404.00854987l0-837.86177109 104.7327214 0 0 837.8617711z',
          fill: '#FFF',
          stroke: '#AEB8C6',
          lineWidth: 0.8
        }
      },
      startText: { padding: 8, style: { fontSize: 10, fill: '#6F6F6F' } },
      endText: { padding: 8, style: { fontSize: 10, fill: '#6F6F6F' } },
      selectedBackground: { style: { fill: '#E1E4E8', fillOpacity: 0.5 } },
      dragMask: { style: { fill: '#E1E4E8', fillOpacity: 0.2 } },
      backgroundChart: {
        area: { style: { lineWidth: 1, fill: '#D1D5DA' } },
        line: { style: { stroke: '#D1D5DA', lineWidth: 1 } }
      },
      selectedBackgroundChart: {
        area: { style: { lineWidth: 1, fill: '#D1D5DA' } },
        line: { style: { stroke: '#D1D5DA', lineWidth: 1 } }
      }
    },
    crosshair: {
      xField: {
        visible: false,
        line: {
          type: 'rect',
          visible: true,
          style: { fill: '#b2bacf', opacity: 0.2, lineDash: [] }
        },
        label: {
          visible: true,
          style: {
            fontFamily: fontFamily,
            fontWeight: 'normal',
            fill: '#fff',
            fontSize: 12
          },
          labelBackground: {
            padding: { bottom: 2, top: 2, left: 4, right: 4 },
            style: { fill: 'rgba(47, 59, 82, 0.9)', cornerRadius: 4 }
          }
        }
      },
      yField: {
        visible: false,
        line: {
          type: 'line',
          visible: true,
          style: { stroke: '#b2bacf', opacity: 0.2, lineDash: [] }
        },
        label: {
          visible: true,
          style: {
            fontFamily: fontFamily,
            fontWeight: 'normal',
            fill: '#fff',
            fontSize: 12
          },
          labelBackground: {
            padding: { bottom: 2, top: 2, left: 4, right: 4 },
            style: { fill: 'rgba(47, 59, 82, 0.9)', cornerRadius: 4 }
          }
        }
      },
      categoryField: {
        visible: false,
        line: {
          type: 'line',
          visible: true,
          style: { stroke: '#b2bacf', opacity: 0.2, lineDash: [] }
        },
        label: {
          visible: true,
          style: {
            fontFamily: fontFamily,
            fontWeight: 'normal',
            fill: '#fff',
            fontSize: 12
          },
          labelBackground: {
            padding: { bottom: 2, top: 2, left: 4, right: 4 },
            style: { fill: 'rgba(47, 59, 82, 0.9)', cornerRadius: 4 }
          }
        }
      },
      valueField: {
        visible: false,
        line: {
          type: 'line',
          visible: true,
          style: { stroke: '#b2bacf', opacity: 0.2, lineDash: [] }
        },
        label: {
          visible: true,
          style: {
            fontFamily: fontFamily,
            fontWeight: 'normal',
            fill: '#fff',
            fontSize: 12
          },
          labelBackground: {
            padding: { bottom: 2, top: 2, left: 4, right: 4 },
            style: { fill: 'rgba(47, 59, 82, 0.9)', cornerRadius: 4 }
          }
        }
      }
    },
    player: {
      visible: true,
      position: 'start',
      slider: {
        space: 10,
        trackStyle: { fill: '#63B5FC' },
        railStyle: {},
        handlerStyle: { stroke: '#63B5FC' }
      },
      controller: {
        start: { order: 0, space: 0, style: { size: 20, fill: '#63B5FC' } },
        pause: { order: 0, space: 0, style: { size: 20, fill: '#63B5FC' } },
        backward: {
          order: 0,
          space: 10,
          position: 'start',
          style: { size: 20, fill: '#63B5FC' }
        },
        forward: {
          order: 0,
          space: 10,
          position: 'end',
          style: { size: 20, fill: '#63B5FC' }
        }
      }
    }
  };

  const theme = {
    name: 'A',
    padding: 12,
    colorScheme: {
      default: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    },
    component,
    series
  };

  return theme;
};

// 注册主题
VChart.ThemeManager.registerTheme('user', getNewTheme());

// 设置默认主题
VChart.ThemeManager.setCurrentTheme('user');

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// 切换主题
setInterval(() => {
  if (vchart.getCurrentThemeName() === 'light') {
    vchart.setCurrentTheme('user');
  } else {
    vchart.setCurrentTheme('light');
  }
}, 2000);

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[主题](link)
