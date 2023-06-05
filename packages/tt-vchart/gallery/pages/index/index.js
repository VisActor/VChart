const app = getApp();

Page({
  onShareAppMessage() {
    return {
      title: "vchart 小程序示例",
      path: "/pages/index/index",
      success() {},
      fail() {},
    };
  },
  data: {
    charts: [
      {
        id: "scatter",
        name: "scatter",
      },
      {
        id: "line",
        name: "line",
      },
      {
        id: "area",
        name: "area",
      },
      {
        id: "funnel",
        name: "funnel",
      },
      {
        id: "bar",
        name: "bar",
      },
      {
        id: "horizontal-bar",
        name: "horizontal-bar",
      },
      {
        id: "radar",
        name: "radar",
      },
      {
        id: "sankey",
        name: "sankey",
      },
      {
        id: "pie",
        name: "pie",
      },
      {
        id: "ring",
        name: "ring",
      },
      {
        id: "rose",
        name: "rose",
      },
      // {
      //   id: "map",
      //   name: "map",
      // },
      {
        id: "wordcloud",
        name: "wordcloud",
      },
      {
        id: "boxplot",
        name: "boxplot",
      },
      // {
      //   id: "contour",
      //   name: "contour",
      // },
      // {
      //   id: "indicator",
      //   name: "indicator",
      // },
      // {
      //   id: "pivot-combination",
      //   name: "pivot",
      // },
      // {
      //   id: "zd-bar",
      //   name: "zd-bar",
      // },
      // {
      //   id: "zd-line",
      //   name: "zd-line",
      // },
      // {
      //   id: "zd-pie",
      //   name: "zd-pie",
      // },
      // {
      //   id: "zd-line-bar",
      //   name: "zd-line-bar",
      // },
      // {
      //   id: "zd-line-bars",
      //   name: "zd-line",
      // },
      {
        id: "dual-axis",
        name: "dual-axis",
      },
    ],
  },

  open(e) {
    tt.navigateTo({
      url: `../chart/index?type=${e.target.dataset.chart.id}`,
    });
  },
});
