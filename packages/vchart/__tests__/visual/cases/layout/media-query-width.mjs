import { verifyRendered } from '../../helpers.mjs';
import { interactionFrame } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 66c4659ac3ab4200c6b4fdc5
 * 迁移边界：注册插件后按源 spec 重建实例，再缩窄至 160×160；验证 maxWidth:180 隐藏左轴。宽度恢复时标签未恢复，保留为待调查问题，未宣称覆盖恢复。
 * 验证目的：来源媒体查询注册、缩窄后隐藏左侧坐标轴标签。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const media = [
      { action: [{ filterType: 'dataZoom', spec: { visible: false } }], query: { maxHeight: 300 } },
      {
        action: [
          { filterType: 'title', spec: { visible: false } },
          { filter: { orient: 'bottom' }, filterType: 'axes', spec: { title: { visible: false } } },
          { filter: { orient: 'top' }, filterType: 'axes', spec: { title: { visible: false } } }
        ],
        query: { maxHeight: 180 }
      },
      {
        action: [
          { filter: { orient: 'top' }, filterType: 'legends', spec: { visible: false } },
          { filter: { orient: 'bottom' }, filterType: 'legends', spec: { visible: false } }
        ],
        query: { maxHeight: 150 }
      },
      {
        action: [
          {
            filter: { orient: 'top' },
            filterType: 'axes',
            spec: { tick: { visible: false }, label: { visible: false } }
          },
          {
            filter: { orient: 'bottom' },
            filterType: 'axes',
            spec: { tick: { visible: false }, label: { visible: false } }
          }
        ],
        query: { maxHeight: 120 }
      },
      {
        action: [
          { filter: { orient: 'right' }, filterType: 'axes', spec: { title: { visible: false } } },
          { filter: { orient: 'left' }, filterType: 'axes', spec: { title: { visible: false } } },
          { filter: { orient: 'left' }, filterType: 'legends', spec: { visible: false } },
          { filter: { orient: 'right' }, filterType: 'legends', spec: { visible: false } },
          { filterType: 'indicator', spec: { visible: false } }
        ],
        query: { maxWidth: 200 }
      },
      {
        action: [
          {
            filter: { orient: 'left' },
            filterType: 'axes',
            spec: { tick: { visible: false }, label: { visible: false } }
          },
          {
            filter: { orient: 'right' },
            filterType: 'axes',
            spec: { tick: { visible: false }, label: { visible: false } }
          }
        ],
        query: { maxWidth: 180 }
      }
    ];
    const spec = {
      type: 'bar',
      height: 160,
      media,
      stack: true,
      label: { visible: true, position: 'inside' },
      data: [
        {
          id: 'barData',
          values: [
            { State: 'AL', age: 'Under 5 Years', population: 100, type: 'a' },
            { State: 'AL', age: '5 to 13 Years', population: 20, type: 'a' }
          ]
        }
      ],
      xField: 'State',
      yField: 'population',
      seriesField: 'age',
      color: ['red', 'blue'],
      axes: [{ orient: 'left' }]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(async () => {
      const { cases, loadCase } = await import('./cases/index.mjs');
      const item = await loadCase(cases.find(c => c.id === 'media-query-width'));
      window.VChart.registerMediaQuery();
      window.__visualChart.release();
      const c = (window.__visualChart = new window.VChart.default(
        { ...item.createSpec(), animation: false },
        {
          dom: 'chart',
          animation: false,
          autoFit: false,
          theme: { fontFamily: 'Arial', tooltip: { transitionDuration: 0 } },
          onError: e => window.__visualErrors.push(String(e))
        }
      ));
      await c.renderAsync();
      window.__mediaWide = c
        .getStage()
        .findAll(g => g.name === 'axis-label' && g.attribute.visible !== false, true).length;
      await c.resize(160, 160);
    });
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。

    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart,
        count = c.getStage().findAll(g => g.name === 'axis-label' && g.attribute.visible !== false, true).length;
      if (
        window.__mediaWide === undefined ||
        count >= window.__mediaWide ||
        c.getSpec().axes.find(a => a.orient === 'left').label.visible !== false
      )
        throw Error('媒体查询未随缩窄隐藏左轴标签');
    });
  }
};
