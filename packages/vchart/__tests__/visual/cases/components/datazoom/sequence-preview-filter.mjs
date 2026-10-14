/**
 * 验证目的：时序图 dataZoom 不累加用户 ID，且连线随时间选区过滤。
 * 图表类型：common（bar + link + dot）。
 * 关键配置：嵌套 dots、数字开头的分类 ID、连续时间轴、filter 模式。
 * 场景条件：五个时刻、两个用户，四条同一时刻的连线；缩放到中间三个时刻。
 * 最终检查：缩略图仅汇总柱状图数值，dot 与 link 同步过滤；截图检查预览和连线。
 * 覆盖边界：不覆盖曲线和头像，更新与系列顺序由单元测试覆盖。
 */
export default {
  createSpec() {
    // 使用虚构用户和固定时刻复现分类 ID 被当作数值的问题。
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
        { id: 'counts', values: [10, 20, 30, 40, 50].map((time, i) => ({ time, count: i + 1 })) },
        {
          id: 'events',
          values: ['123456xxxx', '789012xxxx'].map((user, row) => ({
            user,
            dots: [10, 20, 30, 40, 50].map(time => ({ node_name: `${row}-${time}`, time }))
          }))
        },
        {
          id: 'links',
          values: [10, 20, 30, 40].map(time => ({ from: `0-${time}`, to: `1-${time}` }))
        }
      ],
      series: [
        {
          type: 'bar',
          dataId: 'counts',
          xField: 'time',
          yField: 'count',
          barWidth: 12,
          bar: { style: { fill: '#ddd' } }
        },
        {
          type: 'link',
          dataId: 'links',
          dotSeriesIndex: 2,
          clipHeight: 600,
          dotSeriesSpec: dot,
          fromField: 'from',
          toField: 'to',
          leftAppendPadding: 0,
          link: { style: { stroke: '#5470c6', lineWidth: 2 } }
        },
        dot
      ],
      axes: [
        { type: 'linear', orient: 'bottom', min: 0, max: 60, nice: false },
        { type: 'linear', orient: 'left', seriesIndex: [0], min: 0, max: 6, nice: false },
        { type: 'band', orient: 'right', seriesIndex: [1, 2], domain: ['123456xxxx', '789012xxxx'] }
      ],
      dataZoom: [{ orient: 'top', xAxisIndex: 0, filterMode: 'filter', start: 0, end: 1 }]
    };
  },
  async exercise(page) {
    // 通过真实组件 API 改变选区，未执行缩放时最终断言应失败。
    await page.evaluate(() => {
      const chart = window.__visualChart.getChart();
      const link = chart.getAllSeries().find(s => s.type === 'link');
      if (link.getViewData().latestData.length !== 4) throw Error('初始连线数量不正确');
      chart.getComponentsByKey('dataZoom')[0].setStartAndEnd(1 / 3, 2 / 3);
    });
  },
  async verify(page) {
    // 检查实际预览数据及过滤后的起点，而非只检查 spec 中的配置。
    await page.evaluate(() => {
      const chart = window.__visualChart.getChart();
      const series = chart.getAllSeries();
      const preview = chart.getComponentsByKey('dataZoom')[0].getData().getLatestData();
      if (preview.reduce((sum, d) => sum + d.y, 0) !== 15 || Math.max(...preview.map(d => d.y)) !== 5)
        throw Error('预览错误地汇总了用户 ID 或丢失了柱状图数值');
      const dots = series.find(s => s.type === 'dot').getViewData().latestData;
      if (dots.length !== 6 || dots.some(d => d.time < 20 || d.time > 40)) throw Error('事件未按选区过滤');
      const link = series.find(s => s.type === 'link');
      const starts = link
        .getViewData()
        .latestData.map(d => d.from_xField)
        .sort((a, b) => a - b);
      if (JSON.stringify(starts) !== '[20,30,40]') throw Error('连线未按起点时间过滤');
      const graphics = link.getMarkInName('link').getGraphics();
      if (
        !graphics.length ||
        graphics.some(g => !g.attribute.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)))
      )
        throw Error('连线图元坐标无效');
    });
  }
};
