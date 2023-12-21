import type { IColor, IStageParams, IStage, ILayer } from '@visactor/vrender-core';
import type { EventSourceType, EventType } from '../../event/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { IBoundsLike } from '@visactor/vutils';
import type { GrammarType, IGrammarItem } from './compilable-item';
import type { StringOrNumber } from '../../typings';

export interface IRenderContainer {
  dom?: HTMLElement | 'none';
  canvas?: HTMLCanvasElement | string;
}

/**
 * @since 1.8.0
 */
export type IOptimizeType = {
  // 视口不在可视区，跳过渲染，默认为true
  skipRenderWithOutRange?: boolean;
  // 跳过图元在区间外的判断
  // 不存在dirtyBounds的时候，根据该配置判断是否关闭图元的超出边界判定
  // 如果有dirtyBounds那么该配置不生效
  disableCheckGraphicWidthOutRange?: boolean;
};

export interface IRenderOption {
  /**
   * 配置渲染环境，默认为 'desktop-browser'，当需要在非浏览器环境渲染 VChart 时，需要配置该属性。
   * - 'desktop-browser': 默认模式，适用于 PC 及 H5
   * - 'mobile-browser': H5 模式
   * - 'node': Node 渲染
   * - 'worker': worker 模式
   * - 'miniApp': 小程序模式
   * - 'lynx': lynx 渲染
   * @default 'desktop-browser'
   */
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
  /**
   * 设置屏幕分辨率
   */
  dpr?: number;
  /**
   * 图表交互全局开关，默认为 `true`，开启。
   * @default true
   */
  interactive?: boolean;
  /**
   * 指定绘制的区域
   */
  viewBox?: IBoundsLike;
  /**
   * 用于告诉底层的渲染引擎 VRender，图表的 Canvas 是否是受控制的canvas，如果不是的话，不会进行resize等操作。
   * @default true
   */
  canvasControled?: boolean;
  /**
   * 外部传入的 VRender stage
   */
  stage?: IStage;
  /**
   * 外部传入的 VRender layer
   */
  layer?: ILayer;

  /**
   * 绘制之前的钩子函数
   */
  beforeRender?: IStageParams['beforeRender'];
  /**
   * 绘制之后的钩子函数
   */
  afterRender?: IStageParams['afterRender'];
  /**
   * 绘图区域背景色设置
   */
  background?: IColor;
  /**
   * 日志类型，用于开发调试
   */
  logLevel?: number;
  /**
   * 错误消息回调函数
   */
  onError?: (...args: any[]) => void;
  /**
   * 是否关闭dirtyBounds
   * @default false
   */
  disableDirtyBounds?: boolean;
  /**
   * 是否开启view3d的变换模式
   */
  enableView3dTransform?: boolean;
  /**
   * vrender 的插件列表
   */
  pluginList?: string[];
  /**
   * @since 1.8.0
   */
  optimize?: IOptimizeType;

  enableHtmlAttribute?: boolean;
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
