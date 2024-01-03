import type { IComponentTheme } from '../../../../component/interface';
import { axisBand } from './axis/band-axis';
import { axisX, axisY, axisZ } from './axis/cartesian-axis';
import { commonAxis } from './axis/common-axis';
import { axisLinear } from './axis/linear-axis';
import { axisAngle, axisRadius } from './axis/polar-axis';
import { crosshair } from './crosshair';
import { dataZoom } from './data-zoom';
import { indicator } from './indicator';
import { colorLegend } from './legend/color-legend';
import { discreteLegend } from './legend/discrete-legend';
import { sizeLegend } from './legend/size-legend';
import { mapLabel } from './map-label';
import { markArea } from './mark-area';
import { markLine } from './mark-line';
import { markPoint } from './mark-point';
import { player } from './player';
import { title } from './title';
import { tooltip } from './tooltip';
import { poptip } from './poptip';
import { totalLabel } from './total-label';

export const component: IComponentTheme = {
  discreteLegend,
  colorLegend,
  sizeLegend,
  axis: commonAxis,
  axisBand,
  axisLinear,
  axisX,
  axisY,
  axisZ,
  axisAngle,
  axisRadius,
  markLine,
  markArea,
  markPoint,
  tooltip,
  dataZoom,
  crosshair,
  player,
  indicator,
  title,
  mapLabel,
  poptip,
  totalLabel
};
