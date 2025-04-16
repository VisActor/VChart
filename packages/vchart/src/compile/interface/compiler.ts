import type { Hooks } from '@visactor/vgrammar-core';
import type { IColor, IStageParams, IStage, ILayer } from '@visactor/vrender-core';
import type { RenderMode } from '../../typings/spec/common';
import type { IBoundsLike } from '@visactor/vutils';
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

export interface GestureConfig {
  press?: {
    /**
     * @default 251
     * Minimal press time in ms.
     * @see http://hammerjs.github.io/recognizer-press/
     */
    time?: number;
    /**
     * @default 10
     * Maximal movement that is allowed while pressing.
     * @see http://hammerjs.github.io/recognizer-press/
     */
    threshold?: number;
  };
  swipe?: {
    /**
     * Minimal distance required before recognizing.
     * @default 10
     * @see https://hammerjs.github.io/recognizer-swipe/
     */
    threshold?: number;
    /**
     * Minimal velocity required before recognizing, unit is in px per ms.
     * @default 0.3
     * @see http://hammerjs.github.io/recognizer-swipe/
     */
    velocity?: number;
  };
  tap?: {
    /**
     * max time between the multi-tap taps
     * @default 300
     */
    interval?: number;
  };
}

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

  gestureConfig?: GestureConfig;
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
   * 是否自动刷线dpr
   * @since 1.12.14
   */
  autoRefreshDpr?: boolean;
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
  /**
   * @since 1.8.3
   */
  enableHtmlAttribute?: boolean;
  /**
   * @since 1.8.9
   * 是否支持touch事件
   */
  supportsTouchEvents?: boolean;
  /**
   * @since 1.8.9
   * 是否支持pointer事件
   */
  supportsPointerEvents?: boolean;
  /**
   * @since 1.11.0
   * 用于vrender渲染react元素，`react-dom`包导出元素
   */
  ReactDOM?: any;
  /**
   * @since 1.13.2
   * @default 200
   * 单位 ms
   * 多次点击之间的最大时间，默认为 200 ms，用于判断点击次数
   */
  clickInterval?: number;
  /**
   * @since 1.13.2
   * @default false
   * VRender 参数 是否自动阻止事件
   */
  autoPreventDefault?: boolean;
  /**
   * @deprecated
   * 请使用 hooks 代替
   */
  performanceHook?: Hooks;
}
