import type { ICartesianAxisCommonTheme } from '../../../../../component/axis/cartesian/interface';

export const axisX: ICartesianAxisCommonTheme = {
  label: {
    space: 10
  },
  title: {
    space: 10
  },
  maxHeight: '30%'
};

export const axisY: ICartesianAxisCommonTheme = {
  label: {
    space: 20,
    autoLimit: true
  },
  title: {
    space: 20,
    autoRotate: true
  },
  maxWidth: '30%'
};
