# @visactor/wx-vchart

`@visactor/wx-vchart` is a chart component library packaged by VChart for the [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/) to support chart rendering on the [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/). It can be introduced through `npm`.

This component library only does environmental packaging, and the configuration items and API are completely consistent with VChart. For the corresponding documentation, please refer to [VChart](https://www.visactor.io/vchart).

## Environment Requirements

[WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)

## API

The `@visactor/wx-vchart` chart component usage example is as follows:

```XML
<chart
  canvas-id="chart"
  spec="{{ spec }}"
  styles="{{ styles }}"
  events="{{ events }}"
  bind:chartinit="onChartInit"
  bind:chartready="onChartReady"
/>
```

- `canvas-id` is the chart id, which is consistent with the dom's id, please ensure that the id is not duplicated.
- `spec` is the core concept of VChart, and the spec of the cross-end component is consistent with the PC end. The chart configuration example can be found in [VChart Chart Example](https://www.visactor.io/vchart/example). For users who are not familiar with VChart, please refer to the [VChart Quick Start](https://www.visactor.io/vchart/guide/tutorial_docs/Getting_Started) tutorial.
- `styles` is the chart container style, which can be used to control the chart width and height styles.
- `events` is an object array, which is used to register a series of events, and its definition is as follows. For specific event names, event filter configuration, and callback function parameters, please refer to [VChart Event API](https://www.visactor.io/vchart/api/API/event)

```TypeScript
interface IEvent {
  /**
   * 事件的名称
   */
  type: string;
  /**
   * 事件 API 中的事件筛选配置
   */
  query?: object;
  handler: (event) => void;
}
```

- `bind:chartinit` is a callback function that is called after the chart initialization is completed.
- `bind:chartready` is a callback function that is called after the chart rendering is completed.

## How to Use

In addition to reading the usage instructions below, you can also go directly to [wx-vchart-example](https://github.com/VisActor/wx-vchart-example).

### Prerequisite

Before using the VChart WeChat Mini Program component library, please make sure you have read the relevant documentation introduction of the WeChat open platform.

- [Custom Components](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)
- [npm Support](https://developers.weixin.qq.com/community/develop/article/doc/0008aecec4c9601e750be048d51c13)

### Step 1: Enable npm Capability

Enable Editor > Tools > Build npm, for specific operations, please read [Enable npm Capability](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

![Image](https://res.wx.qq.com/wxdoc/dist/assets/img/construction.408e13ae.png)

**Note: The package.json file of the** **npm** **package needs to be within the miniprogramRoot defined in project.config.json.**

### Step 2: Install `@visactor/wx-vchart`

```bash
npm install @visactor/wx-vchart
```

### Step3: Creating a demo page

Please create a page template using the WeChat Developer Tools.

### Step4: Referencing the component

Configure the following content in index.json to use the `chart` custom component.

```javascript
{
  "usingComponents": {
    "chart": "@visactor/wx-vchart/index"
  }
}
```

### Step5: Creating a chart

1. Prepare the following XML structure in `index.ttml`:

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

2. Prepare the necessary configuration for the chart in `index.js`:

```javascript
Page({
  data: {
    canvasId: 'chartId', // canvasId 图表唯一Id
    events: [], // events 自定义事件
    styles: `
      height: 50vh;
      width: 100%
    `, // 样式字符
    // 图表配置项
    spec: {
      type: 'pie',
      data: [
        {
          id: 'data1',
          values: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 123, name: '搜索引擎' },
            { value: 215, name: '视频广告' }
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

## Notes

1. Currently, due to serialization issues, the WeChat Mini Program does not support passing complex objects or functions in setData or triggerEvent functions, only serializable data is supported. **Therefore, the `events` function, `chartinit` callback parameter, and `chartready` callback parameter are temporarily unavailable**

For some features that require using chart instances, currently you can use [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html#%E5%AE%9E%E7%8E%B0%E6%96%B9%E6%A1%88) to obtain chart instances after annotating the id attribute for the component `<chart id="chart1">`. The following is an example:

```javascript
onChartReady() {
	console.log('chart 实例渲染完成');
	this.selectComponent("#chart1", res => {
		const chartInstance = res && res.chart; // 获取 chart 实例
    console.log('获取 VChart 实例', chartInstance);
	});
},
```

## Feedback

If you encounter any problems during use, please feel free to provide feedback on [GitHub issues](https://github.com/VisActor/VChart/issues/new/choose), thank you!
