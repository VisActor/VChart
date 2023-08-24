import type { IColorLegendTheme } from '../../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from './continuous';

export const colorLegend: IColorLegendTheme = {
  horizontal: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    rail: {
      width: 200,
      height: 8,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    }
  },
  vertical: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
    rail: {
      width: 8,
      height: 200,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    }
  }
};
