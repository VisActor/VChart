import { DomTooltipHandler } from '../../../../src/plugin/components/tooltip-handler/dom-tooltip-handler';
import type { IChart, IChartOption } from '../../../../src/chart/interface';
import type { ICompiler } from '../../../../src/compile/interface/compilable-item';
import type { ITooltipActual } from '../../../../src/typings';
import type { Tooltip, TooltipHandlerParams } from '../../../../src/component/tooltip';

const createRect = (x: number, y: number, width: number, height: number): DOMRect => {
  return {
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({})
  } as DOMRect;
};

const mockElementSize = (element: HTMLElement, width: number, height: number) => {
  Object.defineProperty(element, 'offsetWidth', { value: width, configurable: true });
  Object.defineProperty(element, 'offsetHeight', { value: height, configurable: true });
  element.getBoundingClientRect = jest.fn(() => createRect(0, 0, width, height));
};

class TestDomTooltipHandler extends DomTooltipHandler {
  private _chartForTest: IChart;

  setup(chartElement: HTMLElement, canvasElement: HTMLElement, canvasWidth = 120, canvasHeight = 80) {
    const spec = {
      className: 'vchart-tooltip-element',
      confine: true,
      renderMode: 'html',
      parentElement: chartElement,
      style: {
        panel: { padding: 0, border: { width: 0 } },
        titleLabel: {},
        shape: {},
        keyLabel: {},
        valueLabel: {}
      }
    };
    const chart = {
      getCanvasRect: () => ({ width: canvasWidth, height: canvasHeight })
    } as unknown as IChart;
    this._chartForTest = chart;
    const option = {
      mode: 'desktop-browser',
      globalInstance: {
        getContainer: () => chartElement
      },
      getTheme: (): undefined => undefined,
      getChart: () => chart
    } as unknown as IChartOption;
    const compiler = {
      getCanvas: () => canvasElement
    } as unknown as ICompiler;

    this._component = {
      getSpec: () => spec,
      getOption: () => option,
      getCompiler: () => compiler
    } as unknown as Tooltip;
    this._chartOption = option;
    this._chartContainer = chartElement;
    this._compiler = compiler;
    this._env = 'desktop-browser';
    this._container = document.createElement('div');
    chartElement.appendChild(this._container);

    this._initFromSpec();
    this._initStyle();
  }

  getPosition(canvasX: number, tooltipWidth: number) {
    return this._getActualTooltipPosition(
      {
        activeType: 'mark',
        data: [{ datum: {} }]
      } as unknown as ITooltipActual,
      {
        tooltipSpec: this._component.getSpec(),
        event: {
          type: 'pointermove',
          canvasX,
          canvasY: 40
        },
        chart: this._chartForTest
      } as unknown as TooltipHandlerParams,
      { width: tooltipWidth, height: 30 }
    );
  }
}

describe('DomTooltipHandler', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('confines html tooltip to the visible chart width when canvas coordinates are scaled', () => {
    const chartElement = document.createElement('div');
    const canvasElement = document.createElement('canvas');

    mockElementSize(chartElement, 320, 180);
    mockElementSize(canvasElement, 320, 180);
    chartElement.appendChild(canvasElement);
    document.body.appendChild(chartElement);

    const handler = new TestDomTooltipHandler();
    handler.setup(chartElement, canvasElement, 640, 360);

    const position = handler.getPosition(620, 100);
    expect(position.x).toBeLessThanOrEqual(220);
    expect(position.x).toBeGreaterThanOrEqual(0);
  });
});
