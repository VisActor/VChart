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

/** 对照显式输入，允许已知的组件数组规范化，仍严格检查数据、回调及源轴。 */
export function assertSpec(actual, expected, field = 'spec') {
  if (['spec.crosshair', 'spec.indicator'].includes(field) && !Array.isArray(expected) && Array.isArray(actual)) {
    if (actual.length !== 1) throw new Error('组件数量不正确：' + field);
    actual = actual[0];
  }
  if (typeof expected === 'function') {
    if (typeof actual !== 'function' || actual.toString() !== expected.toString())
      throw new Error('回调配置不正确：' + field);
  } else if (expected && typeof expected === 'object') {
    if (!actual || typeof actual !== 'object') throw new Error('图表输入不正确：' + field);
    const lengthMatches = field === 'spec.axes' ? actual.length >= expected.length : actual.length === expected.length;
    if (Array.isArray(expected) && (!Array.isArray(actual) || !lengthMatches))
      throw new Error('数据长度不正确：' + field);
    for (const key of Object.keys(expected)) assertSpec(actual[key], expected[key], field + '.' + key);
  } else if (actual !== expected) throw new Error('图表输入不正确：' + field);
}

/** 验证静态配置；动态回调和计算使用 verifySourceSpec 在浏览器内生成期望值。 */
export async function verifySpec(page, expected) {
  await page.evaluate(async expected => {
    const { assertSpec } = await import(new URL('./helpers.mjs', location.href).href);
    assertSpec(window.__visualChart.getSpec(), expected);
  }, expected);
}

/** 在同一浏览器执行冻结的源配置，避免 Node 转译函数格式和 Math 实现的微小差异。 */
export async function verifySourceSpec(page, overrides = {}) {
  await page.evaluate(async overrides => {
    const { assertSpec } = await import(new URL('./helpers.mjs', location.href).href);
    const { cases, loadCase } = await import(new URL('./cases/index.mjs', location.href).href);
    const id = new URL(location.href).searchParams.get('case');
    const item = await loadCase(cases.find(item => item.id === id));
    assertSpec(window.__visualChart.getSpec(), { ...item.createSpec(), ...overrides });
  }, overrides);
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

/** 空值饼图应实际绘制占位环，而不是把没有系列图元当作通过。 */
export async function verifyEmptyPie(page) {
  await page.evaluate(() => {
    const series = window.__visualChart.getChart().getAllSeries();
    if (series.length !== 1 || series[0].type !== 'pie') throw new Error('缺少饼图系列');
    const mark = series[0].getMarks().find(mark => mark.name === 'emptyCircle');
    const graphics = mark?.getGraphics() ?? [];
    if (
      !graphics.some(
        g => g.attribute.visible !== false && g.attribute.outerRadius > 0 && g.globalAABBBounds.width() > 0
      )
    )
      throw new Error('占位环未绘制');
    const slices = series[0].getSeriesMark().getGraphics();
    if (
      slices.some(
        g => g.attribute.visible !== false && Math.abs(g.attribute.endAngle - g.attribute.startAngle) > 0.0001
      )
    )
      throw new Error('空值数据仍显示有效扇区');
  });
}
