---
category: examples
group: sankey chart
title: 桑基图多种边配置
keywords: sankey,composition,distribution,relationship,comparison,flow
order: 12-7
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/sankey-chart-d3.jpeg
option: sankeyChart
---

# 桑基图多种边配置

桑基图的边具有起点节点（source）和终点节点（source），可以使用两种形式来表示节点：

- 默认使用 nodes 的索引值。
- 通过配置 nameKey 的回调函数，使用节点名称作为边的起点节点和终点节点。
  这个例子就使用 nameKey 的回调函数作为边的节点配置的。

## 关键配置

- `categoryField` 属性声明为类别字段，表示节点名称
- `valueField` 属性声明数值字段，表示节点之间关系的权重
- `sourceField` 属性声明数值字段，表示来源节点索引
- `targetField` 属性声明数值字段，表示目标节点索引
- `nodeAlign` 属性声明节点的对齐类型，该属性可以配置为'left' | 'right' | 'center' | 'justify' | 'start' | 'end'
- `nodeGap` 属性声明同一层中两个节点之间的间隙大小
- `nodeWidth` 属性声明每个节点的宽度，支持三种取值: 1. 百分比字符串，例如 `{ nodeWidth: '12%' }`；2. 以'px'为单位的简单数字，例如 `{ nodeWidth: 20 }`；3. function，通过自定义计算指定 nodeWidth
- `minNodeHeight` 属性声明数据不为零或空时节点的最小大小，这个配置可以用来避免数据太小时看不到太细的节点，建议小于 5px
- `label` 属性声明标签配置，标签布局方式可配置为`position: 'outside' | 'inside-start' | 'inside-middle' | 'inside-end' | 'left' | 'right'`，标签文字最大缩略长度可使用 `limit` 配置
- `node` 属性声明不同状态下节点的样式配置
- `link` 属性声明不同状态下边的样式配置

## 代码演示

