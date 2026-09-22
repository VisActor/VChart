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
    if (actual.type !== expected.type) throw new Error('图表类型或数据数量不正确');
    // VChart 会合并主题默认值，只核对用例明确指定的输入子集。
    function check(actual, expected, field) {
      if (expected && typeof expected === 'object') {
        if (!actual || typeof actual !== 'object') throw new Error('图表输入不正确：' + field);
        // 坐标系转换器在原轴数组末尾补充缺省轴；原轴仍逐项核对，其他数组必须等长。
        const lengthMatches =
          field === 'spec.axes' ? actual.length >= expected.length : actual.length === expected.length;
        if (Array.isArray(expected) && (!Array.isArray(actual) || !lengthMatches))
          throw new Error('数据长度不正确：' + field);
        for (const key of Object.keys(expected)) check(actual[key], expected[key], field + '.' + key);
      } else if (actual !== expected) throw new Error('图表输入不正确：' + field);
    }
    check(actual, expected, 'spec');
  }, expected);
}

/** 检查每个系列实际绘制，以及用例关注的组件确实存在；布局由截图比较。 */
export async function verifyRendered(page, target = 'series') {
  await page.evaluate(target => {
    const chart = window.__visualChart;
    for (const series of chart.getChart().getAllSeries()) {
      const graphics = series.getSeriesMark()?.getGraphics() ?? [];
      if (
        !graphics.length ||
        !graphics.some(g => {
          const b = g.globalAABBBounds;
          return [b.x1, b.y1, b.x2, b.y2].every(Number.isFinite) && b.width() > 0 && b.height() > 0;
        })
      )
        throw new Error('系列没有有效几何图元');
    }
    if (target !== 'series') {
      const graphic = chart
        .getStage()
        .find(
          g =>
            typeof g.name === 'string' &&
            (target === 'label'
              ? g.name === 'data-label' || g.name === 'label'
              : g.name.toLowerCase().replaceAll('-', '').includes(target.replaceAll('-', ''))),
          true
        );
      if (!graphic || graphic.attribute.visible === false) throw new Error('缺少可见目标：' + target);
      if (
        target === 'label' &&
        !graphic.findAll(
          g => g.type === 'text' && g.attribute.visible !== false && String(g.attribute.text ?? '').length > 0,
          true
        ).length
      )
        throw new Error('没有可见数据标签');
    }
  }, target);
}
