import type { ITreemapSeriesTheme } from '../../../../series/treemap/interface';
import { THEME_CONSTANTS } from '../constants';

export const treemap: ITreemapSeriesTheme = {
  gapWidth: 1,
  nodePadding: [5],
  nonLeaf: {
    visible: false,
    style: {
      fillOpacity: 0.5
    }
  },
  label: {
    style: {
      fill: 'white',
      textBaseline: 'middle',
      textAlign: 'center',
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily
    }
  },
  nonLeafLabel: {
    style: {
      fill: 'black',
      stroke: 'white',
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      textBaseline: 'middle',
      textAlign: 'center'
    }
  }
};
