Page({
  data: {
    spec1: null,
    spec2: null,
    styles: null,

    // 传递样式
    styles: `
      height: 80%;
      width: 100%
    `,
  },

  onLoad(options) {
    this.chartType = options.type;
    const spec = require(`../../data/area`).default;
    this.setData({
      // 设置数据
      spec1: spec,
      spec2: spec,
    });
  },
});
