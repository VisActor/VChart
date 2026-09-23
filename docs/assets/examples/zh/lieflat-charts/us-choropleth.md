---
category: examples
group: lieflat charts
title: M1 · 美国州级分级地图
keywords: lieflat,M1,editorial,theme
order: 59
cover: /vchart/preview/lieflat-charts-us-choropleth.png
---

# M1 · 美国州级分级地图

州界使用地理数据；连续色阶表示注册量，面积只表达地理范围，不表示人数。

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 M1 图型，使用 VChart 独立实现。演示数值为确定性模拟数据，不代表真实业务统计。

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
    text: 'US choropleth',
    subtext: 'Sign-ups across the states · geography is not quantity · neutral fill = no observation',
    textStyle: { fontFamily: font, fontSize: 19 },
    subtextStyle: { fontFamily: font, fontSize: 11 },
    padding: { bottom: 28 }
  },
  animationAppear: { duration: 900, easing: 'quartOut' },
  legends: { visible: false }
};

// 与现有地图示例使用同一数据源。复制到业务项目时可改为自托管 GeoJSON。
const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/usa.json');
if (!response.ok) throw new Error('Unable to load USA GeoJSON: ' + response.status);
const geojson = await response.json();
VChart.registerMap('lieflat-usa', geojson);
const volumes = {
  California: 96,
  'New York': 78,
  Texas: 72,
  Washington: 68,
  Massachusetts: 66,
  Florida: 54,
  Illinois: 49,
  Colorado: 44,
  Georgia: 41,
  Virginia: 33,
  Pennsylvania: 31,
  'North Carolina': 30,
  'New Jersey': 28,
  Oregon: 22,
  Ohio: 21,
  Michigan: 19,
  Arizona: 18,
  Minnesota: 16,
  Utah: 15,
  Maryland: 14,
  Tennessee: 13,
  Wisconsin: 12,
  Missouri: 11,
  Indiana: 9,
  Nevada: 8,
  Connecticut: 7,
  'South Carolina': 6,
  Alabama: 5,
  Kentucky: 5,
  Oklahoma: 4,
  Iowa: 4,
  Kansas: 3,
  Arkansas: 3,
  Louisiana: 3,
  'New Hampshire': 2,
  Idaho: 2,
  'New Mexico': 2,
  Hawaii: 2,
  Maine: 1,
  Nebraska: 1,
  Alaska: 1
};
const values = Object.entries(volumes).map(([name, value]) => ({ name, value }));
const spec = {
  animation: true,
  ...base,
  type: 'map',
  map: 'lieflat-usa',
  nameField: 'name',
  valueField: 'value',
  nameProperty: 'name',
  tooltip: {
    mark: {
      title: { value: d => d.name },
      content: [{ key: 'Accounts (k)', value: d => (d.value == null ? 'No observation' : d.value) }]
    }
  },
  data: [{ id: 'states', values }],
  region: [{ projection: { type: 'albersUsa' } }],
  color: { type: 'linear', domain: [0, 100], clamp: true },
  area: {
    style: {
      fill: (datum, ctx) => (datum.value == null ? themeColor(grid, ctx) : ctx.globalScale('color', datum.value)),
      stroke: paint(paper),
      lineWidth: 1
    },
    state: { hover: { stroke: paint(shades[0]), lineWidth: 2 } }
  },
  legends: {
    visible: true,
    type: 'color',
    orient: 'bottom',
    position: 'middle',
    field: 'value',
    title: { visible: true, text: 'SIGN-UPS / THOUSANDS' }
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
