import { createGroup } from '@visactor/vrender-core';
import { LinkPathMark, registerLinkPathMark } from '../../../src/mark/link-path';
import { BoxPlotMark, registerBoxPlotMark } from '../../../src/mark/box-plot';
import { RippleMark, registerRippleMark } from '../../../src/mark/ripple';
import { LiquidMark, registerLiquidMark } from '../../../src/mark/liquid';
import { addRuntimeState } from '../../../src/mark/utils/glyph';
import { markContext } from '../../util/context';
import { ribbonThickness } from '../series/fixtures/sankey-related';

const createGraphic = (mark: any, attrs: any, datum = {}) => {
  const g = mark._createGraphic(attrs);
  g.context = { data: [datum], states: [] };
  mark._afterCreateGraphic(g);
  return g;
};
const linkAttrs = { x0: 0, y0: 10, x1: 100, y1: 20, thickness: 20, round: false, fill: 'red' };

beforeAll(() => {
  registerLinkPathMark();
  registerBoxPlotMark();
  registerRippleMark();
  registerLiquidMark();
});

test('shared runtime-only selected state resolves each Glyph independently and refreshes without clearing', () => {
  const mark: any = new LinkPathMark('link', markContext);
  mark.created();
  mark._product = createGroup({});
  mark._encoderOfState = {};
  mark._applySharedStateDefinitions();
  const definition = mark._product.sharedStateDefinitions;
  const a = createGraphic(mark, linkAttrs);
  const b = createGraphic(mark, linkAttrs);
  mark._product.appendChild(a);
  mark._product.appendChild(b);
  const encoder = jest.spyOn(mark, '_positionEncoder');
  addRuntimeState(a, 'selected', { ratio: 0.25 }, true, false);
  addRuntimeState(b, 'selected', { ratio: 0.75 }, true, false);
  expect(ribbonThickness(a.getSubGraphic()[1].attribute.path)).toEqual([5, 5]);
  expect(ribbonThickness(b.getSubGraphic()[1].attribute.path)).toEqual([15, 15]);
  const write = jest.spyOn(a, 'commitSubGraphicAttributes');
  encoder.mockClear();
  addRuntimeState(a, 'selected', { ratio: 0.5 }, true, false);
  expect(ribbonThickness(a.getSubGraphic()[1].attribute.path)).toEqual([10, 10]);
  expect(encoder).toHaveBeenCalledTimes(1);
  expect(write).toHaveBeenCalledTimes(1);
  expect(mark._product.sharedStateDefinitions).toBe(definition);
  encoder.mockClear();
  write.mockClear();
  addRuntimeState(a, 'selected', { ratio: 0.5 }, true, false);
  expect(encoder).not.toHaveBeenCalled();
  expect(write).not.toHaveBeenCalled();
  expect(b.attribute.ratio).toBe(0.75);
});

test('static, data-driven and runtime state attributes compose in the shared resolver', () => {
  const mark: any = new LinkPathMark('link', markContext);
  mark.created();
  mark.setAttribute('backgroundStyle', { fill: 'gray' }, 'selected');
  mark.setAttribute('stroke', (datum: any) => datum.stroke, 'selected');
  mark.setAttribute('ratio', 0.1, 'selected');
  mark._updateEncoderByState();
  mark._product = createGroup({});
  mark._applySharedStateDefinitions();
  const g = createGraphic(mark, linkAttrs, { stroke: 'blue' });
  mark._product.appendChild(g);
  addRuntimeState(g, 'selected', { ratio: 0.4 }, true, false);
  expect(g.attribute).toMatchObject({ ratio: 0.4, stroke: 'blue', backgroundStyle: { fill: 'gray' } });
  expect(ribbonThickness(g.getSubGraphic()[1].attribute.path)).toEqual([8, 8]);
  expect(g.getSubGraphic()[0].attribute.fill).toBe('gray');
});

test('channel removal restores current inheritance, and paint changes do not encode geometry', () => {
  const mark: any = new LinkPathMark('link', markContext);
  const g = createGraphic(mark, linkAttrs);
  g.states = {
    hover: { stroke: 'black' },
    selected: { backgroundStyle: { fill: 'gray', stroke: 'purple' }, ratio: 0.5 }
  };
  g.setStates(['hover', 'selected'], false);
  const [back, front] = g.getSubGraphic();
  expect(back.attribute.stroke).toBe('purple');
  expect(front.attribute.stroke).toBe('black');
  g.states = { selected: { backgroundStyle: { fill: 'gray' }, ratio: 0.5 } };
  g.setStates(['selected'], { animate: false });
  expect(back.attribute.stroke).toBeUndefined();
  expect(front.attribute.stroke).toBeUndefined();
  const encode = jest.spyOn(mark, '_positionEncoder');
  g.setAttribute('fill', 'blue');
  expect(encode).not.toHaveBeenCalled();
  g.clearStates(false);
  expect(back.attribute.fill).toBe('blue');
  expect(Object.prototype.hasOwnProperty.call(back.attribute, 'fill')).toBe(false);
  expect(back.attribute.path).toBe('');
  expect(ribbonThickness(front.attribute.path)).toEqual([20, 20]);
});

