import type { DataView } from '@visactor/vdataset';
export interface IPieOpt {
  angleField: string;
  startAngle: number;
  endAngle: number;
  minAngle: number;
  asStartAngle: string;
  asEndAngle: string;
  asMiddleAngle: string;
  asRadian: string;
  asRatio: string;
  asQuadrant: string;
  asK: string;
}
export declare const pie: (
  originData: Array<DataView>,
  op: IPieOpt
) => {
  [x: string]: any;
}[];
