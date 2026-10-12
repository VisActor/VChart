import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65fd3b127c3a0c00c99f2ebe
 * 迁移边界：源未录制鼠标；使用实际图元验证源 drill:true 的下钻与逐层回退，不宣称重放历史录制。
 * 验证目的：来源层级图下钻与空白回退的路径和实际布局。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const data = [
      {
        name: 'root',
        children: [
          {
            name: 'Country A',
            children: [
              {
                name: 'Region1',
                children: [
                  { name: 'Office Supplies', value: 824 },
                  { name: 'Furniture', value: 920 },
                  { name: 'Electronic equipment', value: 936 }
                ]
              },
              {
                name: 'Region2',
                children: [
                  { name: 'Office Supplies', value: 1270 },
                  { name: 'Furniture', value: 1399 },
                  { name: 'Electronic equipment', value: 1466 }
                ]
              },
              {
                name: 'Region3',
                children: [
                  { name: 'Office Supplies', value: 1408 },
                  { name: 'Furniture', value: 1676 },
                  { name: 'Electronic equipment', value: 1559 }
                ]
              },
              {
                name: 'Region4',
                children: [
                  { name: 'Office Supplies', value: 745 },
                  { name: 'Furniture', value: 919 },
                  { name: 'Electronic equipment', value: 781 }
                ]
              },
              {
                name: 'Region5',
                children: [
                  { name: 'Office Supplies', value: 267 },
                  { name: 'Furniture', value: 316 },
                  { name: 'Electronic equipment', value: 230 }
                ]
              },
              {
                name: 'Region6',
                children: [
                  { name: 'Office Supplies', value: 347 },
                  { name: 'Furniture', value: 501 },
                  { name: 'Electronic equipment', value: 453 }
                ]
              }
            ]
          },
          {
            name: 'Country B',
            children: [
              {
                name: 'Region1',
                children: [
                  { name: 'Office Supplies', value: 824 },
                  { name: 'Furniture', value: 920 },
                  { name: 'Electronic equipment', value: 936 }
                ]
              },
              {
                name: 'Region2',
                children: [
                  { name: 'Office Supplies', value: 1270 },
                  { name: 'Furniture', value: 1399 },
                  { name: 'Electronic equipment', value: 1466 }
                ]
              },
              {
                name: 'Region3',
                children: [
                  { name: 'Office Supplies', value: 1408 },
                  { name: 'Furniture', value: 1676 },
                  { name: 'Electronic equipment', value: 1559 }
                ]
              },
              {
                name: 'Region4',
                children: [
                  { name: 'Office Supplies', value: 745 },
                  { name: 'Furniture', value: 919 },
                  { name: 'Electronic equipment', value: 781 }
                ]
              },
              {
                name: 'Region5',
                children: [
                  { name: 'Office Supplies', value: 267 },
                  { name: 'Furniture', value: 316 },
                  { name: 'Electronic equipment', value: 230 }
                ]
              },
              {
                name: 'Region6',
                children: [
                  { name: 'Office Supplies', value: 347 },
                  { name: 'Furniture', value: 501 },
                  { name: 'Electronic equipment', value: 453 }
                ]
              }
            ]
          },
          {
            name: 'Country C',
            children: [
              {
                name: 'Region1',
                children: [
                  { name: 'Office Supplies', value: 824 },
                  { name: 'Furniture', value: 920 },
                  { name: 'Electronic equipment', value: 936 }
                ]
              },
              {
                name: 'Region2',
                children: [
                  { name: 'Office Supplies', value: 1270 },
                  { name: 'Furniture', value: 1399 },
                  { name: 'Electronic equipment', value: 1466 }
                ]
              },
              {
                name: 'Region3',
                children: [
                  { name: 'Office Supplies', value: 1408 },
                  { name: 'Furniture', value: 1676 },
                  { name: 'Electronic equipment', value: 1559 }
                ]
              },
              {
                name: 'Region4',
                children: [
                  { name: 'Office Supplies', value: 745 },
                  { name: 'Furniture', value: 919 },
                  { name: 'Electronic equipment', value: 781 }
                ]
              },
              {
                name: 'Region5',
                children: [
                  { name: 'Office Supplies', value: 267 },
                  { name: 'Furniture', value: 316 },
                  { name: 'Electronic equipment', value: 230 }
                ]
              },
              {
                name: 'Region6',
                children: [
                  { name: 'Office Supplies', value: 347 },
                  { name: 'Furniture', value: 501 },
                  { name: 'Electronic equipment', value: 453 }
                ]
              }
            ]
          }
        ]
      }
    ];
    const spec = {
      data: [{ id: 'data', values: data }],
      type: 'circlePacking',
      categoryField: 'name',
      valueField: 'value',
      drill: true,
      circlePacking: { style: { fillOpacity: d => (d.isLeaf ? 0.75 : 0.25) } },
      layoutPadding: [0, 10, 10],
      label: {
        style: {
          fontSize: 10,
          visible: d => {
            return d.depth === 1;
          }
        }
      },
      animationEnter: { easing: 'cubicInOut' },
      animationExit: { easing: 'cubicInOut' },
      animationUpdate: { easing: 'cubicInOut' },
      tooltip: {
        mark: {
          title: {
            value: val => {
              return val?.datum?.map(data => data.name).join(' / ');
            }
          }
        }
      }
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
    const p = await interactionTarget(page, 'circlePacking', 1);
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
