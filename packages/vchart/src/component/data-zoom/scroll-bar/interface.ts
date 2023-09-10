import type { IPadding } from '../../../typings';
import type { IRectMarkSpec } from '../../../typings/visual';
import type { IComponentSpec } from '../../base/interface';
import type { IDataFilterComponentSpec } from '../interface';

export interface IScrollBarStyle {
  /**
   * 滚动条轨道样式。
   */
  rail?: Omit<IRectMarkSpec, 'width' | 'height'>;
  /**
   * 滚动条滑块样式。
   */
  slider?: Omit<IRectMarkSpec, 'width' | 'height'>;
}

export interface IScrollBarSpec extends IDataFilterComponentSpec, IScrollBarStyle {
  /** 滑块是否圆角。 */
  round?: boolean;
  /**
   * 滚动条内边距，影响滑轨的实际可用空间 [top, right, bottom, left]
   */
  innerPadding?: number | number[] | IPadding;
  /** 滑块当前的可视范围，数值为 0 - 1 */
  range?: [number, number];
  /**
   * 滑块限制的滚动范围，数值为 0 - 1
   */
  limitRange?: [number, number];
}

export type IScrollBarTheme = IComponentSpec &
  IScrollBarStyle & {
    /** 显示的位置 */
    orient?: IScrollBarSpec['orient'];
    /** 组件宽度 */
    width?: IScrollBarSpec['width'];
    /** 组件高度 */
    height?: IScrollBarSpec['height'];
    /** 滑块是否圆角。 */
    round?: IScrollBarSpec['round'];
    /**
     * 滚动条内边距，影响滑轨的实际可用空间 [top, right, bottom, left]
     */
    innerPadding?: IScrollBarSpec['innerPadding'];
  };
