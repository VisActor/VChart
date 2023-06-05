Page({
  data: {
    spec: null,
    events: null,
    options: {
      tooltipRenderMode: 'html'
    },
    styles: null
  },

  onLoad(options) {
    this.chartType = options.type;
    const spec = require(`../../data/${this.chartType}`).default;
    this.setData({
      // 设置数据
      spec
    });
  },

  onChartInit(chart) {
    console.log('chart 实例初始化完成', chart);

    // 自定义 tooltip 插件
    if (this.data.options && this.data.options.tooltipRenderMode === 'html') {
      // somehow，飞书小程序这里的 triggerEvent 过来的参数无效，采用另一种思路
      this.selectComponent('.vchart', ChartSpaceComp => {
        if (ChartSpaceComp) {
          this.selectComponent('.cs-tooltip', TooltipComp => {
            TooltipComp.init(ChartSpaceComp.ttCanvas.chart);
          });
        }
      });
    }
  },

  onChartReady(chart) {
    console.log('chart 实例渲染完成', chart);
  }
});
