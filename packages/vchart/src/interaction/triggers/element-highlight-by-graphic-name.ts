import { Factory } from '../../core/factory';
import { ElementHighlight } from './element-highlight';
import type { BaseEventParams } from '../../event/interface';
import { isNil } from '@visactor/vutils';

const type = 'element-highlight-by-graphic-name';

export class ElementHighlightByGraphicName extends ElementHighlight {
  static type: string = type;
  type: string = type;

  protected _filterByName(e: BaseEventParams) {
    const name = e?.target?.name;
    return !!name;
  }

  protected _parseTargetKey(e: BaseEventParams) {
    return e.target.name;
  }

  start(itemKey: string) {
    if (isNil(itemKey)) {
      return;
    }

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = el.getGraphicItem()?.name === itemKey;
        if (isHighlight) {
          el.updateStates({
            [this.options.blurState]: false,
            [this.options.highlightState]: true
          });
        } else {
          el.updateStates({
            [this.options.blurState]: true,
            [this.options.highlightState]: false
          });
        }
      });
    });
  }

  reset() {
    const states = [this.options.blurState, this.options.highlightState];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(states);
      });
    });
  }

  handleStart = (e: BaseEventParams) => {
    if (e && e.element && this._marks.includes(e.element.mark)) {
      const shouldStart = this.options.shouldStart ? this.options.shouldStart(e) : this._filterByName(e);
      if (shouldStart) {
        const itemKey = this._parseTargetKey(e, e.element);
        this.start(itemKey);
      }
    }
  };

  handleReset = (e: BaseEventParams) => {
    if (e && e.element && this._marks.includes(e.element.mark)) {
      this.reset();
    }
  };
}

export const registerElementHighlightByGraphicName = () => {
  Factory.registerInteractionTrigger(ElementHighlightByGraphicName.type, ElementHighlightByGraphicName);
};
