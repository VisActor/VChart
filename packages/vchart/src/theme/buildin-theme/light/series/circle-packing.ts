import type { ICirclePackingSeriesTheme } from '../../../../series/circle-packing/interface';

export const circlePacking: ICirclePackingSeriesTheme = {
  layoutPadding: 5,
  circlePacking: {
    visible: true,
    style: {
      cursor: 'pointer',
      stroke: '#ffffff'
    }
  },
  label: {
    visible: true,
    style: {
      cursor: 'pointer',
      fill: '#000000'
    }
  }
};
