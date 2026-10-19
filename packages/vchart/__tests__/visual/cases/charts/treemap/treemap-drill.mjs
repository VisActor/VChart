import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65af99db06085f008cf8f8a3
 * 迁移边界：源未录制鼠标；补充实际下钻动作验证 drill:true，不宣称重放历史录制。
 * 验证目的：来源层级图下钻与空白回退的路径和实际布局。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'treemap',
      drill: true,
      data: [
        {
          id: 'data',
          values: [
            {
              name: 'Second',
              children: [
                {
                  name: 'B1',
                  children: [
                    { name: 'B11', value: 100 },
                    { name: 'B12', value: 100 }
                  ]
                },
                { name: 'B2', value: 98 },
                { name: 'B3', value: 56 }
              ]
            },
            {
              name: 'First',
              children: [
                {
                  name: 'A1',
                  value: 100,
                  children: [
                    { name: 'A1-1', value: 60 },
                    { name: 'A1-2', value: 40 }
                  ]
                },
                { name: 'A2', value: 60 },
                { name: 'A3', value: 30 }
              ]
            },
            {
              name: 'Third',
              children: [
                { name: 'C1', value: 335 },
                { name: 'C2', value: 148 },
                { name: 'C3', value: 126 },
                { name: 'C4', value: 26 }
              ]
            },
            {
              name: 'Fourth',
              children: [
                { name: 'D1', value: 415 },
                { name: 'D2', value: 148 },
                { name: 'D3', value: 89 },
                { name: 'D4', value: 64 },
                { name: 'D5', value: 16 }
              ]
            },
            {
              name: 'Fifth',
              children: [
                { name: 'E1', value: 687 },
                { name: 'E2', value: 148 }
              ]
            }
          ]
        }
      ],
      aspectRatio: 0.7,
      categoryField: 'name',
      valueField: 'value',
      legends: { visible: true },
      tooltip: {
        transitionDuration: 0,
        mark: {
          title: {
            value: datum => {
              return datum?.datum?.map(data => data.name).join('/');
            }
          }
        }
      },
      nonLeaf: { visible: true },
      nonLeafLabel: { position: 'top', visible: true, style: {} },
      label: { visible: true }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const c = window.__visualChart;
      window.__drillEvents = [];
      window.__hierarchyBefore = JSON.stringify(
        c
          .getChart()
          .getAllSeries()[0]
          .getSeriesMark()
          .getGraphics()
          .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.size])
      );
      c.on('drill', e => window.__drillEvents.push({ type: e.value.type, path: [...e.value.path] }));
    });
    const p = await interactionTarget(page, 'leaf', 1);
    await page.mouse.click(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(
      () =>
        (window.__hierarchyAfter = JSON.stringify(
          window.__visualChart
            .getChart()
            .getAllSeries()[0]
            .getSeriesMark()
            .getGraphics()
            .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.size])
        ))
    );
    await page.mouse.click(790, 590);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const e = window.__drillEvents;
      if (
        e?.length !== 2 ||
        !e[0].path.length ||
        e[1].path.length >= e[0].path.length ||
        window.__hierarchyBefore === window.__hierarchyAfter
      )
        throw Error('层级下钻/回退没有改变路径与布局');
    });
  }
};
