import type { ICartesianAxisCommonTheme } from '../../../../../component/axis/cartesian/interface';

export const axisX: ICartesianAxisCommonTheme = {
  label: {
    space: 6
  },
  title: {
    space: 6
  },
  maxHeight: '30%'
};

export const axisY: ICartesianAxisCommonTheme = {
  label: {
    space: 8,
    autoLimit: true
  },
  title: {
    space: 8,
    autoRotate: true
  },
  maxWidth: '30%'
};
