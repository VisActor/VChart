import type { IDataZoomTheme } from '../../../../component/data-zoom';

export const dataZoom: IDataZoomTheme = {
  padding: [12, 0],
  showDetail: 'auto',
  brushSelect: false,
  middleHandler: {
    visible: false,
    background: {
      size: 6,
      style: {
        stroke: { type: 'palette', key: 'dataZoomHandlerStrokeColor' },
        cornerRadius: 2
      }
    },
    icon: {
      style: {
        size: 4,
        fill: { type: 'palette', key: 'dataZoomHandlerFillColor' },
        stroke: { type: 'palette', key: 'dataZoomHandlerStrokeColor' },
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
      fill: { type: 'palette', key: 'dataZoomBackgroundColor' },
      lineWidth: 0
    }
  },
  selectedBackground: {
    style: {
      lineWidth: 0
    }
  },
  startHandler: {
    style: {
      symbolType: `M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3
      C-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
      C-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
      C0.3-1.4,0.3-1.4,0.3-1.4z`,
      fill: { type: 'palette', key: 'dataZoomHandlerFillColor' },
      scaleX: 1.2,
      scaleY: 1.2,
      stroke: { type: 'palette', key: 'dataZoomHandlerStrokeColor' },
      lineWidth: 1
    }
  },
  endHandler: {
    style: {
      symbolType: `M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3
      C-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
      C-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
      C0.3-1.4,0.3-1.4,0.3-1.4z`,
      fill: { type: 'palette', key: 'dataZoomHandlerFillColor' },
      scaleX: 1.2,
      scaleY: 1.2,
      stroke: { type: 'palette', key: 'dataZoomHandlerStrokeColor' },
      lineWidth: 1
    }
  },
  startText: {
    padding: 8,
    style: {
      fontSize: 10,
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  },
  endText: {
    padding: 8,
    style: {
      fontSize: 10,
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  },
  dragMask: {
    style: {
      fill: { type: 'palette', key: 'dataZoomSelectedColor', a: 0.1 },
      stroke: { type: 'palette', key: 'dataZoomSelectedColor', a: 0.2 },
      lineWidth: 3
    }
  },
  backgroundChart: {
    area: {
      style: {
        stroke: false,
        fill: { type: 'palette', key: 'dataZoomChartColor' }
      }
    },
    line: {
      style: {
        stroke: { type: 'palette', key: 'dataZoomChartColor' },
        lineWidth: 1
      }
    }
  },
  selectedBackgroundChart: {
    area: {
      style: {
        stroke: false,
        fill: { type: 'palette', key: 'dataZoomChartColor' }
      }
    },
    line: {
      style: {
        stroke: { type: 'palette', key: 'dataZoomChartColor' },
        lineWidth: 1
      }
    }
  }
};
