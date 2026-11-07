import { EventEmitter } from '@visactor/vutils';
import type { IStage } from '@visactor/vrender-core';
import { Compiler } from '../../../src/compile/compiler';
import { Factory } from '../../../src/core/factory';
import type { VChart } from '../../../src/core/vchart';
import { Event } from '../../../src/event/event';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { DimensionHoverEvent } from '../../../src/event/events/dimension/dimension-hover';
import { DimensionClickEvent } from '../../../src/event/events/dimension/dimension-click';
import type { IDimensionInfo } from '../../../src/event/events/dimension/interface';
import type { RenderMode } from '../../../src/typings';

const createEvent = (canvas = new EventEmitter(), mode: RenderMode = 'desktop-browser', scoped = true) => {
  const windowSource = new EventEmitter();
  const stageSource = new EventEmitter();
  const compiler = new Compiler(null, scoped ? { eventSource: { canvas, window: windowSource } } : {});
  compiler['_stage'] = {
    addEventListener: stageSource.on.bind(stageSource),
    removeEventListener: stageSource.off.bind(stageSource),
    window: { addEventListener: canvas.on.bind(canvas), removeEventListener: canvas.off.bind(canvas) }
  } as unknown as IStage;
  const dimensionInfo: IDimensionInfo[] = [{ value: 'A', data: [] }];
  const chart = {
    getOption: () => ({}),
    getAllComponents: () => [{ specKey: 'axes', getScale: () => ({ type: 'band' }) }],
    getModelOption: () => ({
      getDimensionInfo: () => dimensionInfo,
      getDimensionInfoByValue: (_axis: unknown, value: unknown) => (value === 'A' ? dimensionInfo[0] : null)
    })
  };
  const dispatcher = new EventDispatcher({ getChart: () => chart } as unknown as VChart, compiler);
  const event = new Event(dispatcher, mode);
  const move = () => stageSource.emit('pointermove', { viewX: 10, viewY: 20 });
  return { event, dispatcher, canvas, windowSource, stageSource, dimensionInfo, move };
};

