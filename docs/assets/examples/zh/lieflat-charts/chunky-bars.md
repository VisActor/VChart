---
category: examples
group: lieflat charts
title: G3 · 粗柱排名图
keywords: lieflat,G3,editorial,theme
order: 36
cover: /vchart/preview/lieflat-charts-chunky-bars.png
---

# G3 · 粗柱排名图

少量套餐的收入排名，以粗柱、大数字和圆角突出高低。

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 G3 图型，使用 VChart 独立实现。演示数值为确定性模拟数据，不代表真实业务统计。

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
    text: 'Chunky bars',
    subtext: 'Revenue by plan · monthly recurring revenue, $k',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const values = ['FREE', 'STARTER', 'PRO', 'TEAM', 'SCALE', 'ENT'].map((plan, i) => ({
  plan,
  revenue: [38, 27, 22, 16, 11, 7][i]
}));
const spec = {
  animation: true,
  ...base,
  type: 'bar',
  data: [{ id: 'plans', values }],
  xField: 'plan',
  yField: 'revenue',
  bar: { style: { fill: paint(shades[0]), cornerRadius: [16, 16, 0, 0] } },
  barMaxWidth: 64,
  label: {
    visible: true,
    position: 'outside',
    overlap: false,
    style: { fill: paint(ink), fontSize: 20, fontWeight: 800 },
    formatMethod: value => '$' + value + 'k'
  },
  axes: [axis('bottom'), { orient: 'left', visible: false, max: 45 }]
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
