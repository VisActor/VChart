import type { IWaterfallSeriesTheme } from '../../../../series/waterfall/interface';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;

export const waterfall: IWaterfallSeriesTheme = {
  seriesFieldName: {
    total: 'total',
    increase: 'increase',
    decrease: 'decrease'
  },
  leaderLine: {
    style: {
      stroke: 'black',
      lineWidth: 1,
      lineDash: [4, 4]
    }
  },
  stackLabel: {
    offset: 12,
    position: 'withChange',
    style: {
      fill: 'black',
      fontSize
    }
  },
  label: {
    visible: false,
    offset: 12,
    position: 'inside',
    style: {
      fontSize
    }
  }
};
