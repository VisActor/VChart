import type { IMarkGraphic } from '../mark/interface';

const normalizeStates = (states?: string | string[]) => (Array.isArray(states) ? states : states ? [states] : []);

const isSameStates = (currentStates: readonly string[] | undefined, nextStates: readonly string[]) => {
  const current = currentStates ?? [];
  if (current.length !== nextStates.length) {
    return false;
  }

  return current.every((stateName, index) => stateName === nextStates[index]);
};

const syncGraphicStates = (graphic: IMarkGraphic, nextStates: string[], hasAnimation?: boolean) => {
  if (isSameStates(graphic.currentStates, nextStates)) {
    graphic.invalidateResolver?.();
    return;
  }

  if (graphic.setStates) {
    graphic.setStates(nextStates, hasAnimation);
    return;
  }

  graphic.useStates(nextStates, hasAnimation);
};

export const addGraphicState = (
  graphic: IMarkGraphic,
  state: string,
  keepCurrentStates: boolean = true,
  hasAnimation?: boolean
) => {
  if (!state) {
    return;
  }

  const currentStates = keepCurrentStates ? graphic.currentStates ?? [] : [];
  const nextStates = keepCurrentStates ? Array.from(new Set([...currentStates, state])) : [state];

  syncGraphicStates(graphic, nextStates, hasAnimation);
};

export const removeGraphicState = (graphic: IMarkGraphic, state: string | string[], hasAnimation?: boolean) => {
  const states = normalizeStates(state);

  if (!states.length) {
    return;
  }

  const currentStates = (graphic.currentStates ?? []) as string[];
  const nextStates = currentStates.filter((stateName: string) => !states.includes(stateName));

  syncGraphicStates(graphic, nextStates, hasAnimation);
};
