import type { IDataZoomTheme } from '../../../../component/data-zoom';
import { THEME_CONSTANTS } from '../constants';

// eslint-disable-next-line max-len
const DataZoomHandlerSymbolType = `M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3
C-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
C-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6
C0.3-1.4,0.3-1.4,0.3-1.4z;`;

export const dataZoom: IDataZoomTheme = {
  padding: [12, 0],
  showDetail: 'auto',
  brushSelect: false,
  middleHandler: {
    visible: false,
    background: {
      size: 6,
      style: {
        stroke: { type: 'palette', key: 'dataZoomHandleStrokeColor' },
        cornerRadius: 2
      }
    },
    icon: {
      style: {
        size: 4,
        fill: { type: 'palette', key: 'sliderHandleColor' },
        stroke: { type: 'palette', key: 'dataZoomHandleStrokeColor' },
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
      fill: { type: 'palette', key: 'sliderRailColor' },
      lineWidth: 0
    }
  },
  selectedBackground: {
    style: {
      fill: { type: 'palette', key: 'sliderTrackColor' },
      fillOpacity: 0.1,
      outerBorder: {
        stroke: { type: 'palette', key: 'sliderTrackColor' },
        strokeOpacity: 0.2,
        distance: -0.5,
        lineWidth: 1
      }
    }
  },
  selectedBackgroundChart: {
    area: {
      style: {
        visible: false,
        stroke: false,
        fill: { type: 'palette', key: 'dataZoomChartColor' }
      }
    },
    line: {
      style: {
        visible: false,
        stroke: { type: 'palette', key: 'dataZoomChartColor' },
        lineWidth: 1
      }
    }
  },
  startHandler: {
    style: {
      symbolType: DataZoomHandlerSymbolType,
      fill: { type: 'palette', key: 'sliderHandleColor' },
      scaleX: 1.2,
      scaleY: 1.2,
      stroke: { type: 'palette', key: 'dataZoomHandleStrokeColor' },
      lineWidth: 1,
      zIndex: 100
    }
  },
  endHandler: {
    style: {
      symbolType: DataZoomHandlerSymbolType,
      fill: { type: 'palette', key: 'sliderHandleColor' },
      scaleX: 1.2,
      scaleY: 1.2,
      stroke: { type: 'palette', key: 'dataZoomHandleStrokeColor' },
      lineWidth: 1,
      zIndex: 100
    }
  },
  startText: {
    padding: 8,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,

      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    }
  },
  endText: {
    padding: 8,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,

      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
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
  }
};
