import lineCase from './sequence-link-data.mjs';

/**
 * 验证目的：曲线连接的公开 link 配置生效，重复端点的曲率在重绘和数据更新后保持确定。
 * 图表类型：common（dot + link）。
 * 关键配置：linkType: curve、link.visible/style/state、重复 from/to。
 * 场景条件：初始隐藏曲线，通过 updateSpec 显示，再更新事件数据。
 * 最终检查：真实图元显隐、样式、状态，更新后端点与两条不同且稳定的曲线路径。
 * 覆盖边界：不覆盖扩展图表时间轴派生组件；旧 develop 不支持曲线，基线语义校验会明确失败。
 */
export default {
  createSpec() {
    // 复用逐用户事件数据，增加两条相同端点的连接。
    const spec = lineCase.createSpec();
    spec.series[0].linkType = 'curve';
    spec.series[0].link = {
      visible: false,
      style: { stroke: '#5470c6', lineWidth: 2 },
      state: { custom_unSelected: { strokeOpacity: 0.25 } }
    };
    spec.data[1].values = [
      { from: 'a', to: 'c' },
      { from: 'a', to: 'c' }
    ];
    return spec;
  },
  async exercise(page) {
    // 先检查初始化显隐，再通过公开 API 更新配置和数据。
    await page.evaluate(() => {
      const series = window.__visualChart
        .getChart()
        .getAllSeries()
        .find(s => s.type === 'link');
      const mark = series.getMarksWithoutRoot().find(m => m.type === 'path' || m.name === 'link');
      if (mark.getVisible() !== false) throw new Error('初始化未应用 link.visible');
    });
    const spec = this.createSpec();
    spec.series[0].link = {
      visible: true,
      style: { stroke: '#d65f00', lineWidth: 3 },
      state: { custom_unSelected: { strokeOpacity: 0.75 } }
    };
    await page.evaluate(spec => window.__visualChart.updateSpecSync(spec), spec);
    await lineCase.exercise(page);
    await page.evaluate(() => {
      window.__visualChart.updateDataSync('links', [
        { from: 'a', to: 'c' },
        { from: 'a', to: 'c' }
      ]);
    });
  },
  async verify(page) {
    // 核对最终真实数据和图元，既检测动作缺失，也检测属性回调的副作用。
    await page.evaluate(() => {
      const series = window.__visualChart
        .getChart()
        .getAllSeries()
        .find(s => s.type === 'link');
      const mark = series.getMarkInName('link');
      if (!mark || mark.type !== 'path') throw new Error('未通过公开 link 配置创建曲线图元');
      if (!mark.getVisible()) throw new Error('updateSpec 后曲线仍不可见');
      const data = series.getViewData().latestData;
      if (data.length !== 2 || data.some(d => d.from_xField !== 40 || d.to_xField !== 60))
        throw new Error('连接数量或更新后的端点错误');
      const paths = data.map(d => mark.getAttribute('path', d));
      if (paths[0] === paths[1] || paths.some(p => typeof p !== 'string' || /NaN|undefined/.test(p)))
        throw new Error('重复连接的路径无效或未分离');
      if (data.some((d, i) => mark.getAttribute('path', d) !== paths[i])) throw new Error('重复求值改变了曲率');
      if (mark.getAttribute('stroke', data[0]) !== '#d65f00' || mark.getAttribute('lineWidth', data[0]) !== 3)
        throw new Error('updateSpec 未应用 link 样式');
      if (mark.getAttribute('strokeOpacity', data[0], 'custom_unSelected') !== 0.75)
        throw new Error('updateSpec 未应用 link 状态');
      const graphics = mark.getGraphics();
      if (graphics.length !== 2 || graphics.some((g, i) => g.attribute.path !== paths[i]))
        throw new Error('实际绘制路径与数据求值不一致');
    });
  }
};
