import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 649d7ef252a1e9eec95f9e8a
 * 迁移边界：选择三份源数据共同拥有的 x=5；源下方数据从 5 开始，不把其对 x=0 的未命中当作联动失败。
 * 验证目的：来源跨区域刷选联动的实际命中及排除状态。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'common',
      stackField: 'stack',
      seriesField: 'type',
      layout: {
        type: 'grid',
        col: 3,
        row: 5,
        elements: [
          { modelId: 'legend', col: 0, row: 4, colSpan: 3 },
          { modelId: 'top', col: 1, row: 0 },
          { modelId: 'middle', col: 1, row: 1 },
          { modelId: 'bottom', col: 1, row: 2 },
          { modelId: 'axesCol0', col: 0, row: 0 },
          { modelId: 'axesCol1', col: 0, row: 1 },
          { modelId: 'axesCol2', col: 2, row: 2 },
          { modelId: 'axesRow', col: 1, row: 3 }
        ]
      },
      region: [{ id: 'top' }, { id: 'middle' }, { id: 'bottom' }],
      legends: { visible: true, orient: 'bottom', id: 'legend', regionIndex: [0, 1, 2] },
      series: [
        { type: 'bar', dataId: 'dataBar', regionIndex: 0, xField: ['x', 'type'], yField: 'y', seriesField: 'color' },
        { type: 'line', dataId: 'dataLine', regionIndex: 1, xField: 'x', yField: 'y', seriesField: 'color' },
        { type: 'bar', dataId: 'dataBar2', regionIndex: 2, xField: ['x', 'type'], yField: 'y', seriesField: 'color' }
      ],
      axes: [
        { orient: 'left', regionIndex: 0, id: 'axesCol0' },
        { orient: 'left', regionIndex: 1, id: 'axesCol1' },
        { orient: 'right', regionIndex: 2, id: 'axesCol2' },
        { orient: 'bottom', label: { visible: true }, regionIndex: [0, 1, 2], id: 'axesRow' }
      ],
      brush: {
        brushType: 'x',
        regionId: 'top',
        brushLinkSeriesIndex: [1, 2],
        inBrush: { colorAlpha: 1 },
        outOfBrush: { colorAlpha: 0.2 }
      },
      data: [
        {
          id: 'dataBar',
          values: [
            { x: '0', y: '231', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '0', y: '285', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '1', y: '231', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '1', y: '155', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '2', y: '143', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '2', y: '204', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '3', y: '214', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '3', y: '47', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '4', y: '177', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '4', y: '140', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '5', y: '216', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '5', y: '248', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '6', y: '81', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '6', y: '220', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '7', y: '70', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '7', y: '39', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '8', y: '152', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '8', y: '172', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '9', y: '274', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '9', y: '248', y2: '0', stack: 'a', type: 'B', color: 'B' }
          ]
        },
        {
          id: 'dataLine',
          values: [
            { x: '0', y: '89', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '0', y: '258', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '1', y: '173', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '1', y: '191', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '2', y: '143', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '2', y: '12', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '3', y: '202', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '3', y: '273', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '4', y: '77', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '4', y: '31', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '5', y: '53', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '5', y: '178', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '6', y: '222', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '6', y: '148', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '7', y: '150', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '7', y: '296', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '8', y: '224', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '8', y: '115', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '9', y: '104', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '9', y: '215', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '10', y: '240', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '10', y: '32', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '11', y: '165', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '11', y: '294', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '12', y: '128', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '12', y: '255', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '13', y: '155', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '13', y: '13', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '14', y: '36', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '14', y: '139', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '15', y: '275', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '15', y: '182', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '16', y: '247', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '16', y: '81', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '17', y: '26', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '17', y: '62', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '18', y: '268', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '18', y: '77', y2: '0', stack: 'a', type: 'B', color: 'D' },
            { x: '19', y: '2', y2: '0', stack: 'a', type: 'A', color: 'C' },
            { x: '19', y: '111', y2: '0', stack: 'a', type: 'B', color: 'D' }
          ]
        },
        {
          id: 'dataBar2',
          values: [
            { x: '5', y: '141', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '5', y: '30', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '6', y: '8', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '6', y: '276', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '7', y: '125', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '7', y: '196', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '8', y: '174', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '8', y: '71', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '9', y: '251', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '9', y: '240', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '10', y: '295', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '10', y: '231', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '11', y: '112', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '11', y: '176', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '12', y: '278', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '12', y: '17', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '13', y: '270', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '13', y: '174', y2: '0', stack: 'a', type: 'B', color: 'B' },
            { x: '14', y: '251', y2: '0', stack: 'a', type: 'A', color: 'A' },
            { x: '14', y: '130', y2: '0', stack: 'a', type: 'B', color: 'B' }
          ]
        }
      ],
      tooltip: { transitionDuration: 0 }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'bar', 10, 0);
    await page.mouse.move(p.x - 15, p.y - 15);
    await page.mouse.down();
    await page.mouse.move(p.x + 15, p.y - 15, { steps: 3 });
    await page.mouse.move(p.x + 15, p.y + 15, { steps: 3 });
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
      for (const i of [1, 2])
        if (
          !r.some(m => m.series === i && m.states.inBrush > 0) ||
          !r.some(m => m.series === i && m.states.outOfBrush > 0)
        )
          throw Error('刷选没有联动系列 ' + i);
    });
  }
};
