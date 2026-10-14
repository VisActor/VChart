/**
 * 验证目的：dot 原始数据保持逐用户的嵌套结构，更新后 link 仍能定位事件。
 * 图表类型：common（dot + link）。
 * 关键配置：dotSeriesIndex、嵌套 dots、固定线性轴与用户轴。
 * 场景条件：两个用户三个事件，更新事件时间后检查连接端点。
 * 最终检查：原始用户行、展开事件数、更新后的连接数据和有限图元坐标；截图检查连接呈现。
 * 覆盖边界：不覆盖曲线、头像、扩展 transformer 和按需注册，另有单元测试。
 */
export default {
  register({ VChart, VChartExtension }) {
    VChartExtension.registerSequenceAnalysis({ VChart: VChart.default });
  },
  createSpec() {
    // 固定轴范围以便直接对照更新前后的连接位置。
    const dot = {
      type: 'dot',
      dataId: 'events',
      xField: 'time',
      yField: 'user',
      titleField: 'user',
      leftAppendPadding: 0,
      title: { visible: false },
      subTitle: { visible: false },
      symbol: { visible: false }
    };
    return {
      type: 'common',
      animation: false,
      data: [
        {
          id: 'events',
          values: [
            {
              user: 'U1',
              dots: [
                { node_name: 'a', time: 10 },
                { node_name: 'b', time: 20 }
              ]
            },
            { user: 'U2', dots: [{ node_name: 'c', time: 30 }] }
          ]
        },
        { id: 'links', values: [{ from: 'a', to: 'c' }] }
      ],
      series: [
        {
          type: 'link',
          dataId: 'links',
          dotSeriesIndex: 1,
          dotSeriesSpec: dot,
          fromField: 'from',
          toField: 'to',
          leftAppendPadding: 0,
          link: { style: { stroke: '#5470c6', lineWidth: 2 } },
          arrow: { visible: false }
        },
        dot
      ],
      axes: [
        { type: 'linear', orient: 'bottom', min: 0, max: 80, nice: false },
        { type: 'band', orient: 'left', domain: ['U1', 'U2'] }
      ]
    };
  },
  async exercise(page) {
    // 修改真实数据；未执行动作时最终坐标断言不能通过。
    await page.evaluate(() => {
      window.__visualChart.updateFullDataSync([
        {
          id: 'events',
          values: [
            {
              user: 'U1',
              dots: [
                { node_name: 'a', time: 40 },
                { node_name: 'b', time: 50 }
              ]
            },
            { user: 'U2', dots: [{ node_name: 'c', time: 60 }] }
          ]
        },
        { id: 'links', values: [{ from: 'a', to: 'c' }] }
      ]);
    });
  },
  async verify(page) {
    // 校验数据关系及实际连接图元，避免仅凭配置或截图存在判断成功。
    await page.evaluate(() => {
      const series = window.__visualChart.getChart().getAllSeries();
      const dot = series.find(s => s.type === 'dot');
      const link = series.find(s => s.type === 'link');
      const raw = dot.getRawData().latestData;
      if (raw.length !== 2 || raw[0].dots.length !== 2 || raw[1].dots.length !== 1)
        throw Error('dot 原始数据未保留逐用户结构');
      if (dot.getViewData().latestData.length !== 3) throw Error('dot 视图未展开三个事件');
      const datum = link.getViewData().latestData[0];
      if (datum.from_xField !== 40 || datum.to_xField !== 60 || datum.from_yField !== 'U1' || datum.to_yField !== 'U2')
        throw Error('更新后的连接端点数据不正确');
      const mark = link.getMarkInName('link');
      const graphics = mark.getGraphics();
      if (graphics.length !== 1) throw Error('连接图元数量不正确');
      const attrs = graphics[0].attribute;
      if (attrs.points.length !== 2 || !attrs.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)))
        throw Error('连接图元坐标无效');
    });
  }
};
