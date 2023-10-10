import type { ILayoutItemSpec } from '../../../model/interface';
import type { IPadding } from '../../../typings';
import type { IRectMarkSpec } from '../../../typings/visual';
import type { IFilterMode } from '../constant';
import type { IDataFilterComponentSpec } from '../interface';
export interface IScrollBarStyle {
  rail?: Omit<IRectMarkSpec, 'width' | 'height'>;
  slider?: Omit<IRectMarkSpec, 'width' | 'height'>;
}
export interface IScrollBarSpec extends IDataFilterComponentSpec, IScrollBarStyle {
  filterMode?: IFilterMode;
  round?: boolean;
  innerPadding?: number | number[] | IPadding;
  range?: [number, number];
  limitRange?: [number, number];
}
export type IScrollBarTheme = ILayoutItemSpec &
  IScrollBarStyle & {
    orient?: IScrollBarSpec['orient'];
    width?: IScrollBarSpec['width'];
    height?: IScrollBarSpec['height'];
    round?: IScrollBarSpec['round'];
    innerPadding?: IScrollBarSpec['innerPadding'];
  };
