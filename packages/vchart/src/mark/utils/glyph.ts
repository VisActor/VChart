import type { IMarkGraphic } from '../interface/common';
import { addGraphicState } from '../../util/graphic-state';

export const addRuntimeState = (
  g: IMarkGraphic,
  stateName: string,
  attrs: any,
  keepCurrentStates: boolean = true,
  hasAnimation?: boolean
) => {
  if (!g.runtimeStateCache) {
    g.runtimeStateCache = {};
  }

  g.runtimeStateCache[stateName] = attrs;

  addGraphicState(g, stateName, keepCurrentStates, hasAnimation);
};
