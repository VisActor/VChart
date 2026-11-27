# DataSet

VChart 中使用了一个数据处理工具 `@visactor/vdataset` 。本篇教程将详细介绍 DataSet 的相关功能。

## 基本概念

在 DataSet 中有 2 个重要的对象。

- `DataView` 数据视图，可以理解为一份数据。
- `DataSet` 数据集，管理多个 `DataView` 的工具，同一个 `DataSet` 下的 `DataView` 可以通过数据依赖，完成自动更新。

除此之外，还有几个与数据处理相关的概念

- `parser` 数据解析，将原始数据解析为更常用的结构，比如将 `csv` 数据解析为常规的数据对象。
- `transform` 数据变换，对数据进行操作，可以改变原始数据，可以对原始数据使用统计方法中生成一份新数据等等。

> 在 VChart 中，一个图表会使用一个 `DataSet` ，多个图表可以共用一个 `DataSet` 。共用 `DataSet` 可以实现多个图表间的基于数据的联动。

## 功能介绍

### DataSet & DataView

`DataSet` 实例上有获取 `DataView`，注册 `parser`、`transform` 的接口。同时 `DataView` 的创建需要指定一个 `DataSet` 对象。

```js
import { DataSet, DataView, csvParser, dataViewParser, statistics } from '@visactor/vdataset';

const dataSet = new DataSet();
// parser，transform 的注册
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);
dataSet.registerTransform('statistics', statistics);
const dataView = new DataView(dataSet, { name: 'data' });
```

### parser

`parser` 将原始数据解析成数据视图可以使用的结构。解析函数接收原始数据、解析选项和当前的 `DataView`。

```ts
export type Parser = (data: any, options: any, dataView: DataView) => any;
```

使用上面注册的 `csv` 解析器读取 CSV。解析后，每列的值都是字符串。例如，第一行的 `value` 是 `'16.9'`。

```js
dataView.parse(
  `year,group,value
1990,18-34,16.9
1990,35-49,12.2`,
  { type: 'csv' }
);
```

### transform

`transform` 用于变换数据。同一个 `DataView` 可以依次执行多个 transform，后一个 transform 使用前一个的输出。配置 `level` 时，transform 会按 `level` 排序。

```ts
export type Transform = (data: any, options?: any) => any;
```

使用上面注册的 `statistics`，按年份对 CSV 数据的 `value` 求平均值。统计结果中的 `group` 是年份，`avg` 是平均值。

```js
dataView.transform({
  type: 'statistics',
  options: {
    fields: ['value'],
    operations: ['average'],
    as: ['avg'],
    groupBy: 'year'
  }
});
```

### 使用示例

下面的示例将两份按年龄组划分的 CSV 数据合并。数据记录了某地区成年人对同性关系的接受比例，分别涵盖 50 岁以下和 50 岁及以上的人群。柱图显示各年龄组的比例，折线显示每年的平均值。

安装 `@visactor/vchart` 和 `@visactor/vdataset`，并在页面中准备一个有宽高的图表容器，例如 `<div id="chart" style="width: 640px; height: 360px"></div>`。

```js
import VChart from '@visactor/vchart';
import { DataSet, DataView, csvParser, dataViewParser, map, statistics } from '@visactor/vdataset';

const dataSet = new DataSet();
// 注册解析器和变换。mergeDataView 读取各依赖视图的最新数据。
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);
dataSet.registerTransform('mergeDataView', views => views.flatMap(view => view.latestData));
dataSet.registerTransform('map', map);
dataSet.registerTransform('statistics', statistics);

const dataLess50 = `year,group,value
1990,18-34,16.9
1990,35-49,12.2
1991,18-34,17
1991,35-49,17.8
1993,18-34,26.5
1993,35-49,23.8
`;
const dataOver50 = `year,group,value
1990,50-64,10.2
1990,65+,5.2
1991,50-64,10
1991,65+,4.8
1993,50-64,16.8
1993,65+,6.6
`;

// 解析两份 CSV。此时所有列的值都是字符串。
const dataView1 = new DataView(dataSet, { name: 'dataView1' });
dataView1.parse(dataLess50, { type: 'csv' });
const dataView2 = new DataView(dataSet, { name: 'dataView2' });
dataView2.parse(dataOver50, { type: 'csv' });

// 合并两份数据，再将用于绘图的 value 列转换成数字。
const dataViewMerge = new DataView(dataSet, { name: 'dataViewMerge' });
dataViewMerge.parse([dataView1, dataView2], { type: 'dataview' });
dataViewMerge.transform({ type: 'mergeDataView' });
dataViewMerge.transform({
  type: 'map',
  options: { callback: row => ({ ...row, value: Number(row.value) }) }
});
// 合并后的前两行：
// { year: '1990', group: '18-34', value: 16.9 }
// { year: '1990', group: '35-49', value: 12.2 }

// 读取合并后的数据并按年份统计。group 保存分组键，avg 保存平均值。
const dataViewAvg = new DataView(dataSet, { name: 'dataViewAvg' });
dataViewAvg.parse([dataViewMerge], { type: 'dataview' });
dataViewAvg.transform({ type: 'mergeDataView' });
dataViewAvg.transform({
  type: 'statistics',
  options: {
    fields: ['value'],
    operations: ['average'],
    as: ['avg'],
    groupBy: 'year'
  }
});
// 统计结果：
// [
//   { group: '1990', avg: 11.125, max: 16.9, min: 5.2, average: 11.125, sum: 44.5 },
//   { group: '1991', avg: 12.4, max: 17.8, min: 4.8, average: 12.4, sum: 49.6 },
//   { group: '1993', avg: 18.425, max: 26.5, min: 6.6, average: 18.425, sum: 73.7 }
// ]

const spec = {
  type: 'common',
  data: [dataViewMerge, dataViewAvg],
  series: [
    {
      type: 'bar',
      dataId: 'dataViewMerge',
      xField: 'year',
      yField: 'value',
      seriesField: 'group'
    },
    {
      type: 'line',
      dataId: 'dataViewAvg',
      xField: 'group',
      yField: 'avg'
    }
  ],
  axes: [{ orient: 'left' }, { orient: 'bottom', type: 'band' }]
};

const vchart = new VChart(spec, { dom: 'chart', dataSet });
vchart.renderSync();
```

使用 `@visactor/vdataset@1.0.29` 时，`statistics` 还返回了 `max`、`min`、`average` 和 `sum`。折线只读取 `group` 和 `avg`。

### 依赖更新

用 `dataView1.parseNewData(updatedCsv)` 或 `dataView2.parseNewData(updatedCsv)` 替换对应的 CSV 数据。依赖视图会重新执行各自的 transform，图表也会根据更新后的合并数据和统计数据重绘。

将同一个 `DataSet` 和相应的 `DataView` 传给多个图表，也可以让这些图表随数据更新联动。
