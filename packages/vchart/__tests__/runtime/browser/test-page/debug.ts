import type { IDataZoom } from '../../../../src/component/data-zoom';
import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  const spec = {
    type: 'scatter',
    axes: [
      {
        orient: 'left',
        type: 'linear',
        grid: {
          visible: false
        },
        domainLine: {
          visible: true
        },
        max: 0.1,
        min: 0,
        label: {},
        id: 'yAxis'
      },
      {
        orient: 'bottom',
        type: 'linear',
        grid: {
          visible: false
        },
        domainLine: {
          visible: true
        },
        max: 0.01,
        min: 0,
        label: {}
      }
    ],
    markArea: [
      {
        x: '50%',
        y: '0%',
        x1: '100%',
        y1: '50%',
        area: {
          style: {
            fill: 'transparent',
            stroke: '#E6E8F2'
          }
        }
      },
      {
        x: '0%',
        y: '0%',
        x1: '50%',
        y1: '50%',
        area: {
          style: {
            fill: 'rgba(255, 187, 51, 0.7)',
            stroke: '#E6E8F2'
          }
        }
      },
      {
        x: '0%',
        y: '50%',
        x1: '50%',
        y1: '100%',
        area: {
          style: {
            fill: 'transparent',
            stroke: '#E6E8F2'
          }
        }
      },
      {
        x: '50%',
        y: '50%',
        x1: '100%',
        y1: '100%',
        area: {
          style: {
            fill: 'rgba(64, 113, 255, 0.7)',
            stroke: '#E6E8F2'
          }
        }
      }
    ],
    markLine: [
      {
        x: '0%',
        y: '100%',
        x1: '100%',
        y1: '0%',
        line: {
          style: {
            lineDash: [0],
            stroke: '#E6E8F2'
          }
        },
        endSymbol: {
          visible: false
        },
        zIndex: 0
      }
    ],
    extensionMark: [
      {
        type: 'text',
        style: {
          fontSize: 20,
          fill: '#1F2129',
          textBaseline: 'top',
          zIndex: 1,
          y: 12,
          textAlign: 'end',
          text: '第一象限'
        }
      },
      {
        type: 'text',
        style: {
          fontSize: 20,
          fill: '#1F2129',
          textBaseline: 'top',
          zIndex: 1,
          x: 8,
          y: 12,
          textAlign: 'start',
          text: '第二象限'
        }
      },
      {
        type: 'text',
        style: {
          fontSize: 20,
          fill: '#1F2129',
          textBaseline: 'bottom',
          zIndex: 1,
          x: 8,
          textAlign: 'start',
          text: '第三象限'
        }
      },
      {
        type: 'text',
        style: {
          fontSize: 20,
          fill: '#1F2129',
          textBaseline: 'bottom',
          zIndex: 1,
          textAlign: 'end',
          text: '第四象限'
        }
      }
    ],
    padding: [0, 30, 30, 30],
    data: {
      values: []
    },
    color: ['#FF995A'],
    xField: 'x_rate',
    yField: 'y_rate',
    size: 48,
    seriesField: 'type',
    point: {
      state: {
        hover: {
          scaleX: 1.2,
          scaleY: 1.2,
          fillOpacity: 1,
          cursor: 'pointer',
          zIndex: 99
        }
      },
      style: {
        fillOpacity: 0.8,
        zIndex: 3
      }
    },
    legends: [
      {
        visible: true,
        orient: 'top',
        position: 'middle'
      }
    ],
    dataZoom: [
      {
        filterMode: 'axis',
        orient: 'bottom',
        start: 0,
        end: 1,
        id: 'xDataZoom',
        offsetY: 20,
        showDetail: false
      },
      {
        filterMode: 'axis',
        orient: 'right',
        axisId: 'yAxis',
        offsetX: 20,
        start: 0,
        end: 1,
        id: 'yDataZoom',
        showDetail: false
      }
    ],
    brush: {
      visible: false,
      brushType: 'rect',
      inBrush: {
        colorAlpha: 1
      },
      outOfBrush: {
        colorAlpha: 0.2
      }
    },
    tooltip: {
      activeType: 'mark',
      mark: {
        title: {},
        content: [
          {
            key: '线索用户覆盖度'
          },
          {
            key: '深度兴趣用户覆盖度'
          },
          {
            key: '有效阅读线索用户数',
            visible: false
          }
        ]
      }
    },
    label: {
      position: 'center',
      visible: true,
      style: {
        fontSize: 10,
        fill: '#fff',
        strokeOpacity: 0,
        zIndex: 1
      },
      overlap: false
    },
    animation: false
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
};
run();
