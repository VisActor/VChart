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
      textAlign: 'center'
    }
  },
  nonLeafLabel: {
    padding: THEME_CONSTANTS.l4FontSize * 2,
    style: {
      fill: 'black',
      stroke: 'white',
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      textBaseline: 'middle',
      textAlign: 'center'
    }
  }
};
