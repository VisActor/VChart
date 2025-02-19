import { isArray } from '@visactor/vutils';
import type { DimensionEventParams } from '../../event/events/dimension/interface';
// eslint-disable-next-line no-duplicate-imports
import { DimensionEventEnum } from '../../event/events/dimension/interface';
import type { IMarkGraphic } from '../../mark/interface';
import { STATE_VALUE_ENUM } from '../../compile/mark/interface';
import { getDatumOfGraphic } from '../../util';
import type { ISeries } from '../../series';
import type { IDimensionHoverOptions, ITrigger } from './interface';
import { BaseTrigger } from './base';
import { Factory } from '../../core/factory';

const type = 'element-select';
const defaultOptions: Partial<IDimensionHoverOptions> = {
  state: STATE_VALUE_ENUM.STATE_DIMENSION_HOVER,
  reverseState: STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE,
  trigger: DimensionEventEnum.dimensionHover
};

export class DimensionHover extends BaseTrigger<IDimensionHoverOptions> implements ITrigger<IDimensionHoverOptions> {
  static type: string = type;
  type: string = type;

  static defaultOptions = defaultOptions;
  protected _resetType: ('view' | 'self' | 'timeout')[] = [];

  private _timer?: number;
  protected _statedGraphics?: IMarkGraphic[];

  constructor(options?: IDimensionHoverOptions) {
    super(options);
    this.options = Object.assign({}, defaultOptions, options);

    // this._marks = view.getMarksBySelector(this.options.selector);
    this.updateMarkIdByState([this.options.state, this.options.reverseState]);
  }

  getStartState(): string {
    return this.options.state;
  }

  getResetState(): string {
    return this.options.reverseState;
  }

  protected getEvents() {
    const trigger = this.options.trigger;

    return [
      {
        type: trigger,
        handler: this.handleStart
      }
    ];
  }

  resetAll = () => {
    const { state, reverseState } = this.options;

    if (this._statedGraphics && this._statedGraphics.length) {
      this.options.interaction.clearAllStates(this, state, reverseState);
      this.dispatchEvent('reset', { elements: this._statedGraphics, options: this.options });

      this._statedGraphics = [];
    }
  };

  protected getStatedGraphics(params: DimensionEventParams, reverse: boolean = false) {
    const marks = this.getMarksByState(reverse ? this.options.reverseState : this.options.state);

    const items: IMarkGraphic[] = [];
    params.dimensionInfo.forEach(df => {
      df.data.forEach(dd => {
        const seriesMark = marks.filter(m => (m.model as unknown as ISeries) === dd.series && m.getVisible());

        seriesMark.forEach(m => {
          const graphics = m.getGraphics();
          if (!graphics || !graphics.length) {
            return;
          }

          const elements = graphics.filter(g => {
            const datum = getDatumOfGraphic(g);
            let c;
            if (isArray(datum)) {
              c = datum.every((oneData, i) => oneData === dd.datum[i]);
            } else {
              c = dd.datum.some(dd_d => dd_d === datum);
            }
            return reverse ? !c : c;
          });
          items.push(...elements);
        });
      });
    });

    return items;
  }

  handleStart = (params: DimensionEventParams) => {
    const interaction = this.options.interaction;

    switch (params.action) {
      case 'enter':
        interaction.updateStates(
          this,
          this.getStatedGraphics(params),
          interaction.getStatedGraphics(this),
          this.options.state,
          this.options.reverseState
        );

        break;
      case 'leave':
        interaction.clearAllStates(this, this.options.state, this.options.reverseState);
        break;
      case 'click':
      case 'move':
      default:
        break;
    }
  };
}

export const registerDimensionHover = () => {
  Factory.registerInteractionTrigger(DimensionHover.type, DimensionHover);
};
