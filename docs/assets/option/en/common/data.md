{{ target: common-data }}

<!-- IData -->

${prefix} data(${dataType})

{{ if: ${isSeries} }}

Series data, the series can configure its own data or obtain data from spec.data. You can directly pass in a DataView instance, and object configuration is allowed.

{{ else }}

Chart data, can be a single piece of data or an array of data.

{{ /if }}

There are 2 types of chart data configuration supported.

- Data description format object: **IDataValues**
- Data object **DataView** in **Dataset**.

#${prefix} IDataValues

Data description structure supported by the chart

##${prefix} id(string|number)

User-defined ID. Default is not specified. If specified, it can be used for references in other modules of the chart.

{{ if: ${isHierarchy} }}

##${prefix} values(IHierarchyData)

Hierarchical data. Supports nested structure hierarchical data:

```ts
export type IHierarchyNodeData = {
  value?: number;
  children?: IHierarchyNodeData[];
} & Datum;

export type Datum = {
  [key: string]: any;
};
```

{{ else }}

##${prefix} values(string|Datum[])

Data value. Supports 2 types:

- **csv|dsv|tsv** format string.
- Array of data objects.

For the **csv|dsv|tsv** format string, you need to configure the **[parser](TODO:)** attribute to specify the format of the string.

{{ /if }}

##${prefix} fromDataId(string|number)

The current data references another piece of data in the data array as the original data, indexed by **id**. Data processing is done from front to back in the array order, please ensure that the dependent data is at the front of the array.

##${prefix} fromDataIndex(number)

The current data references another piece of data in the data array as the original data, indexed by **array index**. Data processing is done from front to back in the array order, please ensure that the dependent data is at the front of the array.

##${prefix} transform(BuildInTransformOptions[])

Data transformation. You can add transformations to the data. When the chart is finally used, it will use the data after the transformation.

Currently built-in data transformations:

- ~~simplify: Geographic data simplification~~
  **`simplify` transform is removed since version 1.11.0**
  You can directly set `simplify` option in `registerMap` API, for example:

  ```js
  VChart.registerMap('myMay', geojson, {
    simplify: {
      tolerance: 0.01
    }
  });
  ```

- fields: Data dimension processing, including dimension-based sorting, reverse order, data filtering capabilities

```ts
// type
export interface IFieldsMeta {
    type: 'ordinal' | 'linear'; // 维度类型，ordinal 为离散型，linear 为连续型。
    alias?: string; //  字段别名。
    domain?: any[]; // 当前维度的数值区间。在数值区间外的数据会被剔除。
    lockStatisticsByDomain?: boolean; // 是否使用 domain 锁定统计信息。默认为 false 。
    sortIndex?: number; // 当前维度的排序顺序，如果不设置，则不参与排序。可以多个维度按照此属性对数据进行排序。
    sortReverse?: boolean; // 当前维度在排序时是否逆序，只有在配置了 sortIndex 后才有效。默认为 false 。
}
type fieldType = {
  type: 'fields';
  options: {
      fields: {
        [key: string]: IFieldsMeta;
      }
  };
}
// example
const spec = {
  data: [
    {
      id: 'fieldsData',
      values: [
        {date: '1-2', value: '20', type: '利润'},
        {date: '1-3', value: '22', type: '利润'},
        {date: '1-4', value: '30', type: '销售额'},
        {date: '1-2', value: '220', type: '销售额'},
        {date: '1-3', value: '230', type: '销售额'},
        {date: '1-4', value: '-40', type: '销售额'}
      ],
      transform: [{
        type: 'fields',
        options: {
          fields: {
            date: {
              type: 'ordinal' // 数据维度 date 的类型是离散类型
              sortIndex: 1 // 数据会按照 date 进行排序
            },
            value: {
              type: 'linear' // 数据维度 value 的类型是连续类型
              domain: [0,10000] // 会提出 value 值不在 0-10000内的数据
            },
            type: {
              alias: '类型' // 数据维度 type 的别名。如果图例对应这个维度，那么图例的标题文本默认值将是 '类型' 。
            }
          }
        }
      }]
    }
  ]
}
// 最终数据
vchart.getDataSet().getDataView('fieldsData').latestData ===
[{date: '1-2', value: '20', type: '利润'},
{date: '1-2', value: '220', type: '销售额'},
{date: '1-3', value: '22', type: '利润'},
{date: '1-3', value: '230', type: '销售额'},
{date: '1-4', value: '30', type: '销售额'}]

```

- filter: Custom filtering using a callback

```ts
type filterType = {
  type: 'filter';
  options: {
    callback?: (item: any) => boolean; // 返回true的数据保留，返回false的数据剔除
  };
};
// example
const spec = {
  data: [
    {
      id: 'data',
      values: [
        // ...
      ],
      transform: [
        {
          type: 'filter',
          options: {
            callback: (datum: any) => {
              return true | false;
            }
          }
        }
      ]
    }
  ]
};
```

- IFoldOptions: Data expansion

