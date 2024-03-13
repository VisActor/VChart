import type { ILayoutItemSpec } from '../../../layout/interface';
import type { IPadding } from '../../../typings';
import type { IRectMarkSpec } from '../../../typings/visual';
import type { ComponentThemeWithDirection } from '../../interface';
import type { IFilterMode } from '../constant';
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
  /**
   * 数据过滤模式
   * @default 'axis' (scrollBar默认视口裁剪模式)
   * 详细可参考：https://echarts.apache.org/zh/option.html#dataZoom-slider.filterMode）
   */
  filterMode?: IFilterMode;
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

export type IScrollBarCommonTheme = ILayoutItemSpec &
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

export type IScrollBarTheme = ComponentThemeWithDirection<IScrollBarCommonTheme>;
