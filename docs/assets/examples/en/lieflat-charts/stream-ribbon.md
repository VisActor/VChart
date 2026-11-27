---
category: examples
group: lieflat charts
title: F16 · Stream ribbon
keywords: lieflat,F16,editorial,theme
order: 15
cover: /vchart/preview/lieflat-charts-stream-ribbon.png
---

# F16 · Stream ribbon

Three products trade the same river · 48 weeks · band width = active accounts.

A VChart implementation of F16 from [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts). All values are deterministic, simulated demo data.

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
    text: 'Stream ribbon',
    subtext: 'Three products trade the same river · 48 weeks · band width = active accounts',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const values = [];
for (let week = 1; week <= 48; week++) {
  ['EDITOR', 'FLOWS', 'API'].forEach((product, i) =>
    values.push({ week, product, value: Math.round(30 + 15 * Math.sin(week / 8 + i * 2) + (week * (i + 1)) / 5) })
  );
}
const spec = {
  animation: true,
  ...base,
  type: 'area',
  data: [{ id: 'usage', values }],
  xField: 'week',
  yField: 'value',
  seriesField: 'product',
  stack: true,
  stackOffsetSilhouette: true,
  area: { style: { fillOpacity: 0.9 } },
  line: { style: { stroke: paint(paper), lineWidth: 1 } },
  point: { visible: false },
  axes: [
    { ...axis('bottom'), type: 'linear', tickCount: 6 },
    { orient: 'left', visible: false }
  ],
  legends: { visible: true, orient: 'bottom', item: { label: { style: { fontSize: 10 } } } }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
