import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 649d7ef552a1e9eec95f9e93
 * 验证目的：来源层级图下钻与空白回退的路径和实际布局。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const data = [
      {
        name: 'Country A',
        children: [
          {
            name: '东北',
            children: [
              { name: '办公用品', value: 824 },
              { name: '家具', value: 920 },
              { name: '电子设备', value: 936 }
            ]
          },
          {
            name: '中南',
            children: [
              { name: '办公用品', value: 1270 },
              { name: '家具', value: 1399 },
              { name: '电子设备', value: 1466 }
            ]
          },
          {
            name: '华东',
            children: [
              { name: '办公用品', value: 1408 },
              { name: '家具', value: 1676 },
              { name: '电子设备', value: 1559 }
            ]
          },
          {
            name: '华北',
            children: [
              { name: '办公用品', value: 745 },
              { name: '家具', value: 919 },
              { name: '电子设备', value: 781 }
            ]
          },
          {
            name: '西北',
            children: [
              { name: '办公用品', value: 267 },
              { name: '家具', value: 316 },
              { name: '电子设备', value: 230 }
            ]
          },
          {
            name: '西南',
            children: [
              { name: '办公用品', value: 347 },
              { name: '家具', value: 501 },
              { name: '电子设备', value: 453 }
            ]
          }
        ]
      },
      {
        name: 'Country B',
        children: [
          {
            name: '东北',
            children: [
              { name: '办公用品', value: 824 },
              { name: '家具', value: 920 },
              { name: '电子设备', value: 936 }
            ]
          },
          {
            name: '中南',
            children: [
              { name: '办公用品', value: 1270 },
              { name: '家具', value: 1399 },
              { name: '电子设备', value: 1466 }
            ]
          },
          {
            name: '华东',
            children: [
              { name: '办公用品', value: 1408 },
              { name: '家具', value: 1676 },
              { name: '电子设备', value: 1559 }
            ]
          },
          {
            name: '华北',
            children: [
              { name: '办公用品', value: 745 },
              { name: '家具', value: 919 },
              { name: '电子设备', value: 781 }
            ]
          },
          {
            name: '西北',
            children: [
              { name: '办公用品', value: 267 },
              { name: '家具', value: 316 },
              { name: '电子设备', value: 230 }
            ]
          },
          {
            name: '西南',
            children: [
              { name: '办公用品', value: 347 },
              { name: '家具', value: 501 },
              { name: '电子设备', value: 453 }
            ]
          }
        ]
      },
      {
        name: 'Country C',
        children: [
          {
            name: '东北',
            children: [
              { name: '办公用品', value: 824 },
              { name: '家具', value: 920 },
              { name: '电子设备', value: 936 }
            ]
          },
          {
            name: '中南',
            children: [
              { name: '办公用品', value: 1270 },
              { name: '家具', value: 1399 },
              { name: '电子设备', value: 1466 }
            ]
          },
          {
            name: '华东',
            children: [
              { name: '办公用品', value: 1408 },
              { name: '家具', value: 1676 },
              { name: '电子设备', value: 1559 }
            ]
          },
          {
            name: '华北',
            children: [
              { name: '办公用品', value: 745 },
              { name: '家具', value: 919 },
              { name: '电子设备', value: 781 }
            ]
          },
          {
            name: '西北',
            children: [
              { name: '办公用品', value: 267 },
              { name: '家具', value: 316 },
              { name: '电子设备', value: 230 }
            ]
          },
          {
            name: '西南',
            children: [
              { name: '办公用品', value: 347 },
              { name: '家具', value: 501 },
              { name: '电子设备', value: 453 }
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
      layoutPadding: 5,
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
