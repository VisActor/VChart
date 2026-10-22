import { DataSet, DataView } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import { PieSeries, registerPieSeries } from '../../../src/series/pie/pie';
import type { IPieSeriesSpec } from '../../../src/series/pie/interface';
import { BarSeries, registerBarSeries } from '../../../src/series/bar/bar';
import type { IBarSeriesSpec } from '../../../src/series/bar/interface';
import { LineSeries, registerLineSeries } from '../../../src/series/line/line';
import type { ILineSeriesSpec } from '../../../src/series/line/interface';
import { ElementSelect } from '../../../src/interaction/triggers/element-select';
import type { ITriggerEventHandler } from '../../../src/interaction/interface/trigger';
import { Interaction } from '../../../src/interaction/interaction';
import { TRIGGER_TYPE_ENUM } from '../../../src/interaction/triggers/enum';
import type { IMark } from '../../../src/mark/interface';
import type { IMarkGraphic } from '../../../src/mark/interface/common';
import { initChartDataSet, seriesOption } from '../../util/context';

registerPieSeries();
registerBarSeries();
registerLineSeries();

const dataSet = new DataSet();
initChartDataSet(dataSet);

class TestPieSeries extends PieSeries<IPieSeriesSpec> {
  protected _computeLayoutRadius() {
    return 100;
  }
}

const dummyEvent = {
  on: (): void => undefined,
  off: (): void => undefined,
  emit: (): void => undefined
};

function createPieSeries(spec: Partial<IPieSeriesSpec> = {}) {
  const dataView = new DataView(dataSet);
  dataView.parse(
    [
      { type: 'oxygen', value: 46.6 },
      { type: 'silicon', value: 27.72 },
      { type: 'aluminum', value: 8.13 }
    ],
    {
      type: 'array'
    }
  );

  const series = new TestPieSeries(
    {
      type: 'pie',
      data: dataView,
      valueField: 'value',
      categoryField: 'type',
      ...spec
    },
    seriesOption({ dataSet }) as ISeriesOption
  );
  series.created();
  series.init({});
  return series;
}

type SelectTrigger = {
  trigger: {
    type?: string;
    isMultiple?: boolean;
    reverseState?: string;
    trigger?: string | string[];
    triggerOff?: unknown;
  };
  marks: IMark[];
  reverseMarks?: IMark[];
};

function getSelectTriggers(series: { getInteractionTriggers: () => SelectTrigger[] }) {
  return series.getInteractionTriggers().filter(item => item.trigger.type === TRIGGER_TYPE_ENUM.ELEMENT_SELECT);
}

function markNames(trigger: SelectTrigger) {
  return trigger.marks.map(mark => mark.name).sort();
}

function reverseMarkNames(trigger: SelectTrigger) {
  return (trigger.reverseMarks ?? []).map(mark => mark.name).sort();
}

type TestGraphic = IMarkGraphic & {
  currentStates: string[];
};

function createGraphic(mark: IMark): TestGraphic {
  const graphic = {
    context: { markId: mark.id },
    currentStates: [] as string[],
    hasState(state: string) {
      return graphic.currentStates.includes(state);
    },
    setStates(states?: string[] | null) {
      graphic.currentStates = states ?? [];
    }
  };
  return graphic as unknown as TestGraphic;
}

function getIsMultiple(trigger: SelectTrigger['trigger']) {
  return trigger.isMultiple;
}

type SelectEventBus = {
  on: (type: string, handler: ITriggerEventHandler) => void;
  off: (type: string, handler: ITriggerEventHandler) => void;
  emit: (type: string, payload?: { item?: TestGraphic }) => void;
};

function createElementSelect(
  entry: SelectTrigger,
  interaction = new Interaction(),
  event: SelectEventBus = dummyEvent
) {
  return new ElementSelect({
    ...(entry.trigger as any),
    marks: entry.marks,
    reverseMarks: entry.reverseMarks,
    event,
    interaction
  });
}

function startSelects(selectTriggers: SelectTrigger[], graphics: IMarkGraphic[]) {
  const instances = selectTriggers.map(entry => {
    const interaction = new Interaction();
    const instance = createElementSelect(entry, interaction);
    return { interaction, instance };
  });

  graphics.forEach(graphic => {
    instances.forEach(({ instance }) => instance.start(graphic));
  });

  return instances.map(({ interaction, instance }) => interaction.getStatedGraphics(instance) ?? []);
}

