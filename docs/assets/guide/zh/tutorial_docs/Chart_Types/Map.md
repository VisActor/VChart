# 地图

[\[配置项手册\]](../../../option/mapChart)

## 简介

地图是一种将数据可视化为区域颜色或填充效果以显示地理位置的图表类型。通常，地图图表会使用行政边界图层或地图瓦片作为基础地图，并使用颜色或填充级别来表示特定区域的数据值。

## 图表构成

地图主要由形似地理区域的 path 图元及标签等元素构成。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/b42a7699efcd4dfa8b8aa3a02.png)

形似地理区域的 path 图元为地图的基本要素，相关的绘制配置必不可少:

- `mapChart.type`: 图表类型，地图的类型为`'map'`
- `mapChart.nameField`: 分类字段，映射 path 图元所表示的地理区域
- `mapChart.valueField`: 数值字段，映射 path 图元的颜色

由于绘制地理区域需要地图数据的支持，所以地图数据的配置同样必不可少:

- `VChart.registerMap(mapName, mapData)`: VChart 提供地图数据注册的 api，其中`mapName`表示注册的地图数据名称，`mapData`指具体的地图数据，默认为`geojson`类型地图数据，也支持`topojson` 类型地图数据。
- `mapChart.map`: 指定使用注册的地图数据名称

更多地图相关配置见[地图](../../../option/mapChart)

## 快速上手

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

## 地图特性

### 数据

在地图中需要两份数据：

1. 地图底图数据
   地图图表的最基本元素是地图底图，加载地图分为 3 步：

- 获取远程底图数据，比如：`await fetch(xxx)`
- 注册地图数据，比如:

```ts
VChart.registerMap('china', china_topojson, {
  type: 'topojson',
  object: 'china'
});
```

VChart 提供地图数据注册的 api`VChart.registerMap(mapName, mapData)`，其中`mapName`表示注册的地图数据名称，`mapData`指具体的地图数据，默认为`geojson`类型地图数据，也支持`topojson` 类型地图数据，如下面的例子。

- 指定使用注册的地图数据名称，比如`VChart.map: 'mapName'`

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

2. 图元映射数据

- 一个`地理维度`字段，用于指定需要在底图上着色的区域
- 一个`数值`字段，用于映射着色的深浅等指定的视觉通道
  注意: 如果传入的地理维度字段中的区域名称与底图数据不对应，需要通过`mapChart.nameMap`指定。

### 指定 nameMap

正如上文所说，如果图元映射数据中的区域名称与底图数据不对应，需要通过`mapChart.nameMap`指定。
比如在[基础地图](../../../demo/map-chart/basic-map)的例子中，图元映射数据中的区域名称不带行政单位，但底图数据中是有的，所以需要配置`mapChart.nameMap`。

### 自定义映射

地图默认使用离散着色的方式对每个区域进行着色，也就是每个区域的颜色没有连续性。但在很多场景下，地图区域需要通过着色深浅来表示数值大小，从而方便快速找出异常值。
在 VChart 中，可以通过自定义颜色映射的方式达到这一目的。

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

### 自定义投影

可以在地图区域配置`projection: type`来配置地图投影类型，具体配置项可以参考[配置项文档](../../../option/mapChart#region.projection.type)。

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

### 交互

地图支持缩放和拖拽的交互，可以在地图区域配置`roam: true`开启交互，缩放大小也可以通过配置`zoomLimit`来限制：

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

下面是地图缩放交互的示例：

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
