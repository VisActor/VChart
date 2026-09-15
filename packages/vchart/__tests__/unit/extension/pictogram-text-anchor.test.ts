import VChart, { createText } from '../../../src';
import type { ITextGraphicAttribute } from '../../../src';
import { registerBrowserEnv } from '../../../src/env';
import { createDiv, removeDom } from '../../util/dom';
import {
  graphicAttributeTransform,
  pictogram
} from '../../../../vchart-extension/src/charts/pictogram/series/transform';
import { registerPictogramChart } from '../../../../vchart-extension/src/charts/pictogram/pictogram';
import type { IPictogramChartSpec } from '../../../../vchart-extension/src/charts/pictogram/interface';
import type { SVGParsedElementExtend } from '../../../../vchart-extension/src/charts/pictogram/series/pictogram';
import {
  clearSVGSource,
  getSVGSource,
  registerSVGSource
} from '../../../../vchart-extension/src/charts/pictogram/series/svg-source';

const registerTextSVG = (body: string) =>
  registerSVGSource('anchor-test', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">${body}</svg>`);

describe('pictogram text anchor', () => {
  beforeAll(() => registerBrowserEnv());
  afterEach(() => clearSVGSource());

  it.each([
    ['start', 'left', 0],
    ['middle', 'center', 0.5],
    ['end', 'right', 1]
  ])('positions text using %s', (textAnchor, textAlign, ratio) => {
    const attributes = graphicAttributeTransform.text(
      { x: 100, y: 40, textAnchor, fontSize: 12, fontFamily: 'Arial' },
      'WWWW'
    );
    const graphic = createText(attributes as unknown as ITextGraphicAttribute);

    try {
      const bounds = graphic.AABBBounds;
      expect(attributes.textAlign).toBe(textAlign);
      expect(bounds.width()).toBeGreaterThan(0);
      expect(bounds.x1 + bounds.width() * Number(ratio)).toBeCloseTo(100);
      expect(attributes).not.toHaveProperty('textBaseLine');
      expect(attributes).not.toHaveProperty('textBaseline');
    } finally {
      graphic.release();
    }
  });

  it('retains explicit textAlign priority and defaults to left', () => {
    expect(graphicAttributeTransform.text({ textAnchor: 'middle', textAlign: 'right' }, 'A').textAlign).toBe('right');
    expect(graphicAttributeTransform.text({}, 'A').textAlign).toBe('left');
  });

  it('preserves the vertical baseline when changing the horizontal anchor', () => {
    const graphics = ['start', 'middle', 'end'].map(textAnchor =>
      createText(
        graphicAttributeTransform.text(
          { x: 100, y: 40, textAnchor, fontSize: 12 },
          'WWWW'
        ) as unknown as ITextGraphicAttribute
      )
    );
    const reference = createText({ x: 100, y: 40, fontSize: 12, text: 'WWWW', textBaseline: 'alphabetic' });

    try {
      for (const graphic of graphics) {
        expect(graphic.AABBBounds.y1).toBeCloseTo(reference.AABBBounds.y1);
        expect(graphic.AABBBounds.y2).toBeCloseTo(reference.AABBBounds.y2);
      }
    } finally {
      graphics.forEach(graphic => graphic.release());
      reference.release();
    }
  });

  it('preserves an explicit vertical baseline independently of the anchor', () => {
    expect(graphicAttributeTransform.text({ textAnchor: 'middle', textBaseline: 'top' }, 'A')).toHaveProperty(
      'textBaseline',
      'top'
    );
  });

  it.each([
    ['<g text-anchor="middle"><text x="100" y="40">ABC</text></g>', 'center'],
    ['<g text-anchor="middle"><text x="100" y="40" text-anchor="end">ABC</text></g>', 'right'],
    ['<text x="100" y="40" text-anchor="middle"><tspan>ABC</tspan></text>', 'center'],
    ['<text x="100" y="40" text-anchor="middle"><tspan text-anchor="end">ABC</tspan></text>', 'right']
  ])('inherits and overrides SVG anchors: %s', (body, alignment) => {
    registerTextSVG(body);
    const elements = pictogram([getSVGSource('anchor-test')!]) as SVGParsedElementExtend[];
    const texts = elements.filter(element => element.graphicType === 'text');

    expect(texts).toHaveLength(1);
    expect(texts[0]._finalAttributes.textAlign).toBe(alignment);
  });

  it('keeps centered text inside the SVG viewport after rendering and resizing', async () => {
    registerPictogramChart();
    registerTextSVG(
      '<text name="anchor-label" x="170" y="50" text-anchor="middle" font-family="Arial" font-size="12">WWWW</text>'
    );
    const dom = createDiv();
    const chart = new VChart(
      {
        type: 'pictogram',
        width: 200,
        height: 100,
        padding: 0,
        svg: 'anchor-test',
        data: { values: [] }
      } as IPictogramChartSpec,
      { dom, animation: false }
    );

    try {
      chart.renderSync();
      const series = chart.getChart().getAllSeries()[0] as any;
      const textElement = series._parsedSvgResult.elements.find(
        (element: SVGParsedElementExtend) => element.graphicType === 'text'
      );
      const textMark = series._idToMark.get(textElement._uniqueId);
      const root = series.getPictogramRootGraphic();
      const getTextBounds = () => textMark.getGraphics()[0].globalAABBBounds;
      const bounds = getTextBounds();
      const originalY = { y1: bounds.y1, y2: bounds.y2 };

      expect(bounds.width()).toBeGreaterThan(0);
      expect((bounds.x1 + bounds.x2) / 2).toBeCloseTo(170);
      expect(bounds.x2).toBeLessThanOrEqual(200);
      expect(root.attribute.clip).toBe(true);
      expect(root.attribute.postMatrix).toEqual(expect.objectContaining({ a: 1, d: 1, e: 0, f: 0 }));

      await chart.resize(400, 200);

      const resizedBounds = getTextBounds();
      expect((resizedBounds.x1 + resizedBounds.x2) / 2).toBeCloseTo(340);
      expect(resizedBounds.x2).toBeLessThanOrEqual(400);
      expect(resizedBounds.y1).toBeCloseTo(originalY.y1 * 2);
      expect(resizedBounds.y2).toBeCloseTo(originalY.y2 * 2);
      expect(root.attribute.clip).toBe(true);
      expect(root.attribute.postMatrix).toEqual(expect.objectContaining({ a: 2, d: 2, e: 0, f: 0 }));
    } finally {
      chart.release();
      removeDom(dom);
    }
  });
});
