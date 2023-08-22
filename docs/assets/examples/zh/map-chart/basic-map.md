---
category: examples
group: map chart
title: 基础地图
keywords: map,space,polygon
order: 11-0
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/map-chart/basic-map.png
option: mapChart
---

# 基础地图

## 关键配置

- 指定图表表类型`type: map`为地图
- `nameField` 指定分类字段
- `valueField` 指定值字段
- `VChart.registerMap(mapName, mapData)` 为 VChart 提供的地图数据注册的 api，默认为 geojson 类型地图数据，也支持 topojson 数据注册；
- `map: china` 指定使用注册的地图数据名称；
- `nameMap` 为地图数据中的地理名称与数据中的名称映射关系，用于地图数据与数据中的名称不一致时使用；

## 代码演示

```javascript livedemo
const spec = {
  type: 'map',
  map: 'china',
  nameField: 'name',
  valueField: 'value',
  legends: [
    {
      visible: true,
      type: 'size',
      field: 'value',
      orient: 'bottom',
      position: 'start',
      title: {
        visible: true,
        text: 'Population'
      }
    }
  ],
  color: {
    type: 'linear',
    range: ['rgb(252,250,97)', 'rgb(252,150,134)', 'rgb(87,33,15)']
  },
  area: {
    style: {
      fill: {
        field: 'value',
        scale: 'color',
        changeDomain: 'replace'
      }
    }
  },
  data: [
    {
      name: 'data',
      values: [
        {
          name: '北京',
          value: 21893095
        },
        {
          name: '天津',
          value: 13866009
        },
        {
          name: '河北',
          value: 74610235
        },
        {
          name: '山西',
          value: 34915616
        },
        {
          name: '内蒙古',
          value: 24049155
        },
        {
          name: '辽宁',
          value: 42591407
        },
        {
          name: '吉林',
          value: 24073453
        },
        {
          name: '黑龙江',
          value: 31850088
        },
        {
          name: '上海',
          value: 24870895
        },
        {
          name: '江苏',
          value: 84748016
        },
        {
          name: '浙江',
          value: 64567588
        },
        {
          name: '安徽',
          value: 61027171
        },
        {
          name: '福建',
          value: 41540086
        },
        {
          name: '江西',
          value: 45188635
        },
        {
          name: '山东',
          value: 101527453
        },
        {
          name: '河南',
          value: 99365519
        },
        {
          name: '湖北',
          value: 57752557
        },
        {
          name: '湖南',
          value: 66444864
        },
        {
          name: '广东',
          value: 126012510
        },
        {
          name: '广西',
          value: 50126804
        },
        {
          name: '海南',
          value: 10081232
        },
        {
          name: '重庆',
          value: 32054159
        },
        {
          name: '四川',
          value: 83674866
        },
        {
          name: '贵州',
          value: 38562148
        },
        {
          name: '云南',
          value: 47209277
        },
        {
          name: '西藏',
          value: 3648100
        },
        {
          name: '陕西',
          value: 39528999
        },
        {
          name: '甘肃',
          value: 25019831
        },
        {
          name: '青海',
          value: 5923957
        },
        {
          name: '宁夏',
          value: 7202654
        },
        {
          name: '新疆',
          value: 25852345
        },
        {
          name: '中国香港',
          value: 7474200
        },
        {
          name: '澳门',
          value: 683218
        },
        {
          name: '中国台湾',
          value: 23561236
        }
      ]
    }
  ],
  nameMap: {
    广东省: '广东',
    江苏省: '江苏',
    山东省: '山东',
    河南省: '河南',
    河北省: '河北',
    浙江省: '浙江',
    四川省: '四川',
    安徽省: '安徽',
    辽宁省: '辽宁',
    陕西省: '陕西',
    山西省: '山西',
    湖北省: '湖北',
    北京市: '北京',
    湖南省: '湖南',
    黑龙江省: '黑龙江',
    福建省: '福建',
    内蒙古自治区: '内蒙古',
    云南省: '云南',
    江西省: '江西',
    重庆市: '重庆',
    上海市: '上海',
    贵州省: '贵州',
    吉林省: '吉林',
    天津市: '天津',
    广西壮族自治区: '广西',
    甘肃省: '甘肃',
    新疆维吾尔自治区: '新疆',
    宁夏回族自治区: '宁夏',
    海南省: '海南',
    青海省: '青海',
    西藏自治区: '西藏',
    香港特别行政区: '中国香港',
    台湾省: '中国台湾',
    澳门特别行政区: '澳门'
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
if (VChart.getMap('china')) {
  vchart.renderAsync();
}
```

## 相关教程

[地图](link)
