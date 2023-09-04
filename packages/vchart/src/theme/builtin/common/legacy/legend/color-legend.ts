import type { IColorLegendTheme, IContinuousLegendTheme } from '../../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from './continuous';

const handlerTheme: IContinuousLegendTheme['handler'] = {
  style: {
    symbolType: 'circle',
    lineWidth: 4,
    outerBorder: { distance: 2, lineWidth: 1, stroke: '#ccc' },
    size: 10,
    stroke: '#fff'
  }
};

export const colorLegend: IColorLegendTheme = {
  horizontal: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    rail: {
      width: 200,
      height: 8,
      style: {
        fill: 'rgba(0,0,0,0.04)'
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
        fill: 'rgba(0,0,0,0.04)'
      }
    },
    handler: handlerTheme
  }
};
