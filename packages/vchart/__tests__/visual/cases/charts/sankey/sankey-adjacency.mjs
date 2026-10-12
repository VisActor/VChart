import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 6527b98851d9f60a3c5cb802
 * 验证目的：点击桑基节点时仅高亮相邻节点与连接，空白点击恢复。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'sankey',
      data: [
        {
          values: [
            {
              nodes: [
                { name: 'Berlin' },
                { name: 'Job Applications' },
                { name: 'Barcelona' },
                { name: 'Madrid' },
                { name: 'Amsterdam' },
                { name: 'Paris' },
                { name: 'London' },
                { name: 'Munich' },
                { name: 'Brussels' },
                { name: 'Dubai' },
                { name: 'Dublin' },
                { name: 'Other Cities' },
                { name: 'No Response' },
                { name: 'Responded' },
                { name: 'Rejected' },
                { name: 'Interviewed' },
                { name: 'No Offer' },
                { name: 'Declined Offer' },
                { name: 'Accepted Offer' }
              ],
              links: [
                { source: 'Berlin', target: 'Job Applications', value: 102, color: '#dddddd' },
                { source: 'Barcelona', target: 'Job Applications', value: 39, color: '#dddddd' },
                { source: 'Madrid', target: 'Job Applications', value: 35, color: '#dddddd' },
                { source: 'Amsterdam', target: 'Job Applications', value: 15, color: '#dddddd' },
                { source: 'Paris', target: 'Job Applications', value: 14, color: '#dddddd' },
                { source: 'London', target: 'Job Applications', value: 6, color: '#dddddd' },
                { source: 'Munich', target: 'Job Applications', value: 5, color: '#dddddd' },
                { source: 'Brussels', target: 'Job Applications', value: 4, color: '#dddddd' },
                { source: 'Dubai', target: 'Job Applications', value: 3, color: '#dddddd' },
                { source: 'Dublin', target: 'Job Applications', value: 3, color: '#dddddd' },
                { source: 'Other Cities', target: 'Job Applications', value: 12, color: '#dddddd' },
                { source: 'Job Applications', target: 'No Response', value: 189, color: '#dddddd' },
                { source: 'Job Applications', target: 'Responded', value: 49, color: 'orange' },
                { source: 'Responded', target: 'Rejected', value: 38, color: '#dddddd' },
                { source: 'Responded', target: 'Interviewed', value: 11, color: 'orange' },
                { source: 'Interviewed', target: 'No Offer', value: 8, color: '#dddddd' },
                { source: 'Interviewed', target: 'Declined Offer', value: 2, color: '#dddddd' },
                { source: 'Interviewed', target: 'Accepted Offer', value: 1, color: 'orange' }
              ]
            }
          ]
        }
      ],
      categoryField: 'name',
      valueField: 'value',
      sourceField: 'source',
      targetField: 'target',
      nodeAlign: 'justify',
      nodeGap: 8,
      nodeWidth: 15,
      minNodeHeight: 4,
      nodeKey: datum => datum.name,
      iterations: 20,
      title: { text: 'Job application process' },
      label: {
        visible: true,
        style: { fontSize: 10, fill: 'black' },
        state: { blur: { fill: '#e8e8e8', fillOpacity: 0.15 } }
      },
      node: {
        style: { fill: '#b9b9b9', stroke: 'white', lineWidth: 1, strokeOpacity: 1 },
        state: {
          hover: { fill: 'red', fillOpacity: 1 },
          selected: { fill: '#dddddd', stroke: '#333333', lineWidth: 1, fillOpacity: 1 },
          blur: { fillOpacity: 0.05, strokeOpacity: 0.05 }
        }
      },
      tooltip: { transitionDuration: 0 },
      link: {
        style: {
          fill: data => {
            return data.color ?? data.datum.color;
          },
          fillOpacity: 1
        },
        state: { hover: { fillOpacity: 1 }, selected: { fillOpacity: 1 }, blur: { fillOpacity: 0.05 } }
      },
      emphasis: { enable: true, effect: 'adjacency' }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const records = [];
    for (const index of [0, -1, 1]) {
      if (index < 0) await page.mouse.click(790, 590);
      else {
        const p = await interactionTarget(page, 'node', index);
        await page.mouse.click(p.x, p.y);
      }
      await page.mouse.move(950, 750);
      await interactionFrame(page);
      records.push(
        await page.evaluate(index => {
          const s = window.__visualChart.getChart().getAllSeries()[0],
            nodes = s
              .getMarks()
              .find(m => m.name === 'node')
              .getGraphics(),
            links = s
              .getMarks()
              .find(m => m.name === 'link')
              .getGraphics();
          return {
            index,
            key: index < 0 ? null : nodes[index].context.data[0].key,
            nodes: nodes.map(g => ({ key: g.context.data[0].key, states: g.currentStates })),
            links: links.map(g => ({
              source: g.context.data[0].source,
              target: g.context.data[0].target,
              states: g.currentStates
            }))
          };
        }, index)
      );
    }
    await page.evaluate(r => (window.__adjacency = r), records);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const rows = window.__adjacency;
      if (rows?.length !== 3) throw Error('缺少邻接状态过程');
      for (const r of rows) {
        if (r.index < 0) {
          if ([...r.nodes, ...r.links].some(g => g.states.some(s => ['selected', 'blur'].includes(s))))
            throw Error('邻接高亮未清除');
          continue;
        }
        const neighbors = new Set([r.key]);
        for (const l of r.links) {
          const match = l.source === r.key || l.target === r.key;
          if (match) {
            neighbors.add(l.source);
            neighbors.add(l.target);
          }
          if (!l.states.includes(match ? 'selected' : 'blur')) throw Error('链接邻接状态错误');
        }
        for (const n of r.nodes)
          if (!n.states.includes(neighbors.has(n.key) ? 'selected' : 'blur')) throw Error('节点邻接状态错误');
      }
    });
  }
};
