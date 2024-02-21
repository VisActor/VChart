import type { IIndicatorTheme } from '../../../../component/indicator/interface';

export const indicator: IIndicatorTheme = {
  title: {
    visible: true,
    autoLimit: false,
    autoFit: false,
    style: {
      fontSize: { type: 'token', key: 'l1FontSize' },
      fill: { type: 'palette', key: 'primaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  },
  content: {
    visible: true,
    style: {
      fontSize: { type: 'token', key: 'l2FontSize' },
      fill: { type: 'palette', key: 'tertiaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  }
};
