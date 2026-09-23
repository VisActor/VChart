---
category: examples
group: lieflat charts
title: G18 · 描线增长与数字
keywords: lieflat,G18,editorial,theme
order: 51
cover: /vchart/preview/lieflat-charts-draw-in-counter.png
---

# G18 · 描线增长与数字

累计收入按月绘制折线，标题随播放器同步更新累计金额。

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 G18 图型，使用 VChart 独立实现。演示数值为确定性模拟数据，不代表真实业务统计。

## 关键配置

- 默认开启原生入场动画；动态叙事示例的播放器自动播放。
- 使用原生图表类型、坐标轴与数据绑定。
- 背景、文字、数据色和 tooltip 跟随当前 VChart 主题；分类色与数值渐变分别处理。

## 代码演示

```javascript livedemo
// 文档站提供 VCHART_MODULE / VisUtil；项目中分别从 @visactor/vchart / @visactor/vutils 导入。
const { getActualColor, getDataScheme, computeActualDataScheme } = VCHART_MODULE;
// 布局数据只保存颜色角色，实际颜色从当前 VChart 主题读取。
const ink = 'primaryFontColor';
const paper = 'backgroundColor';
const muted = 'secondaryFontColor';
const grid = 'axisGridColor';
const shades = Array.from({ length: 6 }, (_, i) => 'category' + i);
const sequential = Array.from({ length: 6 }, (_, i) => 'intensity' + i);
let colorScheme;
let colors;
const themeColor = (role, ctx) => {
  const nextScheme = ctx.vchart.getChart().getColorScheme();
  // 每次切换主题只解析一次，图元编码与 hover 复用结果。
  if (nextScheme !== colorScheme) {
    colorScheme = nextScheme;
    colors = Object.fromEntries(
      [ink, paper, muted, grid, 'borderColor', 'popupBackgroundColor', 'disableFontColor'].map(key => [
        key,
        getActualColor({ type: 'palette', key }, colorScheme)
      ])
    );
    const dataColors = computeActualDataScheme(getDataScheme(colorScheme), shades);
    shades.forEach((key, i) => {
      colors[key] = dataColors[i % dataColors.length];
    });
    // 数值色阶保持单向强弱，不把分类色板误用为热力图渐变。
    const ramp = VisUtil.ColorUtil.interpolateRgb(
      VisUtil.Color.parseColorString(colors.category0),
      VisUtil.Color.parseColorString(colors[paper])
    );
    sequential.forEach((key, i) => {
      colors[key] = ramp(i * 0.14).toString();
    });
  }
  return colors[role] ?? role;
};
const paint = role => (_, ctx) => themeColor(role, ctx);
const font = 'Inter, Arial, PingFang SC, sans-serif';
// 确定性演示数据：刷新后保持一致，所有数值均为模拟数据。
const sample = (i, seed = 1) => ((Math.sin(i * 127.1 + seed * 311.7) * 43758.5453) % 1) + 1;
const noise = (i, seed = 1) => sample(i, seed) % 1;
const axis = orient => ({
  orient,
  domainLine: { visible: false },
  tick: { visible: false },
  grid: { visible: orient === 'left', style: { lineDash: [2, 4] } },
  label: { style: { fontSize: 10, fontFamily: font } }
});
const base = {
  padding: { top: 24, right: 30, bottom: 30, left: 30 },
  title: {
    text: 'Draw-in and counter',
    subtext: 'H1 revenue, drawn in one stroke · cumulative $k',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const values = [18, 39, 67, 103, 148, 204].map((revenue, i) => ({
  month: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'][i],
  revenue
}));
const frames = values.map((value, i) => ({
  data: [{ id: 'revenue', values: values.slice(0, i + 1) }],
  title: {
    ...base.title,
    text: '$' + value.revenue + 'k',
    subtext: 'H1 REVENUE / CUMULATIVE THROUGH ' + value.month,
    textStyle: { ...base.title.textStyle, fontSize: 42 }
  }
}));

frames.forEach(frame =>
  frame.data.push({
    id: 'frameLabel',
    values: [
      {
        label: frame.title.text
      }
    ]
  })
);
const spec = {
  animation: true,
  ...base,
  type: 'line',
  data: frames[0].data,
  xField: 'month',
  yField: 'revenue',
  line: { style: { stroke: paint(shades[0]), lineWidth: 3 } },
  point: { style: { fill: paint(shades[0]), size: 7 } },
  axes: [
    { ...axis('bottom'), domain: values.map(d => d.month) },
    { ...axis('left'), min: 0, max: 220 }
  ],
  animationAppear: { preset: 'clipIn', duration: 1100 },
  animationUpdate: { duration: 850 },

  customMark: [
    {
      type: 'text',
      dataId: 'frameLabel',
      style: {
        x: 32,
        y: 104,
        text: d => d.label,
        textAlign: 'left',
        textBaseline: 'middle',
        fontFamily: font,
        fontSize: 38,
        fill: paint(ink),
        fontWeight: 800
      }
    }
  ],
  title: { ...base.title, padding: { bottom: 76 } },
  player: {
    type: 'discrete',
    orient: 'bottom',
    auto: true,
    loop: true,
    interval: 1600,
    specs: frames
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
