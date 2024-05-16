# Harmony VChart

- Repository: https://github.com/VisActor/VChart/tree/main/packages/harmony-vchart

HarmonyOS is an intelligent terminal operating system developed by Huawei, mainly using ArkTS as the main development language. Starting from version 1.11.1, VChart supports compatibility with HarmonyOS chart development. To facilitate the use of VChart by Harmony technology stack students, we provide the VChart HarmonyOS package `@visactor/harmony-vchart` (this package is not an NPM package, but an OHPM package), and the spec configuration item of this component is consistent with VChart.

In this tutorial, we will explain in detail how to use VChart in Harmony projects and create a simple bar chart.

## Effect display

<div style="text-align: center;"> <img style="margin-right: 60px" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example.jpg" alt="Harmony VChart example"> <img crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-demo.gif" alt="Harmony VChart example"> </div>

## Quick start

This article assumes that the user is familiar with and can use HarmonyOS. For specific HarmonyOS-related knowledge, please refer to [HarmonyOS Developer Platform](https://developer.huawei.com/consumer/cn/).

### How to install

To start using Harmony VChart, you first need to install the `@visactor/harmony-vchart` package in your Harmony project. In the root directory of the project, use the following command to install the package:

```
ohpm install @visactor/harmony-vchart
```

### Create a chart

Take creating a simple bar chart as an example. In your Harmony component, import the `<BarChart>` component of `visactor/harmony-vchart` and use them in the component. Here is an example code for creating a bar chart:

```typescript
import { VChart } from '@visactor/harmony-vchart';

const spec = '{"type":"bar","data":[{"id":"barData","values":[{"month":"Monday","sales":22},{"month":"Tuesday","sales":13},{"month":"Wednesday","sales":25},{"month":"Thursday","sales":29},{"month":"Friday","sales":38}]}],"xField":"month","yField":"sales","crosshair":{"xField":{"visible":true}}}'

@Entry
@Component
struct Index {
@State message: string = 'Hello World';

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        VChart({
          spec: JSON.parse(spec), w: 300, h: 300,
          onChartInitCb: () => {},
          onChartReadyCb: () => {}
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

In this example, we created a simple bar chart using some basic components and configurations.

<div style="text-align: center;"> <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523213.png" alt="Bar chart example"> </div>

## Unified chart label `<VChart />`

`<VChart />` receives a complete **spec** as the chart definition, and its **spec** data structure is exactly the same as the definition in VChart, so developers can send any spec that is legal for VChart to Harmony-VChart for chart rendering.

### Props

If you already have a spec chart description, using the unified chart label is a faster way, just import the `VChart` component:

`1import { VChart } from '@visactor/harmony-vchart'; 2`

The `VChart` component is the encapsulated Harmony component, and its props definition is as follows:

```typescript
interface VChartProps extends EventsProps {
  /** 图表定义 */
  spec: any;
  /** 图表配置 */
  options?: IInitOption;
  /**
   * 图表初始化的回调
   * @param vchart
   */
  onChartInitCb?: (vchart: VChartConstructor) => void;
  /**
   * 图表准备好的回调(第一次渲染完成)
   * @param vchart
   */
  onChartReadyCb?: (vchart: VChartConstructor) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
  /**
   * 切换到同步渲染
   *
   * @since 1.8.3
   **/
  useSyncRender?: boolean;
  /**
   * props更新的时候，跳过所有函数的检查，即所有的函数都认为没有更新
   *
   * @since 1.6.5
   **/
  skipFunctionDiff?: boolean;
}
```

```typescript
export interface IInitOption {
  /**
   * 图表开始渲染的回调
   * @param vchart
   */
  beforeRender?: (stage: Object) => void;
  /**
   * 渲染完成的回调
   * @param vchart
   */
  afterRender?: (stage: Object) => void;
  /**
   * 启用的插件列表
   */
  pluginList?: string[];
  /** 数据集 */
  dataSet?: Object;
  /**
   * 是否开启动画
   */
  animation?: boolean;
  /**
   * 当文本省略时，鼠标 hover 到文本上时是否显示 poptip
   * @default true
   */
  poptip?: boolean;

  /**
   * 报错的回调函数
   * @since 1.2.0
   */
  onError?: () => void;

  /**
   * 默认主题（支持完整主题对象或者主题名称，主题名称需要提前在 `ThemeManager` 中注册）
   * @since 1.3.0
   */
  theme?: string;
}
```

The definition of `EventsProps` can be found in the Event Interaction section.

`onReady` is a built-in callback event that is triggered when the chart is rendered or updated. Its parameters represent the chart instance object and whether it is the first rendering.

For example, developers can register the required callback events on the chart instance during the first rendering to achieve chart interaction.

## Event Interaction

### Basic Events

The `EventsProps` is supported on the Props of the unified chart tag (VChart) or the semantic chart tag (BarChart, etc.) for the scene tree events thrown by the underlying rendering layer.

The definition of `EventsProps` is as follows:

```typescript
interface EventsProps {
  onPointerDown?: (e: any) => void | boolean;
  onPointerUp?: (e: any) => void | boolean;
  onPointerUpOutside?: (e: any) => void | boolean;
  onPointerTap?: (e: any) => void | boolean;
  onPointerOver?: (e: any) => void | boolean;
  onPointerMove?: (e: any) => void | boolean;
  onPointerEnter?: (e: any) => void | boolean;
  onPointerLeave?: (e: any) => void | boolean;
  onPointerOut?: (e: any) => void | boolean;
  onMouseDown?: (e: any) => void | boolean;
  onMouseUp?: (e: any) => void | boolean;
  onMouseUpOutside?: (e: any) => void | boolean;
  onMouseMove?: (e: any) => void | boolean;
  onMouseOver?: (e: any) => void | boolean;
  onMouseOut?: (e: any) => void | boolean;
  onMouseEnter?: (e: any) => void | boolean;
  onMouseLeave?: (e: any) => void | boolean;
  onPinch?: (e: any) => void | boolean;
  onPinchStart?: (e: any) => void | boolean;
  onPinchEnd?: (e: any) => void | boolean;
  onPan?: (e: any) => void | boolean;
  onPanStart?: (e: any) => void | boolean;
  onPanEnd?: (e: any) => void | boolean;
  onDrag?: (e: any) => void | boolean;
  onDragStart?: (e: any) => void | boolean;
  onDragEnter?: (e: any) => void | boolean;
  onDragLeave?: (e: any) => void | boolean;
  onDragOver?: (e: any) => void | boolean;
  onDragEnd?: (e: any) => void | boolean;
  onRightDown?: (e: any) => void | boolean;
  onRightUp?: (e: any) => void | boolean;
  onRightUpOutside?: (e: any) => void | boolean;
  onTouchStart?: (e: any) => void | boolean;
  onTouchEnd?: (e: any) => void | boolean;
  onTouchEndOutside?: (e: any) => void | boolean;
  onTouchMove?: (e: any) => void | boolean;
  onTouchCancel?: (e: any) => void | boolean;
  onPress?: (e: any) => void | boolean;
  onPressUp?: (e: any) => void | boolean;
  onPressEnd?: (e: any) => void | boolean;
  onSwipe?: (e: any) => void | boolean;
  onDrop?: (e: any) => void | boolean;
  onWeel?: (e: any) => void | boolean;
  onClick?: (e: any) => void | boolean;
  onDblClick?: (e: any) => void | boolean;
}
```

## Summary

Through this tutorial, you should have learned how to use VChart charts to create a simple bar chart in a Harmony project. At the same time, you also learned how to configure the chart according to requirements to meet different scenarios in the project. VChart provides rich configuration options and components, and I believe you will better master their use in actual projects and play a greater role. I hope you enjoy using the VChart library in your project!

## 🔗 Related Links

- [Homepage](https://www.visactor.io/vchart)
- [VCharts Gallery](https://www.visactor.io/vchart/example)
- [VChart Tutorials](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart Options](https://www.visactor.io/vchart/option/)
- [VChart API](https://www.visactor.io/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.io/vgrammar)
- [VRender](https://www.visactor.io/vrender)
- [FAQ](https://www.visactor.io/vchart/guide/tutorial_docs/FAQ)
- [CodeSandbox Template](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) for bug reports
