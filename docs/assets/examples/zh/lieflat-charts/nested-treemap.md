---
category: examples
group: lieflat charts
title: F13 · 嵌套矩形树图
keywords: lieflat,F13,editorial,theme
order: 12
cover: /vchart/preview/lieflat-charts-nested-treemap.png
---

# F13 · 嵌套矩形树图

矩形面积表示工时，分组保留产品层级。

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 F13 图型，使用 VChart 独立实现。演示数值为确定性模拟数据，不代表真实业务统计。

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
    text: 'Nested treemap',
    subtext: 'Where the work went · 1,280 hours · area = effort',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const values = [
  {
    name: 'CORE',
    children: [
      { name: 'Editor', value: 320 },
      { name: 'Search', value: 180 },
      { name: 'Sync', value: 140 }
    ]
  },
  {
    name: 'PLATFORM',
    children: [
      { name: 'API', value: 220 },
      { name: 'SDK', value: 160 }
    ]
  },
  {
    name: 'GROWTH',
    children: [
      { name: 'Onboarding', value: 150 },
      { name: 'Billing', value: 110 }
    ]
  }
];
const spec = {
  animation: true,
  ...base,
  type: 'treemap',
  data: [{ id: 'work', values }],
  categoryField: 'name',
  valueField: 'value',
  gapWidth: 3,
  nodePadding: 4,
  leaf: { style: { stroke: paint(paper), lineWidth: 2 } },
  label: {
    visible: true,
    smartInvert: true,
    style: { fontSize: 13 },
    formatMethod: (text, datum) => datum.name + '\n' + datum.value + ' h'
  },
  nonLeaf: { visible: true },
  nonLeafLabel: {
    visible: true,
    position: 'top',
    padding: 26,
    style: { fill: paint(ink), fontSize: 12, textAlign: 'left', x: d => d.labelRect.x0 + 6 }
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
