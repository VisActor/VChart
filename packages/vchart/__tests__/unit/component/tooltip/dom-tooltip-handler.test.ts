import { DomTooltipHandler } from '../../../../src/plugin/components/tooltip-handler/dom-tooltip-handler';
import {
  TOOLTIP_CONTAINER_EL_CLASS_NAME,
  TOOLTIP_TITLE_CLASS_NAME
} from '../../../../src/plugin/components/tooltip-handler/constants';
import { createDiv, removeDom } from '../../../util/dom';

const createTooltipSpec = (spec: any) => ({
  className: 'vchart-tooltip',
  style: {
    shape: {},
    keyLabel: {},
    valueLabel: {}
  },
  ...spec
});

const createHandler = (spec: any, chartContainer?: HTMLElement) => {
  const handler = new DomTooltipHandler() as any;

  handler._component = {
    getSpec: () => createTooltipSpec(spec)
  };
  handler._chartOption = {
    getTheme: (): undefined => undefined
  };
  handler._chartContainer = chartContainer;
  handler._initStyle();

  return handler as DomTooltipHandler;
};

describe('DomTooltipHandler', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = createDiv();
  });

  afterEach(() => {
    removeDom(container);
  });

  it('falls back to chart container when tooltip parentElement is not a dom element', () => {
    const handler = createHandler(
      {
        parentElement: {}
      },
      container
    );

    expect(() => handler.initRootDom()).not.toThrow();
    expect(container.querySelector(`.${TOOLTIP_CONTAINER_EL_CLASS_NAME}`)).toBe(handler.getTooltipContainer());
    expect(container.querySelector('.vchart-tooltip')).toBe(handler.getRootDom());
  });

  it('creates tooltip container under an empty valid parentElement', () => {
    const parentElement = createDiv(container);
    const handler = createHandler({
      parentElement
    });

    handler.initEl();

    expect(parentElement.querySelector(`.${TOOLTIP_CONTAINER_EL_CLASS_NAME}`)).toBe(handler.getTooltipContainer());
  });

  it('renders title as text', () => {
    const handler = createHandler({}, container) as any;
    const title = '<img src=x onerror="alert(1)">';

    handler.initRootDom();
    handler._updateDomStringByCol({ title: { value: title }, content: [] });

    const titleDom = container.querySelector(`.${TOOLTIP_TITLE_CLASS_NAME}`);
    expect(titleDom.textContent).toBe(title);
    expect(titleDom.querySelector('img')).toBeNull();
  });

  it('confines HTML tooltip to the visible chart width when canvas coordinates are scaled', () => {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    for (const element of [container, canvas]) {
      Object.defineProperty(element, 'offsetWidth', { value: 320 });
      element.getBoundingClientRect = () => ({ x: 0, y: 0, width: 320, height: 180 } as DOMRect);
    }

    const handler = createHandler({ confine: true, renderMode: 'html', parentElement: container }, container) as any;
    handler._env = 'desktop-browser';
    handler._compiler = { getCanvas: () => canvas };
    handler._initFromSpec();
    handler.initEl();

    const { x } = handler._getActualTooltipPosition(
      { activeType: 'mark', data: [{ datum: {} }] },
      {
        tooltipSpec: handler._component.getSpec(),
        event: { canvasX: 620, canvasY: 40 },
        chart: { getCanvasRect: () => ({ width: 640, height: 360 }) }
      },
      { width: 100, height: 30 }
    );

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x + 100).toBeLessThanOrEqual(320);
  });
});
