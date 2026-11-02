import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { interactionTarget } from '../__tests__/visual/interaction-helpers.mjs';
import poptip from '../__tests__/visual/cases/components/axis/axis-poptip-rotated.mjs';

/** 在独立页面上下文执行真实定位代码，记录鼠标动作而不触发浏览器。 */
function pageFor(chart) {
  const window = { __visualChart: chart }, moves = [];
  return {
    window,
    moves,
    mouse: { async move(x, y) { moves.push({ x, y }); } },
    async evaluate(fn, argument) {
      return runInNewContext(`(${fn.toString()})(argument)`, {
        window,
        argument,
        requestAnimationFrame: callback => callback()
      });
    }
  };
}

test('图元中心被遮挡时选择同一图元的可见位置，完全遮挡时拒绝误命中', async () => {
  const graphic = {
    attribute: { visible: true },
    globalAABBBounds: { x1: 0, y1: 0, x2: 100, y2: 100, width: () => 100 }
  };
  let pick = () => ({ graphic });
  const page = pageFor({
    getChart: () => ({ getAllSeries: () => [{ getMarks: () => [{ name: 'bar', getGraphics: () => [graphic] }] }] }),
    getStage: () => ({ pick: (x, y) => pick(x, y) })
  });
  let point = await interactionTarget(page, 'bar');
  assert.equal(point.x, 50);
  assert.equal(point.y, 50);
  const area = {};
  pick = x => ({ graphic: x < 20 ? graphic : area });
  point = await interactionTarget(page, 'bar');
  assert.equal(point.x, 10);
  assert.equal(pick(point.x, point.y).graphic, graphic);
  pick = () => ({ graphic: area });
  await assert.rejects(() => interactionTarget(page, 'bar'), /没有可命中的交互位置/);
});

test('poptip 跳过轴交点处无法命中的标签，仍要求存在可命中的截断标签', async () => {
  const labels = [100, 200].map(y => ({
    name: 'axis-label', type: 'text', cliped: true, attribute: { text: String(y) },
    globalAABBBounds: { x1: 10, x2: 50, y1: y, y2: y + 10 }
  }));
  let pick = (_x, y) => ({ graphic: y > 150 ? labels[1] : null });
  const page = pageFor({ getStage: () => ({ find: fn => labels.find(fn), pick: (x, y) => pick(x, y) }) });
  await poptip.exercise(page);
  assert.deepEqual(page.moves, [{ x: 30, y: 205 }]);
  assert.equal(page.window.__poptipTarget.text, '200');
  pick = () => ({ graphic: null });
  await assert.rejects(() => poptip.exercise(page), /来源未产生可命中的截断轴标签/);
});
