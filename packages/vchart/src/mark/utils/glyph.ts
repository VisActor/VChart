import type { IMarkGraphic } from '../interface/common';

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

  if (g.hasState(stateName)) {
    g.removeState(stateName);
  }
  g.addState(stateName, keepCurrentStates, hasAnimation);
};
