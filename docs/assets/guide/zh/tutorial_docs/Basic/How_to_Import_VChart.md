# 如何在项目中引用 VChart

在[如何获取 VChart](./How_to_Get_VChart)章节中我们介绍了获取 VChart 的方式，本章节会一一介绍这些获取方式下如何引用 VChart。

## cdn 使用

我们从 [cdn](./How_to_Get_VChart#cdn-获取) 获取到 VChart 文件后，就可以将其添加到 HTML 文件的 `<script>` 标签中：

** 说明：cdn 方式引入的时候，VChart 的引用方式需要注意：**

`const vchart = new VChart.default(spec, { dom: 'chart' });`

```html
<body>
  <div id="chart" style="outline: solid red 1px; width: 100%; height: 500px"></div>
</body>
<!-- 引入 VChart -->
<script src="https://unpkg.com/@visactor/vchart/build/index.min.js"></script>

<script>
  // 创建饼图
  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    outerRadius: 0.8,
    valueField: 'value',
    categoryField: 'type',
    title: {
      visible: true,
      text: 'Surface element content statistics'
    },
    legends: {
      visible: true,
      orient: 'left'
    },
    label: {
      visible: true
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum['type'],
            value: datum => datum['value'] + '%'
          }
        ]
      }
    }
  };

  const vchart = new VChart.default(spec, { dom: 'chart' });
  vchart.renderAsync();
</script>
```

## npm 使用

我们通过 [npm](./How_to_Get_VChart#npm-获取) 的方式将 `@visactor/vchart` 安装到项目之后，就可以通过如下方式进行使用了：

```ts
import { default as VChart } from '@visactor/vchart';

const spec = {
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: [
        { type: 'oxygen', value: '46.60' },
        { type: 'silicon', value: '27.72' },
        { type: 'aluminum', value: '8.13' },
        { type: 'iron', value: '5' },
        { type: 'calcium', value: '3.63' },
        { type: 'sodium', value: '2.83' },
        { type: 'potassium', value: '2.59' },
        { type: 'others', value: '3.5' }
      ]
    }
  ],
  outerRadius: 0.8,
  valueField: 'value',
  categoryField: 'type',
  title: {
    visible: true,
    text: 'Surface element content statistics'
  },
  legends: {
    visible: true,
    orient: 'left'
  },
  label: {
    visible: true
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

// 基于准备好的图表 dom 容器，创建 VChart 实例
const vchart = new VChart(spec, {
  dom: 'chart'
});

// 调用渲染方法绘制图表
vchart.renderAsync();
```

## 按需引入

`@visactor/vchart` 默认提供的是 VChart 所有的功能，如果你的项目对代码的体积有强要求的话，也可以按需引入相关的图表及组件。下面我们以一个柱图为例介绍按需引用的方法：

```ts
// 引入 VChart 核心模块
import { VChart } from '@visactor/vchart/esm/core';
// 引入柱状图
import { registerBarChart } from '@visactor/vchart/esm/chart';
// 引入坐标轴、Tooltip、CrossHair组件
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
} from '@visactor/vchart/esm/component';

// 注册图表和组件
VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerCartesianCrossHair
]);
```

VChart 默认对浏览器和 node 环境提供了支持。如果你的项目需要运行在小程序环境下，按需加载时，请注意引入小程序环境代码。  
例如，在微信小程序中使用时，需要调用 `registerWXEnv`：

```ts
import { registerWXEnv } from '@visactor/vchart/esm/env';
VChart.useRegisters([registerWXEnv]);
```

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
  registerCartesianCrossHair,
  registerBrowserEnv
]);
```

具体可以查看代码示例：[按需引入柱状图](https://codesandbox.io/s/the-example-of-visactor-vcharts-shrinking-bundle-size-4gsdfn)