function createCartesianSeries<T extends BarSeries<IBarSeriesSpec> | LineSeries<ILineSeriesSpec>>(
  SeriesCtor: new (spec: any, option: ISeriesOption) => T,
  spec: Record<string, unknown>
) {
  const dataView = new DataView(dataSet);
  dataView.parse(
    [
      { x: 'A', y: 10 },
      { x: 'B', y: 20 },
      { x: 'C', y: 30 }
    ],
    {
      type: 'array'
    }
  );

  const series = new SeriesCtor(
    {
      data: dataView,
      xField: 'x',
      yField: 'y',
      ...spec
    },
    seriesOption({ dataSet }) as ISeriesOption
  );
  series.created();
  series.init({});
  return series;
}

function attachGraphics(mark: IMark, count: number) {
  const graphics = Array.from({ length: count }, () => createGraphic(mark));
  (mark as IMark & { _graphics?: IMarkGraphic[] })._graphics = graphics;
  return graphics;
}

function selectionOf(graphic: TestGraphic) {
  return graphic.currentStates.filter(state => state === 'selected' || state === 'selected_reverse');
}

function createSelectEvent() {
  const handlers = new Map<string, Array<(payload: { item?: TestGraphic }) => void>>();
  return {
    on(type: string, handler: (payload: { item?: TestGraphic }) => void) {
      const list = handlers.get(type) ?? [];
      list.push(handler);
      handlers.set(type, list);
    },
    off(type: string, handler: (payload: { item?: TestGraphic }) => void) {
      handlers.set(
        type,
        (handlers.get(type) ?? []).filter(item => item !== handler)
      );
    },
    emit(type: string, payload: { item?: TestGraphic } = {}) {
      (handlers.get(type) ?? []).forEach(handler => handler(payload));
    }
  };
}

const lineAndPointSelectStyles = {
  line: {
    state: {
      selected: {
        strokeOpacity: 1
      },
      selected_reverse: {
        strokeOpacity: 0.2
      }
    }
  },
  point: {
    state: {
      selected: {
        fillOpacity: 1
      },
      selected_reverse: {
        fillOpacity: 0.2
      }
    }
  }
};

function bindLinePointSelects(interactions: Record<string, unknown>[]) {
  const series = createCartesianSeries(LineSeries, {
    type: 'line',
    ...lineAndPointSelectStyles,
    interactions
  });
  const selectTriggers = getSelectTriggers(series);
  const customSelect = selectTriggers.find(item => markNames(item).join() === 'line');
  const defaultSelect = selectTriggers.find(item => markNames(item).join() === 'point');
  const event = createSelectEvent();
  const interaction = new Interaction();
  const pointTrigger = createElementSelect(defaultSelect, interaction, event);
  const lineTrigger = createElementSelect(customSelect, interaction, event);
  interaction.addTrigger(pointTrigger);
  interaction.addTrigger(lineTrigger);
  pointTrigger.init();
  lineTrigger.init();

  return {
    series,
    selectTriggers,
    customSelect,
    defaultSelect,
    event,
    interaction,
    pointTrigger,
    lineTrigger,
    lines: attachGraphics(customSelect.marks[0], 2),
    points: attachGraphics(defaultSelect.marks[0], 2)
  };
}

function emitClick(
  event: ReturnType<typeof createSelectEvent>,
  graphic: TestGraphic | undefined,
  pointertapFirst: boolean
) {
  const payload = { item: graphic };
  if (pointertapFirst) {
    event.emit('pointertap', payload);
    event.emit('click', payload);
    return;
  }
  event.emit('click', payload);
  event.emit('pointertap', payload);
}

