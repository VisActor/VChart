# Lynx

Lynx 是字节内用 Web 技术栈快速构建 Native 视图的高性能跨端框架，VChart 也提供了该框架的图表渲染能力支持。

## 如何获取 VChart

### npm 包

你可以直接在 lynx 项目中安装 vchart 依赖包：`@visactor/vchart`。

### 手动引入脚本

也可以手动引用 VChart 的 umd 打包产物，你可以通过如下渠道获取：

1. 直接仓库中获取 [packages/block-vchart/block/vchart/index.js](https://github.com/VisActor/VChart/blob/main/packages/block-vchart/block/vchart/index.js) ，每次发包我们都会进行更新
2. 从如下免费的 CDN 中获取

```html
<!-- unpkg -->
<script src="https://unpkg.com/@visactor/vchart/build/index.min.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
```

## 如何使用

下面我们从 `js`、`ttml`、`ttss` 三部分介绍下如何在飞书小组件上使用 VChart。

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

在该文件中创建 VChart 实例，因为 VChart 内部对 lynx 环境进行了兼容，所以在使用上，基本于 PC 端无异，只需要注意两点：

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

2. 在事件上，需要用户自己在 canvas（用于绘制的 canvas） 元素上绑定事件，然后在事件监听函数中手动得分发事件来触发 VChart 内部的事件。

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

下面是 index.js 相关的完成代码：

```ts
import barSpec from './data/bar';
import VChart from '@visactor/vchart';
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
