# React VChart

- 仓库地址：[https://github.com/VisActor/VChart/tree/main/packages/react-vchart](https://github.com/VisActor/VChart/tree/main/packages/react-vchart)

为了方便 React 技术栈的同学更好得使用 VChart，我们提供了 VChart 的 react 封装包：`@visactor/react-vchart`。该组件主要对 VChart 的图表部件做 React 组件化的封装，相关的配置项均与 VChart 一致。

我们将在本教程中详细讲解如在 React 项目中使用 VChart，并创建一个简单的柱状图。更多详细 api 文档，请查看 [`@visactor/reactchart`](https://github.com/VisActor/VChart/blob/main/packages/react-vchart/docs/2.1%20API%E8%AE%BE%E8%AE%A1.md) 仓库的文档。

## 快速上手

### 如何安装

要开始使用 React VChart，首先需要在你的 React 项目中安装 `@visactor/react-vchart` 包。在项目根目录下，使用以下命令安装该包：

```
npm install @visactor/react-vchart
```

或者使用 yarn 进行安装：

```
yarn add @visactor/react-vchart
```

### 创建图表

以创建一个简单的状图为例。在你的 React 组件中，引入 `visactor/react-vchart` 的 `<BarChart>` 组件，并在组件中使用它们。下面是一个创建柱状图的示例代码：

```javascript
import React, { useRef } from 'react';
import { BarChart, Bar, Legend, Axis } from '@visactor/react-vchart';

const App = () => {
  const chartRef = useRef(null);
  const handleChartClick = () => {
    console.log('图表被点击了');
  };

  const barData = [
    { type: 'Autocracies', year: '1930', value: 129 },
    { type: 'Autocracies', year: '1940', value: 133 },
    { type: 'Autocracies', year: '1950', value: 130 },
    { type: 'Autocracies', year: '1960', value: 126 },
    { type: 'Autocracies', year: '1970', value: 117 },
    { type: 'Autocracies', year: '1980', value: 114 },
    { type: 'Autocracies', year: '1990', value: 111 },
    { type: 'Autocracies', year: '2000', value: 89 },
    { type: 'Autocracies', year: '2010', value: 80 },
    { type: 'Autocracies', year: '2018', value: 80 },
    { type: 'Democracies', year: '1930', value: 22 },
    { type: 'Democracies', year: '1940', value: 13 },
    { type: 'Democracies', year: '1950', value: 25 },
    { type: 'Democracies', year: '1960', value: 29 },
    { type: 'Democracies', year: '1970', value: 38 },
    { type: 'Democracies', year: '1980', value: 41 },
    { type: 'Democracies', year: '1990', value: 57 },
    { type: 'Democracies', year: '2000', value: 87 },
    { type: 'Democracies', year: '2010', value: 98 },
    { type: 'Democracies', year: '2018', value: 99 }
  ];

  return (
    <div>
      <BarChart ref={chartRef} data={[{ id: 'id0', values: barData }]} onClick={handleChartClick}>
        <Bar
          seriesField="type"
          xField={['year', 'type']}
          yField="value"
          bar={{
            style: {
              stroke: '#000',
              strokeWidth: 1
            },
            state: {
              hover: {
                stroke: 'black'
              }
            }
          }}
        />
        <Axis orient="bottom" type="band" />
        <Axis orient="left" max={200} type="linear" />
        <Legend visible={true} position="start" orient="top" padding={{ bottom: 12 }} />
      </BarChart>
    </div>
  );
};

export default App;
```

在这个示例中，我们创建了一个简单的柱状图，使用了一些基本的组件和配置。

<div style="text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523213.png" alt="柱状图示例">
</div>

## 组件选择

为了适应不同用户场景和使用习惯，VChart 提供了两种标签风格：

- `<VChart />`：一个大而全的统一入口标签，封装了图表的规范、提供规范的更新、卸载逻辑。适用于 toB 页面，存在页面搭建类的产品页面，以及自行封装 VChart 的业务方迁移。
- `<BarChart />`、`<LineChart />`、`<CommonChart />`等语法化标签：适用于简单页面，开发人员手写代码。方便实现拆包按需加载。

上面的柱状图示例使用了语法化标签 `<BarChart />`，你可以根据需要选择适合的标签风格。接下来，我们将介绍如何根据你的需求调整图表。

## 图表配置及优化

在创建了一个简单的柱状图之后，你可能会需要根据项目的需求进行一些调整。VChart 提供了丰富的配置选项，以满足不同的场景。

- 图表样式：你可以通过配置 `bar` 属性中的 `style` 来设置柱状图的样式。例如，修改柱的颜色、描边、宽度等。
- 自定义图例：通过设置 `<Legend>` 组件的 `visible`、`position`、`orient` 等属性，你可以自定义图例的显示和位置。
- 调整坐标轴：在 `<Axis>` 组件中，你可以设置 `orient`、`type` 等属性来调整坐标轴的显示，或通过修改 `label` 属性来调整轴上的标签显示。

以下是一个根据需求调整后的柱状图：

```javascript
<BarChart ref={chartRef} data={[{ id: 'id0', values: barData }]} onClick={handleChartClick}>
  <Bar
    seriesField="type"
    xField={['year', 'type']}
    yField="value"
    bar={{
      style: {
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1
      },
      state: {
        hover: {
          fill: 'orange'
        }
      }
    }}
  />
  <Axis orient="bottom" type="band" />
  <Axis orient="left" max={200} type="linear" label={{ visible: true }} />
  <Legend visible={true} position="start" orient="top" padding={{ bottom: 12 }} />
</BarChart>
```

通过调整配置，我们得到了一个更符合在实际项目中的柱状图。

## 总结

通过本教程，你应该已经学会了如何在 React 项目中使用 VChart 图表创建一个简单的柱状图。同时，你还了解了如何根据需求配置图表，以满足项目中不同的场景。VChart 提供了丰富的配置选项和组件，相信你在实际项目中会更好地掌握它们的使用，并发挥出更大的作用。希望你能在项目中愉快地使用 VChart 表库！
