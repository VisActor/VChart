import type { IMarkAreaTheme } from '../../../../component/marker/mark-area/interface';

export const markArea: IMarkAreaTheme = {
  area: {
    style: {
      fill: { type: 'palette', key: 'axisDomainColor', a: 0.25 }
    }
  },
  label: {
    style: {
      fontSize: { type: 'token', key: 'l4FontSize' },
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'primaryFontColor' }
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      },
      style: {
        cornerRadius: 3,
        fill: { type: 'palette', key: 'markLabelBackgroundColor' }
      }
    }
  }
};
