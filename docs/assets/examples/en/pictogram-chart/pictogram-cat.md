---
category: examples
group: pictogram chart
title: Cat Stroking For Beginners
keywords: pictogramChart, space
order: 26-1
cover: /vchart/preview/pictogram-cat_1.13.0.png
option: pictogramChart
---

# SVG Cat Stroking For Beginners

Pictogram charts are a form of data visualization that represent specific values or categories in data using graphic symbols (usually in SVG format). This type of chart combines graphic art with data analysis, making the information more visually appealing and intuitive.

## Key Configurations

- Register SVG resources through the `VChart.registerSVG` interface;
- Declare the `svg` attribute as the registered SVG name.

## Code Demo

```javascript livedemo
/** --Add the following code when using in business context-- */
// When using in business context, please additionally import
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --Add the above code when using in business context-- */
VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */

const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pictogram/cat.svg');
const shape = await response.text();

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    values: [{ name: 'Yes', value: 'Love This' }, { name: 'So-so' }, { name: 'Forbidden' }, { name: 'Horror' }]
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'name',
  nameField: 'name',
  valueField: 'value',
  svg: 'cat',
  color: {
    specified: {
      Yes: '#009A00',
      'So-so': '#FEB202',
      Forbidden: '#FE3E00',
      Horror: '#FE2B09',
      undefined: 'white'
    }
  },
  interactions: [
    {
      type: 'element-active-by-legend',
      filterField: 'name'
    }
  ],
  pictogram: {
    style: {
      fill: {
        scale: 'color',
        field: 'name'
      }
    },
    state: {
      active: {
        fillOpacity: 0.8,
        stroke: {
          scale: 'color',
          field: 'name'
        },
        lineWidth: 2
      },
      hover: {
        fillOpacity: 0.8,
        stroke: {
          scale: 'color',
          field: 'name'
        },
        lineWidth: 2
      }
    }
  },
  title: { text: 'Cat Stroking For Beginners' },
  legends: { orient: 'top', filter: false }
};

VChart.registerSVG('cat', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials

[PictogramChart](link)
