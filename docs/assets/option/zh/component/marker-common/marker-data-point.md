{{ target: component-marker-data-point }}

#${prefix} [key(string | number)](string | number)

数据字段及数据值配置，支持：

1. 直接配置数据值，如 `{ x: 'A', y: 123 }`，其中 `'x'`, `'y'` 为原始数据集中对应的数据字段
2. 对于数值类型的字段，也可以配置聚合方式，如：`{ x: 'A', y: 'sum' }`，聚合方式支持如下：
   可选值：

   - 'sum'
   - 'average'
   - 'min'
   - 'max'
   - 'variance'
   - 'standardDeviation'
   - 'median'

3. 回调函数（自 `1.7.3` 版本开始支持），当你期望你的标注位置是动态的，你可以为对应的数据字段配置回调，然后在回调函数中根据你的需求进行处理，回调参数如下：

```ts
// relativeSeriesData 为标注关联的系列的数据集
// relativeSeries 为标注关联的系列实例
export type IDataPointCallback = (relativeSeriesData: Datum[], relativeSeries: ICartesianSeries) => StringOrNumber;
```

`example`:

```ts
coordinates: [
  {
    x: (data, series) => {
      const scale = series.getXAxisHelper().getScale(0);
      console.log(scale.domain());

      return scale.domain()[1];
    },
    y: (data, series) => {
      const scale = series.getYAxisHelper().getScale();
      console.log(scale.domain());

      return scale.domain()[1];
    }
  }
];
```

#${prefix} refRelativeSeriesIndex(number)

具体某个数据元素关联的 series 索引（仅在标注目标：数据元素下有效）。

#${prefix} refRelativeSeriesId(string)

具体某个数据元素关联的 series ID（仅在标注目标：数据元素下有效）。

#${prefix} xFieldIndex(number) = 0

自 `1.7.0` 版本开始支持，用于指定使用 xField 上的那个维度索引，因为 xField 字段有可能会包含多个维度，比如分组场景。默认值为 0。

#${prefix} xFieldDim(string)

自 `1.7.0` 版本开始支持，指定使用 xField 上的维度名称，因为 xField 字段有可能会包含多个维度，比如分组场景。

`xFieldIndex` 和 `xFieldDim` 声明一个即可，同时声明则 `xFieldDim` 优先级更高。

#${prefix} yFieldIndex(number) = 0

自 `1.7.0` 版本开始支持，指定使用 yField 上的那个维度索引，因为 yField 字段有可能会包含多个维度，比如分组场景。默认值为 0。

#${prefix} yFieldDim(string)

自 `1.7.0` 版本开始支持，指定使用 yField 上的维度名称，因为 yField 字段有可能会包含多个维度，比如分组场景。

`yFieldIndex` 和 `yFieldDim` 声明一个即可，同时声明则 `yFieldDim` 优先级更高。
