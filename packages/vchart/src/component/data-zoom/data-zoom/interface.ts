import type { IMarkSpec } from '../../../typings/spec';
import type {
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec
} from '../../../typings/visual';
import type { IComponent } from '../../interface';
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
    icon?: IMarkSpec<ISymbolMarkSpec>;
    background?: {
      size?: number;
    } & IMarkSpec<IRectMarkSpec>;
  };
  background?: {
    size?: number;
  } & IMarkSpec<IRectMarkSpec>;
  startHandler?: IMarkSpec<ISymbolMarkSpec>;
  endHandler?: IMarkSpec<ISymbolMarkSpec>;
  startText?: {
    padding?: number;
  } & IMarkSpec<ITextMarkSpec>;
  endText?: {
    padding?: number;
  } & IMarkSpec<ITextMarkSpec>;
  dragMask?: IMarkSpec<IRectMarkSpec>;
  selectedBackground?: IMarkSpec<IRectMarkSpec>;
  backgroundChart?: {
    line?: IMarkSpec<ILineMarkSpec>;
    area?: IMarkSpec<IAreaMarkSpec>;
  };
  selectedBackgroundChart?: {
    line?: IMarkSpec<ILineMarkSpec>;
    area?: IMarkSpec<IAreaMarkSpec>;
  };
}

/** spec */
export interface IDataZoomSpec extends IDataZoomStyle, IDataFilterComponentSpec {
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
   * @default true
   */
  brushSelect?: boolean;
}

export type IDataZoomTheme = IDataZoomStyle;
