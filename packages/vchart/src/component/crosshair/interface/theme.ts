import type { ICartesianCrosshairSpec, ICommonCrosshairSpec, IPolarCrosshairSpec } from '.';

export interface ICrosshairTheme extends ICommonCrosshairSpec {
  xField?: ICartesianCrosshairSpec['xField'];
  yField?: ICartesianCrosshairSpec['yField'];
  categoryField?: IPolarCrosshairSpec['categoryField'];
  valueField?: IPolarCrosshairSpec['valueField'];
}
