import { FederatedPointerEvent } from '@visactor/vrender-core';
import VChart from '../../../../src';
import { Event_Source_Type } from '../../../../src/constant/event';
import { createDiv, removeDom } from '../../../util/dom';

jest.mock('@visactor/vchart', () => require('../../../../src'), { virtual: true });

const {
  registerCombinationCandlestickChart
} = require('../../../../../vchart-extension/src/charts/combination-candlestick');

const TYPE_FIELD = 'typeField';

const rawData = [
  {
    date: '20260408',
    open: '4.99',
    close: '5.09',
    high: '5.13',
    low: '4.94',
    ma5: '4.91',
    ma10: '5.17',
    total: '19600'
  },
  {
    date: '20260409',
    open: '5.01',
    close: '5.08',
    high: '5.14',
    low: '4.94',
    ma5: '4.93',
    ma10: '5.09',
    total: '14300'
  },
  {
    date: '20260410',
    open: '5.08',
    close: '5.05',
    high: '5.10',
    low: '4.99',
    ma5: '5.00',
    ma10: '5.02',
    total: '13800'
  },
  {
    date: '20260413',
    open: '5.00',
    close: '5.48',
    high: '5.53',
    low: '4.98',
    ma5: '5.12',
    ma10: '5.02',
    total: '34200'
  }
];

const typedValues = (seriesName: string) =>
  rawData.map(datum => ({
    ...datum,
    [TYPE_FIELD]: seriesName
  }));

const createSpec = () => ({
  type: 'combinationCandlestick',
  data: [{ values: rawData }],
  candlestickSeries: {
    type: 'candlestick',
    id: 'candlestickSeries',
    xField: 'date',
    openField: 'open',
    closeField: 'close',
    highField: 'high',
    lowField: 'low',
    seriesField: TYPE_FIELD,
    data: [{ values: typedValues('Candlestick') }]
  },
  series: [
    {
      type: 'line',
      id: 'lineSeries-MA5',
      xField: 'date',
      yField: 'ma5',
      seriesField: TYPE_FIELD,
      data: [{ values: typedValues('MA5') }],
      point: { style: { visible: false } }
    },
    {
      type: 'line',
      id: 'lineSeries-MA10',
      xField: 'date',
      yField: 'ma10',
      seriesField: TYPE_FIELD,
      data: [{ values: typedValues('MA10') }],
      point: { style: { visible: false } }
    }
  ],
  previewSeries: [
    {
      type: 'bar',
      id: 'previewSeries-total',
      xField: 'date',
      yField: 'total',
      seriesField: TYPE_FIELD,
      data: [{ values: typedValues('total') }]
    }
  ],
  previewAxes: {
    orient: 'left',
    id: 'preview-axis-left',
    visible: false,
    innerOffset: { top: 20 }
  },
  previewHeight: '20%',
  axes: [
    {
      orient: 'bottom',
      id: 'axis-bottom',
      paddingInner: [0.7799506694855517, 0],
      paddingOuter: [0.7799506694855517, 0]
    },
    {
      orient: 'left',
      id: 'axis-left',
      zero: false
    }
  ],
  dataZoom: [
    {
      orient: 'bottom',
      visible: false,
      id: 'dataZoom-bottom'
    }
  ],
  crosshair: {
    followTooltip: true,
    xField: {
      visible: true,
      line: {
        type: 'line',
        style: {
          lineWidth: 1,
          opacity: 1,
          stroke: '#000',
          lineDash: [2, 2]
        }
      },
      label: {
        visible: true
      }
    }
  },
  tooltip: {
    visible: true,
    confine: true,
    triggerOff: 'none',
    trigger: 'click',
    parentElement: 'container',
    enterable: true,
    showDelay: 0,
    renderMode: 'html',
    className: 'vchart-tooltip-element'
  }
});

