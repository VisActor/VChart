import type { ITotalLabelTheme } from '../../../../component/label';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;
const fontFamily = THEME_CONSTANTS.FONT_FAMILY;

export const totalLabel: ITotalLabelTheme = {
  visible: false,
  offset: 5,
  overlap: {
    clampForce: true,
    strategy: []
  },
  smartInvert: false,
  animation: false,
  style: {
    fontSize,
    fontFamily,
    fill: { type: 'palette', key: 'primaryFontColor' }
  }
};
