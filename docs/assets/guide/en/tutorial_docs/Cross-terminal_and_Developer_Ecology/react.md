# React VChart

- Repository Address: [https://github.com/VisActor/VChart/tree/main/packages/react-vchart](https://github.com/VisActor/VChart/tree/main/packages/react-vchart)

To make it easier for React users to use VChart, we provide a React wrapper package for VChart: `@visactor/react-vchart`. This component mainly encapsulates VChart's chart components as React components, and its configuration items are consistent with VChart.

In this tutorial, we will explain in detail how to use VChart in a React project and create a simple bar chart. For more detailed API documentation, please refer to the [`@visactor/reactchart`](https://github.com/VisActor/VChart/blob/main/packages/react-vchart/docs/2.1%20API%E8%AE%BE%E8%AE%A1.md) repository documentation.

## Quick Start

### How to Install

To start using React VChart, you'll first need to install the `@visactor/react-vchart` package in your React project. In the project root directory, use the following command to install the package:

```
npm install @visactor/react-vchart
```

or use yarn to install:

```
yarn add @visactor/react-vchart
```

### Creating a Chart

Let's take creating a simple bar chart as an example. In your React component, import the `<BarChart>` component from `visactor/react-vchart` and use them in the component. Here's an example code to create a bar chart:

```javascript
import React, { useRef } from 'react';
import { BarChart, Bar, Legend, Axis } from '@visactor/react-vchart';

const App = () => {
  const chartRef = useRef(null);
  const handleChartClick = () => {
    console.log('Chart clicked');
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

In this example, we created a simple bar chart with some basic components and configurations.

<div style="text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523213.png" alt="Bar chart example">
</div>

## Component Selection

To accommodate different user scenarios and usage habits, VChart offers two label styles:

- `<VChart />`: A large and unified entry label that encapsulates the chart specifications, provides updates and unloads for the specifications. Suitable for toB pages, product pages with page-building elements, and business users who encapsulate VChart themselves.
- `<BarChart />`, `<LineChart />`, `<CommonChart />`, and other syntax labels: Suitable for simple pages, written by developers. Convenient for implementing on-demand loading of packages.

The above bar chart example uses the syntax label `<BarChart />`, and you can choose the appropriate label style according to your needs. Next, we'll introduce how to adjust the chart according to your requirements.

## Chart Configuration and Optimization

After creating a simple bar chart, you may need to make some adjustments based on the requirements of the project. VChart provides a wealth of configuration options to meet different scenarios.

- Chart style: You can set the style of the bar chart by configuring the `style` in the `bar` attribute. For example, changing the color, stroke, width, etc., of the bar.
- Custom legend: By setting the `visible`, `position`, `orient`, and other attributes of the `<Legend>` component, you can customize the display and position of the legend.
- Adjust the axis: In the `<Axis>` component, you can set properties such as `orient`, `type` to adjust the display of the axis, or modify the `label` attribute to adjust the display of labels on the axis.

Here is a modified bar chart according to the requirements:

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

By adjusting the configuration, we have created a bar chart that is more suitable for use in actual projects.

## Conclusion

Through this tutorial, you should have learned how to use VChart to create a simple bar chart in a React project. At the same time, you have learned how to configure the chart according to requirements to meet different scenarios in the project. VChart provides a wealth of options and components, which will undoubtedly play a more significant role in your actual projects. We hope you enjoy using the VChart chart library in your projects!
