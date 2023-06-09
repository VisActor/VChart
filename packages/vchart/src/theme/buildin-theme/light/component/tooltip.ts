import type { ITooltipTheme } from '../../../../component/tooltip/interface';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;

export const tooltip: ITooltipTheme = {
  maxWidth: 440,
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
    backgroundColor: '#fff',
    border: {
      color: '#ffffff',
      width: 0,
      radius: 3
    },
    shadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.1)'
    }
  },
  spaceRow: 6,
  titleLabel: {
    fontSize: 14,
    fontColor: '#4E5969',
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
    fontColor: '#4E5969',
    textAlign: 'left',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 26
  },
  valueLabel: {
    fontSize,
    fontColor: '#4E5969',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 0
  }
};
