/** 创建固定的分组柱图数据，避免随机数据引入截图噪声。 */
export function barSpec() {
  return {
    type: 'bar',
    data: {
      id: 'data',
      values: [
        { x: 'A', y: 30, group: 'Alpha' },
        { x: 'A', y: 15, group: 'Beta' },
        { x: 'B', y: -12, group: 'Alpha' },
        { x: 'B', y: -22, group: 'Beta' },
        { x: 'C', y: 40, group: 'Alpha' },
        { x: 'C', y: 25, group: 'Beta' }
      ]
    },
    xField: 'x',
    yField: 'y',
    seriesField: 'group',
    stack: true
  };
}

/** 根据场景树图元的全局包围盒定位实际交互目标。 */
export async function graphicCenter(page, name) {
  return page.evaluate(name => {
    // 读取渲染图元的实际位置，避免通过固定坐标掩盖布局变化。
    const graphic = window.__visualChart.getStage().find(node => node.name === name, true);
    if (!graphic) throw new Error(`未找到交互图元 ${name}`);
    const bounds = graphic.globalAABBBounds;
    return { x: (bounds.x1 + bounds.x2) / 2, y: (bounds.y1 + bounds.y2) / 2 };
  }, name);
}

/** 验证静态用例的关键输入与图表类型，布局差异交给截图判断。 */
export async function verifySpec(page, expected) {
  await page.evaluate(expected => {
    const actual = window.__visualChart.getSpec();
    if (actual.type !== expected.type || actual.data?.values?.length !== expected.data.values.length)
      throw new Error('图表类型或数据数量不正确');
    // VChart 会合并主题默认值，只核对用例明确指定的输入子集。
    function check(actual, expected, field) {
      if (expected && typeof expected === 'object') {
        if (!actual || typeof actual !== 'object') throw new Error('图表输入不正确：' + field);
        if (Array.isArray(expected) && (!Array.isArray(actual) || actual.length !== expected.length))
          throw new Error('数据长度不正确：' + field);
        for (const key of Object.keys(expected)) check(actual[key], expected[key], field + '.' + key);
      } else if (actual !== expected) throw new Error('图表输入不正确：' + field);
    }
    check(actual, expected, 'spec');
  }, expected);
}
