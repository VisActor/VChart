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
    reverseState: string,
    keepGraphics?: Set<IMarkGraphic>
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
        } else if (keepGraphics?.has(g)) {
          // 同一次 setSelected 里由另一个拆分触发器选中，不能在这里打成反选。
          if (hasReverse && graphicHasState(g, reverseState)) {
            removeGraphicState(g, reverseState, hasAnimation);
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
      if (this._hasSplitElementSelect(triggers)) {
        this._updateSplitTriggerGraphics(triggers, markGraphics);
        return;
      }

      triggers.forEach(t => {
        const newStatedGraphics = this._graphicsOnTriggerMarks(t, markGraphics);

        this.updateStates(t, newStatedGraphics, this.getStatedGraphics(t), t.getStartState(), t.getResetState());

        this.setStatedGraphics(t, newStatedGraphics);
      });
    }
  }

  private _graphicsOnTriggerMarks(trigger: ITrigger, markGraphics: IMarkGraphic[]) {
    return markGraphics.filter(mg => {
      return trigger.getMarks().some(m => {
        const graphics = m && m.getGraphics();

        return graphics && graphics.includes(mg);
      });
    });
  }

  /**
   * 同一状态下至少有两个 element-select，且图元范围有交集（拆开的 line / point）。
   * 柱线组合图里互不重叠的系列不走这条路径。
   */
  private _hasSplitElementSelect(triggers: ITrigger[]) {
    let elementSelectCount = 0;
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i]?.type === TRIGGER_TYPE_ENUM.ELEMENT_SELECT) {
        elementSelectCount++;
      }
    }
    if (elementSelectCount < 2) {
      return false;
    }

    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      if (trigger?.type !== TRIGGER_TYPE_ENUM.ELEMENT_SELECT) {
        continue;
      }
      const peers = this._peerElementSelects(trigger);
      for (let j = 0; j < peers.length; j++) {
        if (triggers.includes(peers[j])) {
          return true;
        }
      }
    }
    return false;
  }

  private _peerSelectGroup(trigger: ITrigger, pool: Set<ITrigger>) {
    const group: ITrigger[] = [];
    const seen = new Set<ITrigger>();
    const queue: ITrigger[] = [trigger];

    while (queue.length) {
      const current = queue.pop();
      if (!current || seen.has(current) || !pool.has(current)) {
        continue;
      }
      seen.add(current);
      group.push(current);
      this._peerElementSelects(current).forEach(peer => {
        if (!seen.has(peer)) {
          queue.push(peer);
        }
      });
    }

    return group;
  }

  /**
   * setSelected 一次命中拆开的多种图元时，整批是同一份目标。
   * 逐个触发器走互斥释放会把前一个刚选中的图元清掉，并打成 selected_reverse。
   */
  private _updateSplitTriggerGraphics(triggers: ITrigger[], markGraphics: IMarkGraphic[]) {
    const graphicsByTrigger = new Map<ITrigger, IMarkGraphic[]>();
    triggers.forEach(trigger => {
      graphicsByTrigger.set(trigger, this._graphicsOnTriggerMarks(trigger, markGraphics));
    });

    const consumed = new Set<ITrigger>();
    const pool = new Set(triggers);

    triggers.forEach(trigger => {
      if (consumed.has(trigger)) {
        return;
      }

      const group = this._peerSelectGroup(trigger, pool);
      const assignments = group.map(item => ({
        trigger: item,
        graphics: graphicsByTrigger.get(item) ?? []
      }));
      const hasBatchTarget = assignments.some(item => item.graphics.length);

      if (group.length > 1 && hasBatchTarget) {
        group.forEach(item => consumed.add(item));
        this._updateSplitSelectBatch(assignments);
        return;
      }

      consumed.add(trigger);
      const graphics = graphicsByTrigger.get(trigger) ?? [];
      this.updateStates(
        trigger,
        graphics,
        this.getStatedGraphics(trigger),
        trigger.getStartState(),
        trigger.getResetState()
      );
      this.setStatedGraphics(trigger, graphics);
    });
  }

  private _updateSplitSelectBatch(assignments: { trigger: ITrigger; graphics: IMarkGraphic[] }[]) {
    const keep = new Set<IMarkGraphic>();
    assignments.forEach(({ graphics }) => {
      graphics.forEach(graphic => {
        if (graphic) {
          keep.add(graphic);
        }
      });
    });

    assignments.forEach(({ trigger, graphics }) => {
      const state = trigger.getStartState();
      const prev = this.getStatedGraphics(trigger);
      if (state && prev?.length) {
        const markById = this._getMarkById(trigger);
        prev.forEach(graphic => {
          if (!graphic || keep.has(graphic) || !graphicHasState(graphic, state)) {
            return;
          }
          removeGraphicState(graphic, state, this._hasAnimationByGraphicState(graphic, markById));
        });
      }
      this.addBothStateOfGraphics(trigger, graphics, state, trigger.getResetState(), keep);
      this.setStatedGraphics(trigger, graphics);
    });
  }
}
