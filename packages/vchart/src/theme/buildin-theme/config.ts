import type { IContinuousLegendTheme } from '../../component/legend/continuous';
export const DEFAULT_TEXT_FONT_FAMILY =
  // eslint-disable-next-line max-len
  'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol';

export const DEFAULT_TEXT_FONT_SIZE = 11;
export const DEFAULT_AXIS_TICK_SIZE = 4;

export const DEFAULT_CONTINUOUS_LEGEND_THEME: IContinuousLegendTheme = {
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: 12,
      fontWeight: 'normal',
      fill: 'rgba(46, 47, 50, 1)'
    },
    space: 12
  },
  handler: {
    visible: true
  }
};
