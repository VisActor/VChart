# VChart Load-on-Demand Tutorial

## Quick Start

`@visactor/vchart` provides all the charts and components of VChart by default. If you don't want to import all components, you can also import the relevant components as needed. Here is an example of how to use it:

```ts
// import VChart core module
import { VChart } from '@visactor/vchart/esm/core';
// import bar chart
import { registerBarChart } from '@visactor/vchart/esm/chart';
// import axis, tooltip, crosshair components
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
} from '@visactor/vchart/esm/component';

// register chart and components
VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
]);
```

## How to Use

When you import VChart in the following way, you get an constructor that only contains the core logic.Which **does not include any charts, components, plugins, or environment compatibility**. Users need to manually import the relevant charts and components, and register them.

> `import { VChart } from '@visactor/vchart/esm/core'`

The options for registration usually include:

- **Chart types**
- **Components**
- Plugins (media queries, formatting, etc.)
- Interactions (selection, hover, etc.)
- Environment compatibility (Lynx, WeChat Mini Program, Feishu Mini Program compatibility)

  Generally speaking, in addition to registering the chart type, it is also necessary to register the necessary components. For example, in a line chart, the axes (continuous and discrete) are indispensable. If they are not registered, the chart cannot be drawn.

This document will explain the rules for component import in as much detail as possible.

### How to import charts

VChart currently supports 20+ [chart types](/vchart/guide/tutorial_docs/Chart_Types/chart_types), which can be imported as follows:

> `import { registerBarChart } from '@visactor/vchart/esm/chart';`

### How to import components

Users can understand the forms of various functional components in the chart through the related content of [Chart Concepts](/vchart/guide/tutorial_docs/Chart_Concepts/Understanding_VChart) in the tutorial documents, so as to better choose the required components.

For the following Cartesian coordinate system charts, it is **necessary to import the cartesian coordinate system [axes](/vchart/guide/tutorial_docs/Chart_Concepts/Axes)** for the calculation of data-to-graphic position mapping.

> Line chart, area chart, bar chart, histogram, scatter, heatmap, boxplot, waterfall, intervalBar chart, intervalArea chart, linearProgress chart

Usually, importing the continuous axis (`registerCartesianLinearAxis`) and the discrete axis (`registerCartesianBandAxis`) is enough to meet most needs. If you need to use the logarithmic axis (`registerCartesianLogAxis`) or the time axis (`registerCartesianTimeAxis`), you need to load them separately.

```ts
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianCrossHair,
  registerCartesianTimeAxis,
  registerCartesianLogAxis
} from '@visactor/vchart/esm/component';

VChart.useRegisters([
  registerCartesianLinearAxis, // Required
  registerCartesianBandAxis, // Required
  registerCartesianTimeAxis, // Optional
  registerCartesianLogAxis // Optional
]);
```

For the following polar coordinate system charts, it is **necessary to import the polar coordinate system [axes](/vchart/guide/tutorial_docs/Chart_Concepts/Axes)**.

> Radar chart, rose chart, gauge chart, circularProgress chart, circlePacking chart

You need to import the continuous axis (`registerPolarLinearAxis`) and the discrete axis (`registerPolarBandAxis`).

```ts
import { registerPolarLinearAxis, registerPolarBandAxis } from '@visactor/vchart/esm/component';

VChart.useRegisters([
  registerPolarLinearAxis, // Required
  registerPolarBandAxis // Required
]);
```

For other components, you can refer to the following checklist:

