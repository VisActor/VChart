/**
 * 主题的命名，不要使用类似 arco，default 等字段，应该要以主题的特征来，颜色/场景特征（light,dark）
 *
 * 1. 对除了 color 外的一些主题设置，应该要有专门的设计，**不要直接复制**
 * 2. 原则上来讲，默认值尽量都放主题中，但是也可根据情况自行判断
 * 3. 目前主题只到系列，不到系列的 mark，对于这个分界没有太清楚，后续根据需求再做开放
 */
import { DEFAULT_TEXT_FONT_FAMILY as fontFamily, DEFAULT_TEXT_FONT_SIZE as fontSize } from './config';
import type { ITheme } from '../interface';

export const darkTheme: ITheme = {
  name: 'dark',
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  },
  discreteLegend: {
    title: {
      visible: false,
      style: {
        fontSize: 12,
        fill: '#fff'
      },
      space: 12
    },
    item: {
      visible: true,
      spaceCol: 10,
      spaceRow: 10,
      padding: {
        top: 2,
        bottom: 2,
        left: 2,
        right: 2
      },
      background: {
        style: {
          fillOpacity: 0
        },
        state: {
          selectedHover: {
            fillOpacity: 0.7
          },
          unSelectedHover: {
            fillOpacity: 0.2
          }
        }
      },
      shape: {
        // visible: true,
        space: 4,
        state: {
          unSelected: {
            fillOpacity: 0.5
          }
        }
      },
      label: {
        // visible: true,
        space: 4,
        style: {
          fontSize: 12
        },
        state: {
          unSelected: {
            fillOpacity: 0.5
          }
        }
      }
    }
  },
  markLine: {
    line: {
      style: {
        lineDash: [3, 3],
        lineWidth: 2,
        stroke: 'rgba(46, 47, 50)'
      }
    },
    startSymbol: {
      visible: false,
      symbolType: 'triangle',
      refAngle: Math.PI / 2,
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
      refAngle: Math.PI / 2,
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
        fontFamily: '',
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: 'rgba(46, 47, 50)',
        stroke: 'rgba(46, 47, 50)',
        lineWidth: 0
      },
      labelBackground: {
        padding: {
          top: 2,
          bottom: 2,
          right: 4,
          left: 4
        },
        style: {
          cornerRadius: 0,
          fill: '#555655'
        }
      }
    }
  },
  markArea: {
    area: {
      style: {
        fill: 'rgba(46, 47, 50, 0.1)'
      }
    },
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
        padding: {
          top: 2,
          bottom: 2,
          right: 4,
          left: 4
        },
        style: {
          cornerRadius: 0,
          fill: '#F68484'
        }
      }
    }
  },
  series: {
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
          fontFamily,
          fontSize
        }
      }
    },
    line: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        offset: 5,
        position: 'top',
        style: {
          fontFamily,
          fontSize,
          lineWidth: 2,
          stroke: 'white'
        }
      }
    },
    area: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        offset: 5,
        position: 'top',
        style: {
          fontFamily,
          fontSize,
          lineWidth: 2,
          stroke: 'white'
        }
      }
    },
    bar: {
      fillOpacity: 1,
      strokeOpacity: 1,
      label: {
        visible: false,
        offset: 5,
        position: 'outside',
        style: {
          lineWidth: 2,
          stroke: 'white',
          fontFamily,
          fontSize
        }
      }
    },
    bar3d: {
      fillOpacity: 1,
      strokeOpacity: 1,
      bar3d: {
        style: {
          height: 3
        }
      },
      label: {
        visible: false,
        style: {
          fontFamily,
          fontSize,
          offset: 12,
          position: 'outside'
        }
      }
    },
    pie: {
      fillOpacity: 1,
      label: {
        visible: false,
        position: 'outside',
        style: {
          fontFamily,
          fontSize
        }
      }
    },
    pie3d: {
      fillOpacity: 1,
      pie3d: {
        style: {
          height: 10
        }
      },
      label: {
        visible: false,
        position: 'outside',
        style: {
          fontFamily,
          fontSize
        }
      }
    },
    map: {
      defaultFillColor: '#f3f3f3',
      area: {
        style: {
          lineWidth: 0.5,
          stroke: 'black'
        }
      },
      label: {
        interactive: false,
        style: {
          fontFamily,
          fontSize,
          textBaseline: 'middle',
          fill: 'black',
          stroke: 'white'
        }
      }
    },
    dot: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      title: {
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          fontSize: 10
        }
      },
      subTitle: {
        style: {
          textAlign: 'left',
          textBaseline: 'top',
          fontSize: 10
        }
      }
    },
    link: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1
    },
    wordCloud: {
      word: {
        padding: 1,
        style: {
          textAlign: 'center',
          textBaseline: 'alphabetic'
        }
      }
    },
    wordCloud3d: {
      word3d: {
        padding: 1,
        style: {
          textAlign: 'center',
          textBaseline: 'alphabetic'
        }
      }
    },
    radar: {
      size: 10,
      fillOpacity: 1,
      strokeOpacity: 1,
      area: {
        style: {
          fillOpacity: 0.2
        }
      },
      label: {
        visible: false,
        offset: 5,
        style: {
          fontFamily,
          fontSize
        }
      }
    },
    waterfall: {
      seriesFieldName: {
        total: 'total',
        increase: 'increase',
        decrease: 'decrease'
      },
      fillOpacity: 1,
      strokeOpacity: 1,
      leaderLine: {
        style: {
          stroke: 'black',
          lineWidth: 1,
          lineDash: [4, 4]
        }
      },
      stackLabel: {
        offset: 5,
        position: 'withChange',
        style: {
          fill: 'black',
          fontFamily,
          fontSize
        }
      },
      label: {
        visible: false,
        offset: 5,
        position: 'inside',
        style: {
          fontFamily,
          fontSize
        }
      }
    }
  },
  dataZoom: {
    showDetail: 'auto',
    middleHandler: {
      visible: false,
      background: {
        size: 5,
        style: {
          // fill: 'white',
          stroke: '#D1D5DA',
          cornerRadius: 2
        }
      },
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
      style: {
        fill: '#F6F8FA',
        stroke: '#F6F8FA',
        lineWidth: 1
      }
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
    startText: {
      padding: 4,
      style: {
        fontSize: 10,
        fill: '#6F6F6F'
      }
    },
    endText: {
      padding: 4,
      style: {
        fontSize: 10,
        fill: '#6F6F6F'
      }
    },
    selectedBackground: {
      style: {
        fill: '#E1E4E8',
        fillOpacity: 0.5
      }
    },
    dragMask: {
      style: {
        fill: '#E1E4E8',
        fillOpacity: 0.2
      }
    },
    backgroundChart: {
      area: {
        style: {
          lineWidth: 1,
          fill: '#D1D5DA'
        }
      },
      line: {
        style: {
          stroke: '#D1D5DA',
          lineWidth: 1
        }
      }
    },
    selectedBackgroundChart: {
      area: {
        style: {
          lineWidth: 1,
          fill: '#D1D5DA'
        }
      },
      line: {
        style: {
          stroke: '#D1D5DA',
          lineWidth: 1
        }
      }
    }
  }
};
