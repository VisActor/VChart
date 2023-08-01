import type { ICirclePackingSeriesTheme } from '../../../../series/circle-packing/interface';

export const circlePacking: ICirclePackingSeriesTheme = {
  layoutPadding: 5,
  circlePacking: {
    visible: true,
    style: {
      cursor: 'pointer',
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  label: {
    visible: true,
    style: {
      cursor: 'pointer',
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  }
};
