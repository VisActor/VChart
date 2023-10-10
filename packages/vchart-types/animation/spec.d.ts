import type { IAnimationConfig } from '@visactor/vgrammar-core';
import type { EasingType } from '@visactor/vrender-core';
export type { IRunningConfig as IMorphConfig, IMorphAnimationConfig } from '@visactor/vgrammar-core';
export type IStateAnimateSpec<Preset extends string> = {
  preset?: Preset | false;
  duration?: number;
  delay?: number;
  easing?: EasingType;
  oneByOne?: boolean;
};
export type IMarkAnimateSpec<MarkName extends string> = Partial<
  Record<MarkName, false | IAnimationConfig | IAnimationConfig[]>
>;
export interface IAnimationSpec<MarkName extends string, Preset extends string> {
  animationAppear?: boolean | IStateAnimateSpec<Preset> | IMarkAnimateSpec<MarkName>;
  animationEnter?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  animationUpdate?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  animationExit?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  animationDisappear?: boolean | Omit<IStateAnimateSpec<Preset>, 'preset'> | IMarkAnimateSpec<MarkName>;
  animationNormal?: IMarkAnimateSpec<MarkName>;
}
export interface IMorphSeriesSpec {
  enable?: boolean;
  morphKey?: string;
  morphElementKey?: string;
}
