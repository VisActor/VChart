import type { ITooltipTheme } from '../../../../component/tooltip/interface';
import { THEME_CONSTANTS } from '../constants';

export const tooltip: ITooltipTheme = {
  offset: {
    x: 10,
    y: 10
  },
  panel: {
    padding: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10
    },
    backgroundColor: { type: 'palette', key: 'popupBackgroundColor' },
    border: {
      color: { type: 'palette', key: 'popupBackgroundColor' },
      width: 0,
      radius: 3
    },
    shadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: { type: 'palette', key: 'shadowColor' }
    }
  },
  spaceRow: 6,
  titleLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,

    fontColor: { type: 'palette', key: 'primaryFontColor' },
    fontWeight: 'bold',
    textAlign: 'left',
    textBaseline: 'middle',
    spacing: 0
  },
  shape: {
    size: 8,
    spacing: 6
  },
  keyLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,

    fontColor: { type: 'palette', key: 'secondaryFontColor' },
    textAlign: 'left',
    textBaseline: 'middle',
    spacing: 26
  },
  valueLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,

    fontColor: { type: 'palette', key: 'primaryFontColor' },
    fontWeight: 'bold',
    textBaseline: 'middle',
    spacing: 0
  }
};
