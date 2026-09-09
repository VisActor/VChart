import { BaseTrigger } from '../../../src/interaction/triggers/base';
import type { IBaseTriggerOptions, ITriggerEventHandler } from '../../../src/interaction/interface/trigger';
import type { IInteraction } from '../../../src/interaction/interface/common';

describe('BaseTrigger', () => {
  it('unregisters every event in an array when released', () => {
    const handler = jest.fn();
    const event = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    };
    const trigger = new (class extends BaseTrigger<IBaseTriggerOptions> {
      protected getEvents(): Array<{ type: string | string[]; handler: ITriggerEventHandler }> {
        return [{ type: ['pointerdown', 'pointerup'], handler }];
      }
    })({ event, interaction: {} as IInteraction });

    trigger.init();
    event.on.mockClear();
    event.off.mockClear();

    trigger.release();

    expect(event.on).not.toHaveBeenCalled();
    expect(event.off).toHaveBeenNthCalledWith(1, 'pointerdown', handler);
    expect(event.off).toHaveBeenNthCalledWith(2, 'pointerup', handler);
  });
});
