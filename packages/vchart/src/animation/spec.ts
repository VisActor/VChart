import type { IAnimationConfig } from '@visactor/vgrammar-core';
import type { EasingType } from '@visactor/vrender';
export type { IRunningConfig as IMorphConfig, IMorphAnimationConfig } from '@visactor/vgrammar-core';

export type IStateAnimateSpec<Preset extends string> = {
  /**
   * 预设动画效果
   */
  preset?: Preset | false;
  /**
   * 图表动画时长
   */
  duration?: number;
  /**
   * 动画延迟开始的时长
   */
  delay?: number;
  /**
   * 动画缓动效果
   */
  easing?: EasingType;
  /**
   * 是否轮流执行
   */
  oneByOne?: boolean;
};

export type IMarkAnimateSpec<MarkName extends string> = Partial<
  Record<MarkName, false | IAnimationConfig | IAnimationConfig[]>
>;

export interface IAnimationSpec<MarkName extends string, Preset extends string> {
  /**
   * 图表入场动画
   * 支持配置图表内置不同动画效果
   */
  animationAppear?: boolean | IStateAnimateSpec<Preset> | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 新增数据动画
   */
  animationEnter?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 数据更新动画
   */
  animationUpdate?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 数据删除动画
   */
  animationExit?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  /**
   * 图表退场动画
   */
  animationDisappear?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  /**
   * 循环动画
   */
  animationNormal?: IMarkAnimateSpec<MarkName>;
}
export interface IMorphSeriesSpec {
  /**
   * 系列全局动画是否开启
   * @default true
   */
  enable?: boolean;
  /**
   * 图元匹配字段
   * 系列前后根据 morphKey 配置的内容进行关联
   */
  morphKey?: string;
  /**
   * 数据匹配字段
   * 多数据图元可配置
   */
  morphElementKey?: string;
}
