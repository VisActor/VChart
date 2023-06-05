import type { IColor, IStageParams, IStage, ILayer } from '@visactor/vrender';
import type { EventSourceType, EventType } from '../../event/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { IBoundsLike } from '@visactor/vutils';
import type { GrammarType, IGrammarItem } from './compilable-item';
import type { StringOrNumber } from '../../typings';

export interface IRenderContainer {
  dom?: HTMLElement | 'none';
  canvas?: HTMLCanvasElement | string;
}

// TODO: 这里最好能够三层统一，直接引用 vrender/vgrammar 的类型定义
export interface IRenderOption {
  mode?: RenderMode;
  /**
   * 渲染环境参数配置
   */
  modeParams?:
    | {
        tooltipCanvasId?: StringOrNumber;
        [key: string]: any;
      }
    | unknown;
  engine?: '2d' | 'webgl' | 'webgl2';
  /**
   * 用于设置内部拾取策略，如不设置，默认采用颜色拾取
   * 'geoPick' 使用集合拾取
   */
  pickMode?: 'native' | 'geoPick';
  webglOptions?: any;
  preserveDrawingBuffer?: boolean;
  dpr?: number;
  fullDraw?: boolean;
  /**
   * 图表交互全局开关，默认为 `true`，开启。
   * @default true
   */
  interactive?: boolean;
  /** 指定绘制的区域 */
  viewBox?: IBoundsLike;
  /** 是否是受控制的canvas，如果不是的话，不会进行resize等操作 */
  canvasControled?: boolean;

  /** 外部传入的 vrender stage */
  stage?: IStage;
  /** 外部传入的 vrender layer */
  layer?: ILayer;

  /**
   * 绘制之前的钩子函数
   */
  beforeRender?: IStageParams['beforeRender'];
  /**
   * 绘制之后的钩子函数
   */
  afterRender?: IStageParams['afterRender'];
  /** 绘图区域背景色设置 */
  background?: IColor;
  /**
   * 日志类型，用于开发调试
   */
  logLevel?: number;
  /**
   * 是否关闭dirtyBounds
   * @default false
   */
  disableDirtyBounds?: boolean;
}

export type CompilerListenerParameters = {
  type: EventType;
  event: Event;
  source: EventSourceType;
  // FIXME: 这里 item 应当为场景树的 Item 类型
  item: any | null;
  datum: any | null;
  markId: number | null;
  modelId: number | null;
  markUserId: StringOrNumber | null;
  modelUserId: StringOrNumber | null;
};

export type CompilerModel = Record<GrammarType, IProductMap<IGrammarItem>>;

export interface IProductMap<T extends IGrammarItem> {
  /** 编译产物 id 和对应的在 vchart 中的 GrammarItem */
  [productId: string]: IGrammarItemMap<T>;
}

export interface IGrammarItemMap<T extends IGrammarItem> {
  /** GrammarItem id 和 对应的引用 */
  [id: number]: T;
}
