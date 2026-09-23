import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame, seriesStates } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e042e
 * 验证目的：图例悬停反向状态、移出恢复与单选筛选。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const data = [
      { year: '2012', type: 'Forest', value: 320 },
      { year: '2012', type: 'Steppe', value: 220 },
      { year: '2012', type: 'Desert', value: 150 },
      { year: '2012', type: 'Wetland', value: 98 },
      { year: '2013', type: 'Forest', value: 332 },
      { year: '2013', type: 'Steppe', value: 182 },
      { year: '2013', type: 'Desert', value: 232 },
      { year: '2013', type: 'Wetland', value: 77 },
      { year: '2014', type: 'Forest', value: 301 },
      { year: '2014', type: 'Steppe', value: 191 },
      { year: '2014', type: 'Desert', value: 201 },
      { year: '2014', type: 'Wetland', value: 101 },
      { year: '2015', type: 'Forest', value: 334 },
      { year: '2015', type: 'Steppe', value: 234 },
      { year: '2015', type: 'Desert', value: 154 },
      { year: '2015', type: 'Wetland', value: 99 },
      { year: '2016', type: 'Forest', value: 390 },
      { year: '2016', type: 'Steppe', value: 290 },
      { year: '2016', type: 'Desert', value: 190 },
      { year: '2016', type: 'Wetland', value: 40 }
    ];
    const spec = {
      type: 'bar',
      data: [{ id: 'bar', values: data }],
      xField: ['year', 'type'],
      yField: 'value',
      seriesField: 'type',
      stateDef: {
        legend_hover: {
          filter: datum => {
            return true;
          }
        }
      },
      legends: [
        {
          orient: 'top',
          position: 'middle',
          padding: { bottom: 12 },
          data: items => {
            return items.map(item => {
              item.shape.outerBorder = { stroke: item.shape.fill, distance: 2, lineWidth: 1 };
              return item;
            });
          },
          item: {
            shape: { space: 8, style: { symbolType: 'square' }, state: { unSelected: { opacity: 0.5 } } },
            background: { visible: false }
          },
          selectMode: 'single'
        }
      ],
      crosshair: { xField: { visible: true, label: { visible: false } }, yField: { visible: false } },
      bar: { state: { legend_hover_reverse: { fill: '#ccc' } } }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      chartSpace.on('legendItemHover', e => {
        const hoveredName = e?.value?.data?.label;
        if (hoveredName) {
          chartSpace.updateState({ legend_hover_reverse: { filter: d => d.type !== hoveredName } });
        }
      });
      chartSpace.on('legendItemUnHover', e => {
        chartSpace.updateState({ legend_hover_reverse: { filter: d => false } });
      });
    });
    const p = await graphicCenter(page, 'legendItem');
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    const hover = await seriesStates(page);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    const off = await seriesStates(page);
    await page.evaluate(() => {
      window.__legendBefore = window.__visualChart
        .getChart()
        .getAllSeries()
        .flatMap(s => s.getViewData().latestData).length;
    });
    await page.mouse.click(p.x, p.y);
    await interactionFrame(page);
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(v => (window.__legendStates = v), { hover, off });
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const r = window.__legendStates;
      if (!r?.hover.some(m => m.states.legend_hover_reverse > 0) || r.off.some(m => m.states.legend_hover_reverse > 0))
        throw Error('图例悬停与恢复没有生效');
      if (
        window.__visualChart
          .getChart()
          .getAllSeries()
          .flatMap(s => s.getViewData().latestData).length >= window.__legendBefore
      )
        throw Error('图例未过滤实际数据');
    });
  }
};
