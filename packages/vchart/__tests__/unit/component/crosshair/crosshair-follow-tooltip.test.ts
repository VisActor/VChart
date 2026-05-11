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
});
