import type { ICartesianAxisCommonTheme } from '../../../../../component/axis/cartesian/interface';

export const axisX: ICartesianAxisCommonTheme = {
  label: {
    space: 8
  },
  title: {
    space: 8
  },
  maxHeight: '30%'
};

export const axisY: ICartesianAxisCommonTheme = {
  label: {
    space: 12,
    autoLimit: true
  },
  title: {
    space: 12,
    autoRotate: true
  },
  maxWidth: '30%'
};
