import type { IIndicatorTheme } from '../../../../component/indicator/interface';

export const indicator: IIndicatorTheme = {
  title: {
    visible: true,
    autoLimit: false,
    autoFit: false,
    style: {
      fontSize: 20,
      fill: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  },
  content: {
    visible: true,
    style: {
      fontSize: 16,
      fill: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  }
};
