# Lynx

**[Scope] This guide retains integration instructions for ByteDance's internal Lynx environment. Based on public information reviewed on September 14, 2026, open-source native Lynx does not yet publicly provide the Canvas integration required here. Installing VChart does not add this capability to the host. For updates, see the [official Lynx documentation](https://lynxjs.org/) and the [charting discussion](https://github.com/lynx-family/lynx/issues/6230#issuecomment-4729040590).**

Lynx is a high-performance cross-platform framework open-sourced by ByteDance, enabling the rapid construction of Native views based on the Web technology stack. Lynx was officially open-sourced on March 5, 2025. VChart provides chart rendering capabilities for this framework based on the internal version of Lynx at ByteDance.

## How to get VChart

### npm package

You can install the vchart dependency package directly in the lynx project: `@visactor/vchart`.

### Manually import script

You can also obtain the VChart UMD bundle and load it using a method supported by the internal host. The HTML tags below show browser usage and cannot be copied directly into a native Lynx project:

1. Obtain [build/index.min.js](https://unpkg.com/@visactor/vchart/build/index.min.js) from the `@visactor/vchart` package
2. Get it from the following free CDN

```html
<!-- unpkg -->
<script src="https://unpkg.com/@visactor/vchart/build/index.min.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
```

## How to Use

The following historical `ttml` and `js` examples are retained for internal Lynx hosts. `Card(...)`, `SystemInfo`, and the Canvas bridge depend on the specific internal host; they are not general-purpose APIs for open-source ReactLynx.

These examples have not been verified with the current VChart version and a specific host version. Check the versions and host APIs before using them. The `domref`, `canvasIdLists`, and `freeCanvasIdx` parameters belong to the older integration and should not be treated as the integration contract for newer versions.

### index.ttml

Three canvases need to be declared, and pay attention to the order of declaration.

- `bar_hidden_canvas` hidden canvas, declared in the first, is used for some internal picking logic
- `bar_draw_canvas` draws canvas, the second statement
- `bar_tooltip_canvas` is used to draw the canvas of the tooltip. The tooltip of the cross-end environment is drawn using the canvas.

```html
<view class="vchart">
  <!-- canvas order is important -->
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

This historical example creates a VChart instance in this file and illustrates two parts of the integration: environment parameters and events.

1. Necessary environment parameters need to be declared in the constructor of VChart

```ts
const chartInstance = new VChart(spec, {
  mode: 'lynx', // Tip: Cross-end environment needs to manually pass in mode
  // Cross-end parameters
  modeParams: {
    domref: domRef, // Canvas node for chart drawing
    force: true, // Whether to force the use of canvas for drawing
    canvasIdLists: [`${item.id}_draw_canvas`, `${item.id}_tooltip_canvas`, `${item.id}_hidden_canvas`], // canvasId list
    tooltipCanvasId: `${item.id}_tooltip_canvas`, // tooltip canvasId
    freeCanvasIdx: 1 // Free canvas index
  },
  dpr: pixelRatio, // Tip: Cross-end environment needs to manually pass in dpr
  renderCanvas: `${item.id}_draw_canvas` // Declare the canvasId used for drawing
});
```

2. Regarding events, users need to bind events to the canvas (canvas used for drawing) element themselves, and then manually dispatch events in the event listening function to trigger events inside VChart.

```ts
bindChartEvent(event) {
   const id = event.target.id.split("_")[0];
   const targetChart = this.data.chartList.find(x => x.id === id);
   const chartInstance = targetChart?.chart;
   if (chartInstance) {
     event.target = chartInstance.getCanvas(); // Tip: Must be set
     chartInstance.getStage().window.dispatchEvent(event);
   }
},
```

The following is the index.js example:

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
    // Register the map before using a map chart
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
              console.error(`Canvas #${item.id} was not found`);
              return;
            }
            domRef.id = item.id;
            const pixelRatio = SystemInfo.pixelRatio;

            const chartInstance = new VChart(item.spec, {
              mode: 'lynx', // Tip: Pass mode explicitly in cross-platform environments
              // Cross-platform parameters
              modeParams: {
                domref: domRef, // Canvas node used to draw the chart
                force: true, // Whether to force Canvas rendering
                canvasIdLists: [`${item.id}_draw_canvas`, `${item.id}_tooltip_canvas`, `${item.id}_hidden_canvas`], // Canvas ID list
                tooltipCanvasId: `${item.id}_tooltip_canvas`, // tooltip canvasId
                freeCanvasIdx: 1 // Index of the first canvas available for internal use
              },
              dpr: pixelRatio, // Tip: Pass dpr explicitly in cross-platform environments
              renderCanvas: `${item.id}_draw_canvas` // Canvas ID used for drawing
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
      event.target = chartInstance.getCanvas(); // Tip: Must be set
      chartInstance.getStage().window.dispatchEvent(event);
    }
  }
});
```

## On-Demand Loading

The `<VChartSimple />` and semantic tags below belong to the internal `@dp/lynx-vchart` component wrapper and require the corresponding internal ReactLynx host. See the [ReactLynx guide](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx) for usage. The historical loading methods and registration lists are retained below; check them against the wrapper version you use.

- Use the `<VChartSimple />` tag to implement custom on-demand loading.

The `<VChartSimple />` component and the `<VChart />` component are almost identical in usage. The only difference is that users need to import the `VChart` constructor class from `@visactor/vchart/esm/core`, register the required charts and components as described in this document, and pass them to `<VChartSimple />`.

- Use semantic tags, all of which support on-demand loading by default. The default registered components for each type of semantic tag are as follows:

> Historical record: supported by the component wrapper from **0.0.12**. This version does not refer to VChart or the Lynx engine.

| Chart                      | Category         | Additional Registered Components      |
| -------------------------- | ---------------- | ------------------------------------- |
| `<LineChart/>`             | Cartesian Charts | `registerLabel`                       |
| `<AreaChart/>`             | Cartesian Charts | `registerLabel`, `registerTotalLabel` |
| `<BarChart/>`              | Cartesian Charts | `registerLabel`, `registerTotalLabel` |
| `<Bar3dChart/>`            | Cartesian Charts | `registerLabel`, `registerTotalLabel` |
| `<BoxPlotChart/>`          | Cartesian Charts | `registerLabel`,                      |
| `<HeatmapChart/>`          | Cartesian Charts | `registerLabel`                       |
| `<Histogram3dChart/>`      | Cartesian Charts | `registerLabel`                       |
| `<HistogramChart/>`        | Cartesian Charts | `registerLabel`                       |
| `<LinearProgressChart/>`   | Cartesian Charts | `registerLabel`                       |
| `<RangeColumnChart/>`      | Cartesian Charts | `registerLabel`                       |
| `<RangeColumn3dChart/>`    | Cartesian Charts | `registerLabel`                       |
| `<ScatterChart/>`          | Cartesian Charts | `registerLabel`                       |
| `<SequenceChart/>`         | Cartesian Charts | `registerLabel`                       |
| `<WaterfallChart/>`        | Cartesian Charts | `registerLabel`, `registerTotalLabel` |
| `<RadarChart/>`            | Polar Charts     | `registerLabel`                       |
| `<RoseChart/>`             | Polar Charts     | `registerLabel`                       |
| `<CircularProgressChart/>` | Polar Charts     | `registerLabel`, `registerIndicator`  |
| `<Pie3dChart/>`            | General Charts   | `registerLabel`, `registerIndicator`  |
| `<PieChart/>`              | General Charts   | `registerLabel`, `registerIndicator`  |
| `<CirclePackingChart/>`    | General Charts   | None                                  |
| `<FunnelChart/>`           | General Charts   | `registerLabel`                       |
| `<Funnel3dChart/>`         | General Charts   | `registerLabel`                       |
| `<GaugeChart/>`            | General Charts   | None                                  |
| `<MapChart/>`              | General Charts   | `registerLabel`                       |
| `<SankeyChart/>`           | General Charts   | None                                  |
| `<SunburstChart/>`         | General Charts   | None                                  |
| `<TreemapChart/>`          | General Charts   | None                                  |
| `<VennChart/>`             | General Charts   | None                                  |
| `<WordCloud3dChart/>`      | General Charts   | None                                  |
| `<WordCloudChart/>`        | General Charts   | None                                  |
| `<LiquidChart/>`           | General Charts   | `registerIndicator`                   |

For Cartesian charts, the default registered components are as follows:

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

For Polar charts, the default registered components are as follows:

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

For General charts, the default registered components are as follows:

- `registerDiscreteLegend`
- `registerContinuousLegend`
- `registerCustomMark`
- `registerAllMarks`
- `registerTitle`
- `registerTooltip`
- `registerCanvasTooltipHandler`

When using semantic tags, if you need components that are not loaded by default, you only need to register the missing components.

[Historical troubleshooting note]: Earlier internal integration documentation suggested upgrading Lynx or setting `resolve.enableINodeCache` to `false` for "No matching export in ..." errors. The build tool and applicable versions for this advice have not been verified. Check the documentation for your toolchain before applying it; this is not a general configuration option for open-source Lynx.

For reference on on-demand loading of VChart, see [related documentation](/vchart/guide/tutorial_docs/Load_on_Demand).
