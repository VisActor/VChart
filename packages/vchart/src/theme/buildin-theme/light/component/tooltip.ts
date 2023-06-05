import type { ITooltipTheme } from '../../../../component/tooltip/interface';
import { DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const tooltip: ITooltipTheme = {
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
    fontFamily,
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
    fontFamily,
    fontSize: 12,
    fontColor: '#4E5969',
    textAlign: 'left',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 26
  },
  valueLabel: {
    fontFamily,
    fontSize: 12,
    fontColor: '#4E5969',
    lineHeight: 18,
    textBaseline: 'middle',
    spacing: 0
  }
};
