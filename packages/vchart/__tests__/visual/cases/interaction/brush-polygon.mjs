import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 649d7ef052a1e9eec95f9e88
 * 验证目的：来源多边形刷选的实际命中及排除状态。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'scatter',
      data: [
        {
          values: [
            { x: 936196, size: 83431, y: 1371, type: '技术', area: '东北' },
            { x: 1270911, size: 219815, y: 5590, type: '办公用品', area: '中南' },
            { x: 453898, size: 19061, y: 727, type: '技术', area: '西南' },
            { x: 919743, size: 148800, y: 1199, type: '家具', area: '华北' },
            { x: 1676224, size: 163453, y: 2517, type: '家具', area: '华东' },
            { x: 1466575, size: 251487, y: 2087, type: '技术', area: '中南' },
            { x: 824673, size: 86067, y: 3622, type: '办公用品', area: '东北' },
            { x: 230956, size: 24016, y: 347, type: '技术', area: '西北' },
            { x: 1599653, size: 228179, y: 2183, type: '技术', area: '华东' },
            { x: 745813, size: 137265, y: 3020, type: '办公用品', area: '华北' },
            { x: 267870, size: 49633, y: 970, type: '办公用品', area: '西北' },
            { x: 1408628, size: 215585, y: 6341, type: '办公用品', area: '华东' },
            { x: 781743, size: 144986, y: 927, type: '技术', area: '华北' },
            { x: 501533, size: 29303, y: 814, type: '家具', area: '西南' },
            { x: 920698, size: 72692, y: 1470, type: '家具', area: '东北' },
            { x: 316212, size: 24903, y: 468, type: '家具', area: '西北' },
            { x: 1399928, size: 199582, y: 2023, type: '家具', area: '中南' },
            { x: 347692, size: 49272, y: 1858, type: '办公用品', area: '西南' }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      sizeField: 'size',
      size: [10, 25],
      shapeField: 'type',
      shape: ['circle', 'triangle'],
      axes: [
        { orient: 'left', range: { min: 0 }, type: 'linear' },
        { orient: 'bottom', label: { visible: true }, type: 'linear' }
      ],
      legends: [
        {
          visible: true,
          orient: 'left',
          position: 'start',
          title: { visible: true, style: { text: '标题' } },
          item: { visible: true }
        }
      ],
      direction: 'horizontal',
      brush: { brushType: 'polygon', inBrush: { colorAlpha: 1 }, outOfBrush: { colorAlpha: 0.2 } }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'point', 0, 0);
    await page.mouse.move(p.x - 15, p.y - 15);
    await page.mouse.down();
    await page.mouse.move(p.x + 15, p.y - 15, { steps: 3 });
    await page.mouse.move(p.x + 15, p.y + 15, { steps: 3 });
    await page.mouse.move(p.x - 15, p.y + 15, { steps: 3 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    await page.evaluate(r => (window.__brushStates = r), await seriesStates(page));
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const r = window.__brushStates;
      if (!r?.some(m => m.states.inBrush > 0) || !r.some(m => m.states.outOfBrush > 0))
        throw Error('刷选未区分实际命中/排除');
    });
  }
};
