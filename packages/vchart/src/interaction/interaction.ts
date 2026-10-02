import type { StateValue } from '../compile/mark';
import type { IMark, IMarkGraphic } from '../mark/interface';
import type { IInteraction } from './interface/common';
import type { ITrigger } from './interface/trigger';
import { TRIGGER_TYPE_ENUM } from './triggers/enum';
import { addGraphicState, removeGraphicState } from '../util/graphic-state';

const graphicHasState = (graphic: IMarkGraphic, state?: string) => {
  if (!state || !graphic) {
    return false;
  }
  if (typeof graphic.hasState === 'function') {
    return graphic.hasState(state);
  }
  return !!graphic.currentStates?.includes(state);
};

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
          const stateTrigger = this._triggerMapByState.get(state);

          if (stateTrigger) {
            !stateTrigger.includes(trigger) && stateTrigger.push(trigger);
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

  hasActiveLinkedSelect(trigger: ITrigger) {
    const stated = this.getStatedGraphics(trigger);
    if (stated?.length) {
      return true;
    }
    return this._peerElementSelects(trigger).some(peer => !!this.getStatedGraphics(peer)?.length);
  }

  isGraphicInLinkedSelect(trigger: ITrigger, graphic: IMarkGraphic) {
    const markId = graphic?.context?.markId;
    if (markId == null) {
      return false;
    }
    return this._peerElementSelects(trigger).some(peer => peer.getMarks().some(mark => mark && mark.id === markId));
  }

  clearLinkedSelectStates(trigger: ITrigger) {
    if (this._disableTriggerEvent) {
      return [];
    }

    const cleared: IMarkGraphic[] = [];
    [trigger, ...this._peerElementSelects(trigger)].forEach(item => {
      const stated = this.getStatedGraphics(item);
      if (!stated?.length) {
        return;
      }
      cleared.push(...stated);
      this.clearAllStatesOfTrigger(item, item.getStartState(), item.getResetState());
      this.setStatedGraphics(item, []);
    });
    return cleared;
  }

  private _elementSelectScopeIds(trigger: ITrigger) {
    const ids = new Set<number>();
    trigger.getMarks()?.forEach(mark => {
      if (mark) {
        ids.add(mark.id);
      }
    });
    trigger.options?.reverseMarks?.forEach((mark: IMark) => {
      if (mark) {
        ids.add(mark.id);
      }
    });
    return ids;
  }

  /**
   * 只关联拆开后仍共享 selected / selected_reverse 的 element-select。
   * 图元范围没有交集的系列（例如柱线组合图里的 bar 与 line）保持各自选中。
   */
  private _peerElementSelects(trigger: ITrigger) {
    if (trigger?.type !== TRIGGER_TYPE_ENUM.ELEMENT_SELECT) {
      return [];
    }
    const state = trigger.getStartState();
    const reverseState = trigger.getResetState();
    if (!state || !reverseState) {
      return [];
    }
    const mine = this._elementSelectScopeIds(trigger);
    if (!mine.size) {
      return [];
    }
    const candidates = this._triggerMapByState.get(state);
    if (!candidates?.length) {
      return [];
    }
    return candidates.filter(other => {
      if (other === trigger || other?.type !== TRIGGER_TYPE_ENUM.ELEMENT_SELECT) {
        return false;
      }
      if (other.getStartState() !== state || other.getResetState() !== reverseState) {
        return false;
      }
      const otherIds = this._elementSelectScopeIds(other);
      for (const id of mine) {
        if (otherIds.has(id)) {
          return true;
        }
      }
      return false;
    });
  }

  /**
   * 另一个 trigger 上的 selected 要让出来。只改它记录的已选图元，避免把整组 reverse 清掉后再全量补回。
   */
  private _releasePeerElementSelect(
    trigger: ITrigger,
    state: string,
    reverseState: string,
    nextStated: IMarkGraphic[]
  ) {
    const peers = this._peerElementSelects(trigger);
    if (!peers.length) {
      return;
    }
    const nextStatedSet = new Set(nextStated);
    const reverseIds = trigger.getMarkIdByState()?.[reverseState];

    peers.forEach(peer => {
      const stated = this.getStatedGraphics(peer);
      if (!stated?.length) {
        return;
      }
      const peerReverseIds = peer.getMarkIdByState()?.[reverseState];
      const markById = this._getMarkById(peer);
      stated.forEach(graphic => {
        if (!graphic || nextStatedSet.has(graphic)) {
          return;
        }
        const markId = graphic.context?.markId;
        const hasAnimation = this._hasAnimationByGraphicState(graphic, markById);
        if (graphicHasState(graphic, state)) {
          removeGraphicState(graphic, state, hasAnimation);
        }
        const shouldReverse =
          (reverseIds && markId != null && reverseIds.includes(markId)) ||
          (peerReverseIds && markId != null && peerReverseIds.includes(markId));
        if (shouldReverse && !graphicHasState(graphic, reverseState)) {
          addGraphicState(graphic, reverseState, true, hasAnimation);
        }
      });
      this.setStatedGraphics(peer, []);
    });
  }

  private _getMarkById(trigger: ITrigger) {
    const markById = new Map<number, IMark>();

    trigger.getMarks().forEach(mark => {
      if (mark) {
        markById.set(mark.id, mark);
      }
    });

    return markById;
  }

  private _hasAnimationByGraphicState(graphic: IMarkGraphic, markById: Map<number, IMark>) {
    const mark = (graphic.parent as any)?.mark ?? markById.get(graphic.context.markId);

    return !!(mark as any)?.hasAnimationByState?.('state');
  }

  updateStates(
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics?: IMarkGraphic[],
    state?: string,
    reverseState?: string
  ) {
    if (this._disableTriggerEvent) {
      return [];
    }

    if (!newStatedGraphics || !newStatedGraphics.length) {
      if (prevStatedGraphics && prevStatedGraphics.length) {
        this.clearAllStatesOfTrigger(trigger, state, reverseState);
      }
      return [];
    }
    if (state && reverseState) {
      this._releasePeerElementSelect(trigger, state, reverseState, newStatedGraphics);
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
    const markById = this._getMarkById(trigger);

    prevStatedGraphics.forEach(g => {
      const hasReverse =
        reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(g.context.markId);

      if (hasReverse) {
        const hasAnimation = this._hasAnimationByGraphicState(g, markById);
        addGraphicState(g, reverseState, true, hasAnimation);
      }
    });

    newStatedGraphics.forEach(g => {
      const hasReverse =
        reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(g.context.markId);

      if (hasReverse) {
        const hasAnimation = this._hasAnimationByGraphicState(g, markById);
        removeGraphicState(g, reverseState, hasAnimation);
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
    const markById = this._getMarkById(trigger);

    prevStatedGraphics.forEach(g => {
      const hasState = state && markIdByState[state] && markIdByState[state].includes(g.context.markId);

      if (hasState) {
        const hasAnimation = this._hasAnimationByGraphicState(g, markById);
        removeGraphicState(g, state, hasAnimation);
      }
    });

    newStatedGraphics.forEach(g => {
      const hasState = state && markIdByState[state] && markIdByState[state].includes(g.context.markId);
      if (hasState) {
        const hasAnimation = this._hasAnimationByGraphicState(g, markById);
        addGraphicState(g, state, true, hasAnimation);
      }
    });
  }

  private _marksForReverseState(trigger: ITrigger) {
    const marks = trigger.getMarks();
    const reverseMarks = trigger.options?.reverseMarks;
    if (!reverseMarks?.length) {
      return marks;
    }

    const seen = new Set(marks.map(mark => mark && mark.id));
    const extra = reverseMarks.filter((mark: IMark) => mark && !seen.has(mark.id));
    return extra.length ? marks.concat(extra) : marks;
  }

  protected addBothStateOfGraphics(
    trigger: ITrigger,
    statedGraphics: IMarkGraphic[],
    state: string,
    reverseState: string
  ) {
    const marks = this._marksForReverseState(trigger);
    const markIdByState = trigger.getMarkIdByState();

    marks.forEach(m => {
      const hasReverse = reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(m.id);
      const hasState = state && markIdByState[state] && markIdByState[state].includes(m.id);

      if (!hasReverse && !hasState) {
        return;
      }

      const hasAnimation = (m as any).hasAnimationByState && (m as any).hasAnimationByState('state');
      m.getGraphics()?.forEach(g => {
        const isStated = statedGraphics && statedGraphics.includes(g);
        if (isStated) {
          if (hasState) {
            if (graphicHasState(g, reverseState)) {
              removeGraphicState(g, reverseState, hasAnimation);
            }
            addGraphicState(g, state, true, hasAnimation);
          }
        } else if (hasReverse) {
          if (graphicHasState(g, state)) {
            removeGraphicState(g, state, hasAnimation);
          }
          addGraphicState(g, reverseState, true, hasAnimation);
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

      const hasAnimation = (mark as any).hasAnimationByState && (mark as any).hasAnimationByState('state');

      mark.getGraphics()?.forEach(g => {
        const isStated = statedGraphics && statedGraphics.includes(g);

        if (isStated) {
          if (hasState) {
            addGraphicState(g, state, true, hasAnimation);
          }
        }
      });
    });
  }

  clearAllStatesOfTrigger(trigger: ITrigger, state?: string, reverseState?: string) {
    if (this._disableTriggerEvent) {
      return;
    }

    const statedGraphics = this.getStatedGraphics(trigger);

    if (!statedGraphics || !statedGraphics.length) {
      return;
    }
    const marks = this._marksForReverseState(trigger);
    const markIdByState = trigger.getMarkIdByState();

    marks.forEach(mark => {
      if (mark) {
        const graphics = mark.getGraphics();
        const hasAnimation = (mark as any).hasAnimationByState && (mark as any).hasAnimationByState('state');
        if (graphics && graphics.length) {
          if (reverseState && markIdByState[reverseState] && markIdByState[reverseState].includes(mark.id)) {
            graphics.forEach(g => {
              removeGraphicState(g, reverseState, hasAnimation);
            });
          }

          if (state && markIdByState[state] && markIdByState[state].includes(mark.id)) {
            graphics.forEach(g => {
              if (statedGraphics.includes(g)) {
                removeGraphicState(g, state, hasAnimation);
              }
            });
          }
        }
      }
    });
  }

  clearAllStates() {
    if (this._disableTriggerEvent) {
      return;
    }

    this._triggerMapByState.forEach((triggers, state) => {
      triggers.forEach(trigger => {
        this.clearAllStatesOfTrigger(trigger, state, trigger.getResetState());
      });
    });
  }

  clearByState(stateValue: string) {
    if (this._disableTriggerEvent) {
      return;
    }

    const triggers = this._triggerMapByState.get(stateValue);

    if (triggers && triggers.length) {
      triggers.forEach(t => {
        this.clearAllStatesOfTrigger(t, stateValue, t.getResetState());

        // 更新缓存
        this.setStatedGraphics(t, []);
      });
    }
  }

  updateStateOfGraphics(stateValue: string, markGraphics: IMarkGraphic[]) {
    if (this._disableTriggerEvent) {
      return;
    }
    const triggers = this._triggerMapByState.get(stateValue);

    if (triggers && triggers.length) {
      triggers.forEach(t => {
        const newStatedGraphics = markGraphics.filter(mg => {
          return t.getMarks().some(m => {
            const graphics = m && m.getGraphics();

            return graphics && graphics.includes(mg);
          });
        });

        this.updateStates(t, newStatedGraphics, this.getStatedGraphics(t), t.getStartState(), t.getResetState());

        this.setStatedGraphics(t, newStatedGraphics);
      });
    }
  }
}
