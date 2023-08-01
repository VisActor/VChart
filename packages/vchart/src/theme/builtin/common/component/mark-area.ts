import type { IMarkAreaTheme } from '../../../../component/marker/mark-area/interface';

export const markArea: IMarkAreaTheme = {
  area: {
    style: {
      fill: 'rgba(46, 47, 50, 0.1)'
    }
  },
  label: {
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'backgroundColor' },
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 0
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      },
      style: {
        cornerRadius: 0,
        fill: '#F68484'
      }
    }
  }
};
