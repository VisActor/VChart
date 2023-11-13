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
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  },
  nonLeafLabel: {
    padding: THEME_CONSTANTS.l5FontSize * 2,
    style: {
      fill: 'black',
      // TODO: 完善类型
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      textBaseline: 'middle',
      textAlign: 'center'
    }
  }
};
