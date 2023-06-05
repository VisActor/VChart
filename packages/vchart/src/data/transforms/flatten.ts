import { flattenNodes } from '@visactor/vgrammar-hierarchy';
import type { Datum } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import type { TreemapNodeElement, SunburstNodeElement } from '@visactor/vgrammar-hierarchy';

export type FlattenNodeElement = TreemapNodeElement | SunburstNodeElement;

export interface IFlattenOpt {
  output?: Datum[];
  maxDepth?: number;
  callback?: <T>(node: FlattenNodeElement) => T;
}

export const flatten = (data: Array<Datum>, op: IFlattenOpt = {}) => {
  if (!data) {
    return [];
  }

  const result = [] as FlattenNodeElement[];
  flattenNodes(data as unknown as FlattenNodeElement[], result, op);
  return result;
};
