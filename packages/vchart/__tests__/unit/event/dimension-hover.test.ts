import { DimensionHoverEvent } from '../../../src/event/events/dimension/dimension-hover';

describe('[event] DimensionHoverEvent', () => {
  test('unregisters every desktop event it registers', () => {
    const eventDispatcher = {
      register: jest.fn(),
      unregister: jest.fn()
    };
    const event = new DimensionHoverEvent(eventDispatcher as any, 'desktop-browser');

    event.register('dimensionHover', { callback: jest.fn(), query: {} } as any);
    event.unregister();

    expect(eventDispatcher.unregister).toHaveBeenCalledWith('pointermove', {
      query: null,
      callback: expect.any(Function)
    });
    expect(eventDispatcher.unregister).toHaveBeenCalledWith('pointerout', {
      query: null,
      callback: expect.any(Function)
    });
  });
});
