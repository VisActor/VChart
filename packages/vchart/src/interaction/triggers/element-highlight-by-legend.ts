import { Factory } from '../../core/factory';
import { BaseTrigger } from './base';
import type { IElementHighlightByLegendOptions, ITrigger, ITriggerEventHandler } from './interface';

const type = 'element-highlight-by-legend';
const defaultOptions: Partial<IElementHighlightByLegendOptions> = {
  state: 'highlight'
};

export class ElementHighlightByLegend
  extends BaseTrigger<IElementHighlightByLegendOptions>
  implements ITrigger<IElementHighlightByLegendOptions>
{
  static type: string = type;
  type: string = type;

  static defaultOptions = defaultOptions;
  protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
    throw new Error('Method not implemented.');
  }
}

export const registerElementHighlightByLegend = () => {
  Factory.registerInteractionTrigger(type, ElementHighlightByLegend);
};
