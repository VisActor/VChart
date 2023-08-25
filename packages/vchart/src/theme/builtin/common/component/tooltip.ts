import type { ITooltipTheme } from '../../../../component/tooltip/interface';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;

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
    backgroundColor: { type: 'palette', key: 'tooltipBackgroundColor' },
    border: {
      color: { type: 'palette', key: 'tooltipBackgroundColor' },
      width: 0,
      radius: 3
    },
    shadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: { type: 'palette', key: 'tooltipShadowColor', a: 0.1 }
    }
  },
  spaceRow: 6,
  titleLabel: {
    fontSize: 14,
    fontColor: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] },
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 0
  },
  shape: {
    size: 8,
    spacing: 6
  },
  keyLabel: {
    fontSize,
    fontColor: { type: 'palette', key: 'secondaryFontColor' },
    textAlign: 'left',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 26
  },
  valueLabel: {
    fontSize,
    fontColor: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] },
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 0
  }
};