```javascript livedemo
const data = [
  {
    nodes: [
      { name: 'Bight of Benin', category: 'Bight' },
      { name: 'Brazil', category: 'Brazil' },
      { name: 'Bight of Biafra and Gulf of Guinea islands', category: 'Bight' },
      { name: 'Gold Coast', category: 'Gold' },
      { name: 'Others Dep.', category: 'Others' },
      { name: 'Senegambia and offshore Atlantic', category: 'Senegambia' },
      { name: 'Sierra Leone e Windward Coast', category: 'Sierra' },
      { name: 'Southeast Africa and Indian Ocean islands', category: 'Southeast' },
      { name: 'West Central Africa and St. Helena', category: 'West' },
      { name: 'Caribbean', category: 'Caribbean' },
      { name: 'Mainland North America', category: 'Mainland' },
      { name: 'Others Arr', category: 'Others' },
      { name: 'Spanish American Mainland', category: 'Spanish' }
    ],
    links: [
      { target: 'Brazil', source: 'Bight of Benin', value: 733769 },
      { target: 'Brazil', source: 'Bight of Biafra and Gulf of Guinea islands', value: 98256 },
      { target: 'Brazil', source: 'Gold Coast', value: 40507 },
      { target: 'Brazil', source: 'Others Dep.', value: 18627 },
      { target: 'Brazil', source: 'Senegambia and offshore Atlantic', value: 86001 },
      { target: 'Brazil', source: 'Sierra Leone e Windward Coast', value: 5409 },
      { target: 'Brazil', source: 'Southeast Africa and Indian Ocean islands', value: 232940 },
      { target: 'Brazil', source: 'West Central Africa and St. Helena', value: 1818611 },
      { target: 'Caribbean', source: 'Bight of Benin', value: 494753 },
      { target: 'Caribbean', source: 'Bight of Biafra and Gulf of Guinea islands', value: 678927 },
      { target: 'Caribbean', source: 'Gold Coast', value: 517280 },
      { target: 'Caribbean', source: 'Others Dep.', value: 192389 },
      { target: 'Caribbean', source: 'Senegambia and offshore Atlantic', value: 144125 },
      { target: 'Caribbean', source: 'Sierra Leone e Windward Coast', value: 284412 },
      { target: 'Caribbean', source: 'Southeast Africa and Indian Ocean islands', value: 57138 },
      { target: 'Caribbean', source: 'West Central Africa and St. Helena', value: 793963 },
      { target: 'Mainland North America', source: 'Bight of Benin', value: 7153 },
      { target: 'Mainland North America', source: 'Bight of Biafra and Gulf of Guinea islands', value: 39389 },
      { target: 'Mainland North America', source: 'Gold Coast', value: 26918 },
      { target: 'Mainland North America', source: 'Others Dep.', value: 12532 },
      { target: 'Mainland North America', source: 'Senegambia and offshore Atlantic', value: 49118 },
      { target: 'Mainland North America', source: 'Sierra Leone e Windward Coast', value: 40366 },
      { target: 'Mainland North America', source: 'Southeast Africa and Indian Ocean islands', value: 3958 },
      { target: 'Mainland North America', source: 'West Central Africa and St. Helena', value: 62966 },
      { target: 'Others Arr', source: 'Bight of Benin', value: 40607 },
      { target: 'Others Arr', source: 'Bight of Biafra and Gulf of Guinea islands', value: 34687 },
      { target: 'Others Arr', source: 'Gold Coast', value: 2108 },
      { target: 'Others Arr', source: 'Others Dep.', value: 1499 },
      { target: 'Others Arr', source: 'Senegambia and offshore Atlantic', value: 8435 },
      { target: 'Others Arr', source: 'Sierra Leone e Windward Coast', value: 12793 },
      { target: 'Others Arr', source: 'Southeast Africa and Indian Ocean islands', value: 9924 },
      { target: 'Others Arr', source: 'West Central Africa and St. Helena', value: 50046 },
      { target: 'Spanish American Mainland', source: 'Bight of Benin', value: 15822 },
      { target: 'Spanish American Mainland', source: 'Bight of Biafra and Gulf of Guinea islands', value: 13700 },
      { target: 'Spanish American Mainland', source: 'Gold Coast', value: 5030 },
      { target: 'Spanish American Mainland', source: 'Others Dep.', value: 5155 },
      { target: 'Spanish American Mainland', source: 'Senegambia and offshore Atlantic', value: 44889 },
      { target: 'Spanish American Mainland', source: 'Sierra Leone e Windward Coast', value: 326 },
      { target: 'Spanish American Mainland', source: 'Southeast Africa and Indian Ocean islands', value: 14327 },
      { target: 'Spanish American Mainland', source: 'West Central Africa and St. Helena', value: 131837 }
    ],
    units: 'Escravos'
  }
];

const spec = {
  type: 'sankey',
  data: [
    {
      name: 'data',
      values: data
    }
  ],
  categoryField: 'name',
  valueField: 'value',
  sourceField: 'source',
  targetField: 'target',
  colorField: 'type',
  nodeKey: datum => datum.name,

  label: {
    visible: true,
    style: {
      fontSize: 12,
      fill: '#000000',
      limit: 10000
    }
  },

  node: {
    state: {
      hover: {
        fill: 'red'
      },
      blur: {
        fill: '#e8e8e8',
        fillOpacity: 0.15
      }
    }
  },

  link: {
    style: {
      fillOpacity: 0.1
    },
    state: {
      hover: {
        fillOpacity: 0.4
      },
      blur: {
        fill: '#e8e8e8'
      }
    }
  },
  emphasis: {
    enable: true,
    trigger: 'selected',
    effect: 'adjacency'
  },
  title: {
    text: 'From Where in Africa Were the Slaves Who Landed in Va.?',
    subtext: 'Source: https://observablehq.com/@luiztheodoro/sankey-d3',
    subtextStyle: {
      fontSize: 12
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[桑基图](link)
