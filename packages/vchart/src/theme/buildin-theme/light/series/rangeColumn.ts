import { minMaxPositionEnum, type IRangeColumnSeriesTheme } from '../../../../series/range-column/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const rangeColumn: IRangeColumnSeriesTheme = {
  fillOpacity: 1,
  strokeOpacity: 1,
  label: {
    visible: false,
    offset: 5,
    position: 'inside',
    style: {
      fill: '#ffffff',
      fontFamily,
      fontSize
    },
    minLabel: {
      position: minMaxPositionEnum.end
    },
    maxLabel: {
      position: minMaxPositionEnum.start
    }
  }
};
