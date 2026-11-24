import { graphicCenter, verifyRendered, verifySourceSpec } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：离散图例按节点名称筛选使用数字索引的桑基图。
 * 场景条件：显式声明节点与连线，端点用节点数组索引，图例按节点名称生成。
 * 最终检查：点击、恢复、再点击，核对选中的图例和实际绘制的节点、连线。
 * 覆盖边界：使用默认筛选和布局，分组图例与层级数据由单元用例覆盖。
 */
export default {
  createSpec() {
    return {
      type: 'sankey',
      data: {
        values: [
          {
            nodes: ['A', 'B', 'C', 'D'].map(name => ({ name })),
            links: [
              { source: 0, target: 1, value: 6 },
              { source: 0, target: 2, value: 4 },
              { source: 1, target: 3, value: 6 },
              { source: 2, target: 3, value: 4 }
            ]
          }
        ]
      },
      categoryField: 'name',
      valueField: 'value',
      sourceField: 'source',
      targetField: 'target',
      label: { visible: true },
      legends: { visible: true, orient: 'bottom' }
    };
  },
  async exercise(page) {
    // 记录每次点击后的实际图元，最后停留在筛选状态供截图检查。
    const snapshot = () =>
      page.evaluate(() => {
        const chart = window.__visualChart;
        const marks = chart.getChart().getAllSeries()[0].getMarks();
        const data = name =>
          marks
            .find(mark => mark.name === name)
            .getGraphics()
            .map(g => g.context.data[0]);
        return {
          selected: chart.getLegendSelectedDataByIndex(),
          nodes: data('node').map(node => node.key),
          links: data('link').map(link => [link.source, link.target])
        };
      });
    const states = [await snapshot()];
    for (let click = 0; click < 3; click++) {
      const point = await graphicCenter(page, 'legendItem');
      await page.mouse.click(point.x, point.y);
      await interactionFrame(page);
      states.push(await snapshot());
    }
    await page.mouse.move(950, 750);
    await page.evaluate(states => (window.__sankeyLegendStates = states), states);
  },
  async verify(page) {
    await verifySourceSpec(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const all = {
        selected: ['A', 'B', 'C', 'D'],
        nodes: [0, 1, 2, 3],
        links: [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3]
        ]
      };
      const filtered = {
        selected: ['B', 'C', 'D'],
        nodes: [1, 2, 3],
        links: [
          [1, 3],
          [2, 3]
        ]
      };
      const actual = window.__sankeyLegendStates;
      if (JSON.stringify(actual) !== JSON.stringify([all, filtered, all, filtered])) {
        throw assertionError('桑基图图例筛选或恢复后，选中项、节点或连线不符合预期：' + JSON.stringify(actual));
      }
    });
    await verifyRendered(page);
  }
};
