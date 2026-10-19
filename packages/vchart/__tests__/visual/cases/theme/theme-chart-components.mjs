import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';
import { interactionFrame } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 6704f50622f17300a767a2c0
 * 迁移边界：保留来源先注册并激活主题、再创建实例的顺序；不以实例后置切换替代标签初始化。
 * 验证目的：来源图表主题启用柱标签并定位左侧图例。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'bar',
      data: {
        values: [
          { time: '2:00', value: 8 },
          { time: '4:00', value: 9 },
          { time: '6:00', value: 11 },
          { time: '8:00', value: 14 },
          { time: '10:00', value: 16 },
          { time: '12:00', value: 17 },
          { time: '14:00', value: 17 },
          { time: '16:00', value: 16 },
          { time: '18:00', value: 15 }
        ]
      },
      legends: {},
      xField: 'time',
      yField: 'value'
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(async () => {
      const myTheme = {
        series: { bar: { label: { visible: true } } },
        chart: { bar: { component: { discreteLegend: { orient: 'left', position: 'end' } } } }
      };
      window.VChart.ThemeManager.registerTheme('user', myTheme);
      window.VChart.ThemeManager.setCurrentTheme('user');
      const { cases, loadCase } = await import('./cases/index.mjs');
      const spec = (await loadCase(cases.find(c => c.id === 'theme-chart-components'))).createSpec();
      window.__visualChart.release();
      window.__visualChart = new window.VChart.default(
        { ...spec, animation: false },
        {
          dom: 'chart',
          animation: false,
          autoFit: false,
          theme: { fontFamily: 'Arial', tooltip: { transitionDuration: 0 } },
          onError: e => window.__visualErrors.push(String(e))
        }
      );
      await window.__visualChart.renderAsync();
    });
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart,
        legend = c
          .getChart()
          .getAllComponents()
          .find(c => c.type === 'discreteLegend');
      if (legend?.getSpec().orient !== 'left') throw Error('图例未使用图表主题');
      const texts = c
        .getStage()
        .findAll(g => g.name === 'data-label', true)
        .flatMap(g => g.findAll(x => x.type === 'text' && x.attribute.visible !== false, true));
      if (!texts.length) throw Error('主题未开启柱标签');
    });
  }
};
