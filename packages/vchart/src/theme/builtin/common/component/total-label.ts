import type { ITotalLabelTheme } from '../../../../component/label';
import { THEME_CONSTANTS } from '../constants';

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
    fontSize: THEME_CONSTANTS.l4FontSize,
    // lineHeight: THEME_CONSTANTS.l4LineHeight,

    fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
  }
};
