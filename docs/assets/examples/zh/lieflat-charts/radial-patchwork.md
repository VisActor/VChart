---
category: examples
group: lieflat charts
title: L10 · 部署放射叠层图
keywords: lieflat,L10,editorial,theme
order: 26
cover: /vchart/preview/lieflat-charts-radial-patchwork.png
---

# L10 · 部署放射叠层图

角度对应一天中的时间，半径对应部署规模，透明度叠加体现密度。

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 L10 图型，使用 VChart 独立实现。演示数值为确定性模拟数据，不代表真实业务统计。

## 关键配置

- 默认开启入场动画；自定义图形按数据顺序分批出现，文字先行显示。
- 使用 `customMark` 和 `dataId` 绑定细线、点、文字与布局记录。
- 同类图元共享数据集，整体等比缩放；悬停读取当前记录。
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
const layers = {};
// 同类图元共用一个数据集和 mark，避免为每条记录创建独立组件。
const put = (type, attrs, detail = '') => {
  (layers[type] || (layers[type] = [])).push({
    ...(type === 'text' ? { angle: 0, textBaseline: 'middle', fontWeight: 400 } : {}),
    ...attrs,
    ...(type === 'text'
      ? { fill: shades.includes(attrs.fill) ? ink : attrs.fill }
      : {
          ...(attrs.fill === ink ? { fill: shades[0] } : {}),
          ...(attrs.stroke === ink ? { stroke: shades[0] } : {})
        }),
    key: layers[type].length,
    detail
  });
};
const text = (x, y, value, fontSize = 10, fill = muted, textAlign = 'center', fontWeight = 400) =>
  put('text', {
    x,
    y,
    text: String(value),
    fontSize,
    fill,
    textAlign,
    fontWeight,
    fontFamily: font,
    textBaseline: 'middle'
  });
const polar = (cx, cy, radius, angle) => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];

[50, 90, 130].forEach(r => {
  put('arc', {
    x: 320,
    y: 230,
    innerRadius: r,
    outerRadius: r + 0.6,
    startAngle: 0,
    endAngle: Math.PI * 2,
    fill: grid
  });
});
for (let i = 0; i < 120; i++) {
  const hour = noise(i, 3) * 24,
    size = 10 + Math.round(noise(i, 17) * 100);
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
  put(
    'arc',
    {
      x: 320,
      y: 230,
      innerRadius: 24,
      outerRadius: 35 + size,
      startAngle: angle,
      endAngle: angle + 0.12,
      fill: ink,
      fillOpacity: 0.09
    },
    'Deploy ' + (i + 1) + ' / ' + hour.toFixed(1) + 'h / ' + size + ' changes'
  );
}
[0, 6, 12, 18].forEach(h => text(...polar(320, 230, 155, (h / 24) * Math.PI * 2 - Math.PI / 2), h + ':00', 11));

text(30, 28, 'Radial patchwork', 19, ink, 'left', 700);
text(30, 52, 'A quarter of deploys, overlaid · angle = time · radius = changes', 10, muted, 'left');
text(30, 408, 'L10 / RADIAL PATCHWORK / SIMULATED DATA', 9, muted, 'left');
const data = Object.entries(layers).map(([type, values]) => ({ id: type, values }));
const children = ['rule', 'arc', 'rect', 'path', 'symbol', 'text']
  .filter(type => layers[type])
  .map(type => {
    const values = layers[type];
    const keys = [...new Set(values.flatMap(Object.keys))].filter(
      key => !['key', 'detail', 'nodeId', 'source', 'target', 'routeId', 'route', 'stage', 'node'].includes(key)
    );
    return {
      type,
      id: 'lieflat-' + type,
      dataId: type,
      dataKey: 'key',
      ...(type === 'text' ? { interactive: false } : {}),
      style: {
        ...Object.fromEntries(
          keys.map(key => [
            key,
            key === 'fill' || key === 'stroke' ? (datum, ctx) => themeColor(datum[key], ctx) : datum => datum[key]
          ])
        ),
        // 装饰图元不参与拾取；扩大细线的命中范围，不改变实际线宽。
        pickable: datum => Boolean(datum.detail),
        pickStrokeBuffer: type === 'rule' ? 6 : type === 'path' || type === 'symbol' ? 4 : 0
      },
      animation: true,
      // 文字先出现；图形在 450ms 内依次开始，整段入场约 1.1s。
      animationAppear: {
        type: 'fadeIn',
        duration: type === 'text' ? 450 : 650,
        delay: type === 'text' ? 0 : datum => (datum.key / Math.max(1, values.length - 1)) * 450,
        easing: 'cubicOut'
      }
    };
  });
