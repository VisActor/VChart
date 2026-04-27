import { FederatedEvent } from '@visactor/vrender-core';
import VChart, {
  type BaseEventParams,
  type IBarChartSpec,
  type IChart,
  type ICommonChartSpec,
  type IMark,
  type IMarkGraphic,
  type ISeries
} from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

describe('vchart event test', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';

    const data = [
      { city: '石家庄', type: '水果', value: 14500 },
      { city: '石家庄', type: '米面', value: 8500 },
      { city: '石家庄', type: '特产零食', value: 10000 },
      { city: '石家庄', type: '茶叶', value: 7000 },
      { city: '深圳', type: '水果', value: 9000 },
      { city: '深圳', type: '米面', value: 8500 },
      { city: '深圳', type: '特产零食', value: 11000 },
      { city: '深圳', type: '茶叶', value: 6000 },
      { city: '温州', type: '水果', value: 16000 },
      { city: '温州', type: '米面', value: 5000 },
      { city: '温州', type: '特产零食', value: 6000 },
      { city: '温州', type: '茶叶', value: 10000 },
      { city: '宁波', type: '水果', value: 14000 },
      { city: '宁波', type: '米面', value: 9000 },
      { city: '宁波', type: '特产零食', value: 10000 },
      { city: '宁波', type: '茶叶', value: 9000 },
      { city: '无锡', type: '水果', value: 14000 },
      { city: '无锡', type: '米面', value: 9000 },
      { city: '无锡', type: '特产零食', value: 10000 },
      { city: '无锡', type: '茶叶', value: 6000 },
      { city: '杭州', type: '水果', value: 9000 },
      { city: '杭州', type: '米面', value: 8500 },
      { city: '杭州', type: '特产零食', value: 10000 },
      { city: '杭州', type: '茶叶', value: 6000 },
      { city: '北京', type: '水果', value: 17000 },
      { city: '北京', type: '米面', value: 6000 },
      { city: '北京', type: '特产零食', value: 7000 },
      { city: '北京', type: '茶叶', value: 10000 },
      { city: '上海', type: '水果', value: 18000 },
      { city: '上海', type: '米面', value: 11000 },
      { city: '上海', type: '特产零食', value: 15000 },
      { city: '上海', type: '茶叶', value: 14000 }
    ];
    const spec: IBarChartSpec = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      // xField: ['city', 'type'],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      axes: [
        {
          orient: 'left',
          id: 'axis-left'
        },
        {
          orient: 'bottom',
          id: 'axis-bottom'
        }
      ],
      legends: {
        id: 'legend',
        orient: 'right',
        position: 'start',
        padding: {
          left: 12
        },
        item: {
          focus: true
        },
        defaultSelected: ['特产零食', '米面'],
        allowAllCanceled: true
      },
      label: {
        visible: true,
        interactive: true
      },
      totalLabel: {
        visible: true,
        interactive: true
      }
    };
    vchart = new VChart(spec, {
      dom,
      animation: false
    });
    vchart.renderSync();
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should fire pointerdown event', () => {
    const axisEventSpy = jest.fn();
    vchart.on('pointerdown', { type: 'axis', level: 'model' }, axisEventSpy);
    vchart.on('pointerdown', { id: 'axis-bottom', level: 'model' }, axisEventSpy);

    const axis = vchart.getComponents().find(com => com.type === 'cartesianAxis-band');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    axis?.event.emit('pointerdown', { model: axis });
    expect(axisEventSpy).toBeCalledTimes(2);

    const legendEventSpy = jest.fn();
    vchart.on('pointerdown', { type: 'legend', level: 'model' }, legendEventSpy);
    vchart.on('pointerdown', { id: 'legend' }, legendEventSpy);

    const legend = vchart.getComponents().find(com => com.type === 'discreteLegend');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    legend?.event.emit('pointerdown', { model: legend });
    expect(legendEventSpy).toBeCalledTimes(2);
  });

  it('should fire legendItemClick event only once', () => {
    const legendItemClickSpy = jest.fn();
    vchart.on('legendItemClick', legendItemClickSpy);
    vchart.on('legendItemClick', { level: 'model' }, legendItemClickSpy);

    const legend = vchart.getComponents().find(com => com.type === 'discreteLegend');
    legend?.getVRenderComponents()[0]._dispatchEvent('legendItemClick', {});
    expect(legendItemClickSpy).toBeCalledTimes(2);
  });

  it('should fire label event', () => {
    const labelEventSpy = jest.fn();
    vchart.on('click', { level: 'model', type: 'label' }, labelEventSpy);

    const labelModel = vchart.getComponents().find(com => com.type === 'label');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    labelModel?.event.emit('click', { model: labelModel });

    expect(labelEventSpy).toBeCalledTimes(1);
  });

  it('should fire totalLabel event', () => {
    const labelEventSpy = jest.fn();
    vchart.on('click', { level: 'model', type: 'totalLabel' }, labelEventSpy);

    const labelModel = vchart.getComponents().find(com => com.type === 'totalLabel');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    labelModel?.event.emit('click', { model: labelModel });

    expect(labelEventSpy).toBeCalledTimes(1);
  });

  it('should fire pointerdown event once after updateSpecSync()', () => {
    const pointDowmSpy = jest.fn();
    const stage = vchart.getStage();
    const e = new FederatedEvent((stage as any).eventSystem.manager);

    e.type = 'pointerdown';
    vchart.on('pointerdown', pointDowmSpy);

    stage.dispatchEvent(e);

    expect(pointDowmSpy).toBeCalledTimes(1);

    vchart.updateSpecSync({
      ...vchart.getSpec(),
      stack: 'percent'
    });

    stage.dispatchEvent(e);
    expect(pointDowmSpy).toBeCalledTimes(2);
  });

  it('should fire tooltipRelease before release chart', () => {
    const handleTooltipRelease = jest.fn();
    vchart.on('tooltipRelease', handleTooltipRelease);

    vchart.release();

    expect(handleTooltipRelease).toBeCalledTimes(1);
  });

  it('should keep series element-active triggers isolated in common chart', () => {
    const commonContainer = createDiv();
    const commonDom = createDiv(commonContainer);
    commonDom.id = 'common-container';
    commonContainer.style.position = 'fixed';
    commonContainer.style.width = '500px';
    commonContainer.style.height = '500px';
    commonContainer.style.top = '0px';
    commonContainer.style.left = '0px';

    const commonChart = new VChart(
      {
        type: 'common',
        data: [
          {
            id: 'barData',
            values: [
              { x: 'Mon', y: 10 },
              { x: 'Tue', y: 12 }
            ]
          },
          {
            id: 'lineData',
            values: [
              { x: 'Mon', y: 8 },
              { x: 'Tue', y: 15 }
            ]
          }
        ],
        series: [
          {
            type: 'line',
            dataId: 'lineData',
            xField: 'x',
            yField: 'y',
            line: {
              state: {
                active: {
                  lineWidth: 4
                }
              }
            },
            interactions: [
              {
                type: 'element-active',
                trigger: 'click'
              }
            ]
          },
          {
            type: 'bar',
            dataId: 'barData',
            xField: 'x',
            yField: 'y',
            bar: {
              state: {
                active: {
                  stroke: '#000',
                  lineWidth: 2
                }
              }
            },
            interactions: [
              {
                type: 'element-active',
                trigger: 'pointerover'
              }
            ]
          }
        ],
        axes: [{ orient: 'left' }, { orient: 'bottom', type: 'band' }]
      } as ICommonChartSpec,
      {
        dom: commonDom,
        animation: false
      }
    );

    commonChart.renderSync();

    try {
      const chart = commonChart.getChart() as IChart;
      const barSeries = chart.getAllSeries().find((series: ISeries) => series.type === 'bar');
      expect(barSeries).toBeDefined();
      if (!barSeries) {
        throw new Error('Expected bar series to exist');
      }

      const barMark = barSeries.getMarks().find((mark: IMark) => mark.name === 'bar');
      expect(barMark).toBeDefined();
      if (!barMark) {
        throw new Error('Expected bar mark to exist');
      }

      const barGraphic = barMark.getGraphics()[0] as IMarkGraphic;

      chart.getEvent().emit('pointerover', { item: barGraphic } as unknown as BaseEventParams);
      expect(barGraphic.hasState('active')).toBe(true);

      chart.getEvent().emit('pointerout', { item: barGraphic } as unknown as BaseEventParams);
      expect(barGraphic.hasState('active')).toBe(false);

      chart.getEvent().emit('click', { item: barGraphic } as unknown as BaseEventParams);
      expect(barGraphic.hasState('active')).toBe(false);
    } finally {
      commonChart.release();
      removeDom(commonContainer);
    }
  });

  it('should apply interaction state style through vrender state patch', () => {
    const stateContainer = createDiv();
    const stateDom = createDiv(stateContainer);

    const chartWithState = new VChart(
      {
        type: 'bar',
        width: 400,
        height: 300,
        data: [
          {
            id: 'data',
            values: [
              { x: 'Mon', y: 10 },
              { x: 'Tue', y: 12 }
            ]
          }
        ],
        xField: 'x',
        yField: 'y',
        hover: { enable: true, trigger: 'pointerover', triggerOff: 'pointerout' },
        select: { enable: true, trigger: 'click', mode: 'single' },
        bar: {
          state: {
            hover: {
              fillOpacity: 0.31
            },
            selected: {
              stroke: '#111827',
              lineWidth: 4
            }
          }
        }
      } as IBarChartSpec,
      {
        dom: stateDom,
        animation: false
      }
    );

    chartWithState.renderSync();

    try {
      const chart = chartWithState.getChart() as IChart;
      const barSeries = chart.getAllSeries()[0];
      const barMark = barSeries.getMarks().find((mark: IMark) => mark.name === 'bar');
      expect(barMark).toBeDefined();
      if (!barMark) {
        throw new Error('Expected bar mark to exist');
      }

      const barGraphic = barMark.getGraphics()[0] as IMarkGraphic & {
        attribute: Record<string, unknown>;
        resolvedStatePatch?: Record<string, unknown>;
        stateProxy?: (stateName: string, states: string[]) => Record<string, unknown>;
      };
      expect(barGraphic).toBeDefined();
      expect(typeof barGraphic.stateProxy).toBe('function');

      const hoverPatch = barGraphic.stateProxy?.('hover', ['hover']);
      expect(hoverPatch?.fillOpacity).toBe(0.31);

      chart.getEvent().emit('pointerover', { item: barGraphic } as unknown as BaseEventParams);

      expect(barGraphic.hasState('hover')).toBe(true);
      expect(barGraphic.resolvedStatePatch?.fillOpacity).toBe(0.31);
      expect(barGraphic.attribute.fillOpacity).toBe(0.31);

      chart.getEvent().emit('pointerout', { item: barGraphic } as unknown as BaseEventParams);

      expect(barGraphic.hasState('hover')).toBe(false);
      expect(barGraphic.resolvedStatePatch).toBeUndefined();
      expect(barGraphic.attribute.fillOpacity).not.toBe(0.31);

      const selectedPatch = barGraphic.stateProxy?.('selected', ['selected']);
      expect(selectedPatch?.stroke).toBe('#111827');
      expect(selectedPatch?.lineWidth).toBe(4);

      chart.getEvent().emit('click', { item: barGraphic } as unknown as BaseEventParams);

      expect(barGraphic.hasState('selected')).toBe(true);
      expect(barGraphic.resolvedStatePatch?.stroke).toBe('#111827');
      expect(barGraphic.resolvedStatePatch?.lineWidth).toBe(4);
      expect(barGraphic.attribute.stroke).toBe('#111827');
      expect(barGraphic.attribute.lineWidth).toBe(4);
    } finally {
      chartWithState.release();
      removeDom(stateContainer);
    }
  });

  it('should merge only identical interaction triggers in common chart', () => {
    const commonContainer = createDiv();
    const commonDom = createDiv(commonContainer);

    const createSpec = (
      lineTrigger: 'click' | 'pointerover',
      barTrigger: 'click' | 'pointerover'
    ): ICommonChartSpec => ({
      type: 'common',
      data: [
        {
          id: 'barData',
          values: [
            { x: 'Mon', y: 10 },
            { x: 'Tue', y: 12 }
          ]
        },
        {
          id: 'lineData',
          values: [
            { x: 'Mon', y: 8 },
            { x: 'Tue', y: 15 }
          ]
        }
      ],
      series: [
        {
          type: 'line',
          dataId: 'lineData',
          xField: 'x',
          yField: 'y',
          line: {
            state: {
              active: {
                lineWidth: 4
              }
            }
          },
          interactions: [
            {
              type: 'element-active',
              trigger: lineTrigger
            }
          ]
        },
        {
          type: 'bar',
          dataId: 'barData',
          xField: 'x',
          yField: 'y',
          bar: {
            state: {
              active: {
                stroke: '#000',
                lineWidth: 2
              }
            }
          },
          interactions: [
            {
              type: 'element-active',
              trigger: barTrigger
            }
          ]
        }
      ],
      axes: [{ orient: 'left' }, { orient: 'bottom', type: 'band' }]
    });

    const getActiveTriggerCount = (spec: ICommonChartSpec) => {
      const chart = new VChart(spec, {
        dom: commonDom,
        animation: false
      });

      chart.renderSync();

      try {
        const activeTriggers = ((
          chart.getChart() as unknown as {
            _interaction: { _triggerMapByState: Map<string, unknown[]> };
          }
        )._interaction._triggerMapByState.get('active') ?? []) as unknown[];

        return activeTriggers.length;
      } finally {
        chart.release();
      }
    };

    try {
      expect(getActiveTriggerCount(createSpec('pointerover', 'pointerover'))).toBe(1);
      expect(getActiveTriggerCount(createSpec('click', 'pointerover'))).toBe(2);
    } finally {
      removeDom(commonContainer);
    }
  });
});
