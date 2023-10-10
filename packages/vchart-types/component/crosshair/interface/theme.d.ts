import type {
  ICartesianCrosshairSpec,
  ICommonCrosshairSpec,
  ICrosshairCategoryFieldSpec,
  ICrosshairValueFieldSpec,
  IPolarCrosshairSpec
} from '.';
export interface ICrosshairTheme extends ICommonCrosshairSpec {
  bandField?: ICrosshairCategoryFieldSpec;
  linearField?: ICrosshairValueFieldSpec;
  xField?: ICartesianCrosshairSpec['xField'];
  yField?: ICartesianCrosshairSpec['yField'];
  categoryField?: IPolarCrosshairSpec['categoryField'];
  valueField?: IPolarCrosshairSpec['valueField'];
}
