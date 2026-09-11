import { markContext as ctx } from '../../util/context';
import { TextMark } from '../../../src/mark/text';
import { LayoutZIndex } from '../../../src/constant/layout';
import { default as VChart } from '../../../src';
import { createCanvas, removeDom } from '../../util/dom';

test('text mark initial style', () => {
  const textMark = new TextMark('rule0', ctx);
  textMark.created();
  const visible = textMark.getAttribute('visible', {});
  const zindex = textMark.getAttribute('zIndex', {});

  const x = textMark.getAttribute('x', {});
  const y = textMark.getAttribute('y', {});
  const dx = textMark.getAttribute('dx', {});
  const dy = textMark.getAttribute('dy', {});
  const stroke = textMark.getAttribute('stroke', {});
  const strokeWidth = textMark.getAttribute('lineWidth', {});
  const lineDash = textMark.getAttribute('lineDash', {});
  const strokeOpacity = textMark.getAttribute('strokeOpacity', {});
  const cursor = textMark.getAttribute('cursor', {});

  // mark zindex
  expect(textMark.getMarkConfig().zIndex).toEqual(LayoutZIndex.Mark);

  expect(visible).toEqual(true);
  expect(zindex).toEqual(undefined);
  expect(x).toEqual(0);
  expect(y).toEqual(0);
  expect(dx).toEqual(undefined);
  expect(dy).toEqual(undefined);
  expect(stroke).toEqual(undefined);
  expect(strokeOpacity).toEqual(undefined);
  expect(strokeWidth).toEqual(0);
  expect(lineDash).toEqual([]);
  expect(cursor).toEqual(undefined);
});

describe('rich text line dash rendering', () => {
  let canvasDom: HTMLCanvasElement;
  let chart: VChart;
  let setLineDashSpy: jest.SpyInstance;
  let strokeTextSpy: jest.SpyInstance;

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    setLineDashSpy?.mockRestore();
    strokeTextSpy?.mockRestore();
    chart?.release();
    removeDom(canvasDom);
  });

  test('resets line dash before drawing a rich text label', () => {
    setLineDashSpy = jest.spyOn(CanvasRenderingContext2D.prototype, 'setLineDash');
    strokeTextSpy = jest.spyOn(CanvasRenderingContext2D.prototype, 'strokeText');

    chart = new VChart(
      {
        type: 'scatter',
        data: [{ id: 'data1', values: [{ x: 1, y: 1, size: 50 }] }],
        xField: 'x',
        yField: 'y',
        sizeField: 'size',
        point: {
          style: {
            stroke: '#ff0000',
            lineWidth: 4,
            lineDash: [10, 10]
          }
        },
        label: {
          visible: true,
          position: 'top',
          offset: 10,
          formatMethod: () => ({
            type: 'rich',
            text: [
              {
                text: 'label',
                fontSize: 30,
                fill: '#000',
                stroke: '#00ff00',
                lineWidth: 4
              }
            ]
          })
        },
        animation: false
      } as any,
      {
        renderCanvas: canvasDom,
        animation: false
      }
    );

    chart.renderSync();

    const richTextGraphic = chart.getStage().getElementsByType('richtext')[0] as any;
    const lineDashCalls = setLineDashSpy.mock.calls.map(([lineDash]) => lineDash);
    const pointLineDashIndex = lineDashCalls.findIndex(
      lineDash => Array.isArray(lineDash) && lineDash[0] === 10 && lineDash[1] === 10
    );
    const labelStrokeTextIndex = strokeTextSpy.mock.calls.findIndex(([text]) => text === 'label');
    const labelStrokeTextInvocationOrder = strokeTextSpy.mock.invocationCallOrder[labelStrokeTextIndex];
    const lineDashCallsBeforeLabel = setLineDashSpy.mock.calls
      .map(([lineDash], index) => ({
        lineDash,
        invocationOrder: setLineDashSpy.mock.invocationCallOrder[index]
      }))
      .filter(({ invocationOrder }) => invocationOrder < labelStrokeTextInvocationOrder)
      .sort((a, b) => a.invocationOrder - b.invocationOrder);
    const lastLineDashBeforeLabel = lineDashCallsBeforeLabel[lineDashCallsBeforeLabel.length - 1];

    expect(richTextGraphic.attribute.lineDash).toEqual([]);
    expect(pointLineDashIndex).toBeGreaterThanOrEqual(0);
    expect(labelStrokeTextIndex).toBeGreaterThanOrEqual(0);
    expect(setLineDashSpy.mock.invocationCallOrder[pointLineDashIndex]).toBeLessThan(labelStrokeTextInvocationOrder);
    expect(lastLineDashBeforeLabel?.lineDash).toEqual([]);
  });
});