// 整组等比缩放，保持点阵、圆形和文字的比例；不依赖固定容器宽度。
const scale = (_, ctx) => {
  const { width, height } = ctx.vchart.getChart().getCanvasRect();
  return Math.min(width / 640, height / 440);
};
const spec = {
  animation: true,
  type: 'common',
  padding: 0,
  data,
  series: [],
  customMark: [
    {
      type: 'group',
      style: {
        x: (_, ctx) => (ctx.vchart.getChart().getCanvasRect().width - 640 * scale(_, ctx)) / 2,
        y: (_, ctx) => (ctx.vchart.getChart().getCanvasRect().height - 440 * scale(_, ctx)) / 2,
        scaleX: scale,
        scaleY: scale
      },
      children
    }
  ],
  // customMark 没有 series，使用下方 TooltipHandler 处理图元事件与提示生命周期。
  tooltip: { trigger: [] }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();
// 通过标准 TooltipHandler 托管浮层，release 时自动移除。
const container = vchart.getContainer();
const tooltipElement = document.createElement('div');
tooltipElement.setAttribute('role', 'tooltip');
tooltipElement.className = 'lieflat-tooltip';
tooltipElement.style.cssText =
  'position:absolute;visibility:hidden;pointer-events:none;z-index:10;box-sizing:border-box;' +
  'max-width:min(280px, calc(100% - 16px));padding:8px 11px;border:1px solid;' +
  'border-radius:4px;font:12px/1.5 ' +
  font;
const updateTooltipTheme = () => {
  const ctx = { vchart };
  tooltipElement.style.background = themeColor('popupBackgroundColor', ctx);
  tooltipElement.style.color = themeColor(ink, ctx);
  tooltipElement.style.borderColor = themeColor('borderColor', ctx);
};
updateTooltipTheme();
vchart.on('afterRender', updateTooltipTheme);
container.style.position = 'relative';
container.appendChild(tooltipElement);
let tooltipWidth = 0;
let tooltipHeight = 0;
const tooltipHandler = {
  showTooltip: (activeType, data, { event }) => {
    const detail = data[0].datum[0].detail;
    if (tooltipElement.textContent !== detail || tooltipElement.style.visibility === 'hidden') {
      tooltipElement.textContent = detail;
      tooltipWidth = tooltipElement.offsetWidth;
      tooltipHeight = tooltipElement.offsetHeight;
    }
    const { width, height } = vchart.getChart().getCanvasRect();
    const x = Math.max(8, Math.min(event.canvasX + 12, width - tooltipWidth - 8));
    const y = Math.max(8, Math.min(event.canvasY + 12, height - tooltipHeight - 8));
    tooltipElement.style.left = x + 'px';
    tooltipElement.style.top = y + 'px';
    tooltipElement.style.visibility = 'visible';
  },
  hideTooltip: () => {
    tooltipElement.style.visibility = 'hidden';
  },
  isTooltipShown: () => tooltipElement.style.visibility === 'visible',
  release: () => tooltipElement.remove()
};
vchart.setTooltipHandler(tooltipHandler);
// 使用 pointermove 的最终命中结果，避免相邻图元的 out/over 导致提示反复隐藏。
vchart.on('pointermove', params => {
  if (params.datum && params.datum.detail) {
    tooltipHandler.showTooltip('mark', [{ datum: [params.datum] }], params);
  } else {
    tooltipHandler.hideTooltip();
  }
});
vchart.on('pointerleave', { source: 'chart' }, tooltipHandler.hideTooltip);
// 通过 vchart.setCurrentTheme('已注册的主题名') 切换，无需重新计算业务数据。
// 仅用于控制台调试。
window['vchart'] = vchart;
```
