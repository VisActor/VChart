import type { IMarkGraphic } from '../mark/interface';

const normalizeStates = (states?: string | string[]) => (Array.isArray(states) ? states : states ? [states] : []);

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

  graphic.useStates(nextStates, hasAnimation);
};

export const removeGraphicState = (graphic: IMarkGraphic, state: string | string[], hasAnimation?: boolean) => {
  const states = normalizeStates(state);

  if (!states.length) {
    return;
  }

  const currentStates = (graphic.currentStates ?? []) as string[];
  const nextStates = currentStates.filter((stateName: string) => !states.includes(stateName));

  graphic.useStates(nextStates, hasAnimation);
};
