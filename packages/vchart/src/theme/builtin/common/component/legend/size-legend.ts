import type { IContinuousLegendTheme, ISizeLegendTheme } from '../../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from './continuous';

const handlerTheme: IContinuousLegendTheme['handler'] = {
  style: {
    symbolType: 'circle',
    lineWidth: 0,
    outerBorder: {
      lineWidth: 2,
      distance: 0.8,
      stroke: { type: 'palette', key: 'dataZoomSelectedColor' }
    },
    fill: { type: 'palette', key: 'dataZoomHandlerFillColor' }
    /*
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowColor: { type: 'palette', key: 'shadowColor', a: 0.3 }
    */
  }
};

export const sizeLegend: ISizeLegendTheme = {
  horizontal: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    sizeBackground: {
      fill: { type: 'palette', key: 'dataZoomChartColor' }
    },
    track: {
      style: {
        fill: { type: 'palette', key: 'dataZoomSelectedColor', a: 0.8 }
      }
    },
    rail: {
      width: 200,
      height: 4,
      style: {
        fill: { type: 'palette', key: 'dataZoomBackgroundColor' }
      }
    },
    handler: handlerTheme
  },
  vertical: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    sizeBackground: {
      fill: { type: 'palette', key: 'dataZoomChartColor' }
    },
    track: {
      style: {
        fill: { type: 'palette', key: 'dataZoomSelectedColor', a: 0.8 }
      }
    },
    rail: {
      width: 4,
      height: 200,
      style: {
        fill: { type: 'palette', key: 'dataZoomBackgroundColor' }
      }
    },
    handler: handlerTheme
  }
};
