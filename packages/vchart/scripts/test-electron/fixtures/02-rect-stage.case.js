const { application, graphicCreator, createRect, Group, Stage, Layer } = require('@visactor/vrender-core');
const { registerRect } = require('@visactor/vrender-kits/register/register-rect');
const { loadBrowserEnv } = require('@visactor/vrender-kits/env/browser');

loadBrowserEnv();
registerRect();

test('rect 文件没有继承其他文件的全局状态和 DOM', () => {
  const key = Symbol.for('vchart.test.electron-isolation');
  expect(globalThis[key]).toBeUndefined();
  expect(document.querySelector('[data-isolation]')).toBeNull();
  globalThis[key] = 'rect';
  const node = document.createElement('div');
  node.dataset.isolation = 'rect';
  document.body.appendChild(node);
});

test('rect 注册表与服务来自同一模块实例', () => {
  expect(graphicCreator.rect).toBe(createRect);
  const group = new Group({});
  expect(() => group.createOrUpdateChild('rect', {}, 'rect')).not.toThrow();
  expect(application.graphicService.creator).toBe(graphicCreator);
});

test('Stage 与 Layer 来自同一模块实例，主图层可添加图元', () => {
  expect(application.layerService.layerFactory.LayerCtor).toBe(Layer);
  const stage = new Stage({ canvas: document.createElement('canvas'), width: 10, height: 10 });
  try {
    expect(stage.defaultLayer).not.toBeNull();
    stage.defaultLayer.appendChild(new Group({}));
  } finally {
    stage.release();
  }
});
