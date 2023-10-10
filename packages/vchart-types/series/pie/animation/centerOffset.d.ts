import type { IAnimationTimeline, IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { IArcMark } from '../../../mark/arc';
export type ICenterOffsetAnimationOptions = {
  distance?: number;
};
export declare function centerOffsetConfig(mark: IArcMark, originalConfig: IAnimationTypeConfig): IAnimationTimeline;
