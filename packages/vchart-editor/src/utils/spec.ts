import type { IChartModel } from './../elements/chart/interface';
import type { IModelInfoSpecKey } from './../core/interface';
import type { IModelInfo } from '../core/interface';

export function isSameModelInfo(info1: IModelInfo, info2: IModelInfo) {
  if ('id' in info1) {
    return info1.id === info2.id;
  }
  return (
    info1.specKey === (<IModelInfoSpecKey>info2).specKey && info1.specIndex === (<IModelInfoSpecKey>info2).specIndex
  );
}

export function isModelInfoMatchSpec(info: IModelInfo, spec: { id: string | number }, specKey: string, index: number) {
  if ('id' in info) {
    return info.id === spec.id;
  }
  return info.specKey === specKey && info.specIndex === index;
}

export function isModelMatchModelInfo(model: IChartModel, info: IModelInfo) {
  if ('id' in info && info.id !== undefined) {
    return info.id === model.userId;
  }
  return info.specKey === model.specKey && info.specIndex === model.getSpecIndex();
}