describe('[event] DimensionHoverEvent', () => {
  const originalHover = Factory.getComposedEvent('dimensionHover');
  beforeAll(() => Factory.registerComposedEvent('dimensionHover', DimensionHoverEvent));
  afterAll(() => Factory.registerComposedEvent('dimensionHover', originalHover));

  test.each(['pointerout', 'pointercancel'] as const)('programmatic activation is cleared by %s', type => {
    const { event, dispatcher, canvas, dimensionInfo, move } = createEvent();
    const onHover = jest.fn();
    event.on('dimensionHover', onHover);
    const hover = event.getComposedEventMap().get(onHover).event;
    expect(hover.dispatch('A', {})).toEqual(dimensionInfo);
    canvas.emit(type, { type });
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'leave', dimensionInfo }));
    canvas.emit(type, { type });
    expect(onHover).toHaveBeenCalledTimes(2);
    move();
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'enter', dimensionInfo }));
    dispatcher.release();
  });

  test('programmatic activation is committed before a callback cancels it', () => {
    const { event, dispatcher, canvas } = createEvent();
    const onHover = jest.fn(params => {
      if (params.action === 'enter') {
        canvas.emit('pointercancel', { type: 'pointercancel' });
      }
    });
    event.on('dimensionHover', onHover);
    event.getComposedEventMap().get(onHover).event.dispatch('A', {});
    expect(onHover.mock.calls.map(([params]) => params.action)).toEqual(['enter', 'leave']);
    canvas.emit('pointerout', { type: 'pointerout' });
    expect(onHover).toHaveBeenCalledTimes(2);
    dispatcher.release();
  });

  test('an empty programmatic activation does not leave an active hover', () => {
    const { event, dispatcher, canvas } = createEvent();
    const onHover = jest.fn();
    event.on('dimensionHover', onHover);
    expect(event.getComposedEventMap().get(onHover).event.dispatch('missing', {})).toEqual([]);
    canvas.emit('pointerout', { type: 'pointerout' });
    expect(onHover).toHaveBeenCalledTimes(1);
    dispatcher.release();
  });

  test('programmatic dimension click keeps its callback and return value', () => {
    const { dispatcher, dimensionInfo } = createEvent();
    const click = new DimensionClickEvent(dispatcher, 'desktop-browser');
    const onClick = jest.fn();
    click.register('dimensionClick', { query: null, callback: onClick });
    expect(click.dispatch('A', {})).toEqual(dimensionInfo);
    expect(onClick).toHaveBeenCalledWith({ action: 'enter', dimensionInfo });
    click.unregister();
    dispatcher.release();
  });

  test('scoped pointercancel reaches public listeners and clears hover without pointerout', () => {
    const { event, dispatcher, canvas, dimensionInfo, move } = createEvent();
    const onCancel = jest.fn();
    const onHover = jest.fn();
    const cancel = { type: 'pointercancel', pointerId: 1 };

    event.on('pointercancel', { source: 'canvas' }, onCancel);
    event.on('dimensionHover', onHover);
    move();
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'enter', dimensionInfo }));

    canvas.emit('pointercancel', cancel);
    expect(onCancel).toHaveBeenCalledWith(expect.objectContaining({ source: 'canvas', event: cancel }));
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'leave', dimensionInfo }));

    canvas.emit('pointercancel', cancel);
    canvas.emit('pointerout', { type: 'pointerout' });
    expect(onHover).toHaveBeenCalledTimes(2);

    move();
    expect(onHover).toHaveBeenCalledTimes(3);
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'enter', dimensionInfo }));

    event.off('pointercancel', onCancel);
    canvas.emit('pointercancel', cancel);
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ action: 'leave', dimensionInfo }));
    dispatcher.release();
    expect(canvas.listenerCount('pointercancel')).toBe(0);
  });

  test.each(['pointercancel', 'pointerout'] as const)('off dimensionHover removes the %s handler', type => {
    const { event, dispatcher, canvas, move } = createEvent();
    const onHover = jest.fn();
    event.on('dimensionHover', onHover);
    move();
    expect(onHover).toHaveBeenCalledTimes(1);

    event.off('dimensionHover', onHover);
    canvas.emit(type, { type });
    move();
    expect(onHover).toHaveBeenCalledTimes(1);
    expect(dispatcher['_canvasBubbles'].size).toBe(0);
    expect(canvas.listenerCount(type)).toBe(0);
    dispatcher.release();
  });

  test.each([
    ['desktop-browser', true],
    ['mobile-browser', true],
    ['desktop-browser', false],
    ['mobile-browser', false]
  ] as const)('repeated on/off cleans handlers in %s, scoped=%s', (mode, scoped) => {
    const { event, dispatcher, canvas, stageSource, move } = createEvent(new EventEmitter(), mode, scoped);
    const onHover = jest.fn();
    for (let i = 0; i < 10; i++) {
      event.on('dimensionHover', onHover);
      move();
      event.off('dimensionHover', onHover);
      expect(dispatcher['_canvasBubbles'].size).toBe(0);
      expect(dispatcher['_viewBubbles'].size).toBe(0);
      expect(canvas.eventNames()).toEqual([]);
      expect(stageSource.eventNames()).toEqual([]);
    }
    expect(onHover).toHaveBeenCalledTimes(10);
    event.on('dimensionHover', onHover);
    move();
    canvas.emit('pointercancel', { type: 'pointercancel' });
    expect(onHover).toHaveBeenCalledTimes(12);
    event.off('dimensionHover');
    expect(dispatcher['_canvasBubbles'].size).toBe(0);
    dispatcher.release();
  });

  test('off removes only its own hover handler and preserves another chart on the same source', () => {
    const a = createEvent();
    const b = createEvent(a.canvas);
    const onA = jest.fn();
    const onB = jest.fn();
    const onOtherChart = jest.fn();
    a.event.on('dimensionHover', onA);
    a.event.on('dimensionHover', onB);
    b.event.on('dimensionHover', onOtherChart);
    a.move();
    b.move();

    a.event.off('dimensionHover', onA);
    expect(a.dispatcher['_canvasBubbles'].get('pointercancel').getCount()).toBe(1);
    expect(a.dispatcher['_canvasBubbles'].get('pointerout').getCount()).toBe(1);
    a.canvas.emit('pointercancel', { type: 'pointercancel' });
    expect(onA).toHaveBeenCalledTimes(1);
    expect(onB).toHaveBeenCalledTimes(2);
    expect(onOtherChart).toHaveBeenCalledTimes(2);

    a.event.release();
    expect(a.dispatcher['_canvasBubbles'].size).toBe(0);
    expect(a.canvas.listenerCount('pointercancel')).toBe(1);
    b.move();
    a.canvas.emit('pointerout', { type: 'pointerout' });
    expect(onA).toHaveBeenCalledTimes(1);
    expect(onB).toHaveBeenCalledTimes(2);
    expect(onOtherChart).toHaveBeenCalledTimes(4);
    b.event.off('dimensionHover', onOtherChart);
    expect(a.canvas.eventNames()).toEqual([]);
    a.dispatcher.release();
    b.dispatcher.release();
  });

  test.each(['canvas', 'window', 'chart'] as const)('public pointercancel connects and disconnects %s', source => {
    const { event, dispatcher, canvas, windowSource, stageSource } = createEvent();
    const emitter = { canvas, window: windowSource, chart: stageSource }[source];
    const onCancel = jest.fn();
    event.on('pointercancel', { source }, onCancel);
    emitter.emit('pointercancel', { type: 'pointercancel' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledWith(expect.objectContaining({ source }));
    event.off('pointercancel', onCancel);
    emitter.emit('pointercancel', { type: 'pointercancel' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(emitter.listenerCount('pointercancel')).toBe(0);
    dispatcher.release();
  });

  test('off cancels pending debounced hover callbacks', async () => {
    const { event, dispatcher, move } = createEvent();
    const onHover = jest.fn();
    const onActive = jest.fn();
    try {
      event.on('dimensionHover', { debounce: 10 }, onHover);
      const completed = new Promise<void>(resolve => {
        event.on('dimensionHover', { debounce: 10 }, params => {
          onActive(params);
          resolve();
        });
      });
      move();
      event.off('dimensionHover', onHover);
      await completed;
      expect(onActive).toHaveBeenCalledTimes(1);
      expect(onHover).not.toHaveBeenCalled();
    } finally {
      event.release();
      dispatcher.release();
    }
  });
});
