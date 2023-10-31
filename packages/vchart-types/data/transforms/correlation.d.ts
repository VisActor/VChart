export interface ICorrelationOpt {
  field: string;
  radiusField?: string;
  radiusRange?: [number, number];
  center?: [string | number, string | number];
  startAngle?: number;
  endAngle?: number;
  innerRadius?: string | number;
  outerRadius?: string | number;
}
export interface CircularRelationItem {
  x: number;
  y: number;
  size: number;
  datum: any;
}
export declare const correlation: (data: any, options: any) => any;
