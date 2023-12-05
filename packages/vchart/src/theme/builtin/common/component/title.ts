import type { ITitleTheme } from '../../../../component/title/interface';
import { THEME_CONSTANTS } from '../constants';

export const title: ITitleTheme = {
  padding: {
    top: 4,
    bottom: 20
  },
  textStyle: {
    fontSize: THEME_CONSTANTS.l3FontSize,
    lineHeight: THEME_CONSTANTS.l3LineHeight as any, // FIXME: vrender 支持行高字符串后删除 any

    fill: { type: 'palette', key: 'primaryFontColor' }
  },
  subtextStyle: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight as any, // FIXME: vrender 支持行高字符串后删除 any

    fill: { type: 'palette', key: 'tertiaryFontColor' }
  }
};
