import type {
  ICartesianCrosshairSpec,
  ICommonCrosshairSpec,
  ICrosshairCategoryFieldSpec,
  ICrosshairValueFieldSpec,
  IPolarCrosshairSpec,
  CrossHairTrigger
} from './spec';

export interface ICrosshairTheme extends ICommonCrosshairSpec {
  /**
   * band 轴 crosshair 的公共配置
   * @since 1.3.0
   */
  bandField?: Partial<ICrosshairCategoryFieldSpec>;
  /**
   * linear 轴 crosshair 的公共配置
   * @since 1.3.0
   */
  linearField?: Partial<ICrosshairValueFieldSpec>;
  xField?: Partial<ICartesianCrosshairSpec['xField']>;
  yField?: Partial<ICartesianCrosshairSpec['yField']>;
  categoryField?: Partial<IPolarCrosshairSpec['categoryField']>;
  valueField?: Partial<IPolarCrosshairSpec['valueField']>;
  /**
   * 是否可以通过 点击 固定住一组 crosshair，也可以同时触发。
   * @default 'hover'
   */
  trigger?: CrossHairTrigger;
  /**
   * 隐藏crosshair的触发方式（目前仅支持和trigger一致的设置以及none）
   */
  triggerOff?: CrossHairTrigger | 'none' | number;
}
