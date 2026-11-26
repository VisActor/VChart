# DataSet

VChart uses a data processing tool `@visactor/vdataset`. This tutorial will introduce the related features of DataSet in detail.

## Basic Concepts

There are two important objects in the DataSet.

- `DataView` data view, which can be understood as a set of data.
- `DataSet` dataset, a tool for managing multiple `DataView`, with data dependency, `DataView` under the same `DataSet` can complete automatic update.

In addition, there are several concepts related to data processing

- `parser` data parsing, which parses raw data into more commonly used structures, such as parsing `csv` data into regular data objects.
- `transform` data transformation, which operates on data, can change the original data, can use statistical methods on the original data to generate a new set of data, etc.

> In VChart, a chart will use a `DataSet`, and multiple charts can share a `DataSet`. Sharing `DataSet` can implement data-based linkage between multiple charts.

## Feature Introduction

### DataSet & DataView

The `DataSet` instance has interfaces for obtaining `DataView`, registering `parser`, and `transform`. At the same time, the creation of `DataView` requires specifying a `DataSet` object.

```js
import { DataSet, DataView, csvParser, dataViewParser, statistics } from '@visactor/vdataset';

const dataSet = new DataSet();
// parser, transform registration
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);
dataSet.registerTransform('statistics', statistics);
const dataView = new DataView(dataSet, { name: 'data' });
```

### parser

A parser turns raw input into data a `DataView` can use. It receives the raw data, parser options, and the current `DataView`.

```ts
export type Parser = (data: any, options: any, dataView: DataView) => any;
```

Use the `csv` parser registered above to read CSV. It returns strings for all columns. For example, the first row has a `value` of `'16.9'`.

```js
dataView.parse(
  `year,group,value
1990,18-34,16.9
1990,35-49,12.2`,
  { type: 'csv' }
);
```

### transform

A transform processes data. A `DataView` can run multiple transforms in sequence, passing each transform's output to the next. The `level` option controls their order.

```ts
export type Transform = (data: any, options?: any) => any;
```

Use the `statistics` transform registered above to average `value` by year. The output stores the year in `group` and the average in `avg`.

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

### Usage Examples

This example combines two CSV data sets that record the proportion of adults in a region who accept same-sex relationships. One covers adults under 50, and the other covers adults aged 50 and older. The bars show the proportions by age group, and the line shows the average for each year.

Install `@visactor/vchart` and `@visactor/vdataset`, and give the chart a container with a width and height, such as `<div id="chart" style="width: 640px; height: 360px"></div>`.

```js
import VChart from '@visactor/vchart';
import { DataSet, DataView, csvParser, dataViewParser, map, statistics } from '@visactor/vdataset';

const dataSet = new DataSet();
// Register the parsers and transforms. mergeDataView reads the latest rows from each dependency.
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

// Parse the two CSV data sets. All column values are strings at this stage.
const dataView1 = new DataView(dataSet, { name: 'dataView1' });
dataView1.parse(dataLess50, { type: 'csv' });
const dataView2 = new DataView(dataSet, { name: 'dataView2' });
dataView2.parse(dataOver50, { type: 'csv' });

// Merge the rows, then convert the value column to numbers for the chart.
const dataViewMerge = new DataView(dataSet, { name: 'dataViewMerge' });
dataViewMerge.parse([dataView1, dataView2], { type: 'dataview' });
dataViewMerge.transform({ type: 'mergeDataView' });
dataViewMerge.transform({
  type: 'map',
  options: { callback: row => ({ ...row, value: Number(row.value) }) }
});
// The first two merged rows:
// { year: '1990', group: '18-34', value: 16.9 }
// { year: '1990', group: '35-49', value: 12.2 }

// Read the merged rows and aggregate them by year. group holds the grouping key and avg holds the average.
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
// Statistics output:
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

With `@visactor/vdataset@1.0.29`, `statistics` also returns `max`, `min`, `average`, and `sum`. The line uses `group` and `avg`.

### Dependency Update

Replace either CSV data set with `dataView1.parseNewData(updatedCsv)` or `dataView2.parseNewData(updatedCsv)`. The dependent views run their transforms again, and the chart redraws with the updated merged rows and statistics.

Pass the same `DataSet` and relevant `DataView` instances to multiple charts to keep those charts in sync as the data changes.
