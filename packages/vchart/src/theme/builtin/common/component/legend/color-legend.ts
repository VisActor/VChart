import type { IColorLegendTheme, IContinuousLegendTheme } from '../../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from './continuous';

const handlerTheme: IContinuousLegendTheme['handler'] = {
  style: {
    symbolType: 'circle',
    lineWidth: 0,
    outerBorder: {
      lineWidth: 2,
      distance: 0.8,
      stroke: '#ffffff'
    },
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowColor: { type: 'palette', key: 'shadowColor' }
  }
};

export const colorLegend: IColorLegendTheme = {
  horizontal: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    rail: {
      width: 200,
      height: 8,
      style: {
        fill: { type: 'palette', key: 'sliderRailColor' }
      }
    },
    handler: handlerTheme
  },
  vertical: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    rail: {
      width: 8,
      height: 200,
      style: {
        fill: { type: 'palette', key: 'sliderRailColor' }
      }
    },
    handler: handlerTheme
  }
};
