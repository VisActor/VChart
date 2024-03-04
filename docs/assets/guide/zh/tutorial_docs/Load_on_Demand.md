# VChart 按需加载教程

## 快速上手

`@visactor/vchart` 默认提供的是 VChart 所有的图表和组件，如果你不想引入所有组件，也可以按需引入相关的组件。使用示例如下：

```ts
// 引入 VChart 核心模块
import { VChart } from '@visactor/vchart/esm/core';
// 引入柱状图
import { registerBarChart } from '@visactor/vchart/esm/chart';
// 引入坐标轴、提示信息、十字准星组件
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
} from '@visactor/vchart/esm/component';

// 注册柱状图和组件
VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
]);
```

## 如何使用

当你通过下面的方式引入 VChart，得到的是一个只有核心逻辑，**不包含任何图表、组件、插件、环境兼容**的对象。用户需要手动引入相关图表、组件，并进行注册。

> `import { VChart } from '@visactor/vchart/esm/core'`

可以的选择注册内容通常包括：

- **图表类型**
- **组件**
- 插件（媒体查询、格式化等）
- 交互（选中、悬浮等）
- 环境兼容（Lynx、微信小程序、飞书小程序的环境兼容）

通常来说，除了注册图表类型以外，还需要注册必要的组件。例如在折线图中，坐标轴（连续轴和离散轴）是必不可少的，如果不注册，图表将无法绘制。

这篇文的将尽可能详细地说明组件引入的规则。

### 如何引入图表

VChart 目前支持 20+ 种[图表类型](/vchart/guide/tutorial_docs/Chart_Types/chart_types)，可以通过如下方式引入：

> `import { registerBarChart } from '@visactor/vchart/esm/chart';`

### 如何引入组件

用户可以通过教程文档中的[图表概念](/vchart/guide/tutorial_docs/Chart_Concepts/Understanding_VChart)相关内容，了解在图表中，各个功能组件的名词和形式，从而更好地选择所需的组件。

对于下列笛卡尔坐标系图表而言，**必须引入直角坐标系[坐标轴](/vchart/guide/tutorial_docs/Chart_Concepts/Axes)**，用于数据到图形位置的映射计算。

> 折线图、面积图、柱状图/条形图、直方图、散点图、热力图、箱型图、瀑布图、区间柱状图、区间面积图、条形进度图

通常，引入连续轴（`registerCartesianLinearAxis`）和离散轴（`registerCartesianBandAxis`）足以满足大部分需求。如果你需要使用到对数轴（`registerCartesianLogAxis`）、时间轴（`registerCartesianTimeAxis`），则需要额外加载。

```ts
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianCrossHair,
  registerCartesianTimeAxis,
  registerCartesianLogAxis
} from '@visactor/vchart/esm/component';

VChart.useRegisters([
  registerCartesianLinearAxis, // 必选
  registerCartesianBandAxis, // 必选
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis // 非必选
]);
```

对于下列极坐标系图表而言，**必须引入极坐标系[坐标轴](/vchart/guide/tutorial_docs/Chart_Concepts/Axes)**。

> 雷达图、玫瑰图、仪表盘图、环形进度图、嵌套圆图

需要引入连续轴（`registerPolarLinearAxis`）和离散轴（`registerPolarBandAxis`）。

```ts
import { registerPolarLinearAxis, registerPolarBandAxis } from '@visactor/vchart/esm/component';

VChart.useRegisters([
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis // 必选
]);
```

其他组件可以参考下面的自查表：

