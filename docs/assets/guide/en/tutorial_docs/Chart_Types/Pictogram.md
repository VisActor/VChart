# Pictogram

[\[Option Items\]](../../../option/pictogramChart)

## Introduction

Pictogram Charts are a form of chart that uses graphics, symbols, and images to represent data. Different from traditional numerical charts such as bar charts and line charts, pictogram-style charts present data in an image-based way, which is easier to understand and remember. This type of chart can emphasize the visual effect of data, allowing viewers to grasp the key information of the data more quickly.

### Chart Composition

The configuration of pictograms is somewhat similar to that of maps and mainly consists of the following components:

- svg materials
- data
  The data fields and data mappings of pictograms have the following configurations:
- `pictogramChart.type`: The chart type. The type of pictogram is `'pictogram'`.
- `pictogramChart.data`: The data source for chart drawing.
- `pictogramChart.nameField`: The field declared as the name property, used to associate with graphic elements in the SVG.
  A set of data is defined as follows:
- For more component configurations, see [VChart pictogramChart Configuration](../../../option/pictogramChart).

### Quick Start

```javascript livedemo
/** -- Please add the following code when using it in business -- */
// When using it in business, please additionally import registerPictogramChart and execute it.
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** -- Please add the above code when using it in business -- */
/** -- Please delete the following code when using it in business -- */
VCHART_MODULE.registerPictogramChart();
/** -- Please delete the above code when using it in business -- */
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

### Key Configurations

- `nameField`: The configuration of the field declared as the name, used to associate with graphic elements in the SVG.
- `valueField`: The configuration of the field declared as the value.
- `pictogram`: The style configuration of all graphic elements associated with the name. (The styles of other graphic elements are the same as those defined in the SVG and cannot be configured.)
  For elements with a specified name, their specified styles can be configured through the name. For example, in the following example, the regular and interactive styles of the rect graphic element can be set:

```javascript livedemo
/** -- Please add the following code when using it in business -- */
// When using it in business, please additionally import registerPictogramChart and execute it.
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** -- Please add the above code when using it in business -- */
/** -- Please delete the following code when using it in business -- */
VCHART_MODULE.registerPictogramChart();
/** -- Please delete the above code when using it in business -- */
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

For graphic elements with the same name, the style settings and interactions will take effect simultaneously. For example:

```javascript livedemo
/** -- Please add the following code when using it in business -- */
// When using it in business, please additionally import registerPictogramChart and execute it.
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** -- Please add the above code when using it in business -- */
/** -- Please delete the following code when using it in business -- */
VCHART_MODULE.registerPictogramChart();
/** -- Please delete the above code when using it in business -- */
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

### More Explanations

Pictograms are not included in the VChart by default. If you need to use them, please manually import pictograms.

```ts
import { registerPictogramChart } from '@visactor/vchart';
registerPictogramChart();
```
