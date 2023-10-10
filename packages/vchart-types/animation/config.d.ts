import type { MarkAnimationSpec } from './interface';
export declare const DEFAULT_ANIMATION_CONFIG: {
  appear: {
    duration: number;
    easing: string;
  };
  update: {
    type: string;
    duration: number;
    easing: string;
  };
  enter: {
    duration: number;
    easing: string;
  };
  exit: {
    duration: number;
    easing: string;
  };
  disappear: {
    duration: number;
    easing: string;
  };
};
export declare const DEFAULT_MARK_ANIMATION: Record<string, (params?: any, preset?: any) => MarkAnimationSpec>;