<table>
    <tr>
        <td>组件</td>
        <td>组件注册方法</td>
        <td>实际场景示意</td>
    </tr>
    <tr>
        <td>离散图例</td>
        <td><code>registerDiscreteLegend</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a215.png" alt="Discrete Legend Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>连续图例</td>
        <td><code>registerContinuousLegend</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a13.png" alt="Continuous Legend Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>提示信息</td>
        <td><code>registerTooltip</code></td>
        <td style="font-weight: bold">Tooltip 包括 canvas 和 dom 两种绘制方式：<br>通常在浏览器环境下，需要注册<code>registerDomTooltipHandler</code><br>在小程序、node等非浏览器环境下，需要注册<code>registerCanvasTooltipHandler</code><br><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a212.png" alt="Tooltip Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>十字准星（直角坐标系）</td>
        <td><code>registerCartesianCrossHair</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a15.png" alt="Cartesian CrossHair Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>十字准星（极坐标系）</td>
        <td><code>registerPolarCrossHair</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a218.png" alt="Polar CrossHair Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>缩略轴</td>
        <td><code>registerDataZoom</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-datazoom.png" alt="DataZoom Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>滚动条</td>
        <td><code>registerScrollBar</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a18.png" alt="ScrollBar Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>标签</td>
        <td><code>registerLabel</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c613.png" alt="Label Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>指标卡</td>
        <td><code>registerIndicator</code></td>
        <td>常用于饼图、仪表盘图的数值指标卡展示。<br><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-indicator.png" alt="Indicator Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>标题</td>
        <td><code>registerTitle</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-title.png" alt="Title Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>标注线</td>
        <td><code>registerMarkLine</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c619.png" alt="MarkLine Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>标注点</td>
        <td><code>registerMarkPoint</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a1b.png" alt="MarkPoint Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>标注区域</td>
        <td><code>registerMarkArea</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a21c.png" alt="MarkArea Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>总计标签</td>
        <td><code>registerTotalLabel</code></td>
        <td>通常用于堆叠图表，显示堆叠总和。</br><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-totalLabel.png" alt="TotalLabel Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>框选</td>
        <td><code>registerBrush</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-brush.png" alt="Brush Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>自定义图元</td>
        <td><code>registerCustomMark</code></td>
        <td>提供自定义绘图的扩展能力。<br><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/load-on-demand-customMark.png" alt="Custom Mark Illustration" style="max-width: 400px"></td>
    </tr>
    <tr>
        <td>播放器</td>
        <td><code>registerPlayer</code></td>
        <td><img  src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c618.png" alt="Player Illustration" style="max-width: 400px"></td>
    </tr>

</table>

### 如何引入插件

以[媒体查询器](/vchart/guide/tutorial_docs/Self-adaption/Media_Query)为例，可以通过如下方式引入：

> `import { registerMediaQuery } from '@visactor/vchart/esm/plugin';`

## react-vchart 按需加载

React-VChart 本身代码都支持按需加载，当需要 VChart 按需加载的时候，需要使用 `<VChartSimple />` 标签。

`<VChartSimple />`组件和`<VChart />`组件使用方法基本完全相同，唯一差异点为，需要用户从 `@viasctor/vchart/esm/core` 引用 `VChart` 构造类，根据本文描述，注册需要的图表和组件，并传入给 `<VChartSimple />`;

```typescript
interface VChartSimpleProps extends EventsProps {
  /** 图表定义 */
  spec: any;
  /** 图表配置 */
  options?: ChartOptions;
  /** 图表渲染完成事件 */
  onReady?: (instance: VChart, isInitial: boolean) => void;
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
  /**
   * VChart构造类
   *
   * @since 1.8.3
   **/
  vchartConstrouctor: IVChartConstructor;
}
```

## taro-vchart 按需加载

> 自 1.10.0 版本后支持

与 react-vchart 类似，当需要 VChart 按需加载的时候，也是需要使用 `<VChartSimple />` 标签。

`<VChartSimple />`组件和`<VChart />`组件使用方法基本完全相同，唯一差异点为，需要用户从 `@viasctor/vchart/esm/core` 引用 `VChart` 构造类，根据本文描述，注册需要的图表和组件，并传入给 `<VChartSimple />`;

## 跨端

VChart 默认对浏览器和 node 环境提供了支持。如果你的项目需要运行在小程序环境下，按需加载时，请注意引入小程序环境代码。
例如，在微信小程序中使用时，需要调用 `registerWXEnv`：

```ts
import { registerWXEnv } from '@visactor/vchart/esm/env';
VChart.useRegisters([registerWXEnv]);
```

目前 VChart 支持的环境兼容注册器包括：

<table>
    <tr>
        <td>环境</td>
        <td>组件注册方法</td>
    </tr>
    <tr>
        <td>浏览器</td>
        <td><code>registerBrowserEnv</code></td>
    </tr>
    <tr>
        <td>Node</td>
        <td><code>registerNodeEnv</code></td>
    </tr>
    <tr>
        <td>微信小程序</td>
        <td><code>registerWXEnv</code></td>
    </tr>
    <tr>
        <td>飞书小程序</td>
        <td><code>registerLarkEnv</code></td>
    </tr>
    <tr>
        <td>Lynx</td>
        <td><code>registerLynxEnv</code></td>
    </tr>
    <tr>
        <td>以上所有</td>
        <td><code>registerAllEnv</code></td>
    </tr>
</table>

注意如果你的项目使用的是 cjs(commonJS) 的话，请从 `@visactor/vchart/cjs` 目录下引用，如下：

```js
// 引入 VChart 核心模块
const { VChart } = require('@visactor/vchart/cjs/core');
// 引入柱状图
const { registerBarChart } = require('@visactor/vchart/cjs/chart');
// 引入坐标轴、Tooltip、CrossHair组件
const {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
} = require('@visactor/vchart/cjs/component');

// 注册
VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
]);
```
