import type { ICartesianCrosshairSpec, IPolarCrosshairSpec } from '.';

export interface ICrosshairTheme {
  xField?: ICartesianCrosshairSpec['xField'];
  yField?: ICartesianCrosshairSpec['yField'];
  categoryField?: IPolarCrosshairSpec['categoryField'];
  valueField?: IPolarCrosshairSpec['valueField'];
  labelZIndex?: number;
  gridZIndex?: number;
}
