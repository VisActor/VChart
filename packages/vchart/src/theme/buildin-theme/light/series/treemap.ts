import type { ITreemapSeriesTheme } from '../../../../series/treemap/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const treemap: ITreemapSeriesTheme = {
  fillOpacity: 1,
  strokeOpacity: 1,
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
      fontFamily: fontFamily,
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
      fontFamily: fontFamily,
      fontSize: fontSize,
      textBaseline: 'middle',
      textAlign: 'center'
    }
  }
};
