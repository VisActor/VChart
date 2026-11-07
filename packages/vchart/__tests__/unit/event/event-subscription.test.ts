import { EventEmitter } from '@visactor/vutils';
import type { IStage } from '@visactor/vrender-core';
import { Compiler } from '../../../src/compile/compiler';
import type { VChart } from '../../../src/core/vchart';
import { Event } from '../../../src/event/event';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import type { BaseEventParams } from '../../../src/event/interface';

const sourceNames = ['chart', 'canvas', 'window'] as const;
const setup = () => {
  const sources = { chart: new EventEmitter(), canvas: new EventEmitter(), window: new EventEmitter() };
  const compiler = new Compiler(null, { eventSource: sources });
  compiler['_stage'] = {
    addEventListener: sources.chart.on.bind(sources.chart),
    removeEventListener: sources.chart.off.bind(sources.chart)
  } as unknown as IStage;
  const dispatcher = new EventDispatcher({ getChart: (): null => null } as unknown as VChart, compiler);
  const first = new Event(dispatcher, 'desktop-browser');
  const other = new Event(dispatcher, 'desktop-browser');
  const emit = (owner = 'both') => {
    sourceNames.forEach(source => sources[source].emit('pointermove', { type: 'pointermove', owner }));
  };
  const release = () => {
    first.release();
    other.release();
    dispatcher.release();
  };
  return { first, other, sources, dispatcher, emit, release };
};

describe('[event] subscription ownership', () => {
  test.each(['off', 'callback', 'release'] as const)(
    '%s removes all owned sources and retains other instances',
    operation => {
      const { first, other, sources, emit, release } = setup();
      const callback = jest.fn();
      sourceNames.forEach(source => {
        first.on('pointermove', { source, filter: p => p.event.owner !== 'other' }, callback);
        other.on('pointermove', { source, filter: p => p.event.owner !== 'first' }, callback);
      });
      try {
        emit();
        expect(callback).toHaveBeenCalledTimes(6);
        callback.mockClear();
        if (operation === 'off') {
          first.off('pointermove');
        } else if (operation === 'callback') {
          first.off('pointermove', callback);
        } else {
          first.release();
        }
        first.release();
        emit('first');
        expect(callback).not.toHaveBeenCalled();
        emit('other');
        expect(callback.mock.calls.map(([params]) => params.source)).toEqual(sourceNames);
        other.release();
        sourceNames.forEach(source => expect(sources[source].listenerCount('pointermove')).toBe(0));
      } finally {
        release();
      }
    }
  );

  test.each(sourceNames)('off with explicit %s source preserves the other sources', source => {
    const { first, emit, release } = setup();
    const callback = jest.fn();
    sourceNames.forEach(name => first.on('pointermove', { source: name }, callback));
    try {
      first.off('pointermove', { source }, callback);
      first.off('pointermove', { source }, callback);
      emit();
      expect(callback.mock.calls.map(([params]) => params.source)).toEqual(sourceNames.filter(name => name !== source));
      callback.mockClear();
      first.release();
      emit();
      expect(callback).not.toHaveBeenCalled();
    } finally {
      release();
    }
  });

  test('callback removal retains unrelated callbacks and event types', () => {
    const { first, sources, emit, release } = setup();
    const removed = jest.fn();
    const retained = jest.fn();
    sourceNames.forEach(source => first.on('pointermove', { source }, removed));
    first.on('pointermove', retained);
    first.on('pointerdown', removed);
    try {
      first.off('pointermove', removed);
      emit();
      expect(removed).not.toHaveBeenCalled();
      expect(retained).toHaveBeenCalledTimes(1);
      sources.chart.emit('pointerdown', { type: 'pointerdown' });
      expect(removed).toHaveBeenCalledTimes(1);
    } finally {
      release();
    }
  });

  test('same callback at different bubble levels is fully removed', () => {
    const { first, dispatcher, emit, release } = setup();
    const callback = jest.fn();
    first.on('pointermove', { level: 'model' }, callback);
    first.on('pointermove', callback);
    try {
      dispatcher.dispatch('pointermove', {
        source: 'chart',
        model: {},
        event: { type: 'pointermove' }
      } as BaseEventParams);
      expect(callback).toHaveBeenCalledTimes(2);
      callback.mockClear();
      first.off('pointermove', callback);
      emit();
      expect(callback).not.toHaveBeenCalled();
    } finally {
      release();
    }
  });

  test.each(
    (['debounce', 'throttle'] as const).flatMap(timing =>
      (['off', 'release', 'clear'] as const).map(operation => ({ timing, operation }))
    )
  )('%p cancels only the removed subscriptions', async ({ timing, operation }) => {
    const { first, other, dispatcher, sources, emit, release } = setup();
    const callback = jest.fn();
    sourceNames.forEach(source => {
      first.on('pointermove', { source, [timing]: 20, filter: p => p.event.owner !== 'other' }, callback);
      other.on('pointermove', { source, [timing]: 20, filter: p => p.event.owner !== 'first' }, callback);
    });
    try {
      emit();
      if (timing === 'throttle') {
        expect(callback).toHaveBeenCalledTimes(6);
        callback.mockClear();
        emit();
      }
      if (operation === 'off') {
        first.off('pointermove');
      } else if (operation === 'release') {
        first.release();
      } else {
        dispatcher.clear();
      }
      await new Promise(resolve => setTimeout(resolve, 40));
      expect(callback.mock.calls.map(([params]) => params.source)).toEqual(operation === 'clear' ? [] : sourceNames);
      callback.mockClear();
      emit('first');
      await new Promise(resolve => setTimeout(resolve, 40));
      expect(callback).not.toHaveBeenCalled();
      other.release();
      sourceNames.forEach(source => expect(sources[source].listenerCount('pointermove')).toBe(0));
    } finally {
      release();
    }
  });
});
