const { application, graphicCreator, createLine } = require('@visactor/vrender-core');
const { registerLine } = require('@visactor/vrender-kits/register/register-line');
const { loadBrowserEnv } = require('@visactor/vrender-kits/env/browser');

loadBrowserEnv();
registerLine();

test('line 文件拥有独立的页面与图元服务', () => {
  const key = Symbol.for('vchart.test.electron-isolation');
  expect(globalThis[key]).toBeUndefined();
  expect(document.querySelector('[data-isolation]')).toBeNull();
  globalThis[key] = 'line';
  const node = document.createElement('div');
  node.dataset.isolation = 'line';
  document.body.appendChild(node);
  expect(application.graphicService.creator).toBe(graphicCreator);
  expect(application.graphicService.creator.line).toBe(createLine);
  expect(application.layerService.getStageLayer({})).toBeUndefined();
});
