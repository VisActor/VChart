---
category: examples
group: grammatical-tag
title: Nested Pie Chart
keywords: pieChart, comparison, composition, proportion, circle
order: 0-8
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c81708.png
option: pieChart
---

# Nested Pie Chart

Nested pie charts can be achieved by configuring multiple pie chart series, with the outer pie chart set to a doughnut chart.

## Key Configuration

- The `categoryField` and `valueField` attributes are used to specify the pie chart category and sector angle fields, respectively
- The `innerRadius` and `outerRadius` attributes are used to specify the inner and outer radii of the sector

## Demo source

```javascript livedemo template=openinula-vchart
const root = document.getElementById(CONTAINER_ID);
const { VChart, CommonChart, Pie, Title, Legend } = InulaVChart;
const { useState, useRef, useEffect } = Inula;

const Card = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    window['vchart'] = chartRef;
  }, []);

  return (
    <CommonChart ref={chartRef} color={['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']}>
      <Pie
        data={{
          id: 'id0',
          values: [
            { type: '0~29', value: '126.04' },
            { type: '30~59', value: '128.77' },
            { type: '60 and over', value: '77.09' }
          ]
        }}
        outerRadius={0.65}
        innerRadius={0}
        valueField="value"
        categoryField="type"
        label={{
          position: 'inside',
          visible: true,
          style: {
            fill: 'white'
          }
        }}
        pie={{
          style: {
            stroke: '#ffffff',
            lineWidth: 2
          }
        }}
      />
      <Pie
        data={{
          id: 'id1',
          values: [
            { type: '0~9', value: '39.12' },
            { type: '10~19', value: '43.01' },
            { type: '20~29', value: '43.91' },
            { type: '30~39', value: '45.4' },
            { type: '40~49', value: '40.89' },
            { type: '50~59', value: '42.48' },
            { type: '60~69', value: '39.63' },
            { type: '70~79', value: '25.17' },
            { type: '80 and over', value: '12.29' }
          ]
        }}
        outerRadius={0.8}
        innerRadius={0.67}
        valueField="value"
        categoryField="type"
        label={{
          visible: true
        }}
        pie={{
          style: {
            stroke: '#ffffff',
            lineWidth: 2
          }
        }}
      />
      <Title
        visible
        text="Population Distribution by Age in the United States, 2021 (in millions)"
        textStyle={{
          fontFamily: 'Times New Roman'
        }}
      />
      <Legend visible orient="left" />
    </CommonChart>
  );
};

Inula.render(<Card />, root);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```

## Related tutorials

[Pie chart](link)
