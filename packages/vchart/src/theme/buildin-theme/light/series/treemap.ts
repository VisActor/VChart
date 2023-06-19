import type { ITreemapSeriesTheme } from '../../../../series/treemap/interface';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;

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
      fontSize: fontSize,
      fill: 'white',
      textBaseline: 'middle',
      textAlign: 'center'
    }
  },
  nonLeafLabel: {
    padding: fontSize * 2,
    style: {
      fill: 'black',
      stroke: 'white',
      lineWidth: 2,
      fontSize: fontSize,
      textBaseline: 'middle',
      textAlign: 'center'
    }
  }
};
