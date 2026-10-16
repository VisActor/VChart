---
category: examples
group: lieflat charts
title: F13 · Nested treemap
keywords: lieflat,F13,editorial,theme
order: 12
cover: /vchart/preview/lieflat-charts-nested-treemap.png
---

# F13 · Nested treemap

Where the work went · 1,280 hours · area = effort.

A VChart implementation of F13 from [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts). All values are deterministic, simulated demo data.

## Key options

- Native entrance animation is enabled by default; animated stories start their player automatically.
- Native VChart series, axes and data binding.
- Background, text, data colors and tooltips follow the active VChart theme; categorical and sequential palettes are separate.

## Demo

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