```ts
type foldType = {
  type: 'fold';
  options: {
    fields: string[]; // 需要被展开的字段集
    key: string; // 展开后 fields 的内容被转化到 key 字段
    value: string; // 展开后对应数值转化到 value 字段
    retains?: string[]; // 保留字段集，默认为除 fields 以外的所有字段
  };
};
// example
const spec = {
  data: [
    {
      id: 'temperatureData',
      values: [
        { date: '周一', 最低: 18, 最高: 28 },
        { date: '周二', 最低: 19, 最高: 30 },
        { date: '周三', 最低: 20, 最高: 32 }
      ],
      transform: [
        {
          type: 'fold',
          options: {
            fields: string[('最低', '最高')],
            key: 'type',
            value: 'temperature'
          }
        }
      ]
    }
  ]
};
// 最终数据
vchart.getDataSet().getDataView('temperatureData').latestData ===
  [
    { date: '周一', type: '最低', temperature: 18 },
    { date: '周一', type: '最高', temperature: 28 },
    { date: '周二', type: '最低', temperature: 19 },
    { date: '周二', type: '最高', temperature: 30 },
    { date: '周三', type: '最低', temperature: 20 },
    { date: '周三', type: '最高', temperature: 32 }
  ];
```

##${prefix} fields(Object)

Considering that data dimension processing is quite common, a separate configuration item is provided. The content of this configuration will be converted to [transform.fieldsTransform](TODO:)

```ts
// type
type fields = {
  [key: string]: IFieldsMeta;
};
// example
const spec = {
  data: [
    {
      id: 'fieldsData',
      values: [
        {date: '1-2', value: '20', type: '利润'},
        {date: '1-3', value: '22', type: '利润'},
        {date: '1-4', value: '30', type: '销售额'},
        {date: '1-2', value: '220', type: '销售额'},
        {date: '1-3', value: '230', type: '销售额'},
        {date: '1-4', value: '-40', type: '销售额'}
      ],
      fields: {
        date: {
          type: 'ordinal' // 数据维度 date 的类型是离散类型
          sortIndex: 1 // 数据会按照 date 进行排序
        },
        value: {
          type: 'linear' // 数据维度 value 的类型是连续类型
          domain: [0,10000] // 会提出 value 值不在 0-10000内的数据
        },
        type: {
          alias: '类型' // 数据维度 type 的别名。如果图例对应这个维度，那么图例的标题文本默认值将是 '类型' 。
        }
      }
    }
  ]
}
// 最终数据
vchart.getDataSet().getDataView('fieldsData').latestData ===
  [
    {date: '1-2', value: '20', type: '利润'},
    {date: '1-2', value: '220', type: '销售额'},
    {date: '1-3', value: '22', type: '利润'},
    {date: '1-3', value: '230', type: '销售额'},
    {date: '1-4', value: '30', type: '销售额'}
  ]
```

##${prefix} parser(Object)

Starting from `1.3.0` version, `parser` supports `clone` property configuration, the default is `true`, which is used to configure whether the data needs to be cloned. If you consider performance, you can turn it off, but this will It has some side effects, that is, we will modify the incoming data (the original fields and values will not be modified, only some fields will be added based on the original data).

When the data content is a string, you can specify the parsing method by configuring the parser. It currently supports **csv|dsv|tsv** only.

```ts
type parser = {
  type: 'csv' | 'dsv' | 'tsv';
  options?: {
    // delimiter 必须是一个单字符。
    delimiter?: string; // 参数值默认为半角逗号，即默认将被处理文件视为 CSV , 当 delimiter='\t' 时，被处理文件就是TSV。
  };
  /**
   * Whether to clone the data, the default is true.
   * If you consider performance, you can turn it off, but this will have some side effects, that is, we will modify the incoming data (the original fields and values will not be modified, only some fields will be added based on the original data).
   * @default true
   * @since 1.3.0
   */
  clone?: boolean;
};
```

```ts
// example
const csvData = `date,最低,最高
周一,18,28
周二,19,30
周三,20,32
`;
const spec = {
  data: [
    {
      id: 'fieldsData',
      values: csvData,
      // parser 不配置的话，默认当做 csv 处理
      parser: {
        type: 'csv'
      }
    }
  ]
};
```

#${prefix} DataView

Using the data processing package [**@visactor/dataset**](TODO:).

The data processing package provides 2 core objects:

1. **DataSet** that manages the data set
2. Data object **DataView**

The usage example is as follows:

```ts
// 从包中导出需要的内容
import { DataSet, DataView, csvParser, fold } from '@visactor/dataset';

// 创建一个数据集
const dataSet = new DataSet();
// 注册数据 parser 和 transform。除了使用内置的 parser 和 transform 外，用户还可以按照接口自定义 parser 和 transform 。
dataSet.registerParser('csv', csvParser);
dataSet.registerTransform('fold', fold);
// 创建 dataView 。请务必设置数据集和名称，方便其他模块使用此数据
const dataView = new DataView(dataSet, { name: 'data' });
const csvData = `date,最低,最高
周一,18,28
周二,19,30
周三,20,32
`;
// 指定当前数据使用 csvParser 进行解析
dataView.parse(csvData, {
  type: 'csv'
});
// 添加 transform 处理数据
dataView.transform({
  type: 'fold',
  options: {
    fields: ['最低', '最高'], // 展开字段集
    key: 'type', // fields 内容转为到 key 字段
    value: 'value' // 对应数值转化到 value 字段
  }
});

// 最终数据
dataSet.getDataView('data').latestData ===
  [
    { date: '周一', type: '最低', temperature: 18 },
    { date: '周一', type: '最高', temperature: 28 },
    { date: '周二', type: '最低', temperature: 19 },
    { date: '周二', type: '最高', temperature: 30 },
    { date: '周三', type: '最低', temperature: 20 },
    { date: '周三', type: '最高', temperature: 32 }
  ];

// 在图表的数据中可以直接使用此对象
const spec: {
  data: [dataView];
  // ...
};
```
