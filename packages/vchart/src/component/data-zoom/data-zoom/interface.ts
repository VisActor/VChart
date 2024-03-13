import type { IMarkSpec } from '../../../typings/spec';
import type {
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec
} from '../../../typings/visual';
import type { IComponentSpec } from '../../base/interface';
import type { ComponentThemeWithDirection, IComponent } from '../../interface';
import type { IFilterMode } from '../constant';
import type { IDataFilterComponent, IDataFilterComponentSpec } from '../interface';

export type IDataZoom = IComponent & IDataFilterComponent;

// TODO: 开放的状态样式配置较少，暂时不使用markSpec方式配置
export interface IDataZoomStyle {
  /**
   * 是否显示startText和endText
   * @default 'auto' 鼠标hover在选中区域时才显示startText和endText
   */
  showDetail?: 'auto' | boolean;

  middleHandler?: {
    visible?: boolean;
    icon?: ISymbolMarkSpec;
    background?: {
      size?: number;
    } & IRectMarkSpec;
  };
  background?: {
    size?: number;
  } & IRectMarkSpec;
  startHandler?: ISymbolMarkSpec;
  endHandler?: ISymbolMarkSpec;
  startText?: {
    padding?: number;
  } & ITextMarkSpec;
  endText?: {
    padding?: number;
  } & ITextMarkSpec;
  dragMask?: IRectMarkSpec;
  selectedBackground?: IRectMarkSpec;
  backgroundChart?: {
    line?: ILineMarkSpec;
    area?: IAreaMarkSpec;
  };
  selectedBackgroundChart?: {
    line?: ILineMarkSpec;
    area?: IAreaMarkSpec;
  };
}

/** spec */
export interface IDataZoomSpec extends IDataZoomStyle, IDataFilterComponentSpec {
  /**
   * 数据过滤模式
   * @default 'filter' （dataZoom默认数据过滤模式）
   * 详细可参考：https://echarts.apache.org/zh/option.html#dataZoom-slider.filterMode）
   */
  filterMode?: IFilterMode;
  /**
   * 背景趋势线对应的字段
   */
  valueField?: string;
  /**
   * 起始点文字标签format格式配置
   */
  startText?: {
    padding?: number;
    style?: IMarkSpec<ITextMarkSpec>;
    formatMethod?: (text: string | number) => string | string[];
    /**
     * 格式化模板
     * @description 可以通过类似 `{value:.2f}%` 的形式对指定数据字段进行格式化
     * @since 1.10.0
     */
    formatter?: string | string[];
  };
  endText?: {
    padding?: number;
    style?: IMarkSpec<ITextMarkSpec>;
    formatMethod?: (text: string | number) => string | string[];
    formatter?: string | string[];
  };
  /**
   * 是否开启框选, 如果不开启则支持selectedBackground拖拽（框选和拖拽两者互斥）
   * @default false
   */
  brushSelect?: boolean;
  /**
   * 是否忽略轴上配置的固定 bandSize
   * 如果置为 true，则 datazoom 可以任意改变轴的 bandSize。
   * 但如果轴上配置了 bandSize 范围，则第一次渲染会保持 bandSize 在配置范围内。
   * 该配置仅在 auto 设为 true 时生效。
   * @since 1.7.0
   */
  ignoreBandSize?: boolean;

  /**
   * 背景图表节点压缩率, 如果不配置则默认将节点限制在10000个
   * @since 1.10.0
   */
  tolerance?: number;
}

export type IDataZoomCommonTheme = IComponentSpec &
  IDataZoomStyle & {
    /** 显示的位置 */
    orient?: IDataZoomSpec['orient'];
    /** 组件宽度 */
    width?: IDataZoomSpec['width'];
    /** 组件高度 */
    height?: IDataZoomSpec['height'];
    /**
     * 是否开启框选, 如果不开启则支持selectedBackground拖拽（框选和拖拽两者互斥）
     * @default false
     */
    brushSelect?: boolean;
  };

export type IDataZoomTheme = ComponentThemeWithDirection<IDataZoomCommonTheme>;
