import type { IPoptipTheme } from '../../../../component/poptip/interface';
import { THEME_CONSTANTS } from '../constants';

export const poptip: IPoptipTheme = {
  visible: true,
  position: 'auto',
  padding: 8,
  titleStyle: {
    fontSize: THEME_CONSTANTS.l5FontSize,
    // lineHeight: THEME_CONSTANTS.l5LineHeight, // FIXME: vrender 支持行高字符串后取消注释

    fontWeight: 'bold',
    fill: { type: 'palette', key: 'primaryFontColor' }
  },
  contentStyle: {
    fontSize: THEME_CONSTANTS.l5FontSize,
    // lineHeight: THEME_CONSTANTS.l5LineHeight, // FIXME: vrender 支持行高字符串后取消注释

    fill: { type: 'palette', key: 'secondaryFontColor' }
  },
  panel: {
    visible: true,
    fill: { type: 'palette', key: 'tooltipBackgroundColor' },
    cornerRadius: 3,
    lineWidth: 0,
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowColor: { type: 'palette', key: 'shadowColor', a: 0.1 },
    size: 0,
    space: 12
  }
};
