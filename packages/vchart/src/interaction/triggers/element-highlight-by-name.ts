import { Factory } from '../../core/factory';
import { BaseTrigger } from './base';
import type { IElementHighlightOptions, ITrigger, ITriggerEventHandler } from './interface';

const type = 'element-highlight-by-name';
const defaultOptions: Partial<IElementHighlightOptions> = {
  state: 'active',
  trigger: 'click'
};

export class ElementHighlightByName
  extends BaseTrigger<IElementHighlightOptions>
  implements ITrigger<IElementHighlightOptions>
{
  static type: string = type;
  type: string = type;

  static defaultOptions = defaultOptions;
  protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
    throw new Error('Method not implemented.');
  }
}

export const registerElementHighlightByName = () => {
  Factory.registerInteractionTrigger(type, ElementHighlightByName);
};
