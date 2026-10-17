import { Brush } from '../../../src/component/brush/brush';

test.each([1, 4, 64])('%i regions reset ten thousand graphic states in one layout pass', regions => {
  const brush = Object.create(Brush.prototype) as any;
  let stateUpdates = 0;
  // 用实际状态迁移计数约束工作量，不能为每个面板重复遍历整张图。
  const graphics = Array.from({ length: 10000 }, (_, i) => ({
    context: { key: String(i) },
    currentStates: ['hover', i % 2 ? 'inBrush' : 'outOfBrush'],
    setStates(states: string[]) {
      this.currentStates = states;
      stateUpdates++;
    }
  }));
  brush._option = {};
  brush._spec = { visible: true };
  brush.getMarks = (): unknown[] => [];
  brush._relativeRegions = Array.from({ length: regions }, (_, id) => ({ id }));
  brush._brushComponents = brush._relativeRegions.map(() => ({
    setAttributes: jest.fn(),
    children: [{ removeAllChild: jest.fn() }]
  }));
  brush._getBrushInteractiveAttr = () => ({ interactiveRange: { x1: 0, x2: 100, y1: 0, y2: 100 } });
  const marks = brush._relativeRegions.map((_: unknown, index: number) => ({
    id: index,
    getGraphics: () =>
      graphics.slice(
        Math.floor((index * graphics.length) / regions),
        Math.floor(((index + 1) * graphics.length) / regions)
      )
  }));
  brush._itemMap = Object.fromEntries(marks.map((mark: unknown, index: number) => [index, [mark]]));
  brush._linkedItemMap = brush._itemMap;

  brush.onLayoutEnd();

  expect(stateUpdates).toBe(2 * graphics.length);
  expect(graphics.every(graphic => graphic.currentStates.length === 1 && graphic.currentStates[0] === 'hover')).toBe(
    true
  );
  expect(Object.keys(brush._inBrushElementsMap)).toHaveLength(0);
  expect(Object.keys(brush._linkedInBrushElementsMap)).toHaveLength(0);
  expect(Object.keys(brush._outOfBrushElementsMap)).toHaveLength(graphics.length);
  expect(Object.keys(brush._linkedOutOfBrushElementsMap)).toHaveLength(graphics.length);
  brush._brushComponents.forEach((component: any) => {
    expect(component.setAttributes).toHaveBeenCalledTimes(1);
    expect(component.children[0].removeAllChild).toHaveBeenCalledTimes(1);
  });
});

test('clears all brush state before releasing any region container', () => {
  const brush = Object.create(Brush.prototype) as any;
  const children = [0, 1, 2].map(() => ({ removeAllChild: jest.fn() }));
  brush._brushComponents = children.map(child => {
    const component = { children: [child], releaseBrushEvents: jest.fn(), removeAllChild: jest.fn() };
    component.removeAllChild.mockImplementation(() => {
      component.children = [];
    });
    return component;
  });
  brush._itemMap = {};
  brush._linkedItemMap = {};
  brush._spec = {};
  brush.getContainer = () => ({ removeChild: jest.fn() });
  expect(() => brush.clear()).not.toThrow();
  children.forEach(child => expect(child.removeAllChild).toHaveBeenCalledTimes(1));
  expect(brush._brushComponents).toBeNull();
});
