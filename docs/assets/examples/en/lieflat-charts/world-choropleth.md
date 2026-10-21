---
category: examples
group: lieflat charts
title: M2 · World choropleth
keywords: lieflat,M2,editorial,theme
order: 60
cover: /vchart/preview/lieflat-charts-world-choropleth.png
---

# M2 · World choropleth

Where the users are · monthly active accounts · drag to pan, wheel to zoom.

A VChart implementation of M2 from [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts). All values are deterministic, simulated demo data.

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
    text: 'World choropleth',
    subtext: 'Where the users are · monthly active accounts · drag to pan, wheel to zoom',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json');
if (!response.ok) throw new Error('Unable to load world GeoJSON: ' + response.status);
const geojson = await response.json();
VChart.registerMap('lieflat-world', geojson);
const volumes = {
  'United States of America': 95,
  India: 62,
  'United Kingdom': 48,
  Germany: 41,
  Brazil: 39,
  Canada: 34,
  France: 30,
  Australia: 28,
  China: 26,
  Japan: 26,
  'South Korea': 21,
  Spain: 19,
  Italy: 17,
  Singapore: 16,
  Indonesia: 15,
  Mexico: 14,
  Netherlands: 13,
  Poland: 13,
  Sweden: 12,
  Ireland: 12,
  Philippines: 11,
  Turkey: 10,
  Vietnam: 9,
  'South Africa': 9,
  Denmark: 9,
  Norway: 8,
  Thailand: 8,
  Malaysia: 8,
  Argentina: 7,
  Nigeria: 7,
  Chile: 6,
  Colombia: 6,
  'New Zealand': 6,
  Egypt: 5,
  Pakistan: 5,
  Russia: 5
};
const values = Object.entries(volumes).map(([name, value]) => ({ name, value }));
const spec = {
  animation: true,
  ...base,
  type: 'map',
  map: 'lieflat-world',
  nameField: 'name',
  valueField: 'value',
  nameProperty: 'name',
  tooltip: {
    mark: {
      title: { value: d => d.name },
      content: [{ key: 'Accounts (k)', value: d => (d.value == null ? 'No observation' : d.value) }]
    }
  },
  data: [{ id: 'countries', values }],
  region: [{ roam: true, projection: { type: 'equirectangular' } }],
  color: { type: 'linear', domain: [0, 100], clamp: true },
  area: {
    style: {
      fill: (datum, ctx) => (datum.value == null ? themeColor(grid, ctx) : ctx.globalScale('color', datum.value)),
      stroke: paint(paper),
      lineWidth: 0.6
    },
    state: { hover: { stroke: paint(shades[0]), lineWidth: 1.5 } }
  },
  legends: {
    visible: true,
    type: 'color',
    orient: 'bottom',
    position: 'middle',
    field: 'value',
    title: { visible: true, text: 'MONTHLY ACTIVE ACCOUNTS / THOUSANDS' }
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
// 布局前更新标准颜色比例尺，区域和连续图例共享同一条主题渐变。
vchart.on('layoutStart', () => {
  const ctx = { vchart };
  vchart
    .getScale('color')
    .range([themeColor(sequential[5], ctx), themeColor(shades[0], ctx)])
    .domain([0, 100]);
});
vchart.renderSync();

// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
