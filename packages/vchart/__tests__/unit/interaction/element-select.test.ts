import { DataSet, DataView } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import { PieSeries, registerPieSeries } from '../../../src/series/pie/pie';
import type { IPieSeriesSpec } from '../../../src/series/pie/interface';
import { BarSeries, registerBarSeries } from '../../../src/series/bar/bar';
import type { IBarSeriesSpec } from '../../../src/series/bar/interface';
import { LineSeries, registerLineSeries } from '../../../src/series/line/line';
import type { ILineSeriesSpec } from '../../../src/series/line/interface';
import { ElementSelect } from '../../../src/interaction/triggers/element-select';
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
  };
  marks: IMark[];
};

function getSelectTriggers(series: { getInteractionTriggers: () => SelectTrigger[] }) {
  return series.getInteractionTriggers().filter(item => item.trigger.type === TRIGGER_TYPE_ENUM.ELEMENT_SELECT);
}

function markNames(trigger: SelectTrigger) {
  return trigger.marks.map(mark => mark.name).sort();
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

function startSelects(selectTriggers: SelectTrigger[], graphics: IMarkGraphic[]) {
  const instances = selectTriggers.map(({ trigger, marks }) => {
    const interaction = new Interaction();
    const instance = new ElementSelect({
      ...(trigger as any),
      marks,
      event: dummyEvent,
      interaction
    });
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

    const lineMark = customSelect.marks[0];
    const lineGraphics = attachGraphics(lineMark, 2);
    const lineSelect = new ElementSelect({
      ...(customSelect.trigger as any),
      marks: customSelect.marks,
      event: dummyEvent,
      interaction: new Interaction()
    });
    lineSelect.start(lineGraphics[0]);
    expect(lineGraphics[0].currentStates).toContain('selected');
    expect(lineGraphics[1].currentStates).toContain('selected_reverse');

    const point = defaultSelect.marks[0];
    expect(startSelects([defaultSelect], [createGraphic(point), createGraphic(point)])[0]).toHaveLength(1);

    const pointGraphics = attachGraphics(point, 2);
    const pointSelect = new ElementSelect({
      ...(defaultSelect.trigger as any),
      marks: defaultSelect.marks,
      event: dummyEvent,
      interaction: new Interaction()
    });
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
    const elementSelect = new ElementSelect({
      ...(selectTriggers[0].trigger as any),
      marks: selectTriggers[0].marks,
      event: dummyEvent,
      interaction: new Interaction()
    });

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
  });
});
