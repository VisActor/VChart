import type { IMarkSpec } from '../../../typings/spec';
import type {
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec
} from '../../../typings/visual';
import type { IComponentSpec } from '../../base/interface';
import type { IComponent } from '../../interface';
import type { IFilterMode } from '../constant';
import type { IDataFilterComponentSpec } from '../interface';

export type IDataZoom = IComponent;

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
  };
  endText?: {
    padding?: number;
    style?: IMarkSpec<ITextMarkSpec>;
    formatMethod?: (text: string | number) => string | string[];
  };
  /**
   * 是否开启框选, 如果不开启则支持selectedBackground拖拽（框选和拖拽两者互斥）
   * @default false
   */
  brushSelect?: boolean;
}

export type IDataZoomTheme = IComponentSpec &
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
