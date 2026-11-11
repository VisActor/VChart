import { EventEmitter } from '@visactor/vutils';
import { Gesture } from '@visactor/vrender-kits';
import {
  EventManager,
  FederatedPointerEvent,
  FederatedWheelEvent,
  type IStage,
  type IEventTarget
} from '@visactor/vrender-core';
import { Compiler } from '../../../src/compile/compiler';
import type { VChart } from '../../../src/core/vchart';
import { Event } from '../../../src/event/event';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import type { BaseEventParams } from '../../../src/event/interface';

const setup = () => {
  const canvas = new EventEmitter();
  const windowSource = new EventEmitter();
  const chart = new EventEmitter();
  const manager = new EventManager(null, {});
  const compiler = new Compiler(null, { eventSource: { canvas, window: windowSource } });
  compiler['_stage'] = {
    eventSystem: { manager },
    addEventListener: chart.on.bind(chart),
    removeEventListener: chart.off.bind(chart)
  } as unknown as IStage;
  const dispatcher = new EventDispatcher({ getChart: (): null => null } as unknown as VChart, compiler);
  const event = new Event(dispatcher, 'desktop-browser');
  return { event, dispatcher, manager, sources: { canvas, window: windowSource, chart } };
};

describe('[event] delayed input', () => {
  test.each(['canvas', 'window', 'chart'] as const)('debounce preserves pooled pointer data from %s', async source => {
    const { event, dispatcher, sources } = setup();
    const input = new FederatedPointerEvent();
    input.type = 'pointerdown';
    input.pointerId = 1;
    input.buttons = 1;
    input.client.x = input.canvas.x = input.viewport.x = 200;
    const completed = new Promise(resolve => {
      event.on('pointerdown', { source, debounce: 20 }, params => resolve(params.event));
    });
    try {
      sources[source].emit('pointerdown', input);
      input.type = 'pointerup';
      input.buttons = 0;
      input.client.x = input.canvas.x = input.viewport.x = 350;
      const saved = await completed;
      expect(saved).toMatchObject({ type: 'pointerdown', clientX: 200, canvasX: 200, viewX: 200, buttons: 1 });
      expect(saved).not.toBe(input);
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test('throttle preserves the trailing pointer event', async () => {
    const { event, dispatcher, sources } = setup();
    const input = new FederatedPointerEvent();
    input.pointerId = 1;
    input.type = 'pointerdown';
    input.buttons = 1;
    input.canvas.x = 200;
    const calls: { type: string; x: number; buttons: number }[] = [];
    const completed = new Promise<void>(resolve => {
      event.on('pointerdown', { source: 'canvas', throttle: 20 }, params => {
        calls.push({ type: params.event.type, x: params.event.canvasX, buttons: params.event.buttons });
        if (calls.length === 2) {
          resolve();
        }
      });
    });
    try {
      sources.canvas.emit('pointerdown', input);
      input.canvas.x = 210;
      sources.canvas.emit('pointerdown', input);
      input.type = 'pointerup';
      input.buttons = 0;
      input.canvas.x = 350;
      await completed;
      expect(calls).toEqual([
        { type: 'pointerdown', x: 200, buttons: 1 },
        { type: 'pointerdown', x: 210, buttons: 1 }
      ]);
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test.each([false, true])('delayed events retain payload and isolate pooled buffers (manager: %s)', async managed => {
    const { event, dispatcher, manager, sources } = setup();
    const payloadKey = Symbol('payload');
    const payload = { value: 42 };
    const target = sources.chart as unknown as IEventTarget;
    const input = Object.assign(new FederatedPointerEvent(managed ? manager : undefined), {
      type: 'pointerdown',
      pointerId: 1,
      timeStamp: 123,
      target,
      currentTarget: target,
      defaultPrevented: true,
      propagationStopped: true,
      propagationImmediatelyStopped: true,
      nativeEvent: {} as PointerEvent,
      originalEvent: new FederatedPointerEvent(),
      path: [target],
      detailPath: [target],
      customPayload: payload,
      [payloadKey]: payload
    });
    input.eventPhase = input.AT_TARGET;
    const coordinates = [
      'layer',
      'page',
      'canvas',
      'viewport',
      'client',
      'movement',
      'offset',
      'global',
      'screen'
    ] as const;
    coordinates.forEach(key => Object.assign(input[key], { x: 200, y: 100 }));
    const completed = new Promise<BaseEventParams['event']>(resolve => {
      event.on('pointerdown', { source: 'canvas', debounce: 20 }, params => resolve(params.event));
    });
    try {
      sources.canvas.emit('pointerdown', input);
      coordinates.forEach(key => Object.assign(input[key], { x: 350, y: 250 }));
      input.path.length = input.detailPath.length = 0;
      input.customPayload = { value: 99 };
      const saved = await completed;
      expect(saved).toBeInstanceOf(FederatedPointerEvent);
      expect(saved.manager).toBe(input.manager);
      expect(saved.timeStamp).toBe(123);
      expect(saved.target).toBe(target);
      expect(saved.currentTarget).toBeNull();
      expect(saved.eventPhase).toBe(saved.NONE);
      expect(saved.defaultPrevented).toBe(false);
      expect(saved.propagationStopped).toBe(false);
      expect(saved.propagationImmediatelyStopped).toBe(false);
      expect(input.currentTarget).toBe(target);
      expect(input.defaultPrevented).toBe(true);
      expect(input.propagationStopped).toBe(true);
      expect(input.propagationImmediatelyStopped).toBe(true);
      expect(saved.nativeEvent).toBe(input.nativeEvent);
      expect(saved.originalEvent).toBe(input.originalEvent);
      expect(saved.customPayload).toBe(payload);
      expect(Reflect.get(saved, payloadKey)).toBe(payload);
      expect(saved.path).toEqual([target]);
      expect(saved.detailPath).toEqual([target]);
      coordinates.forEach(key => expect(saved[key]).toEqual({ x: 200, y: 100 }));
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test('throttle leading callback stops subsequent engine listeners on the original event', () => {
    const { event, dispatcher, manager, sources } = setup();
    manager.rootTarget = sources.chart as unknown as EventManager['rootTarget'];
    const input = new FederatedPointerEvent(manager);
    input.type = 'pointerdown';
    input.pointerId = 1;
    input.target = manager.rootTarget;
    const received = jest.fn(params => params.event.stopImmediatePropagation());
    const host = jest.fn();
    event.on('pointerdown', { throttle: 20 }, received);
    sources.chart.on('pointerdown', host);
    try {
      manager.dispatchEvent(input);
      expect(received).toHaveBeenCalledTimes(1);
      expect(received.mock.calls[0][0].event).toBe(input);
      expect(input.propagationImmediatelyStopped).toBe(true);
      expect(host).not.toHaveBeenCalled();
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test.each([
    ['stopPropagation', 'propagationStopped'],
    ['preventDefault', 'defaultPrevented']
  ] as const)('throttle leading callback preserves %s on the original event', (method, flag) => {
    const { event, dispatcher, sources } = setup();
    const input = new FederatedPointerEvent();
    input.pointerId = 1;
    input.nativeEvent = {} as PointerEvent;
    event.on('pointerdown', { source: 'canvas', throttle: 20 }, params => params.event[method]());
    try {
      sources.canvas.emit('pointerdown', input);
      expect(input[flag]).toBe(true);
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test('debounce preserves wheel deltas and coordinates', async () => {
    const { event, dispatcher, sources } = setup();
    const input = new FederatedWheelEvent();
    input.type = 'wheel';
    input.deltaMode = 0;
    input.deltaX = 2;
    input.deltaY = 10;
    input.canvas.x = 200;
    const completed = new Promise(resolve => {
      event.on('wheel', { source: 'canvas', debounce: 20 }, params => resolve(params.event));
    });
    try {
      sources.canvas.emit('wheel', input);
      input.deltaX = 5;
      input.deltaY = 20;
      input.canvas.x = 350;
      expect(await completed).toMatchObject({ type: 'wheel', deltaMode: 0, deltaX: 2, deltaY: 10, canvasX: 200 });
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test('synchronous subscribers keep the original event', () => {
    const { event, dispatcher, sources } = setup();
    const input = new FederatedPointerEvent();
    input.pointerId = 1;
    const received = jest.fn();
    event.on('pointerdown', { source: 'canvas' }, received);
    sources.canvas.emit('pointerdown', input);
    expect(received).toHaveBeenCalledWith(expect.objectContaining({ event: input }));
    expect(received.mock.calls[0][0].event).toBe(input);
    event.release();
    dispatcher.release();
  });

  test('delayed non-pooled events keep their identity', async () => {
    const { event, dispatcher, sources } = setup();
    const input = Object.freeze({ type: 'pointerdown', clientX: 200, buttons: 1 });
    const completed = new Promise(resolve => {
      event.on('pointerdown', { source: 'canvas', debounce: 20 }, params => resolve(params.event));
    });
    try {
      sources.canvas.emit('pointerdown', input);
      expect(await completed).toBe(input);
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test('delayed custom event parameters keep their shape', async () => {
    const { event, dispatcher } = setup();
    const input = { source: 'chart' as const, datum: { x: 1 } };
    const completed = new Promise(resolve => {
      event.on('custom', { debounce: 20 }, params => resolve(params));
    });
    try {
      event.emit('custom', input);
      expect(await completed).toStrictEqual(input);
    } finally {
      event.release();
      dispatcher.release();
    }
  });
});

describe('[event] gesture payload and delayed lifecycle', () => {
  test('removing one callback preserves another pending callback on the same source', async () => {
    const { event, dispatcher, sources } = setup();
    const removed = jest.fn();
    const input = new FederatedPointerEvent();
    input.pointerId = 1;
    const completed = new Promise(resolve => {
      event.on('pointerdown', { source: 'canvas', debounce: 20 }, removed);
      event.on('pointerdown', { source: 'canvas', debounce: 20 }, resolve);
    });
    try {
      sources.canvas.emit('pointerdown', input);
      event.off('pointerdown', removed);
      await completed;
      expect(removed).not.toHaveBeenCalled();
    } finally {
      event.release();
      dispatcher.release();
    }
  });

  test.each(['debounce', 'throttle'] as const)('%s preserves real pinch payload through Compiler', async timing => {
    const { event, dispatcher, manager, sources } = setup();
    const target = Object.assign(sources.chart, {
      addEventListener: sources.chart.on.bind(sources.chart),
      removeEventListener: sources.chart.off.bind(sources.chart)
    });
    const gesture = new Gesture(target as unknown as IEventTarget);
    // Advance the frame queue explicitly, without installing a rendering environment.
    gesture['throttleTimer'] = 1;
    let complete: () => void;
    const completed = new Promise<void>(resolve => (complete = resolve));
    const received = jest.fn((_params: BaseEventParams) => {
      if (received.mock.calls.length === (timing === 'throttle' ? 2 : 1)) {
        complete();
      }
    });
    event.on('pinch', { [timing]: 20 }, received);
    const pointer = (pointerId: number, x: number) => {
      const input = new FederatedPointerEvent(manager);
      input.pointerId = pointerId;
      input.canvas.x = x;
      return input;
    };
    try {
      sources.chart.emit('pointerdown', pointer(1, 0));
      sources.chart.emit('pointerdown', pointer(2, 10));
      sources.chart.emit('pointermove', pointer(2, 20));
      // Flush Gesture's frame queue through its real Stage listeners.
      const flushGesture = () => {
        gesture['emitThrottles'].splice(0).forEach(({ type, ev }: { type: string; ev: FederatedPointerEvent }) => {
          gesture['emitEvent'](type, ev);
        });
      };
      flushGesture();
      sources.chart.emit('pointermove', pointer(2, 30));
      flushGesture();
      await completed;
      expect(received).toHaveBeenCalledTimes(timing === 'throttle' ? 2 : 1);
      const last = received.mock.calls[received.mock.calls.length - 1][0].event;
      expect(last).toMatchObject({
        scale: 3,
        center: { x: 5, y: 0 },
        points: [
          { x: 0, y: 0 },
          { x: 30, y: 0 }
        ]
      });
    } finally {
      gesture.release();
      gesture['reset']();
      event.release();
      dispatcher.release();
    }
  });

  test.each(
    (['canvas', 'window', 'chart'] as const).flatMap(source =>
      (['debounce', 'throttle'] as const).flatMap(timing =>
        (['off', 'release', 'clear'] as const).map(operation => ({ source, timing, operation }))
      )
    )
  )('%p cancels pending callbacks', async ({ source, timing, operation }) => {
    const { event, dispatcher, sources } = setup();
    const callback = jest.fn();
    event.on('pointerdown', { source, [timing]: 20 }, callback);
    const input = new FederatedPointerEvent();
    input.pointerId = 1;
    sources[source].emit('pointerdown', input);
    if (timing === 'throttle') {
      expect(callback).toHaveBeenCalledTimes(1);
      sources[source].emit('pointerdown', input);
      callback.mockClear();
    }
    if (operation === 'off') {
      event.off('pointerdown');
    } else if (operation === 'release') {
      event.release();
    } else {
      dispatcher.clear();
    }
    sources[source].emit('pointerdown', input);
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(callback).not.toHaveBeenCalled();
    event.release();
    dispatcher.release();
  });
});
