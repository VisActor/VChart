import type { IPadding, StringOrNumber, ILineMarkSpec, IRectMarkSpec, ITextMarkSpec } from '../../../typings';
import type { IAxis } from '../../axis/interface';
import type { IComponentSpec } from '../../base/interface';
import type { IComponent } from '../../interface';
export interface ICrossHair extends IComponent {
  clearAxisValue?: () => void;
  setAxisValue?: (v: StringOrNumber, axis: IAxis) => void;
  layoutByValue?: (v?: number) => void;
  hide?: () => void;
}
export type CrossHairTrigger = 'click' | 'hover' | ['click', 'hover'];
export interface ICommonCrosshairSpec extends IComponentSpec {
  trigger?: CrossHairTrigger;
  triggerOff?: CrossHairTrigger | 'none';
  labelZIndex?: number;
  gridZIndex?: number;
}
export interface ICartesianCrosshairSpec extends ICommonCrosshairSpec {
  xField?: ICrosshairCategoryFieldSpec;
  yField?: ICrosshairCategoryFieldSpec;
}
export interface IPolarCrosshairSpec extends ICommonCrosshairSpec {
  categoryField?: ICrosshairCategoryFieldSpec;
  valueField?: ICrosshairValueFieldSpec;
}
export interface ICrosshairCategoryFieldSpec extends ICrosshairDataBindSpec {
  visible: boolean;
  line?: ICrosshairLineSpec | ICrosshairRectSpec;
  label?: ICrosshairLabelSpec;
}
export interface ICrosshairValueFieldSpec {
  visible: boolean;
  line?: ICrosshairLineSpec;
  label?: ICrosshairLabelSpec;
}
export type ICrosshairLineStyle = Pick<
  ILineMarkSpec,
  'stroke' | 'strokeOpacity' | 'opacity' | 'lineDash' | 'lineWidth'
>;
export type ICrosshairRectStyle = ICrosshairLineStyle & Pick<IRectMarkSpec, 'fill' | 'fillOpacity' | 'cornerRadius'>;
export interface ICrosshairLineSpec {
  visible?: boolean;
  type?: 'line';
  width?: number;
  smooth?: boolean;
  style?: ICrosshairLineStyle;
}
export interface ICrosshairRectSpec {
  visible?: boolean;
  type?: 'rect';
  width?: number | string;
  style?: ICrosshairRectStyle;
}
export interface ICrosshairLabelSpec {
  visible?: boolean;
  formatMethod?: (text: StringOrNumber | string[]) => string | string[];
  style?: Partial<ITextMarkSpec>;
  labelBackground?: ICrosshairLabelBackgroundSpec;
}
export interface ICrosshairLabelBackgroundSpec {
  visible?: boolean;
  minWidth?: number;
  maxWidth?: number;
  padding?: IPadding | number | number[];
  style: Partial<IRectMarkSpec>;
}
export interface ICrosshairDataBindSpec {
  bindingAxesIndex?: number[];
  defaultSelect?: {
    axisIndex: number;
    datum: StringOrNumber;
  };
}
export type ICrosshairSpec = ICartesianCrosshairSpec | IPolarCrosshairSpec;
