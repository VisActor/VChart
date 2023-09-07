# Lark Mini Program

We provide the `@visactor/lark-vchart` chart component library for Lark Mini Programs, which can be introduced via `npm`.

Example project: [examples](https://github.com/VisActor/VChart/tree/main/packages/lark-vchart/gallery) can be imported using Lark Developer Tools.

## Environment Requirements

Lark version >= 3.45.
[Lark Developer Tools](https://open.feishu.cn/document/uYjL24iN/ucDOzYjL3gzM24yN4MjN)

## API

The usage of the `@visactor/lark-vchart` chart component is shown below:

```xml
<chart
  canvas-id="chart"
  spec="{{ spec }}"
  styles="{{ styles }}"
  events="{{ events }}"
  bind:chartinit="onChartInit"
  bind:chartready="onChartReady"
/>
```

- `canvas-id` is the chart id, consistent with the id of the dom. Please make sure the id is not duplicated.
- `spec` is the core concept of VChart, with the spec of the cross-end component consistent with the PC side. Chart configuration examples can be found in [VChart Examples](../../../../example). For users unfamiliar with VChart, please refer to the [Getting Started with VChart](../../Getting_Started) tutorial.
- `styles` are the chart container styles, which can be used to control chart width, height, etc.
- `events` is an array of objects used to register a series of events, defined as follows. For specific event names, event filter configurations, and callback function parameters, please refer to [VChart Event API](../../../../api/API/event)

```ts
interface IEvent {
  /**
   * Name of the event
   */
  type: string;
  /**
   * Event API's event filtering configuration
   */
  query?: object;
  handler: (event) => void;
}
```

- `bind:chartinit` is a callback function, called when the chart initialization is complete.
- `bind:chartready` is a callback function, called when the chart rendering is complete.

## How to Use

### Prerequisites

Before using the VChart Lark Mini Program component library, please make sure you have read the relevant documentation on the Lark Open Platform.

- [Custom Components](https://open.feishu.cn/document/uYjL24iN/ugTOugTOugTO)
- [npm Support](https://open.feishu.cn/document/uYjL24iN/uEzMzUjLxMzM14SMzMTN/npm-support)

### Step1: Enable npm Capability

Enable Editor > Details > Local Settings > Use npm, and read [Enable npm Capability](https://open.feishu.cn/document/tools-and-resources/development-tools/npm-support#26ae361b) for detailed operations.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270918.png)

**Important Note: The package.json file of the npm package needs to be placed within the miniprogramRoot defined in project.config.json.**

### Step2: Install `@visactor/lark-vchart`

```bash
$ npm install @visactor/lark-vchart
```

### Step3: Create a demo page

The structure is as follows:

```markdown
├── pages
│ └── demo
│ └── index.js # Page js
│ ├── index.json # Page json configuration
│ ├── index.ttml # Page xml structure
│ ├── index.ttss # Page style
```

### Step4: Reference the Component

Configure the following content in index.json to use the `chart` custom component.

```javascript
{
  "usingComponents": {
    "chart": "@visactor/lark-vchart/index"
  }
}
```

### Step5: Create a Chart

1.  Prepare the following xml structure in `index.ttml`:

```xml
<chart
  canvas-id="chart"
  spec="{{ spec }}"
  styles="{{ styles }}"
  events="{{ events }}"
  bind:chartinit="onChartInit"
  bind:chartready="onChartReady"
/>
```

2.  Prepare the necessary chart configuration in `index.js`

```javascript
Page({
  data: {
    canvasId: 'chartId', // canvasId unique chart Id
    events: [], // events custom events
    styles: `
      height: 50vh;
      width: 100%
    `, // style string
    // Chart configuration options
    spec: {
      type: 'pie',
      data: [
        {
          id: 'data1',
          values: [
            { value: 335, name: 'Direct Access' },
            { value: 310, name: 'Email Marketing' },
            { value: 274, name: 'Affiliate Advertising' },
            { value: 123, name: 'Search Engine' },
            { value: 215, name: 'Video Advertising' }
          ]
        }
      ],
      outerRadius: 0.6,
      categoryField: 'name',
      valueField: 'value'
    }
  },
  onLoad: function (options) {}
});
```

## Precautions

1. Due to serialization issues, Lark Mini Programs currently do not support passing complex objects and functions in setData and triggerEvent, only serializable data. **Therefore, `events` function, `chartinit` callback parameters, and `chartready` callback parameters are temporarily not available**

For some features that require the use of the chart instance, you can currently use [selectComponent](https://open.feishu.cn/document/uYjL24iN/uADMx4CMwEjLwATM), and after marking the id attribute in the component `<chart-space id="chart1">`, get the chart instance through `selectComponent`, as shown below:

```javascript
onChartReady() {
	console.log('chart instance rendering complete');
	this.selectComponent("#chart1", res => {
		const chartInstance = res && res.ttCanvas && res.ttCanvas.chart; // Get the chart instance
		// ...
	});
},
```

To give the pie chart to the label text callback function as an example, the detailed steps refer to the following (the user can adjust the strategy depending on the situation, here only provides a basic idea and steps):
- step1: Configure the id and chartOnReady event when declaring the chart component to updateSpec when the empty chart is rendered.
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/miniapp-support-function-a.png)

- step2: when initializing the chart, declare an empty chart (chart type and data must be declared, data can be declared as an empty array)
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/miniapp-support-function-b.png)

- step3: In the onChartReady event, get the component and chart instance by selectComponent and update the spec of the chart instance

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/miniapp-support-function-c.png)

- Result: The callback function for the pie chart's label works.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/miniapp-support-function-d.gif)

## Feedback

If you encounter any problems during use, please feel free to provide feedback on [GitHub issues](https://github.com/VisActor/VChart/issues/new/choose), thank you!
