export type InterpolateType =
  | 'basis'
  | 'linear'
  | 'monotone'
  | 'monotoneX'
  | 'monotoneY'
  | 'step'
  | 'stepAfter'
  | 'stepBefore'
  | 'linearClosed'
  | 'cardinalClosed';

export const DEFAULT_SMOOTH_INTERPOLATE = 'monotone';
export const DEFAULT_LINEAR_INTERPOLATE = 'linear';
export const DEFAULT_LINEAR_CLOSED_INTERPOLATE = 'linearClosed';
export const DEFAULT_CIRCLE_CLOSED_INTERPOLATE = 'cardinalClosed';
