# Lynx

**【适用范围】本文保留的是字节内部 Lynx 环境的接入说明。根据截至 2026-09-14 的公开资料核查，开源原生 Lynx 尚未公开提供本文所需的 Canvas 接入能力；安装 VChart 不会为宿主补充该能力。开源进展请参考 [Lynx 官方文档](https://lynxjs.org/)及[图表需求讨论](https://github.com/lynx-family/lynx/issues/6230#issuecomment-4729040590)。**

Lynx 是字节开源的高性能跨端框架，基于 Web 技术栈快速构建 Native 视图，Lynx 于 2025-03-05 正式开源；VChart 基于 Lynx 字节内部版本提供了该框架的图表渲染能力支持。

## 如何获取 VChart

### npm 包

你可以直接在 lynx 项目中安装 vchart 依赖包：`@visactor/vchart`。

### 手动引入脚本

也可以获取 VChart 的 UMD 打包产物，并按内部宿主支持的方式加载。下面的 HTML 标签展示浏览器中的引用方式，原生 Lynx 项目不能直接照搬：

1. 获取 `@visactor/vchart` 包中的 [build/index.min.js](https://unpkg.com/@visactor/vchart/build/index.min.js) 构建产物
2. 从如下免费的 CDN 中获取

```html
<!-- unpkg -->
<script src="https://unpkg.com/@visactor/vchart/build/index.min.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
```

## 如何使用

以下保留内部 Lynx 宿主的历史 `ttml` 和 `js` 接入示例。`Card(...)`、`SystemInfo` 及画布桥接依赖对应内部宿主，不是开源 ReactLynx 的通用 API。

这些示例尚未针对当前 VChart 与具体宿主版本完成运行验证，使用前需核对版本及宿主 API。示例中的 `domref`、`canvasIdLists` 和 `freeCanvasIdx` 是旧接入参数，不应直接作为新版本接入契约。

### index.ttml

需要声明三个 canvas，并且注意声明的顺序

- `bar_hidden_canvas` 隐藏的 canvas，在第一个声明，用于内部的一些拾取逻辑
- `bar_draw_canvas` 绘制 canvas，第二个声明
- `bar_tooltip_canvas` 用于绘制 tooltip 的 canvas，跨端环境的 tooltip 使用 canvas 绘制。

```html
<view class="vchart">
  <!-- canvas顺序很重要 -->
  <canvas
    name="bar_hidden_canvas"
    id="bar_hidden_canvas"
    user-interaction-enabled="{{false}}"
    class="cs-canvas cs-canvas-hidden"
  >
  </canvas>
  <canvas
    class="cs-canvas"
    bindtouchstart="bindChartEvent"
    bindtouchmove="bindChartEvent"
    bindtouchend="bindChartEvent"
    name="bar_draw_canvas"
    id="bar_draw_canvas"
  >
  </canvas>
  <canvas
    name="bar_tooltip_canvas"
    id="bar_tooltip_canvas"
    user-interaction-enabled="{{false}}"
    class="cs-tooltip-canvas"
  >
  </canvas>
</view>
```

### index.js

此历史示例在该文件中创建 VChart 实例，展示环境参数和事件接入两个部分：

1. 需要在 VChart 的构造函数中声明必要的环境参数

```ts
const chartInstance = new VChart(spec, {
  mode: 'lynx', //  Tip: 跨端环境需要手动传入 mode
  // 跨端参数
  modeParams: {
    domref: domRef, // 图表绘制的 canvas 节点
    force: true, // 是否强制使用 canvas 绘制
    canvasIdLists: [`${item.id}_draw_canvas`, `${item.id}_tooltip_canvas`, `${item.id}_hidden_canvas`], // canvasId 列表
    tooltipCanvasId: `${item.id}_tooltip_canvas`, // tooltip canvasId
    freeCanvasIdx: 1 // 自由 canvas 索引
  },
  dpr: pixelRatio, // Tip: 跨端环境需要手动传入 dpr
  renderCanvas: `${item.id}_draw_canvas` // 声明用于绘制的 canvasId
});
```

2. 在事件上，需要用户自己在 canvas（用于绘制的 canvas） 元素上绑定事件，然后在事件监听函数中手动分发事件来触发 VChart 内部的事件。

```ts
bindChartEvent(event) {
  const id = event.target.id.split("_")[0];
  const targetChart = this.data.chartList.find(x => x.id === id);
  const chartInstance = targetChart?.chart;
  if (chartInstance) {
    event.target = chartInstance.getCanvas(); // Tip: 必须设置
    chartInstance.getStage().window.dispatchEvent(event);
  }
},
```

下面是 index.js 示例代码：

```ts
import barSpec from './data/bar';
import VChart, { registerLynxEnv } from '@visactor/vchart';
import mapJson from './data/map-data-china';

Card({
  data: {
    chartList: [
      {
        id: 'bar',
        spec: barSpec,
        chart: undefined
      }
    ]
  },
  onLoad: function () {
    // 如果需要使用地图，需要先注册地图
    VChart.registerMap('china', mapJson, {
      type: 'geojson'
    });
    this.init();
  },

  init() {
    registerLynxEnv();
    this.data.chartList.forEach(item => {
      this.createSelectorQuery()
        .select(`#${item.id}_draw_canvas`)
        .invoke({
          method: 'boundingClientRect',
          success: domRef => {
            if (!domRef) {
              console.error(`未找到 #${item.id} 画布`);
              return;
            }
            domRef.id = item.id;
            const pixelRatio = SystemInfo.pixelRatio;

            const chartInstance = new VChart(item.spec, {
              mode: 'lynx', //  Tip: 跨端环境需要手动传入 mode
              // 跨端参数
              modeParams: {
                domref: domRef, // 图表绘制的 canvas 节点
                force: true, // 是否强制使用 canvas 绘制
                canvasIdLists: [`${item.id}_draw_canvas`, `${item.id}_tooltip_canvas`, `${item.id}_hidden_canvas`], // canvasId 列表
                tooltipCanvasId: `${item.id}_tooltip_canvas`, // tooltip canvasId
                freeCanvasIdx: 1 // 自由 canvas 索引
              },
              dpr: pixelRatio, // Tip: 跨端环境需要手动传入 dpr
              renderCanvas: `${item.id}_draw_canvas` // 声明用于绘制的 canvasId
            });
            item.chart = chartInstance;

            if (item.events) {
              item.events.forEach(event => {
                chartInstance.on(event.type, { source: event.element }, event.handler);
              });
            }
            chartInstance.renderSync();
          },
          fail: res => {
            console.log('res:', res);
          }
        })
        .exec();
    });
  },

  bindChartEvent(event) {
    const id = event.target.id.split('_')[0];
    const targetChart = this.data.chartList.find(x => x.id === id);
    const chartInstance = targetChart?.chart;
    if (chartInstance) {
      event.target = chartInstance.getCanvas(); // Tip: 必须设置
      chartInstance.getStage().window.dispatchEvent(event);
    }
  }
});
```

## 按需加载

以下 `<VChartSimple />` 和语义化标签属于内部包 `@dp/lynx-vchart` 的组件封装，使用前需具备对应内部 ReactLynx 宿主；完整用法参考 [ReactLynx 文档](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx)。下面保留该封装的历史按需加载方式及注册清单，需与实际使用的封装版本核对：

- 使用 `<VChartSimple />` 标签，实现自定义的按需加载

`<VChartSimple />`组件和`<VChart />`组件使用方法基本完全相同，唯一差异点为，需要用户从 `@visactor/vchart/esm/core` 引用 `VChart` 构造类，根据本文描述，注册需要的图表和组件，并传入给 `<VChartSimple />`;

- 使用语义化标签，所有的语义化标签默认支持按需加载，其中各种语义化标签默认注册的内容如下：

> 历史记录：该组件封装自 **0.0.12** 版本开始支持；此版本号不指 VChart 或 Lynx 引擎。

| 图表                       | 分类           | 额外注册的组件                        |
| -------------------------- | -------------- | ------------------------------------- |
| `<LineChart/>`             | 直角坐标系图表 | `registerLabel`                       |
| `<AreaChart/>`             | 直角坐标系图表 | `registerLabel`, `registerTotalLabel` |
| `<BarChart/>`              | 直角坐标系图表 | `registerLabel`, `registerTotalLabel` |
| `<Bar3dChart/>`            | 直角坐标系图表 | `registerLabel`, `registerTotalLabel` |
| `<BoxPlotChart/>`          | 直角坐标系图表 | `registerLabel`,                      |
| `<HeatmapChart/>`          | 直角坐标系图表 | `registerLabel`                       |
| `<Histogram3dChart/>`      | 直角坐标系图表 | `registerLabel`                       |
| `<HistogramChart/>`        | 直角坐标系图表 | `registerLabel`                       |
| `<LinearProgressChart/>`   | 直角坐标系图表 | `registerLabel`                       |
| `<RangeColumnChart/>`      | 直角坐标系图表 | `registerLabel`                       |
| `<RangeColumn3dChart/>`    | 直角坐标系图表 | `registerLabel`                       |
| `<ScatterChart/>`          | 直角坐标系图表 | `registerLabel`                       |
| `<SequenceChart/>`         | 直角坐标系图表 | `registerLabel`                       |
| `<WaterfallChart/>`        | 直角坐标系图表 | `registerLabel`, `registerTotalLabel` |
| `<RadarChart/>`            | 极坐标系图表   | `registerLabel`                       |
| `<RoseChart/>`             | 极坐标系图表   | `registerLabel`                       |
| `<CircularProgressChart/>` | 极坐标系图表   | `registerLabel`, `registerIndicator`  |
| `<Pie3dChart/>`            | 通用图表       | `registerLabel`, `registerIndicator`  |
| `<PieChart/>`              | 通用图表       | `registerLabel`, `registerIndicator`  |
| `<CirclePackingChart/>`    | 通用图表       | 无                                    |
| `<FunnelChart/>`           | 通用图表       | `registerLabel`                       |
| `<Funnel3dChart/>`         | 通用图表       | `registerLabel`                       |
| `<GaugeChart/>`            | 通用图表       | 无                                    |
| `<MapChart/>`              | 通用图表       | `registerLabel`                       |
| `<SankeyChart/>`           | 通用图表       | 无                                    |
| `<SunburstChart/>`         | 通用图表       | 无                                    |
| `<TreemapChart/>`          | 通用图表       | 无                                    |
| `<VennChart/>`             | 通用图表       | 无                                    |
| `<WordCloud3dChart/>`      | 通用图表       | 无                                    |
| `<WordCloudChart/>`        | 通用图表       | 无                                    |
| `<LiquidChart/>`           | 通用图表       | `registerIndicator`                   |

其中，直角坐标系图表默认注册组件如下：

- `registerCartesianLinearAxis`
- `registerCartesianBandAxis`
- `registerCartesianTimeAxis`
- `registerCartesianLogAxis`
- `registerCartesianCrossHair`
- `registerBrush`
- `registerContinuousLegend`
- `registerDataZoom`
- `registerDiscreteLegend`
- `registerCustomMark`
- `registerAllMarks`
- `registerMarkArea`
- `registerMarkLine`
- `registerMarkPoint`
- `registerScrollBar`
- `registerTitle`
- `registerTooltip`
- `registerCanvasTooltipHandler`

极坐标系图表默认注册组件如下：

- `registerPolarLinearAxis`
- `registerPolarBandAxis`
- `registerPolarCrossHair`
- `registerBrush`
- `registerContinuousLegend`
- `registerDataZoom`
- `registerDiscreteLegend`
- `registerCustomMark`
- `registerAllMarks`
- `registerScrollBar`
- `registerTitle`
- `registerTooltip`
- `registerCanvasTooltipHandler`

通用图表默认注册组件如下：

- `registerDiscreteLegend`
- `registerContinuousLegend`
- `registerCustomMark`
- `registerAllMarks`
- `registerTitle`
- `registerTooltip`
- `registerCanvasTooltipHandler`

使用语义化标签的时候，如果用到其他没有默认加载的组件，只需要注册未加载的组件即可；

【历史排错记录】：旧版内部接入文档曾建议在“No matching export in ...”报错时升级 Lynx，或将 `resolve.enableINodeCache` 设为 `false`。该建议所属的构建工具及适用版本尚未核实，使用前需核对对应工具链文档，不能将其作为开源 Lynx 的通用配置。

VChart 按需引用参考[相关文档](/vchart/guide/tutorial_docs/Load_on_Demand)
