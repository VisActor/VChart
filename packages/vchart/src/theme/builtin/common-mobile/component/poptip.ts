import type { IPoptipTheme } from '../../../../component/poptip/interface';
import { THEME_CONSTANTS } from '../constants';

export const poptip: IPoptipTheme = {
  visible: true,
  position: 'auto',
  padding: 8,
  titleStyle: {
    fontSize: THEME_CONSTANTS.l5FontSize
    // lineHeight: THEME_CONSTANTS.l5LineHeight, // FIXME: vrender 支持行高字符串后取消注释
  },
  contentStyle: {
    fontSize: THEME_CONSTANTS.l5FontSize
    // lineHeight: THEME_CONSTANTS.l5LineHeight, // FIXME: vrender 支持行高字符串后取消注释
  },
  panel: {
    visible: true,
    size: 0,
    space: 12
  }
};
