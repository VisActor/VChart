import type { IPolarAxisCommonTheme } from '../../../../component/axis/polar/interface/theme';
import { commonAxis } from './common-axis';

export const axisRadius: IPolarAxisCommonTheme = {
  grid: {
    smooth: true,
    visible: true
  },
  subGrid: {
    smooth: true,
    visible: false
  }
};

export const axisAngle: IPolarAxisCommonTheme = commonAxis;
