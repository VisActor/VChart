import type { OrientType } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { getSizeHandlerPath } from '@visactor/vrender-components';
import type { IContinuousLegendTheme, ISizeLegendTheme } from '../../../../../component/legend';
import { DEFAULT_CONTINUOUS_LEGEND_THEME } from './continuous';

const getHandlerTheme = (align?: OrientType): IContinuousLegendTheme['handler'] => ({
  style: {
    symbolType: getSizeHandlerPath(align),
    fill: '#fff',
    lineWidth: 1,
    size: 10,
    stroke: '#ccc',
    outerBorder: false
  }
});

export const sizeLegend: ISizeLegendTheme = {
  horizontal: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
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
    handler: getHandlerTheme('top')
  },
  vertical: {
    ...DEFAULT_CONTINUOUS_LEGEND_THEME,
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
    handler: getHandlerTheme('right')
  }
};
