import type { IWaterfallSeriesTheme } from '../../../../series/waterfall/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const waterfall: IWaterfallSeriesTheme = {
  seriesFieldName: {
    total: 'total',
    increase: 'increase',
    decrease: 'decrease'
  },
  fillOpacity: 1,
  strokeOpacity: 1,
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
      fontFamily,
      fontSize
    }
  },
  label: {
    visible: false,
    offset: 12,
    position: 'inside',
    style: {
      fontFamily,
      fontSize
    }
  }
};
