Page({
  data: {
    spec: {},
    events: [],
    options: {}

    // styles: `
    // border-radius:5px;
    // background-color: #fff;
    // border:1px solid #E6E6E6;
    // box-sizing: border-box;
    // height: 100%
    // width: 100%;
    // padding: 0px 20px 20px 20px;
    // `
  },

  onLoad(options) {
    this.chartType = options.type;
    const spec = require(`../../data/${this.chartType}`).default;
    this.setData({
      // 设置数据
      spec
      // 绑定事件
      // FIXME: 【飞书小程序】传递函数因为序列化问题传递过不去。先注释掉
      // events: [
      //   {
      //     element: 'chart',
      //     type: 'initialized',
      //     handler: (event, item) => console.log('touchstart', event, item),
      //   },
      //   {
      //     element: 'chart',
      //     type: 'touchmove',
      //     handler: (event, item) => console.log('touchmove', event, item),
      //   },
      //   {
      //     element: 'chart',
      //     type: 'touchend',
      //     handler: (event, item) => console.log('touchend', event, item),
      //   },
      // ],
    });
  },

  onChartInit(event) {
    console.log('chart 实例初始化完成', event);
    // function labelFormat(key) {
    //   return key + 'test';
    // }
    // this.selectComponent('#chart', res => {
    //   const chartInstance = res && res.chart; // 获取 chart 实例
    //   chartInstance.registerFunction('labelFormat', labelFormat);
    // });
  },

  onChartReady(event) {
    console.log('chart 实例渲染完成', event);
  }
});
