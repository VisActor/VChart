/** 按实际系列图元定位；折线取线段中点，面积取上下边界之间，避免误点相邻 symbol。 */
export async function interactionTarget(page, name, index = 0, seriesIndex) {
  return page.evaluate(
    ({ name, index, seriesIndex }) => {
      const series = window.__visualChart.getChart().getAllSeries();
      const selected = seriesIndex === undefined ? series : [series[seriesIndex]];
      const graphics = selected
        .flatMap(s =>
          s
            .getMarks()
            .filter(m => m.name === name)
            .flatMap(m => m.getGraphics())
        )
        .filter(g => g.attribute.visible !== false && g.globalAABBBounds.width() > 0);
      const g = graphics[index];
      if (!g) throw new Error('缺少交互图元：' + name + '/' + index);
      const a = g.attribute,
        matrix = g.globalTransMatrix;
      let local;
      if (a.startAngle !== undefined) {
        const angle = (a.startAngle + a.endAngle) / 2,
          radius = ((a.innerRadius || 0) + a.outerRadius) / 2;
        local = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
      } else if (['line', 'area'].includes(name) && a.points?.length > 1) {
        const p = a.points[0],
          q = a.points[1];
        local = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
        if (name === 'area' && Number.isFinite(p.y1) && Number.isFinite(q.y1))
          local.y = (local.y + (p.y1 + q.y1) / 2) / 2;
      }
      if (local)
        return {
          x: matrix.a * local.x + matrix.c * local.y + matrix.e,
          y: matrix.b * local.x + matrix.d * local.y + matrix.f
        };
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    },
    { name, index, seriesIndex }
  );
}

/** 让输入事件后的绘制队列完成；是否生效仍由独立 verify 检查真实状态。 */
export async function interactionFrame(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

/** 保存每种系列图元的状态计数，供多步交互结束后逐步校验，不用“动作已执行”布尔值代替结果。 */
export async function seriesStates(page) {
  return page.evaluate(() =>
    window.__visualChart
      .getChart()
      .getAllSeries()
      .flatMap((s, series) =>
        s.getMarks().map(m => {
          const graphics = m.getGraphics();
          const states = {};
          for (const g of graphics) for (const state of g.currentStates ?? []) states[state] = (states[state] ?? 0) + 1;
          return { series, name: m.name, count: graphics.length, states };
        })
      )
  );
}
