import type {
  ICartesianCrosshairSpec,
  ICommonCrosshairSpec,
  ICrosshairCategoryFieldSpec,
  ICrosshairValueFieldSpec,
  IPolarCrosshairSpec
} from '.';

export interface ICrosshairTheme extends ICommonCrosshairSpec {
  /**
   * band 轴 crosshair 的公共配置
   * @since 1.3.0
   */
  bandField?: ICrosshairCategoryFieldSpec;
  /**
   * linear 轴 crosshair 的公共配置
   * @since 1.3.0
   */
  linearField?: ICrosshairValueFieldSpec;
  xField?: ICartesianCrosshairSpec['xField'];
  yField?: ICartesianCrosshairSpec['yField'];
  categoryField?: IPolarCrosshairSpec['categoryField'];
  valueField?: IPolarCrosshairSpec['valueField'];
}