describe('element-select vs default select', () => {
  test('interactions isMultiple accumulates without default single-select fighting it', () => {
    const series = createPieSeries({
      interactions: [
        {
          type: 'element-select',
          isMultiple: true
        }
      ]
    });

    const triggers = series.getInteractionTriggers();
    const selectTriggers = getSelectTriggers(series);

    expect(selectTriggers).toHaveLength(1);
    expect(getIsMultiple(selectTriggers[0].trigger)).toBe(true);
    expect(triggers.some(item => item.trigger.type === TRIGGER_TYPE_ENUM.DIMENSION_HOVER)).toBe(true);
    expect(triggers.some(item => item.trigger.type === TRIGGER_TYPE_ENUM.ELEMENT_HIGHLIGHT)).toBe(true);

    const mark = selectTriggers[0].marks[0];
    const statedLists = startSelects(selectTriggers, [createGraphic(mark), createGraphic(mark)]);

    expect(statedLists.some(graphics => graphics.length > 1)).toBe(true);
  });

  test('default select without interactions stays single-select', () => {
    const series = createPieSeries();
    const selectTriggers = getSelectTriggers(series);

    expect(selectTriggers).toHaveLength(1);
    expect(getIsMultiple(selectTriggers[0].trigger)).toBe(false);

    const mark = selectTriggers[0].marks[0];
    const statedLists = startSelects(selectTriggers, [createGraphic(mark), createGraphic(mark)]);

    expect(statedLists[0]).toHaveLength(1);
  });

  test('select.mode multiple still accumulates without interactions', () => {
    const series = createPieSeries({
      select: {
        mode: 'multiple'
      }
    });
    const selectTriggers = getSelectTriggers(series);

    expect(selectTriggers).toHaveLength(1);
    expect(getIsMultiple(selectTriggers[0].trigger)).toBe(true);

    const mark = selectTriggers[0].marks[0];
    const statedLists = startSelects(selectTriggers, [createGraphic(mark), createGraphic(mark)]);

    expect(statedLists[0].length).toBeGreaterThan(1);
  });

  test('bar element-select leaves line point on default select', () => {
    const interactions = [
      {
        type: 'element-select' as const,
        markNames: ['bar'],
        isMultiple: true
      }
    ];
    const bar = createCartesianSeries(BarSeries, { type: 'bar', interactions });
    const line = createCartesianSeries(LineSeries, { type: 'line', interactions });

    expect(interactions[0]).not.toHaveProperty('reverseState');

    const barSelects = getSelectTriggers(bar);
    expect(barSelects).toHaveLength(1);
    expect(getIsMultiple(barSelects[0].trigger)).toBe(true);
    expect(markNames(barSelects[0])).toEqual(['bar']);
    expect(barSelects[0].trigger.reverseState).toBe('selected_reverse');

    const barMark = barSelects[0].marks[0];
    const barStated = startSelects(barSelects, [createGraphic(barMark), createGraphic(barMark)]);
    expect(barStated.some(graphics => graphics.length > 1)).toBe(true);

    const lineSelects = getSelectTriggers(line);
    expect(lineSelects).toHaveLength(1);
    expect(getIsMultiple(lineSelects[0].trigger)).toBe(false);
    expect(markNames(lineSelects[0])).toEqual(['line', 'point']);
    expect(line.getInteractionTriggers().some(item => item.trigger.type === TRIGGER_TYPE_ENUM.ELEMENT_HIGHLIGHT)).toBe(
      true
    );

    const point = lineSelects[0].marks.find(mark => mark.name === 'point');
    const statedLists = startSelects(lineSelects, [createGraphic(point), createGraphic(point)]);
    expect(statedLists[0]).toHaveLength(1);
  });

  test('line element-select keeps default select on point', () => {
    const series = createCartesianSeries(LineSeries, {
      type: 'line',
      line: {
        state: {
          selected_reverse: {
            strokeOpacity: 0.2
          }
        }
      },
      point: {
        state: {
          selected_reverse: {
            fillOpacity: 0.2
          }
        }
      },
      interactions: [
        {
          type: 'element-select',
          markNames: ['line'],
          isMultiple: true
        }
      ]
    });

    const selectTriggers = getSelectTriggers(series);
    const customSelect = selectTriggers.find(item => getIsMultiple(item.trigger) === true);
    const defaultSelect = selectTriggers.find(item => getIsMultiple(item.trigger) !== true);

    expect(customSelect).toBeTruthy();
    expect(defaultSelect).toBeTruthy();
    expect(markNames(customSelect)).toEqual(['line']);
    expect(markNames(defaultSelect)).toEqual(['point']);
    expect(customSelect.trigger.reverseState).toBe('selected_reverse');
    expect(defaultSelect.trigger.reverseState).toBe('selected_reverse');
    expect(reverseMarkNames(customSelect)).toEqual(['point']);
    expect(reverseMarkNames(defaultSelect)).toEqual(['line']);

    const lineMark = customSelect.marks[0];
    const lineGraphics = attachGraphics(lineMark, 2);
    const lineSelect = createElementSelect(customSelect);
    lineSelect.start(lineGraphics[0]);
    expect(lineGraphics[0].currentStates).toContain('selected');
    expect(lineGraphics[1].currentStates).toContain('selected_reverse');

    const point = defaultSelect.marks[0];
    expect(startSelects([defaultSelect], [createGraphic(point), createGraphic(point)])[0]).toHaveLength(1);

    const pointGraphics = attachGraphics(point, 2);
    const pointSelect = createElementSelect(defaultSelect);
    pointSelect.start(pointGraphics[0]);
    expect(pointGraphics[0].currentStates).toContain('selected');
    expect(pointGraphics[1].currentStates).toContain('selected_reverse');
    expect(pointGraphics[1].currentStates).not.toContain('selected');
  });

  test('line element-select by markIds keeps default select on other marks', () => {
    const series = createCartesianSeries(LineSeries, { type: 'line' });
    const lineMark = series.getMarks().find(mark => mark.name === 'line');
    series.getSpec().interactions = [
      {
        type: 'element-select',
        markIds: [lineMark.getProductId()],
        isMultiple: true
      }
    ];

    const selectTriggers = getSelectTriggers(series);
    const customSelect = selectTriggers.find(item => getIsMultiple(item.trigger) === true);
    const defaultSelect = selectTriggers.find(item => getIsMultiple(item.trigger) !== true);

    expect(markNames(customSelect)).toEqual(['line']);
    expect(markNames(defaultSelect)).toEqual(['point']);

    const point = defaultSelect.marks[0];
    expect(startSelects([defaultSelect], [createGraphic(point)])[0]).toHaveLength(1);
  });

  test('interactions element-select keeps selected_reverse without explicit reverseState', () => {
    const interaction = {
      type: 'element-select' as const,
      isMultiple: true
    };
    const series = createPieSeries({
      pie: {
        state: {
          selected: {
            fillOpacity: 1
          },
          selected_reverse: {
            fillOpacity: 0.2
          }
        }
      },
      interactions: [interaction]
    });

    expect(interaction).not.toHaveProperty('reverseState');

    const selectTriggers = getSelectTriggers(series);
    expect(selectTriggers).toHaveLength(1);
    expect(getIsMultiple(selectTriggers[0].trigger)).toBe(true);
    expect(selectTriggers[0].trigger.reverseState).toBe('selected_reverse');

    const mark = selectTriggers[0].marks.find(item => item.name === 'pie');
    expect(mark.stateStyle.selected_reverse).toBeTruthy();

    const graphics = attachGraphics(mark, 3);
    const elementSelect = createElementSelect(selectTriggers[0]);

    elementSelect.start(graphics[0]);
    expect(graphics[0].currentStates).toContain('selected');
    expect(graphics[0].currentStates).not.toContain('selected_reverse');
    expect(graphics[1].currentStates).toEqual(['selected_reverse']);
    expect(graphics[2].currentStates).toEqual(['selected_reverse']);

    elementSelect.start(graphics[1]);
    expect(graphics[0].currentStates).toContain('selected');
    expect(graphics[1].currentStates).toContain('selected');
    expect(graphics[0].currentStates).not.toContain('selected_reverse');
    expect(graphics[1].currentStates).not.toContain('selected_reverse');
    expect(graphics[2].currentStates).toEqual(['selected_reverse']);
  });

  test('explicit reverseState on element-select is kept', () => {
    const series = createPieSeries({
      interactions: [
        {
          type: 'element-select',
          isMultiple: true,
          reverseState: 'custom_reverse'
        }
      ]
    });

    const selectTriggers = getSelectTriggers(series);
    expect(selectTriggers).toHaveLength(1);
    expect(selectTriggers[0].trigger.reverseState).toBe('custom_reverse');
    expect(selectTriggers[0].reverseMarks).toBeUndefined();
  });

  test('partial line element-select keeps cross-mark selected_reverse', () => {
    const series = createCartesianSeries(LineSeries, {
      type: 'line',
      line: {
        state: {
          selected_reverse: {
            strokeOpacity: 0.2
          }
        }
      },
      point: {
        state: {
          selected_reverse: {
            fillOpacity: 0.2
          }
        }
      },
      interactions: [
        {
          type: 'element-select',
          markNames: ['line']
        }
      ]
    });

    const selectTriggers = getSelectTriggers(series);
    const customSelect = selectTriggers.find(item => markNames(item).join() === 'line');
    const defaultSelect = selectTriggers.find(item => markNames(item).join() === 'point');

    expect(selectTriggers).toHaveLength(2);
    expect(customSelect).toBeTruthy();
    expect(defaultSelect).toBeTruthy();
    expect(customSelect.trigger.reverseState).toBe('selected_reverse');
    expect(defaultSelect.trigger.reverseState).toBe('selected_reverse');
    expect(reverseMarkNames(customSelect)).toEqual(['point']);
    expect(reverseMarkNames(defaultSelect)).toEqual(['line']);

    const lineMark = customSelect.marks[0];
    const pointMark = defaultSelect.marks[0];

    const linesWhenPointSelected = attachGraphics(lineMark, 2);
    const pointsWhenPointSelected = attachGraphics(pointMark, 2);
    createElementSelect(defaultSelect).start(pointsWhenPointSelected[0]);

    expect(pointsWhenPointSelected[0].currentStates).toContain('selected');
    expect(pointsWhenPointSelected[0].currentStates).not.toContain('selected_reverse');
    expect(pointsWhenPointSelected[1].currentStates).toContain('selected_reverse');
    expect(linesWhenPointSelected[0].currentStates).toEqual(['selected_reverse']);
    expect(linesWhenPointSelected[1].currentStates).toEqual(['selected_reverse']);

    const linesWhenLineSelected = attachGraphics(lineMark, 2);
    const pointsWhenLineSelected = attachGraphics(pointMark, 2);
    createElementSelect(customSelect).start(linesWhenLineSelected[0]);

    expect(linesWhenLineSelected[0].currentStates).toContain('selected');
    expect(linesWhenLineSelected[0].currentStates).not.toContain('selected_reverse');
    expect(linesWhenLineSelected[1].currentStates).toContain('selected_reverse');
    expect(pointsWhenLineSelected[0].currentStates).toEqual(['selected_reverse']);
    expect(pointsWhenLineSelected[1].currentStates).toEqual(['selected_reverse']);
  });

  test('explicit reverseState on a partial element-select is not shared with default marks', () => {
    const series = createCartesianSeries(LineSeries, {
      type: 'line',
      interactions: [
        {
          type: 'element-select',
          markNames: ['line'],
          reverseState: 'custom_reverse'
        }
      ]
    });

    const selectTriggers = getSelectTriggers(series);
    const customSelect = selectTriggers.find(item => item.trigger.reverseState === 'custom_reverse');
    const defaultSelect = selectTriggers.find(item => item.trigger.reverseState === 'selected_reverse');

    expect(markNames(customSelect)).toEqual(['line']);
    expect(markNames(defaultSelect)).toEqual(['point']);
    expect(customSelect.reverseMarks).toBeUndefined();
    expect(reverseMarkNames(defaultSelect)).toEqual(['line']);
  });

  test('click point then line then cancel keeps one exclusive selected state', () => {
    const bound = bindLinePointSelects([
      {
        type: 'element-select',
        markNames: ['line']
      }
    ]);
    const { customSelect, defaultSelect, interaction, pointTrigger, lineTrigger, lines, points } = bound;

    expect(customSelect.trigger.reverseState).toBe('selected_reverse');
    expect(defaultSelect.trigger.reverseState).toBe('selected_reverse');
    expect(reverseMarkNames(customSelect)).toEqual(['point']);
    expect(reverseMarkNames(defaultSelect)).toEqual(['line']);
    expect(customSelect.trigger.triggerOff).toEqual(['empty', 'click']);

    pointTrigger.start(points[0]);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[0])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);

    lineTrigger.start(lines[0]);
    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(lineTrigger)).toEqual([lines[0]]);

    pointTrigger.start(undefined);
    [...points, ...lines].forEach(graphic => {
      expect(selectionOf(graphic)).toEqual([]);
    });
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(lineTrigger) ?? []).toEqual([]);
  });

  test.each([
    ['pointertap then click', true],
    ['click then pointertap', false]
  ])('click point then line then cancel (%s)', (_label, pointertapFirst: boolean) => {
    const { event, interaction, pointTrigger, lineTrigger, lines, points } = bindLinePointSelects([
      {
        type: 'element-select',
        markNames: ['line']
      }
    ]);

    emitClick(event, points[0], pointertapFirst);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[0])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(pointTrigger)).toEqual([points[0]]);

    emitClick(event, lines[0], pointertapFirst);
    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(lineTrigger)).toEqual([lines[0]]);

    emitClick(event, undefined, pointertapFirst);
    [...points, ...lines].forEach(graphic => {
      expect(selectionOf(graphic)).toEqual([]);
    });
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(lineTrigger) ?? []).toEqual([]);

    emitClick(event, lines[0], pointertapFirst);
    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);

    emitClick(event, points[0], pointertapFirst);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[0])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(lineTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(pointTrigger)).toEqual([points[0]]);
  });

  test('setSelected batch keeps both line and point selected across split triggers', () => {
    const { interaction, pointTrigger, lineTrigger, lines, points } = bindLinePointSelects([
      {
        type: 'element-select',
        markNames: ['line']
      }
    ]);

    interaction.updateStateOfGraphics('selected', [lines[0], points[0]]);

    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(lineTrigger)).toEqual([lines[0]]);
    expect(interaction.getStatedGraphics(pointTrigger)).toEqual([points[0]]);

    interaction.updateStateOfGraphics('selected', [lines[1], points[1]]);

    expect(selectionOf(lines[1])).toEqual(['selected']);
    expect(selectionOf(points[1])).toEqual(['selected']);
    expect(selectionOf(lines[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(lineTrigger)).toEqual([lines[1]]);
    expect(interaction.getStatedGraphics(pointTrigger)).toEqual([points[1]]);

    interaction.updateStateOfGraphics('selected', [lines[0]]);

    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(lineTrigger)).toEqual([lines[0]]);
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);

    pointTrigger.start(undefined);
    [...points, ...lines].forEach(graphic => {
      expect(selectionOf(graphic)).toEqual([]);
    });
    expect(interaction.getStatedGraphics(pointTrigger) ?? []).toEqual([]);
    expect(interaction.getStatedGraphics(lineTrigger) ?? []).toEqual([]);
  });

  test('default select setSelected still selects line and point together', () => {
    const series = createCartesianSeries(LineSeries, {
      type: 'line',
      ...lineAndPointSelectStyles
    });
    const selectTriggers = getSelectTriggers(series);
    expect(selectTriggers).toHaveLength(1);

    const interaction = new Interaction();
    const trigger = createElementSelect(selectTriggers[0], interaction, createSelectEvent());
    interaction.addTrigger(trigger);

    const line = selectTriggers[0].marks.find(mark => mark.name === 'line');
    const point = selectTriggers[0].marks.find(mark => mark.name === 'point');
    const lines = attachGraphics(line, 2);
    const points = attachGraphics(point, 2);

    interaction.updateStateOfGraphics('selected', [lines[0], points[0]]);

    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(interaction.getStatedGraphics(trigger)).toEqual([lines[0], points[0]]);
  });

  test('partial multiple line select still accumulates across line clicks', () => {
    const { event, customSelect, lines, points } = bindLinePointSelects([
      {
        type: 'element-select',
        markNames: ['line'],
        isMultiple: true
      }
    ]);

    expect(customSelect.trigger.triggerOff).toEqual(['empty']);
    expect(customSelect.trigger.reverseState).toBe('selected_reverse');

    emitClick(event, lines[0], true);
    emitClick(event, lines[1], true);

    expect(selectionOf(lines[0])).toEqual(['selected']);
    expect(selectionOf(lines[1])).toEqual(['selected']);
    expect(selectionOf(points[0])).toEqual(['selected_reverse']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);

    emitClick(event, points[0], true);
    expect(selectionOf(points[0])).toEqual(['selected']);
    expect(selectionOf(points[1])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[0])).toEqual(['selected_reverse']);
    expect(selectionOf(lines[1])).toEqual(['selected_reverse']);
  });
});
