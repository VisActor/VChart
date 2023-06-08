import type { ICartesianAxisCommonTheme } from '../../../../component/axis/cartesian/interface';

export const axisX: ICartesianAxisCommonTheme = {
  grid: { visible: false }
};

export const axisY: ICartesianAxisCommonTheme = {
  domainLine: {
    visible: true
  },
  tick: { visible: true },
  label: {
    space: 4
  },
  title: {
    autoRotate: true
  }
};
