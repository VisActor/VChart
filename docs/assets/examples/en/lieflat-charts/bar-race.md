---
category: examples
group: lieflat charts
title: G16 · Bar race
keywords: lieflat,G16,editorial,theme
order: 49
cover: /vchart/preview/lieflat-charts-bar-race.png
---

# G16 · Bar race

Eight products race · monthly active accounts · play / pause below.

A VChart implementation of G16 from [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts). All values are deterministic, simulated demo data.

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
    text: 'Bar race',
    subtext: 'Eight products race · monthly active accounts · play / pause below',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const products = ['EDITOR', 'FLOWS', 'DOCS', 'API', 'CHAT', 'SYNC', 'VAULT', 'BOARDS'];
const frames = Array.from({ length: 12 }, (_, month) => ({
  data: [
    {
      id: 'race',
      values: products
        .map((product, i) => ({
          product,
          users: Math.round(30 + i * 5 + month * (3 + (7 - i) * 1.5) + Math.sin(month + i) * 15)
        }))
        .sort((a, b) => b.users - a.users)
    }
  ],
  title: { ...base.title, subtext: 'MONTH ' + (month + 1) + ' / 2026 · ACTIVE ACCOUNTS (k)' }
}));

frames.forEach(frame =>
  frame.data.push({
    id: 'frameLabel',
    values: [
      {
        label: frame.title.subtext
      }
    ]
  })
);
const spec = {
  animation: true,
  ...base,
  type: 'bar',
  direction: 'horizontal',
  data: frames[0].data,
  xField: 'users',
  yField: 'product',
  seriesField: 'product',
  dataKey: 'product',
  color: { type: 'ordinal', domain: products },
  axes: [
    { ...axis('bottom'), min: 0, max: 200 },
    { ...axis('left'), grid: { visible: false } }
  ],
  bar: { style: { cornerRadius: 6 } },
  barMaxWidth: 25,
  label: { visible: true, position: 'outside', style: { fill: paint(ink), fontWeight: 800 } },
  animationUpdate: { duration: 700, easing: 'cubicInOut' },

  customMark: [
    {
      type: 'text',
      dataId: 'frameLabel',
      style: {
        x: 32,
        y: 89,
        text: d => d.label,
        textAlign: 'left',
        textBaseline: 'middle',
        fontFamily: font,
        fontSize: 12,
        fill: paint(ink),
        fontWeight: 600
      }
    }
  ],
  title: { ...base.title, padding: { bottom: 45 } },
  player: {
    type: 'discrete',
    orient: 'bottom',
    auto: true,
    loop: true,
    interval: 1500,
    specs: frames
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
