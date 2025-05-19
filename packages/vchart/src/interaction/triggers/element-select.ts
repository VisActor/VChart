import { isArray } from '@visactor/vutils';
import { STATE_VALUE_ENUM } from '../../compile/mark/interface';
import type { IElementSelectOptions, ITrigger } from '../interface/trigger';
import type { IMarkGraphic } from '../../mark/interface/common';
import { BaseTrigger } from './base';
import { parseTriggerOffOfSelect } from './util';
import { Factory } from '../../core/factory';
import { TRIGGER_TYPE_ENUM } from './enum';
import type { BaseEventParams } from '../../event/interface';

const defaultOptions: Partial<IElementSelectOptions> = {
  state: STATE_VALUE_ENUM.STATE_SELECTED,
  trigger: 'click'
};

export class ElementSelect extends BaseTrigger<IElementSelectOptions> implements ITrigger<IElementSelectOptions> {
  static type: string = TRIGGER_TYPE_ENUM.ELEMENT_SELECT;
  type: string = TRIGGER_TYPE_ENUM.ELEMENT_SELECT;

  static defaultOptions = defaultOptions;
  protected _resetType: ('view' | 'self' | 'timeout')[] = [];

  private _timer?: number;

  constructor(options?: IElementSelectOptions) {
    super(options);
    this.options = Object.assign({}, defaultOptions, options);

    this.updateMarkIdByState([this.options.state, this.options.reverseState]);
  }

  getStartState(): string {
    return this.options.state;
  }

  getResetState(): string {
    return this.options.reverseState;
  }

  protected getEvents() {
    const triggerOff = this.options.triggerOff;
    const trigger = this.options.trigger;

    const events = [
      {
        type: trigger,
        handler: this.handleStart
      }
    ];

    const { eventNames, resetType } = parseTriggerOffOfSelect(triggerOff);

    eventNames.forEach(evt => {
      if (evt && (isArray(trigger) ? !trigger.includes(evt) : evt !== trigger)) {
        events.push({ type: evt, handler: this.handleReset });
      }
    });

    this._resetType = resetType;

    return events;
  }

  resetAll = () => {
    const { state, reverseState, interaction } = this.options;

    const statedGraphics = interaction.getStatedGraphics(this);

    if (statedGraphics && statedGraphics.length) {
      interaction.clearAllStatesOfTrigger(this, state, reverseState);
      this.dispatchEvent('reset', { graphics: statedGraphics, options: this.options });

      interaction.setStatedGraphics(this, []);
    }
  };

  handleStart = (e: BaseEventParams) => {
    this.start(e.item);
  };

  handleReset = (e: BaseEventParams) => {
    const { interaction } = this.options;

    const statedGraphics = interaction.getStatedGraphics(this);
    if (!statedGraphics || !statedGraphics.length) {
      return;
    }
    const markGraphic = e.item;
    const hasActiveElement = markGraphic && this._markSet.getMarkInId(markGraphic.context.markId);

    if (this._resetType.includes('view') && !hasActiveElement) {
      this.resetAll();
    } else if (this._resetType.includes('self') && hasActiveElement) {
      this.resetAll();
    }
  };

  start(markGraphic: IMarkGraphic) {
    const { state, reverseState, isMultiple, interaction } = this.options;
    const statedGraphics = interaction.getStatedGraphics(this);

    if (markGraphic && this._markSet.getMarkInId(markGraphic.context.markId)) {
      if (markGraphic.hasState(state)) {
        if (this._resetType.includes('self')) {
          const newStatedGraphics = statedGraphics && statedGraphics.filter(g => g !== markGraphic);

          if (newStatedGraphics && newStatedGraphics.length) {
            interaction.setStatedGraphics(
              this,
              interaction.updateStates(this, newStatedGraphics, statedGraphics, state, reverseState)
            );
          } else {
            this.resetAll();
          }
        }
      } else {
        if (this._timer) {
          clearTimeout(this._timer);
        }
        markGraphic.addState(state, true);

        const newStatedGraphics = this.options.interaction.updateStates(
          this,
          isMultiple && statedGraphics ? [...statedGraphics, markGraphic] : [markGraphic],
          statedGraphics,
          state,
          reverseState
        );
        interaction.setStatedGraphics(this, newStatedGraphics);
        this.dispatchEvent('start', { graphics: newStatedGraphics, options: this.options });

        if (this._resetType.includes('timeout')) {
          this._timer = setTimeout(() => {
            this.resetAll();
          }, this.options.triggerOff as number) as unknown as number;
        }
      }
    } else if (this._resetType.includes('view') && statedGraphics && statedGraphics.length) {
      this.resetAll();
    }
  }

  reset(markGraphic: IMarkGraphic) {
    if (markGraphic) {
      if (this._markSet.getMarkInId(markGraphic.context.markId)) {
        markGraphic.removeState([this.options.state, this.options.reverseState]);
      }
    } else {
      this.resetAll();
    }
  }
}

export const registerElementSelect = () => {
  Factory.registerInteractionTrigger(ElementSelect.type, ElementSelect);
};
