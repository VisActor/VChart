import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 6511e1ee172872291c4615d5
 * 验证目的：来源 DataZoom 拖动及有效范围约束。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            { State: 'WY', 年龄段: '小于5岁adwadwdaw', 人口数量: 25635 },
            { State: 'WY', 年龄段: '5至13岁', 人口数量: 1890 },
            { State: 'WY', 年龄段: '14至17岁', 人口数量: 9314 },
            { State: 'WY', 年龄段: '18至19岁', 人口数量: 9314 },
            { State: 'WY', 年龄段: '19至20岁', 人口数量: 9314 },
            { State: 'WY', 年龄段: '21至22岁', 人口数量: 9314 },
            { State: 'WY', 年龄段: '23至24岁', 人口数量: 9314 },
            { State: 'WY', 年龄段: '25至26岁', 人口数量: 9314 },
            { State: 'DC', 年龄段: '小于5岁', 人口数量: 30352 },
            { State: 'DC', 年龄段: '5至13岁', 人口数量: 20439 },
            { State: 'DC', 年龄段: '14至17岁', 人口数量: 10225 },
            { State: 'DC', 年龄段: '18至19岁', 人口数量: 10225 },
            { State: 'DC', 年龄段: '19至20岁', 人口数量: 10225 },
            { State: 'DC', 年龄段: '21至22岁', 人口数量: 10225 },
            { State: 'DC', 年龄段: '23至24岁', 人口数量: 10225 },
            { State: 'DC', 年龄段: '25至26岁', 人口数量: 10225 },
            { State: 'VT', 年龄段: '小于5岁', 人口数量: 38253 },
            { State: 'VT', 年龄段: '5至13岁', 人口数量: 42538 },
            { State: 'VT', 年龄段: '14至17岁', 人口数量: 15757 },
            { State: 'VT', 年龄段: '18至19岁', 人口数量: 15757 },
            { State: 'VT', 年龄段: '19至20岁', 人口数量: 15757 },
            { State: 'VT', 年龄段: '21至22岁', 人口数量: 15757 },
            { State: 'VT', 年龄段: '23至24岁', 人口数量: 15757 },
            { State: 'VT', 年龄段: '25至26岁', 人口数量: 15757 },
            { State: 'ND', 年龄段: '小于5岁', 人口数量: 51896 },
            { State: 'ND', 年龄段: '5至13岁', 人口数量: 67358 },
            { State: 'ND', 年龄段: '14至17岁', 人口数量: 18794 },
            { State: 'ND', 年龄段: '18至19岁', 人口数量: 18794 },
            { State: 'ND', 年龄段: '19至20岁', 人口数量: 18794 },
            { State: 'ND', 年龄段: '21至22岁', 人口数量: 18794 },
            { State: 'ND', 年龄段: '23至24岁', 人口数量: 18794 },
            { State: 'ND', 年龄段: '25至26岁', 人口数量: 18794 },
            { State: 'AK', 年龄段: '小于5岁', 人口数量: 72083 },
            { State: 'AK', 年龄段: '5至13岁', 人口数量: 85640 },
            { State: 'AK', 年龄段: '14至17岁', 人口数量: 22153 },
            { State: 'AK', 年龄段: '18至19岁', 人口数量: 22153 },
            { State: 'AK', 年龄段: '19至20岁', 人口数量: 22153 },
            { State: 'AK', 年龄段: '21至22岁', 人口数量: 22153 },
            { State: 'AK', 年龄段: '23至24岁', 人口数量: 22153 },
            { State: 'AK', 年龄段: '25至26岁', 人口数量: 22153 }
          ]
        }
      ],
      padding: { top: 30 },
      xField: ['State', '年龄段'],
      yField: '人口数量',
      seriesField: '年龄段',
      legends: {
        visible: true,
        orient: 'left',
        type: 'discrete',
        maxRow: 1,
        padding: { right: 12 },
        pager: {
          padding: 0,
          space: 0,
          handler: {
            space: 4,
            preShape: '',
            nextShape: '',
            style: { fill: '#8F959E', size: 7 },
            state: { hover: { fill: '#336DF4' }, disable: { fill: '#BBBFC4' } }
          },
          textStyle: { fill: '#8F959E', fontSize: 12, lineHeight: 20 }
        },
        item: {
          visible: true,
          spaceCol: 16,
          background: { state: { selectedHover: { fill: '#E22E28', fillOpacity: '0.1' } } },
          label: { formatMethod: text => text, style: { fontSize: 12, maxLineWidth: 120 } },
          shape: { space: 2, style: { symbolType: 'circle', size: 8 } }
        }
      },
      bar: { state: { hover: { stroke: '#000', lineWidth: 1 } } },
      label: {
        visible: true,
        position: 'inside',
        style: { fontSize: 12, lineHeight: 20, fontWeight: 700, fontFamily: 'DIN Alternate' }
      },
      tooltip: {
        minWidth: 120,
        dimension: {
          content: { key: datum => datum.年龄段 + '：', value: datum => datum.人口数量, shapeType: 'circle' }
        },
        style: {
          spaceRow: 2,
          keyLabel: { lineHeight: 20, spacing: 0, fontSize: 12 },
          valueLabel: { lineHeight: 20, fontSize: 12 },
          titleLabel: { fontSize: 12, lineHeight: 20, fontColor: '#1F2329' },
          panel: {
            padding: { top: 10, bottom: 10, left: 12, right: 12 },
            border: { color: '#EFF0F1', width: 1, radius: 6 },
            shadow: { x: 0, y: 4, blur: 16, spread: 4, color: '#1F232908' }
          },
          shape: { size: 8, spacing: 5 }
        }
      },
      dataZoom: [{ orient: 'bottom', start: 0, end: 0.2, minSpan: 0.1, maxSpan: 0.5 }]
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
