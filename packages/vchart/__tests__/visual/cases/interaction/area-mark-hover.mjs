import { verifyRendered } from '../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e032f
 * 验证目的：面积图点与面积分别悬停的真实状态。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'common',
      series: [
        {
          type: 'area',
          data: {
            id: 'data1',
            values: [
              { x: 1, y: 80 },
              { x: 2, y: 40 },
              { x: 3, y: 10 },
              { x: 4, y: 20 }
            ]
          },
          xField: 'x',
          yField: 'y',
          point: { state: { normal: { fill: 'yellow', size: 30 }, hover: { fill: 'pink' } } },
          area: {
            interactive: true,
            state: { normal: { cursor: 'pointer', fill: 'grey' }, hover: { fill: 'pink', stroke: '#000' } }
          },
          line: { state: { normal: { lineWidth: 20 }, hover: { stroke: 'pink' } } }
        }
      ],
      axes: [{ orient: 'left' }, { orient: 'bottom', type: 'band' }],
      tooltip: { transitionDuration: 0 }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const observations = [];
    for (const name of ['point', 'area']) {
      await page.mouse.move(950, 750);
      const p = await interactionTarget(page, name);
      await page.mouse.move(p.x, p.y);
      await interactionFrame(page);
      observations.push({ name, states: await seriesStates(page) });
    }
    await page.evaluate(v => (window.__observations = v), observations);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await page.evaluate(async () => {
      const { assertSpec } = await import('./helpers.mjs');
      const { cases, loadCase } = await import('./cases/index.mjs');
      const expected = (await loadCase(cases.find(c => c.id === 'area-mark-hover'))).createSpec();
      /* VChart 将 line 状态合并到 area；保留来源两份配置，核验合并后的实际结果。 */ expected.series[0].area.state.hover.stroke =
        expected.series[0].line.state.hover.stroke;
      assertSpec(window.__visualChart.getSpec(), expected);
    });
    await verifyRendered(page);
    await page.evaluate(() => {
      const r = window.__observations;
      if (r?.length !== 2 || r.some(r => !r.states.some(m => m.name === r.name && m.states.hover > 0)))
        throw Error('点或面积未进入 hover');
    });
  }
};
