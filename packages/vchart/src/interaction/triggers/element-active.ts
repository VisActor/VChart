import { Factory } from '../../core/factory';
import { BaseTrigger } from './base';
import type { IElementActiveOptions, ITrigger, ITriggerEventHandler } from './interface';

const type = 'element-select';
const defaultOptions: Partial<IElementActiveOptions> = {
  state: 'active',
  trigger: 'click'
};

export class ElementActive extends BaseTrigger<IElementActiveOptions> implements ITrigger<IElementActiveOptions> {
  static type: string = type;
  type: string = type;

  static defaultOptions = defaultOptions;
  protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
    throw new Error('Method not implemented.');
  }
}

export const registerElementActive = () => {
  Factory.registerInteractionTrigger(type, ElementActive);
};
