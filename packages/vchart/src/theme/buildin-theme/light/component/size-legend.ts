import type { ISizeLegendTheme } from '../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from '../../config';

export const sizeLegend: ISizeLegendTheme = {
  horizontal: {
    sizeBackground: {
      fill: '#cdcdcd'
    },
    track: {
      style: {
        fill: 'rgba(20,20,20,0.1)'
      }
    },
    rail: {
      width: 200,
      height: 4,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    },
    ...DEFAULT_CONTINUOUS_LEGEND_THEME
  },
  vertical: {
    sizeBackground: {
      fill: '#cdcdcd'
    },
    track: {
      style: {
        fill: 'rgba(20,20,20,0.1)'
      }
    },
    rail: {
      width: 4,
      height: 200,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    },
    ...DEFAULT_CONTINUOUS_LEGEND_THEME
  }
};
