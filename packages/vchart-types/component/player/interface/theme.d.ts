import type { ControllerLayout, OrientType } from '@visactor/vrender-components';
import type { ISymbolMarkSpec, IRectMarkSpec } from '../../../typings';
import type { BaseGraphicAttributes } from '@visactor/vrender-components/es/core/type';
import type { ILayoutItemSpec } from '../../../model/interface';
export interface IPlayerTheme extends ILayoutItemSpec {
  visible?: boolean;
  dx?: number;
  dy?: number;
  width?: number;
  height?: number;
  position?: 'start' | 'middle' | 'end';
  orient?: OrientType;
  slider?: IPlayerSlider;
  controller?: IPlayerController;
}
export type PlayerAlignType = 'start' | 'middle' | 'end';
export interface IPlayerSlider {
  visible?: boolean;
  space?: number;
  dx?: number;
  dy?: number;
  railStyle?: IRectMarkSpec;
  trackStyle?: IRectMarkSpec;
  handlerStyle?: ISymbolMarkSpec;
}
export interface IPlayerController {
  visible?: boolean;
  start?: Partial<ControllerLayout & BaseGraphicAttributes<ISymbolMarkSpec>>;
  pause?: Partial<ControllerLayout & BaseGraphicAttributes<ISymbolMarkSpec>>;
  backward?: Partial<ControllerLayout & BaseGraphicAttributes<ISymbolMarkSpec>>;
  forward?: Partial<ControllerLayout & BaseGraphicAttributes<ISymbolMarkSpec>>;
}