<table>
  <tr>
    <td>Component</td>
    <td>Component Registration Method</td>
    <td>Actual Scenario Illustration</td>
  </tr>
  <tr>
    <td>Discrete Legend</td>
    <td><code>registerDiscreteLegend</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a215.png"
        alt="Discrete Legend Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Continuous Legend</td>
    <td><code>registerContinuousLegend</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a13.png"
        alt="Continuous Legend Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Tooltip</td>
    <td><code>registerTooltip</code></td>
    <td style="font-weight: bold">Tooltip includes two rendering methods, canvas and dom:<br>Usually in a browser
      environment, you need to register<code>registerDomTooltipHandler</code><br>In non-browser environments such as
      mini programs and node, you need to register<code>registerCanvasTooltipHandler</code><br><img
         src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a212.png"
        alt="Tooltip Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Crosshair (Cartesian Coordinate System)</td>
    <td><code>registerCartesianCrossHair</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a15.png"
        alt="Cartesian CrossHair Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Crosshair (Polar Coordinate System)</td>
    <td><code>registerPolarCrossHair</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a218.png"
        alt="Polar CrossHair Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Zoom Slider</td>
    <td><code>registerDataZoom</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-datazoom.png"
        alt="DataZoom Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Scrollbar</td>
    <td><code>registerScrollBar</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a18.png"
        alt="ScrollBar Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Label</td>
    <td><code>registerLabel</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c613.png" alt="Label Illustration"
        style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Indicator</td>
    <td><code>registerIndicator</code></td>
    <td>Commonly used for numerical indicator card display in pie charts and dashboard charts.<br><img
         src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-indicator.png"
        alt="Indicator Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
  <td>Title</td>
  <td><code>registerTitle</code></td>
  <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-title.png"
      alt="Title Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Mark Line</td>
    <td><code>registerMarkLine</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c619.png"
        alt="MarkLine Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Mark Point</td>
    <td><code>registerMarkPoint</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a1b.png"
        alt="MarkPoint Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Mark Area</td>
    <td><code>registerMarkArea</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a21c.png"
        alt="MarkArea Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Total Label</td>
    <td><code>registerTotalLabel</code></td>
    <td>Usually used for stacked charts to display the total stack.</br><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-totalLabel.png"
        alt="TotalLabel Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Brush</td>
    <td><code>registerBrush</code></td>
    <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-brush.png"
        alt="Brush Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Custom Mark</td>
    <td><code>registerCustomMark</code></td>
    <td>Provides the ability to extend custom drawing.<br><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-customMark.png"
        alt="Custom Mark Illustration" style="max-width: 400px"></td>
  </tr>
  <tr>
    <td>Player</td>
    <td><code>registerPlayer</code></td>
    <td><img 
        src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c618.png" alt="Player Illustration"
        style="max-width: 400px"></td>
  </tr>
</table>

### How to import plugins

Taking the [Media Query](/vchart/guide/tutorial_docs/Self-adaption/Media_Query)as an example, it can be imported in the following way:

> `import { registerMediaQuery } from '@visactor/vchart/esm/plugin';`

## React VChart Load on Demand

The code of React-VChart itself supports load on demand. When VChart needs to be loaded on demand, you need to use the `<VChartSimple />` tag.

The usage of the `<VChartSimple />` component and the `<VChart />` component is basically the same. The only difference is that the user needs to import the VChart constructor class from @viasctor/vchart/esm/core, register the required charts and components according to the description in this article, and pass them to `<VChartSimple />`.

```typescript
interface VChartSimpleProps extends EventsProps {
  /** chart spec */
  spec: any;
  /** chart options */
  options?: ChartOptions;
  /** Chart Rendering Completion Event */
  onReady?: (instance: VChart, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
  /**
   * Switch to Synchronous Rendering
   *
   * @since 1.8.3
   **/
  useSyncRender?: boolean;
  /**
   * When props are updated, skip all function checks, i.e., all functions are considered not updated.
   *
   * @since 1.6.5
   **/
  skipFunctionDiff?: boolean;
  /**
   * VChart constructor
   *
   * @since 1.8.3
   **/
  vchartConstrouctor: IVChartConstructor;
}
```

## taro-vchart 按需加载

> Supported after version 1.10.0

Similar to react-vchart, when VChart needs to be loaded on demand, you also need to use the `<VChartSimple />` tag.

The usage of the `<VChartSimple />` component and the `<VChart />` component is basically the same. The only difference is that the user needs to import the VChart constructor class from @viasctor/vchart/esm/core, register the required charts and components according to the description in this article, and pass them to `<VChartSimple />`.

## Cross-platform Related

VChart provides support for the browser and node environments by default. If your project needs to run in a mini-program environment, please note to import the mini-program environment code when loading on demand.
For example, when using in WeChat Mini Program, you need to call `registerWXEnv`:

```ts
import { registerWXEnv } from '@visactor/vchart/esm/env';
VChart.useRegisters([registerWXEnv]);
```

The environment compatibility registrars currently supported by VChart include:

<table>
  <tr>
    <td>Environment</td>
    <td>Component Registration Method</td>
  </tr>
  <tr>
    <td>Browser</td>
    <td><code>registerBrowserEnv</code></td>
  </tr>
  <tr>
    <td>Node</td>
    <td><code>registerNodeEnv</code></td>
  </tr>
  <tr>
    <td>WeChat Mini Program</td>
    <td><code>registerWXEnv</code></td>
  </tr>
  <tr>
    <td>Lark Mini Program</td>
    <td><code>registerLarkEnv</code></td>
  </tr>
  <tr>
    <td>Lynx</td>
    <td><code>registerLynxEnv</code></td>
  </tr>
  <tr>
    <td>All of the above</td>
    <td><code>registerAllEnv</code></td>
  </tr>
</table>

Please note that if your project uses cjs (commonJS), please import from the @visactor/vchart/cjs directory, as follows:

```js
// import VChart core module
const { VChart } = require('@visactor/vchart/cjs/core');
// import bar chart
const { registerBarChart } = require('@visactor/vchart/cjs/chart');
// import axis, tooltip, crosshair components
const {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
} = require('@visactor/vchart/cjs/component');

// register chart and components
VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
]);
```
