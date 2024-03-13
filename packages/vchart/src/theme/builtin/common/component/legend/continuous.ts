import type { IContinuousLegendTheme } from '../../../../../component/legend';

export const DEFAULT_CONTINUOUS_LEGEND_THEME: IContinuousLegendTheme = {
  orient: 'right',
  position: 'middle',
  padding: [16, 24],
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: { type: 'token', key: 'l5FontSize' },
      lineHeight: { type: 'token', key: 'l5LineHeight' },

      fontWeight: 'normal',
      fill: { type: 'palette', key: 'primaryFontColor' }
    },
    space: 12
  },
  handler: {
    visible: true
  },
  startText: {
    style: {
      fontSize: { type: 'token', key: 'l5FontSize' },
      lineHeight: { type: 'token', key: 'l5LineHeight' },

      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    },
    space: 6
  },
  endText: {
    style: {
      fontSize: { type: 'token', key: 'l5FontSize' },
      lineHeight: { type: 'token', key: 'l5LineHeight' },

      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    },
    space: 6
  },
  handlerText: {
    style: {
      fontSize: { type: 'token', key: 'l5FontSize' },
      lineHeight: { type: 'token', key: 'l5LineHeight' },

      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    },
    space: 6
  }
};
