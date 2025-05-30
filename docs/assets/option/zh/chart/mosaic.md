{{ target: chart-mosaic }}

# mosaic

马赛克图。
自从`1.12.0`版本。
注意: 在业务中使用时, 请额外引入 registerLiquidChart 并注册。
示例:

```ts
import { registerMosaicChart } from '@visactor/vchart';
registerMosaicChart();
```

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'mosaic'
) }}

{{ use: series-mosaic(
  prefix = '#',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true,
  noStack = true
) }}

## autoBandSize(boolean | Object)

是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize，从而影响轴实际长度。自 1.10.0 版本开始支持。

### extend(number)

根据 barWidth 计算出 bandSize，从而固定轴整体长度之后，添加的扩增值。单位为 px。

{{ use: chart-component(
  axisType = 'cartesian'
) }}