describe('Crosshair followTooltip with combinationCandlestick', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;

  beforeAll(() => {
    registerCombinationCandlestickChart();
  });

  beforeEach(() => {
    container = createDiv();
    container.id = 'container';
    dom = createDiv(container);
    dom.id = 'chart';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';

    vchart = new VChart(createSpec() as any, {
      dom,
      animation: false
    });
    vchart.renderSync();
  });

  afterEach(() => {
    vchart.release();
    removeDom(container);
  });

  const getCrosshair = () => vchart.getComponents().find(com => com.type === 'cartesianCrosshair') as any;

  const getLineSeries = () => vchart.getChart().getSeriesInUserId('lineSeries-MA5') as any;

  const getDatum = (date: string) => rawData.find(item => item.date === date);

  const getLinePoint = (date: string) => {
    const series = getLineSeries();
    const datum = series.getViewData().latestData.find((item: any) => item.date === date);

    return {
      series,
      datum,
      point: series.dataToPosition(datum),
      regionStart: series.getRegion().getLayoutStartPoint()
    };
  };

  const triggerClickTooltipAtDate = (date: string) => {
    const datum = getDatum(date);
    const point = vchart.convertDatumToPosition(datum, { seriesId: 'lineSeries-MA5' }, true) as {
      x: number;
      y: number;
    };
    const tooltip = vchart.getComponents().find(com => com.type === 'tooltip') as any;

    tooltip._getMouseMoveHandler(true)({
      event: {
        type: 'pointertap',
        viewX: point.x,
        viewY: point.y,
        canvasX: point.x,
        canvasY: point.y,
        clientX: point.x,
        clientY: point.y
      },
      chart: vchart.getChart(),
      source: Event_Source_Type.chart
    });
  };

  const getCrosshairXValue = () => {
    const values = Array.from(getCrosshair()._stateByField.xField.currentValue.values()) as { datum: string }[];
    return values[0]?.datum;
  };

  const getCrosshairXCoord = () => getCrosshair()._stateByField.xField.crosshairComp?.attribute?.start?.x;

  const getExpectedXCoord = (date: string) => {
    const { point, regionStart } = getLinePoint(date);

    return point.x + regionStart.x;
  };

  const dispatchGraphicClick = (graphic: any, x: number, y: number) => {
    const stage = vchart.getStage();
    const event = new FederatedPointerEvent((stage as any).eventSystem.manager);

    event.type = 'pointertap';
    event.pointerId = 1;
    event.pointerType = 'mouse';
    event.button = 0;
    event.buttons = 1;
    event.view = window;
    event.client.x = x;
    event.client.y = y;
    event.canvas.x = x;
    event.canvas.y = y;
    event.global.x = x;
    event.global.y = y;
    event.viewport.x = x;
    event.viewport.y = y;
    graphic.dispatchEvent(event);
  };

  test('updates crosshair to the current clicked dimension', () => {
    triggerClickTooltipAtDate('20260409');
    expect(getCrosshairXValue()).toBe('20260409');
    const firstCoord = getCrosshairXCoord();

    triggerClickTooltipAtDate('20260410');
    expect(getCrosshairXValue()).toBe('20260410');
    expect(getCrosshairXCoord()).not.toBe(firstCoord);
    expect(getCrosshairXCoord()).toBeCloseTo(getExpectedXCoord('20260410'), 6);
  });

  test('uses the dimension tooltip value instead of re-inverting a point-derived value', () => {
    triggerClickTooltipAtDate('20260409');
    expect(getCrosshairXValue()).toBe('20260409');

    const previousPoint = getLinePoint('20260409');
    const { series, datum, point } = getLinePoint('20260410');
    const axis = (vchart.getChart() as any)
      .getComponentsByKey('axes')
      .find((component: any) => component.getOrient() === 'bottom');
    const dataToPosition = jest.spyOn(series, 'dataToPosition').mockReturnValue(previousPoint.point);

    getCrosshair()._layoutCrosshair(
      point.x,
      point.y,
      [
        {
          axis,
          value: '20260410',
          position: axis.getScale().scale('20260410'),
          data: [{ series, datum: [datum], key: 'lineSeries-MA5_2' }]
        }
      ],
      'dimension'
    );

    dataToPosition.mockRestore();
    expect(getCrosshairXValue()).toBe('20260410');
    expect(getCrosshairXCoord()).toBeCloseTo(getExpectedXCoord('20260410'), 6);
  });

  test('updates crosshair when clicking candlestick graphics', () => {
    const clickCandlestickAt = (date: string) => {
      const series = vchart.getChart().getSeriesInUserId('candlestickSeries') as any;
      const datum = series.getViewData().latestData.find((item: any) => item.date === date);
      const regionStart = series.getRegion().getLayoutStartPoint();
      const point = series.dataToPosition(datum);
      const graphic = vchart
        .getStage()
        .getElementsByType('glyph')
        .find((g: any) => g.context?.modelUserId === 'candlestickSeries' && g.context?.data?.[0]?.date === date);

      dispatchGraphicClick(graphic, point.x + regionStart.x, point.y + regionStart.y);
    };

    clickCandlestickAt('20260409');
    expect(getCrosshairXValue()).toBe('20260409');

    clickCandlestickAt('20260410');
    expect(getCrosshairXValue()).toBe('20260410');
  });

  test('honors preview axis innerOffset when computing crosshair hit bounds', () => {
    const axes = (vchart.getChart() as any).getComponentsByKey('axes');
    const previewAxis = axes.find((axis: any) => axis.getSpec?.().id === 'preview-axis-left');
    const previewRegion = previewAxis.getRegions()[0];
    const previewRegionStart = previewRegion.getLayoutStartPoint();
    const layoutStart = getCrosshair().getLayoutStartPoint();
    const yAxisMap = getCrosshair()._getAxisInfoByField('y');
    const bounds = yAxisMap.get(previewAxis.getSpecIndex());

    expect(bounds.y1).toBeCloseTo(previewRegionStart.y - layoutStart.y + 20, 6);
  });
});
