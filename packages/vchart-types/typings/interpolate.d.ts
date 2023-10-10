export type InterpolateType =
  | 'basis'
  | 'bundle'
  | 'cardinal'
  | 'catmullRom'
  | 'linear'
  | 'monotone'
  | 'monotoneX'
  | 'monotoneY'
  | 'natural'
  | 'step'
  | 'stepAfter'
  | 'stepBefore'
  | 'linearClosed'
  | 'cardinalClosed';
export declare const DEFAULT_SMOOTH_INTERPOLATE = 'monotone';
export declare const DEFAULT_LINEAR_INTERPOLATE = 'linear';
export declare const DEFAULT_LINEAR_CLOSED_INTERPOLATE = 'linearClosed';
export declare const DEFAULT_CIRCLE_CLOSED_INTERPOLATE = 'cardinalClosed';
