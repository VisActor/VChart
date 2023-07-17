import type { ITooltipPattern, Maybe, TooltipActiveType, TooltipData } from '../../../typings';
import type { ITooltipActiveTypeAsKeys, TooltipHandlerParams, TooltipResult } from './common';
import type { ITooltipTheme } from './theme';

export interface ITooltipSpec
  extends Partial<
    /* mark tooltip pattern（*支持在series上设置）
     * & dimension tooltip pattern
     */
    ITooltipActiveTypeAsKeys<ITooltipPattern, ITooltipPattern>
  > {
  /** 是否显示（*支持在series上设置）（*会影响自定义handler） */
  visible?: boolean;
  /** 受支持的激活类型（*支持在series上设置）（*会影响自定义handler） */
  activeType?: TooltipActiveType | TooltipActiveType[];
  /** tooltip触发方式（*会影响自定义handler） */
  trigger?: 'hover' | 'click' | 'none';
  /** 隐藏tooltip的触发方式（目前仅支持和trigger一致的设置以及none）（*会影响自定义handler） */
  triggerOff?: 'hover' | 'click' | 'none';

  /** tooltip样式 */
  style?: Omit<ITooltipTheme, 'offset'>;

  /** 自定义handler方法 */
  handler?: Partial<ITooltipHandlerSpec>;

  /** tooltip 渲染方式，默认为 html */
  renderMode?: 'html' | 'canvas';
  /**
   * 是否将 tooltip 框限制在画布区域内，renderMode 为 canvas 时，默认开启。
   */
  confine?: boolean;

  /**
   * tooltip dom元素的 className，仅当 renderMode: 'html' 时生效
   */
  className?: string;
  /**
   * tooltip dom 元素的挂载点
   */
  parentElement?: HTMLElement | HTMLCanvasElement;
  /**
   * 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
   * 该属性目前只对 renderMode 为 html 时生效
   * TODO: 支持 renderMode: canvas
   */
  enterable?: boolean;

  /**
   * 浮层移动动画过渡时间，单位是 ms，设置为 0 的时候会紧跟着鼠标移动（目前仅影响 dom tooltip）
   */
  transitionDuration?: number;

  /** 更新 tooltip 的防抖动时间间隔，单位是 ms */
  throttleInterval?: number;

  offset?: {
    x?: number;
    y?: number;
  };
}

export interface ITooltipHandlerSpec {
  /** 显示 tooltip，可以选择返回是否遇到异常 */
  showTooltip: (activeType: TooltipActiveType, data: TooltipData, params: TooltipHandlerParams) => Maybe<TooltipResult>;
  /** 隐藏 tooltip */
  hideTooltip: (params: TooltipHandlerParams) => void;
  /** 释放 tooltip */
  release: () => void;
}
