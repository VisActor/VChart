import { minMaxPositionEnum, type IRangeColumnSeriesTheme } from '../../../../series/range-column/interface';
import { THEME_CONSTANTS } from '../constants';

export const rangeColumn: IRangeColumnSeriesTheme = {
  label: {
    visible: false,
    offset: 5,
    position: 'inside',
    style: {
      fill: { type: 'palette', key: 'backgroundColor' },
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    },
    minLabel: {
      position: minMaxPositionEnum.end
    },
    maxLabel: {
      position: minMaxPositionEnum.start
    }
  }
};
