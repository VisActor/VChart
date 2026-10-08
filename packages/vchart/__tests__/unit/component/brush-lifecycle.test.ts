import { Brush } from '../../../src/component/brush/brush';
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
