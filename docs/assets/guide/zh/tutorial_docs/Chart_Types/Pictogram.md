# 象形图

[\[配置项\]](../../../option/pictogramChart)

## 简介

象形图（Pictogram Charts）是一种使用图形、符号和图像来表示数据的图表形式。与传统的条形图、折线图等数值图表不同，象形图式图表通过图像化的方式呈现数据，更容易理解和记忆。这种图表可以强调数据的视觉效果，使观众更快速地抓住数据的关键信息。

### 图表构成

象形图的配置方式与地图有一些类似，主要由以下组件构成：

- svg 素材
- 数据

象形图的数据字段及数据映射有如下配置：

- `pictogramChart.type`: 图表类型，象形图的类型为`'pictogram'`
- `pictogramChart.data`: 图表绘制的数据源
- `pictogramChart.nameField` 属性声明为名称的字段，用于与 SVG 中的图形元素进行关联

一组数据定义如下：

- 更多组件配置见[VChart pictogramChart 配置](../../../option/pictogramChart)

### 快速上手

```javascript livedemo
/** --在业务中使用时请添加以下代码-- */
// 在业务中使用时, 请额外引入 registerPictogramChart 并执行
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --在业务中使用时请添加以上代码-- */

/** --在业务中使用时请删除以下代码-- */
VCHART_MODULE.registerPictogramChart();
/** --在业务中使用时请删除以上代码-- */
const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pictogram/shapes.svg');
const shape = await response.text();

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    values: []
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'name',
  nameField: 'name',
  valueField: 'value',
  svg: 'shapes'
};

VChart.registerSVG('shapes', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

### 关键配置

- `nameField` 属性声明为名称字段配置，用于与 SVG 中的图形元素进行关联
- `valueField` 属性声明为值字段配置
- `pictogram` 所有关联了 name 的图元的样式配置。（其他图元的样式与 SVG 定义一致，无法配置）

对于有指定 name 的元素，可以通过名称配置其指定样式，例如下面这个例子，可以对 rect 图元进行常规和交互的样式设置：

```javascript livedemo
/** --在业务中使用时请添加以下代码-- */
// 在业务中使用时, 请额外引入 registerPictogramChart 并执行
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --在业务中使用时请添加以上代码-- */

/** --在业务中使用时请删除以下代码-- */
VCHART_MODULE.registerPictogramChart();
/** --在业务中使用时请删除以上代码-- */
const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pictogram/shapes.svg');
const shape = await response.text();

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    values: [
      {
        name: 'rect',
        value: 1
      },
      {
        name: 'circle',
        value: 2
      },
      {
        name: 'ellipse',
        value: 3
      },
      {
        name: 'line',
        value: 4
      },
      {
        name: 'polyline',
        value: 5
      },
      {
        name: 'polygon',
        value: 6
      },
      {
        name: 'path',
        value: 7
      },
      {
        name: 'text',
        value: 8
      }
    ]
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'name',
  nameField: 'name',
  valueField: 'value',
  svg: 'shapes',
  rect: {
    style: { fill: 'red' },
    state: {
      hover: { fillOpacity: 0.5, stroke: 'yellow', lineWidth: 2 }
    }
  }
};

VChart.registerSVG('shapes', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

对于拥有相同名称的图元，在样式设置、交互时会同时生效，例如：

```javascript livedemo
/** --在业务中使用时请添加以下代码-- */
// 在业务中使用时, 请额外引入 registerPictogramChart 并执行
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --在业务中使用时请添加以上代码-- */

/** --在业务中使用时请删除以下代码-- */
VCHART_MODULE.registerPictogramChart();
/** --在业务中使用时请删除以上代码-- */
const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pictogram/shapes-two-rect.svg');
const shape = await response.text();

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    values: []
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'name',
  nameField: 'name',
  valueField: 'value',
  svg: 'shapes-two-rect',
  rect: {
    style: { fill: 'red' },
    state: {
      hover: { fillOpacity: 0.5, stroke: 'yellow', lineWidth: 2 }
    }
  }
};

VChart.registerSVG('shapes-two-rect', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

### 更多说明

象形图没有在 VChart 默认引入，如需使用，请手动引入象形图。

```ts
import { registerPictogramChart } from '@visactor/vchart';
registerPictogramChart();
```
