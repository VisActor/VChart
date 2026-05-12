import VChart from '../../../../src';
import { ChartEvent, Event_Source_Type } from '../../../../src/constant/event';
import { createDiv, removeDom } from '../../../util/dom';

describe('Crosshair followTooltip', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;

  beforeEach(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';

    vchart = new VChart(
      {
        type: 'line',
        data: [
          {
            id: 'data',
            values: [
              { x: 'A', y: 1 },
              { x: 'B', y: 2 }
            ]
          }
        ],
        xField: 'x',
        yField: 'y',
        tooltip: {
          trigger: 'click',
          triggerOff: 'none'
        },
        crosshair: {
          followTooltip: true,
          xField: {
            visible: true,
            label: {
              visible: false
            },
            line: {
              visible: true,
              type: 'line'
            }
          }
        }
      } as any,
      { dom }
    );
    vchart.renderSync();
  });

  afterEach(() => {
    vchart.release();
    removeDom(container);
  });

  test('clears axis value when followed tooltip hides', () => {
    const crosshair = vchart.getComponents().find(com => com.type === 'cartesianCrosshair') as any;
    const axis = vchart.getComponents().find(com => (com as any).getOrient?.() === 'bottom') as any;

    crosshair.showCrosshair([{ axis, value: 'A' }]);
    expect(crosshair._stateByField.xField.currentValue.size).toBe(1);

    crosshair.event.emit(ChartEvent.tooltipHide, {
      source: Event_Source_Type.chart,
      tooltip: {}
    });

    expect(crosshair._stateByField.xField.currentValue.size).toBe(0);
  });

  test('renders after followed tooltip updates stale crosshair state', () => {
    const crosshair = vchart.getComponents().find(com => com.type === 'cartesianCrosshair') as any;
    const axis = vchart.getComponents().find(com => (com as any).getOrient?.() === 'bottom') as any;
    const series = vchart.getChart().getSeriesInIndex()[0] as any;
    const stage = vchart.getStage() as any;
    const datumB = series.getViewData().latestData.find((item: any) => item.x === 'B');
    const pointB = series.dataToPosition(datumB);
    const render = jest.spyOn(stage, 'render').mockImplementation(() => undefined);

    crosshair.showCrosshair([{ axis, value: 'A' }]);
    const crosshairComp = crosshair._stateByField.xField.crosshairComp;

    // Simulate an outer stage drawing before tooltipShow updates the current dimension.
    crosshair.onBeforeRender();
    expect(Array.from(crosshair._stateByField.xField.currentValue.values())[0]).toMatchObject({ datum: 'A' });

    render.mockClear();
    jest.spyOn(crosshairComp, 'setAttributes').mockImplementation(() => undefined);

    crosshair.event.emit(ChartEvent.tooltipShow, {
      source: Event_Source_Type.chart,
      event: {
        viewX: pointB.x,
        viewY: pointB.y
      },
      activeType: 'dimension',
      tooltipData: [
        {
          axis,
          value: 'B',
          data: [{ series, datum: [datumB], key: 'line_1' }]
        }
      ],
      tooltip: {}
    });

    expect(Array.from(crosshair._stateByField.xField.currentValue.values())[0]).toMatchObject({ datum: 'B' });
    expect(render).toHaveBeenCalled();

    render.mockClear();
    crosshair.event.emit(ChartEvent.tooltipShow, {
      source: Event_Source_Type.chart,
      event: {
        viewX: pointB.x,
        viewY: pointB.y
      },
      activeType: 'dimension',
      tooltipData: [
        {
          axis,
          value: 'B',
          data: [{ series, datum: [datumB], key: 'line_1' }]
        }
      ],
      tooltip: {}
    });

    expect(Array.from(crosshair._stateByField.xField.currentValue.values())[0]).toMatchObject({ datum: 'B' });
    expect(crosshair._stateByField.xField.currentValue.size).toBe(1);
    expect(render).toHaveBeenCalled();

    render.mockRestore();
    (crosshairComp.setAttributes as jest.Mock).mockRestore();
  });

  test('falls back to next frame render when followed tooltip updates during render', () => {
    const crosshair = vchart.getComponents().find(com => com.type === 'cartesianCrosshair') as any;
    const axis = vchart.getComponents().find(com => (com as any).getOrient?.() === 'bottom') as any;
    const series = vchart.getChart().getSeriesInIndex()[0] as any;
    const stage = vchart.getStage() as any;
    const datumB = series.getViewData().latestData.find((item: any) => item.x === 'B');
    const pointB = series.dataToPosition(datumB);
    const render = jest.spyOn(stage, 'render').mockImplementation(() => undefined);
    const renderNextFrame = jest.spyOn(stage, 'renderNextFrame').mockImplementation(() => undefined);
    const prevState = stage.state;

    stage.state = 'rendering';

    crosshair.event.emit(ChartEvent.tooltipShow, {
      source: Event_Source_Type.chart,
      event: {
        viewX: pointB.x,
        viewY: pointB.y
      },
      activeType: 'dimension',
      tooltipData: [
        {
          axis,
          value: 'B',
          data: [{ series, datum: [datumB], key: 'line_1' }]
        }
      ],
      tooltip: {}
    });

    expect(Array.from(crosshair._stateByField.xField.currentValue.values())[0]).toMatchObject({ datum: 'B' });
    expect(render).not.toHaveBeenCalled();
    expect(renderNextFrame).toHaveBeenCalled();

    stage.state = prevState;
    render.mockRestore();
    renderNextFrame.mockRestore();
  });
});
