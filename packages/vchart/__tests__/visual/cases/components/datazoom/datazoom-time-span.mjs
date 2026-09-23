import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65f7b21549222d00d0762038
 * 验证目的：来源 DataZoom 拖动及有效范围约束。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      color: [
        '#3855df',
        '#ffc52b',
        '#5ecf78',
        '#fb7a00',
        '#0acffd',
        '#217dfd',
        '#98dd61',
        '#3150e0',
        '#714efd',
        '#0bcfff',
        '#3d0dde',
        '#ffc527',
        '#f5c13f',
        '#fb7a08',
        '#95d8fd'
      ],
      type: 'rangeColumn',
      direction: 'horizontal',
      yField: 'type',
      minField: 'start_time',
      maxField: 'end_time',
      seriesField: 'color',
      dataZoom: [
        {
          orient: 'bottom',
          height: 20,
          start: 0.1,
          endValue: 1681956000,
          maxSpan: 0.8,
          filterMode: 'axis',
          brushSelect: false,
          startText: { formatMethod: text => Math.floor(text) },
          endText: { formatMethod: text => Math.floor(text) }
        }
      ],
      axes: [
        { orient: 'left', type: 'band', bandPadding: 0.5, visible: false },
        { type: 'time', orient: 'bottom', layers: [{ tickStep: 28800, timeFormat: '%Y%m%d %H:%M' }] }
      ],
      title: {
        textStyle: {
          character: [
            { text: 'Time-Consuming Distribution', fontWeight: 400, fill: '#222' },
            { text: 'Show the SQL distribution of TOP 100', fontWeight: 200, fontSize: 10, fill: '#555' }
          ]
        }
      },
      tooltip: {
        visible: true,
        dimension: { visible: false },
        mark: {
          title: { key: 'Query ID', value: datum => 'Query ID: ' + datum['id'] },
          content: [
            { key: 'Time Consuming', value: datum => datum['useTime'] },
            { key: 'start time', value: datum => datum['start_time'] },
            { key: 'end time', value: datum => datum['end_time'] }
          ]
        }
      },
      data: [
        {
          id: 'data0',
          values: [
            {
              start_time: 1681926000,
              end_time: 1681927200,
              type: 'TOP 1',
              color: 'A',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681926000,
              end_time: 1681959600,
              type: 'TOP 2',
              color: 'B',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681925400,
              end_time: 1681974000,
              type: 'TOP 3',
              color: 'C',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681924800,
              end_time: 1681933200,
              type: 'TOP 4',
              color: 'D',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681959600,
              end_time: 1681963200,
              type: 'TOP 5',
              color: 'E',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681970400,
              end_time: 1681971000,
              type: 'TOP 5',
              color: 'F',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            { start_time: 1681992000, end_time: 1681992600, type: 'TOP 5', color: 'G', useTime: '100ms' },
            {
              start_time: 1681956000,
              end_time: 1681963200,
              type: 'TOP 6',
              color: 'H',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681990200,
              end_time: 1681993800,
              type: 'TOP 7',
              color: 'I',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681948800,
              end_time: 1681959600,
              type: 'TOP 8',
              color: 'J',
              id: 'a90292870-9282',
              useTime: '100ms'
            },
            {
              start_time: 1681945200,
              end_time: 1681956000,
              type: 'TOP 9',
              color: 'K',
              id: 'a90292870-9282',
              useTime: '100ms'
            }
          ].reverse()
        }
      ]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const c = window.__visualChart;
      window.__zoomEvents = [];
      window.__zoomBefore = JSON.stringify(
        c
          .getChart()
          .getAllSeries()
          .map(s =>
            s
              .getSeriesMark()
              .getGraphics()
              .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
          )
      );
      c.on('dataZoomChange', e => window.__zoomEvents.push({ ...e.value }));
    });
    const p = await graphicCenter(page, 'endHandler');
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(p.x + 160, p.y + 0, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart,
        events = window.__zoomEvents,
        r = events?.at(-1),
        cfg = c.getSpec().dataZoom[0];
      if (!r || !Number.isFinite(r.start) || !Number.isFinite(r.end) || r.end <= r.start)
        throw Error('未产生有效范围变化');
      const span = r.end - r.start;
      if (
        (cfg.minSpan !== undefined && span < cfg.minSpan - 1e-6) ||
        (cfg.maxSpan !== undefined && span > cfg.maxSpan + 1e-6)
      )
        throw Error('范围违反来源 minSpan/maxSpan');
      const actual = JSON.stringify(
        c
          .getChart()
          .getAllSeries()
          .map(s =>
            s
              .getSeriesMark()
              .getGraphics()
              .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
          )
      );
      if (actual === window.__zoomBefore) throw Error('缩放没有影响实际绘制');
    });
  }
};