test.each(['line', 'bar'])('boxPlot clears conditional angle and anchor outputs (%s)', shaftShape => {
  const mark: any = new BoxPlotMark('box', markContext);
  mark.setGlyphConfig({ direction: 'horizontal', shaftShape });
  const g = createGraphic(mark, {
    x: 10,
    y: 20,
    min: 0,
    q1: 5,
    median: 10,
    q3: 15,
    max: 20,
    boxHeight: 10,
    ruleHeight: 10,
    minMaxHeight: 2,
    q1q3Height: 10
  });
  g.states = { hover: { angle: 0.5 } };
  g.setStates(['hover'], false);
  g.getSubGraphic().forEach((child: any) => expect(child.attribute.angle).toBe(0.5));
  g.clearStates(false);
  g.getSubGraphic().forEach((child: any) => {
    expect(child.attribute.angle).toBeUndefined();
    expect(child.attribute.anchor).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(child.attribute, 'angle')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(child.attribute, 'anchor')).toBe(false);
  });
});

test('ripple retains derived opacity and restores geometry', () => {
  const mark: any = new RippleMark('ripple', markContext);
  const g = createGraphic(mark, { size: 20, ripple: 0, fill: 'red' });
  g.states = { hover: { ripple: 1, fillOpacity: 1 } };
  g.setStates(['hover'], false);
  expect(g.getSubGraphic().map((child: any) => child.attribute.fillOpacity)).toEqual([0.5, 0.25, 0]);
  expect(g.getSubGraphic().map((child: any) => child.attribute.size)).toEqual([30, 40, 50]);
  g.clearStates(false);
  expect(g.getSubGraphic().map((child: any) => child.attribute.fillOpacity)).toEqual([0.75, 0.5, 0.25]);
  expect(g.getSubGraphic().map((child: any) => child.attribute.size)).toEqual([20, 30, 40]);
});

test('liquid retains child opacity and does not rebuild points for a paint-only update', () => {
  const mark: any = new LiquidMark('liquid', markContext);
  const g = createGraphic(mark, { y: 20, height: 100, wave: 0, fill: 'red' });
  const points = g.getSubGraphic().map((child: any) => child.attribute.points);
  const encode = jest.spyOn(mark, '_positionEncoder');
  g.states = { hover: { fill: 'blue' } };
  g.setStates(['hover'], false);
  expect(encode).not.toHaveBeenCalled();
  g.getSubGraphic().forEach((child: any, i: number) => {
    expect(child.attribute.points).toBe(points[i]);
    expect(child.attribute.fill).toBe('blue');
  });
  expect(g.getSubGraphic().map((child: any) => child.attribute.fillOpacity)).toEqual([1, 0.66, 0.33]);
  g.setAttribute('wave', 0.5);
  expect(encode).toHaveBeenCalledTimes(1);
  expect(g.getSubGraphic()[0].attribute.points[0].x).toBe(-450);
});

test.each([0, 1])('ratio endpoint %s has the correct foreground and full background thickness', ratio => {
  const mark: any = new LinkPathMark('link', markContext);
  const g = createGraphic(mark, linkAttrs);
  g.states = { selected: { ratio } };
  g.setStates(['selected'], false);
  const [back, front] = g.getSubGraphic();
  expect(ribbonThickness(front.attribute.path)).toEqual([20 * ratio, 20 * ratio]);
  expect(ribbonThickness(back.attribute.path)).toEqual([20, 20]);
  g.clearStates(false);
  expect(ribbonThickness(front.attribute.path)).toEqual([20, 20]);
  expect(back.attribute.path).toBe('');
});

test('reused Glyph discards the previous datum runtime ratio', () => {
  const mark: any = new LinkPathMark('link', markContext);
  mark.created();
  mark._product = createGroup({});
  mark._encoderOfState = {};
  mark._applySharedStateDefinitions();
  const g = createGraphic(mark, linkAttrs);
  mark._product.appendChild(g);
  addRuntimeState(g, 'selected', { ratio: 0.25 }, true, false);
  g.context = { data: [{ key: 'next' }], states: [], reusing: true, finalAttrs: { ...linkAttrs, thickness: 40 } };
  mark._graphics = [g];
  mark._runApplyGraphic([g]);
  expect(g.runtimeStateCache).toBeUndefined();
  expect(g.attribute.ratio).toBeUndefined();
  addRuntimeState(g, 'selected', {}, true, false);
  expect(g.attribute.ratio).toBeUndefined();
  expect(ribbonThickness(g.getSubGraphic()[1].attribute.path)).toEqual([40, 40]);
});

test('progressive creation initializes Glyph children after datum and context are ready', () => {
  const mark: any = new LinkPathMark('link', markContext);
  mark.created();
  mark._product = createGroup({});
  const progressiveGroup = createGroup({});
  mark._product.appendChild(progressiveGroup);
  mark.renderContext = { progressive: {} };
  mark._graphics = [{ context: { data: [{}], states: [], finalAttrs: linkAttrs } }];
  mark._runApplyGraphic(mark._graphics);
  const g = mark._graphics[0];
  expect(g.parent).toBe(progressiveGroup);
  expect(g.getSubGraphic()[0].attribute.path).toBe('');
  expect(ribbonThickness(g.getSubGraphic()[1].attribute.path)).toEqual([20, 20]);
});
