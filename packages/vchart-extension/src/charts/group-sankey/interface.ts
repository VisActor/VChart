import type { Datum, IRectMarkSpec } from '@visactor/vchart';

export interface IGroupRectMark extends IRectMarkSpec {
  /**
   * 分组图元之间的间距
   */
  gap?: number;
  groupA?: (datum: Datum) => number;
  groupB?: (datum: Datum) => number;
}

export enum GroupRectMarkType {
  groupRect = 'groupRect'
}
