import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { interactionTarget, clippedAxisLabelTarget } from '../__tests__/visual/interaction-helpers.mjs';

/** 将定位函数放入独立页面上下文，用覆盖层和轴交点验证真实命中规则。 */
function pageFor(chart) {
  return {
    evaluate: (fn, input) => runInNewContext(`(${fn.toString()})(input)`, { input, window: { __visualChart: chart } })
  };
}

test('混合系列定位避开被面积覆盖的柱心，刷选覆盖层仍使用几何中心', async () => {
  const graphic = { attribute: {}, globalAABBBounds: { x1: 0, y1: 0, x2: 100, y2: 100, width: () => 100 } };
  let covered = false;
  const page = pageFor({
    getChart: () => ({ getAllSeries: () => [{ getMarks: () => [{ name: 'bar', getGraphics: () => [graphic] }] }] }),
    getStage: () => ({ pick: x => ({ graphic: !covered && x < 50 ? graphic : {} }) })
  });
  const visible = await interactionTarget(page, 'bar');
  assert.equal(visible.x, 25);
  assert.equal(visible.y, 50);
  covered = true;
  const center = await interactionTarget(page, 'bar');
  assert.equal(center.x, 50);
  assert.equal(center.y, 50);
  await assert.rejects(() => interactionTarget(page, 'missing'), /缺少交互图元/);
});

test('截断轴标签定位拒绝交点遮挡，无可命中标签时明确失败', async () => {
  const labels = [470, 370].map(y => ({
    name: 'axis-label',
    type: 'text',
    cliped: true,
    attribute: { text: 'full-' + y },
    globalAABBBounds: { x1: 20, x2: 90, y1: y - 5, y2: y + 5 }
  }));
  let blocked = false;
  const stage = {
    find: predicate => labels.find(predicate),
    pick: (_x, y) => ({ graphic: !blocked && y < 400 ? labels[1] : {} })
  };
  const page = pageFor({ getStage: () => stage });
  const target = await clippedAxisLabelTarget(page);
  assert.equal(target.text, 'full-370');
  assert.equal(target.y, 370);
  blocked = true;
  await assert.rejects(() => clippedAxisLabelTarget(page), /可命中的截断轴标签/);
});
