# Map

[\[Configuration Item Manual\]](../../../option/mapChart)

## Introduction

A map is a type of chart that visualizes a data lake as a Region color or fill effect to display geographic location. Typically, map charts use administrative boundary layers or map tiles as the base map, and use color or fill levels to represent Region-specific data values.

## Chart composition

The map is mainly composed of elements such as path data and labels that resemble geographic Regions.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/b42a7699efcd4dfa8b8aa3a02.png)

The path primitive shaped like a geographic Region is the basic element of the map, and the relevant drawing configuration is essential:

- `mapChart.type`: Chart type, the type of map is`'map'`
- `mapChart.nameField`: Classification field, map the geographic Region represented by the path primitive
- `mapChart.valueField`: Numerical field, map the color of the path primitive

Since mapping Geographical Regions requires the support of map data, the configuration of map data is also essential:

- `VChart.registerMap(mapName, mapData)`: VChart provides an api for map data registration, where`mapName`Indicates the name of the registered map data,`mapData`Refers to the specific map data, the default is`geojson`Type map data, also supported`topojson` Type map data.
- `mapChart.map`: Specify to use the registered map data name

For more map related configurations, see[Map](../../../option/mapChart)

## Get started quickly

```javascript livedemo
const spec = {
  type: 'map',
  map: 'world'
};

const geosjonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json';

const response = await fetch(geosjonUrl);
const geojson = await response.json();

VChart.registerMap('world', geojson, {
  type: 'geojson'
});

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
vchart.renderSync();
```

## Map Features

### data

Two pieces of data are required in the map:

1.  Base map data
    The most basic element of the map chart is the map base map, and loading the map is divided into 3 steps:

- Get remote basemap data, such as:`await fetch(xxx)`
- Register map data such as:

```ts
VChart.registerMap('china', china_topojson, {
  type: 'topojson',
  object: 'china'
});
```

VChart provides api for map data registration`VChart.registerMap(mapName, mapData)`, in which`mapName`Indicates the name of the registered map data,`mapData`Refers to the specific map data, the default is`geojson`Type map data, also supported`topojson` Type map data as in the example below.

- Specify the use of registered map data names, such as`VChart.map: 'mapName'`

```javascript livedemo
const spec = {
  type: 'map',
  map: 'south-america',
  nameField: 'name',
  valueField: 'value',
  data: [
    {
      id: 'map',
      values: [
        {
          name: 'Peru',
          value: 247300
        },
        {
          name: 'Chile',
          value: 244500
        },
        {
          name: 'Brazil',

          value: 1993000
        },
        {
          name: 'Bolivia',
          value: 1653000
        },
        {
          name: 'Argentina',
          value: 1553000
        },
        {
          name: 'Paraguay',
          value: 1253000
        },
        {
          name: 'Venezuela',
          value: 1153000
        },
        {
          name: 'Colombia',
          value: 1053000
        }
      ]
    }
  ]
};

const topojsonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/topojson/south-america.json';

const response = await fetch(topojsonUrl);
const topojson = await response.json();

VChart.registerMap('south-america', topojson, {
  type: 'topojson',
  object: 'south-america'
});

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
vchart.renderSync();
```

2.  Meta map data

- one`地理维度`Field specifying the Region to be colored on the base map
- one`数值`Field used to map the specified visual channel such as shading depth
  Note: If the Region name in the incoming Geographic Dimension field does not correspond to the base map data, you need to pass`mapChart.nameMap`Specify.

### Specify nameMap

As mentioned above, if the Region name in the metadata map data does not correspond to the base map data, you need to pass`mapChart.nameMap`Specify.
For example in[Base map](../../../demo/map-chart/basic-map)In the example of, the Region name in the metadata map data does not have an administrative unit, but it is in the base map data, so it needs to be configured`mapChart.nameMap`.

### Custom Mapping

By default, the map uses discrete coloring to color each Region, that is, the color of each Region is not continuous. But in many scenarios, the map Region needs to represent the numerical size through the shading depth, so as to facilitate and quickly find outliers.
In VChart, this can be achieved by customizing the color map.

```ts
color: {
    type: 'linear',
    range: ['rgb(252,250,97)', 'rgb(252,150,134)', 'rgb(87,33,15)']
  }
```

```javascript livedemo
const spec = {
  type: 'map',
  map: 'south-america',
  nameField: 'name',
  valueField: 'value',
  color: {
    type: 'linear',
    range: ['rgb(252,250,97)', 'rgb(252,150,134)', 'rgb(87,33,15)']
  },
  area: {
    style: {
      fill: {
        scale: 'color',
        field: 'value',
        changeDomain: 'replace'
      }
    }
  },
  data: [
    {
      id: 'map',
      values: [
        {
          name: 'Peru',
          value: 247300
        },
        {
          name: 'Chile',
          value: 244500
        },
        {
          name: 'Brazil',

          value: 1993000
        },
        {
          name: 'Bolivia',
          value: 1653000
        },
        {
          name: 'Argentina',
          value: 1553000
        },
        {
          name: 'Paraguay',
          value: 1253000
        },
        {
          name: 'Venezuela',
          value: 1153000
        },
        {
          name: 'Colombia',
          value: 1053000
        }
      ]
    }
  ]
};

const topojsonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/topojson/south-america.json';

const response = await fetch(topojsonUrl);
const topojson = await response.json();

VChart.registerMap('south-america', topojson, {
  type: 'topojson',
  object: 'south-america'
});

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
vchart.renderSync();
```

### Custom projection

Can be configured in Map Region`projection: type`To configure the map projection type, you can refer to the specific configuration items[Configuration Item Document](../../../option/mapChart#region.projection.type).

```javascript livedemo
const spec = {
  type: 'map',
  map: 'world',
  nameField: 'name',
  valueFiled: 'value',
  region: [
    {
      projection: {
        type: 'equirectangular'
      }
    }
  ],
  data: [
    {
      name: 'source',
      values: [
        {
          name: 'China',
          value: 21197
        }
      ]
    }
  ]
};

const geosjonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json';

const response = await fetch(geosjonUrl);
const geojson = await response.json();

VChart.registerMap('world', geojson, {
  type: 'geojson'
});

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
vchart.renderSync();
```

### interaction

The map supports the interaction of zooming and dragging, which can be configured in the map Region`roam: true`Enable interaction, and the zoom size can also be configured through configuration.`zoomLimit`To limit:

```json
{
  "region": [
    {
      "roam": true,
      "coordinate": "geo",
      "zoomLimit": {
        "min": 1,
        "max": 6
      }
    }
  ]
}
```

Here is an example of a map zoom interaction:

```javascript livedemo
const spec = {
  type: 'map',
  map: 'world',
  nameField: 'name',
  valueFiled: 'value',
  region: [
    {
      roam: true,
      zoomLimit: {
        min: 1,
        max: 6
      },
      projection: {
        type: 'equirectangular'
      }
    }
  ],
  data: [
    {
      name: 'source',
      values: [
        {
          name: 'China',
          value: 21197
        }
      ]
    }
  ]
};

const geosjonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json';

const response = await fetch(geosjonUrl);
const geojson = await response.json();

VChart.registerMap('world', geojson, {
  type: 'geojson'
});

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
vchart.renderSync();
```
