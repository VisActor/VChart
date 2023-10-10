import type { IIndicatorItemSpec } from './interface';
export interface IIndicatorDatum {
  type: 'title' | 'content';
  index: number;
  datum: any;
  spec: IIndicatorItemSpec;
}
export interface IIndicatorMapper {
  title: IIndicatorItemSpec;
  content: IIndicatorItemSpec[];
  datum: () => any;
}
export declare const indicatorMapper: (data: Array<any>, op: IIndicatorMapper) => any[];
