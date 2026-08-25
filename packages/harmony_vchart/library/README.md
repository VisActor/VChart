# Harmony-VChart

VChart 是 VisActor 可视化系统中的图表组件库。它基于可视化语法库 VGrammar 和基于可视化渲染引擎 VRender 的组件封装，封装了基于可视化语法库的图表逻辑。其核心能力如下：

**跨平台**：自动适应桌面、H5 和多个小程序环境
**叙事**：全面的注释、动画、流程控制、叙事模板等增强功能，用于视觉叙事
**场景**：将视觉叙事能力传递给最终用户，提高开发者的生产力

HarmonyOS 是华为研发的智能终端操作系统，以 ArkTS 为主要开发语言，VChart 从 1.11.1 版本开始，支持兼容 HarmonyOS 的图表开发（支持 HarmonyOS API 11 以上）。

OpenHarmony 是由开放原子开源基金会（OpenAtom Foundation）孵化及运营的开源项目，目标是面向全场景、全连接、全智能时代，基于开源的方式，搭建一个智能终端设备操作系统的框架和平台，促进万物互联产业的繁荣发展。VChart 同时也兼容 OpenHarmony 应用开发的图表开发（支持 API 10 Release 以上）

为了方便 Harmony 技术栈的同学更好的使用，我们提供了 VChart 的 HarmonyOS 封装包`@visactor/harmony-vchart`（此包不是 NPM 包，是 OHPM 包），该组件的 spec 配置项与 VChart 一致，该包在 HarmonyOS 和 OpenHarmony 应用开发环境中的使用是一致的

具体文档参见官网： [Homepage](https://www.visactor.com/vchart)
使用 demo 应用程序：https://gitee.com/VisActor/harmony-vchart-example

## 效果展示

<div style="text-align: center;">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-dualaxis.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-funnel.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-scatter.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-area.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-ring.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-rose.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-sankey.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-wordcloud.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-demo-low-quality.gif" alt="Harmony VChart示例">
</div>

## 🔨 使用

### 📦 安装

```bash
# ohpm
ohpm install @visactor/harmony-vchart
```

### 📊 图表示例

以创建一个简单的状图为例。在你的 Harmony 组件中，引入 `visactor/harmony-vchart` 的 `<VChart>` 组件，并在组件中使用它们。下面是一个创建柱状图的示例代码：

```typescript
import { VChart } from '@visactor/harmony-vchart';

interface Event {
  item: ItemType
}

interface ItemType {
  addState(str: string): void;
}

@Entry
@Component
struct Index {
  @State message: string = 'Hello World';
  @State spec:Record<string, string|ESObject> = {
    'type': 'bar',
    'data': {
      values: ([
        {
          "type": "Autocracies",
          "year": "1930",
          "value": 129
        },
        {
          "type": "Autocracies",
          "year": "1940",
          "value": 133
        },
        {
          "type": "Autocracies",
          "year": "1950",
          "value": 130
        },
        {
          "type": "Autocracies",
          "year": "1960",
          "value": 126
        },
        {
          "type": "Autocracies",
          "year": "1970",
          "value": 117
        },
        {
          "type": "Autocracies",
          "year": "1980",
          "value": 114
        },
        {
          "type": "Autocracies",
          "year": "1990",
          "value": 111
        },
        {
          "type": "Autocracies",
          "year": "2000",
          "value": 89
        },
        {
          "type": "Autocracies",
          "year": "2010",
          "value": 80
        },
        {
          "type": "Autocracies",
          "year": "2018",
          "value": 80
        },
        {
          "type": "Democracies",
          "year": "1930",
          "value": 22
        },
        {
          "type": "Democracies",
          "year": "1940",
          "value": 13
        },
        {
          "type": "Democracies",
          "year": "1950",
          "value": 25
        },
        {
          "type": "Democracies",
          "year": "1960",
          "value": 29
        },
        {
          "type": "Democracies",
          "year": "1970",
          "value": 38
        },
        {
          "type": "Democracies",
          "year": "1980",
          "value": 41
        },
        {
          "type": "Democracies",
          "year": "1990",
          "value": 57
        },
        {
          "type": "Democracies",
          "year": "2000",
          "value": 87
        },
        {
          "type": "Democracies",
          "year": "2010",
          "value": 98
        },
        {
          "type": "Democracies",
          "year": "2018",
          "value": 99
        }
      ]) as ESObject
    },
    'xField': ['year', 'type'],
    'yField': 'value',
    'seriesField': 'type',
    'bar': {
      'state': ({
        'aaa': ({
          'fill': 'red'
        } as ESObject)
      } as ESObject),
      'style': ({
        "stroke": "#000",
        "lineWidth": 1
      } as ESObject)
    },
    'legends': {
      "visible": true,
      "position": "start",
      "orient": "top"
    }
  }

  build() {
    Row() {
      Column() {
        VChart({
          spec: this.spec, w: 300, h: 300,
          onChartInitCb: (vchart) => {
            return;
          },
          onChartReadyCb: (vchart) => {
            vchart.on('touchstart', {level: 'mark', type: 'bar'}, (e: Event) => {
              e.item.addState('aaa')
            })
          },
          initOption: {
            beforeRender: () => {
              // this.t = Date.now();
            },
            afterRender: () => {
              // this.delta = Date.now() - this.t;
            }
          }
        });
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

在这个示例中，我们创建了一个简单的柱状图，使用了一些基本的组件和配置。

<div style="text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523213.png" alt="柱状图示例">
</div>

## 统一图表标签 `<VChart />`

`<VChart />` 接收的一个完整的**spec**作为图表定义，其**spec**的数据结构完全等同于 VChart 中的定义，因此开发者可以将任何对于 VChart 合法的 spec 送入 Harmony-VChart 中进行图表渲染。

### Props

如果你已经有了 spec 图表描述信息，使用统一图表标签是比较快捷的方式，只需要引入`VChart`组件即可：

```typescript
import { VChart } from '@visactor/harmony-vchart';
```

`VChart`组件即封装的 Harmony 组件，其 props 定义如下：

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

`EventsProps` 的定义参考事件交互章节

`onChartReadyCb`是一个内置的回调事件，会在图表渲染或更新时触发，其入参分别代表图表实例对象，以及是否初次渲染。

举例来说，开发者可以在初次渲染时，将需要触发的回调事件注册在图表实例上以实现图表交互功能。

## 事件交互

### 基础事件

统一图表标签（VChart）是最外层图表组件，其 Props 上都支持底层渲染层抛出的场景树事件`EventsProps`。

`EventsProps`的定义如下：

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

## ⌨️ 开发

首先，安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

然后克隆仓库:

```bash
# clone
$ git clone git@github.com:VisActor/VChart.git
$ cd VChart
# install dependencies
$ rush update
# start vchart development server
$ rush build
```

然后进入 harmony_vchart 目录调试，目前 Harmony 使用的是 VChart 的打包产物文件，代码热更新的开发方式正在开发中...欢迎攻坚

## 🔗 相关链接

- [Homepage](https://www.visactor.com/vchart)
- [VCharts Gallery](https://www.visactor.com/vchart/example)
- [VChart Tutorials](https://www.visactor.com/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart Options](https://www.visactor.com/vchart/option/)
- [VChart API](https://www.visactor.com/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.com/vgrammar)
- [VRender](https://www.visactor.com/vrender)
- [FAQ](https://www.visactor.com/vchart/faq/)
- [CodeSandbox Template](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) for bug reports
