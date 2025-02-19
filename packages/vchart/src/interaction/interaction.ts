import type { StateValue } from '../compile/mark';
import type { IMarkGraphic } from '../mark/interface';
import type { IInteraction } from './interface/common';
import type { ITrigger } from './interface/trigger';

export class Interaction implements IInteraction {
  private _stateGraphicsByTrigger: Map<ITrigger, IMarkGraphic[]> = new Map();

  private _disableTriggerEvent: boolean = false;

  setDisableActiveEffect(disable: boolean) {
    this._disableTriggerEvent = disable;
  }

  private _triggerMapByState: Map<StateValue, ITrigger[]> = new Map();
  addTrigger(trigger: ITrigger) {
    if (trigger) {
      const startState = trigger.getStartState();
      const resetState = trigger.getResetState();

      [startState, resetState].forEach(state => {
        if (state) {
          if (this._triggerMapByState.get(state)) {
            this._triggerMapByState.get(state).push(trigger);
          } else {
            this._triggerMapByState.set(state, [trigger]);
          }
        }
      });
    }
  }

  setStatedGraphics(trigger: ITrigger, graphics: IMarkGraphic[]) {
    this._stateGraphicsByTrigger.set(trigger, graphics);
  }

  getStatedGraphics(trigger: ITrigger) {
    return this._stateGraphicsByTrigger.get(trigger);
  }

  updateStates(
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics?: IMarkGraphic[],
    state?: string,
    reverseState?: string
  ) {
    if (this._disableTriggerEvent) {
      return;
    }

    if (!newStatedGraphics || !newStatedGraphics.length) {
      return null;
    }
    if (state && reverseState) {
      if (prevStatedGraphics && prevStatedGraphics.length) {
        // toggle
        this.toggleReverseStateOfGraphics(trigger, newStatedGraphics, prevStatedGraphics, reverseState);
        this.toggleStateOfGraphics(trigger, newStatedGraphics, prevStatedGraphics, state);
      } else {
        // update all the elements
        this.addBothStateOfGraphics(trigger, newStatedGraphics, state, reverseState);
      }
    } else if (state) {
      if (prevStatedGraphics && prevStatedGraphics.length) {
        this.toggleStateOfGraphics(trigger, newStatedGraphics, prevStatedGraphics, state);
      } else {
        this.addStateOfGraphics(trigger, newStatedGraphics, state);
      }
    }

    return newStatedGraphics;
  }

  protected toggleReverseStateOfGraphics(
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics: IMarkGraphic[],
    reverseState: string
  ) {
    const markIdByState = trigger.getMarkIdByState();

    prevStatedGraphics.forEach(g => {
      const hasReverse =
        reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(g.context.markId);

      if (hasReverse) {
        g.addState(reverseState, true);
      }
    });

    newStatedGraphics.forEach(g => {
      const hasReverse =
        reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(g.context.markId);

      if (hasReverse) {
        g.removeState(reverseState);
      }
    });
  }

  protected toggleStateOfGraphics(
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics: IMarkGraphic[],
    state: string
  ) {
    const markIdByState = trigger.getMarkIdByState();

    prevStatedGraphics.forEach(g => {
      const hasState = state && markIdByState[state] && markIdByState[state].includes(g.context.markId);

      if (hasState) {
        g.removeState(state);
      }
    });

    newStatedGraphics.forEach(g => {
      const hasState = state && markIdByState[state] && markIdByState[state].includes(g.context.markId);

      if (hasState) {
        g.addState(state, true);
      }
    });
  }

  protected addBothStateOfGraphics(
    trigger: ITrigger,
    statedGraphics: IMarkGraphic[],
    state: string,
    reverseState: string
  ) {
    const marks = trigger.getMarks();
    const markIdByState = trigger.getMarkIdByState();

    marks.forEach(m => {
      const hasReverse = reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(m.id);
      const hasState = state && markIdByState[state] && markIdByState[state].includes(m.id);

      if (!hasReverse && !hasState) {
        return;
      }

      m.getGraphics()?.forEach(g => {
        const isStated = statedGraphics && statedGraphics.includes(g);

        if (isStated) {
          if (hasState) {
            g.addState(state, true);
          }
        } else {
          if (hasReverse) {
            g.addState(reverseState, true);
          }
        }
      });
    });
  }

  protected addStateOfGraphics(trigger: ITrigger, statedGraphics: IMarkGraphic[], state: string) {
    const marks = trigger.getMarks();
    const markIdByState = trigger.getMarkIdByState();

    marks.forEach(mark => {
      const hasState = state && markIdByState[state] && markIdByState[state].includes(mark.id);

      if (!hasState) {
        return;
      }

      mark.getGraphics()?.forEach(g => {
        const isStated = statedGraphics && statedGraphics.includes(g);

        if (isStated) {
          if (hasState) {
            g.addState(state, true);
          }
        }
      });
    });
  }

  clearAllStates(trigger: ITrigger, state?: string, reverseState?: string) {
    if (this._disableTriggerEvent) {
      return;
    }

    const statedGraphics = this.getStatedGraphics(trigger);

    if (!statedGraphics || !statedGraphics.length) {
      return;
    }
    const marks = trigger.getMarks();
    const markIdByState = trigger.getMarkIdByState();

    marks.forEach(mark => {
      if (mark) {
        const graphics = mark.getGraphics();

        if (graphics && graphics.length) {
          if (reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(mark.id)) {
            graphics.forEach(g => {
              g.removeState(reverseState);
            });
          }

          if (state && markIdByState[state] && markIdByState[state].includes(mark.id)) {
            graphics.forEach(g => {
              if (statedGraphics.includes(g)) {
                g.removeState(state);
              }
            });
          }
        }
      }
    });
  }
}
