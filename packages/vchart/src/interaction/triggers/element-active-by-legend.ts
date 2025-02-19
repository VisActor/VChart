import { Factory } from '../../core/factory';
import { BaseTrigger } from './base';
import type { IElementActiveByLegendOptions, ITrigger, ITriggerEventHandler } from './interface';

const type = 'element-active-by-legend';
const defaultOptions: Partial<IElementActiveByLegendOptions> = {
  state: 'active'
};

export class ElementActiveByLegend
  extends BaseTrigger<IElementActiveByLegendOptions>
  implements ITrigger<IElementActiveByLegendOptions>
{
  static type: string = type;
  type: string = type;

  static defaultOptions = defaultOptions;
  protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
    throw new Error('Method not implemented.');
  }
}

export const registerElementActiveByLegend = () => {
  Factory.registerInteractionTrigger(type, ElementActiveByLegend);
};
