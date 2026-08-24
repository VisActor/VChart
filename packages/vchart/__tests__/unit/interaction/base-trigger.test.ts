import { BaseTrigger } from '../../../src/interaction/triggers/base';
import type { IBaseTriggerOptions, ITriggerEventHandler } from '../../../src/interaction/interface/trigger';

class TestTrigger extends BaseTrigger<IBaseTriggerOptions> {
  type = 'test';
  readonly handler = jest.fn();

  protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
    return [{ type: ['pointerdown', 'none', 'pointermove'], handler: this.handler }];
  }
}

describe('BaseTrigger', () => {
  it('unbinds every event in an array-valued trigger when released', () => {
    const event = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    };
    const trigger = new TestTrigger({ event, interaction: {} as IBaseTriggerOptions['interaction'] });

    trigger.init();
    trigger.release();

    expect(event.on.mock.calls).toEqual([
      ['pointerdown', trigger.handler],
      ['pointermove', trigger.handler]
    ]);
    expect(event.off.mock.calls).toEqual([
      ['pointerdown', trigger.handler],
      ['pointermove', trigger.handler]
    ]);
  });
});
