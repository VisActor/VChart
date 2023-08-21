---
category: examples
group: marker
title: markLine 指定关联系列数据点
keywords: marker,commonChart
order: 33-4
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/marker/mark-line-ref-series.png
option: commonChart#markLine
---

# markLine 指定关联系列数据点

markLine 支持关联数据系列, 当用户配置的数据点分布在不同的系列时, 可以为指定每个数据点的关联系列.

## 关键配置

数据点定位:

- `coordinates`属性声明构建 markLine 标注线的数据点或数据聚合值数组时,
  数据点的声明中可以增加`refRelativeSeriesIndex`或 `refRelativeSeriesId`属性. 如`{ xKey: value , yKey: value, refRelativeSeriesIndex: value, refRelativeSeriesId: value }`, 其中`refRelativeSeriesIndex`表示关联系列的索引, `refRelativeSeriesId`表示关联系列的 ID, ID 优先级高于索引.

## 代码演示

```javascript livedemo
const spec = {
  type: 'common',
  layout: {
    type: 'grid',
    col: 2,
    row: 4,
    elements: [
      {
        modelId: 'DAU rate',
        col: 1,
        row: 0
      },
      {
        modelId: 'Active time',
        col: 1,
        row: 1
      },
      {
        modelId: 'Total number of active users',
        col: 1,
        row: 2
      },
      {
        modelId: 'DAU rateleft',
        col: 0,
        row: 0
      },
      {
        modelId: 'Active timeleft',
        col: 0,
        row: 1
      },
      {
        modelId: 'Total number of active usersleft',
        col: 0,
        row: 2
      },
      {
        modelId: 'Total number of active usersbottom',
        col: 1,
        row: 3
      }
    ]
  },
  region: [
    {
      id: 'DAU rate'
    },
    {
      id: 'Active time'
    },
    {
      id: 'Total number of active users'
    }
  ],
  series: [
    {
      id: 'DAU rateseries0',
      regionId: 'DAU rate',
      dataId: 'Deep use of user DAU rate',
      type: 'line',
      xField: ['x'],
      yField: 'y',
      seriesField: 'type'
    },
    {
      id: 'Active timeseries0',
      regionId: 'Active time',
      dataId: 'Active time per user in deep use',
      type: 'bar',
      xField: ['x', 'type'],
      yField: 'y',
      seriesField: 'type'
    },
    {
      id: 'Active timeseries1',
      regionId: 'Active time',
      type: 'bar',
      data: {
        id: 'Deep usage per user math study duration',
        values: [
          {
            x: 0,
            y: 32.4656226827,
            originXData: '2022-08-01',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 1,
            y: 0.5552382268,
            originXData: '2022-08-02',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 2,
            y: 1.4436532949,
            originXData: '2022-08-03',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 3,
            y: 3.1126381092,
            originXData: '2022-08-04',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 4,
            y: 1.1268964986,
            originXData: '2022-08-05',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 5,
            y: 0.5050388045,
            originXData: '2022-08-06',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 6,
            y: 4.0162738173,
            originXData: '2022-08-07',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 7,
            y: 0.9405286783000001,
            originXData: '2022-08-08',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 8,
            y: 3.0172404425,
            originXData: '2022-08-09',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 9,
            y: 7.2199749701,
            originXData: '2022-08-10',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 10,
            y: 2.0713092067,
            originXData: '2022-08-11',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 11,
            y: 0.1454215003,
            originXData: '2022-08-12',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 12,
            y: 0.34810792,
            originXData: '2022-08-13',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 13,
            y: 21.3149621065,
            originXData: '2022-08-14',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 14,
            y: 1.4820634174,
            originXData: '2022-08-15',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 15,
            y: 0.2719140554,
            originXData: '2022-08-16',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 16,
            y: 2.3799150001,
            originXData: '2022-08-17',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 17,
            y: 0.1894116861,
            originXData: '2022-08-18',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 18,
            y: 0.8476751264,
            originXData: '2022-08-19',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 19,
            y: 0.48242238330000003,
            originXData: '2022-08-20',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 20,
            y: 0.1947340727,
            originXData: '2022-08-21',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 21,
            y: 1.1067963307,
            originXData: '2022-08-22',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 22,
            y: 1.3933568114,
            originXData: '2022-08-23',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 23,
            y: 0.7905690988,
            originXData: '2022-08-24',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 24,
            y: 0.9146571015,
            originXData: '2022-08-25',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 25,
            y: 2.1289279778,
            originXData: '2022-08-26',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 26,
            y: 0.9739281597,
            originXData: '2022-08-27',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 27,
            y: 1.3985377548,
            originXData: '2022-08-28',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 28,
            y: 0.537922157,
            originXData: '2022-08-29',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 29,
            y: 0.46251733580000004,
            originXData: '2022-08-30',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 30,
            y: 1.3731678133,
            originXData: '2022-08-31',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 31,
            y: 1.1320447771,
            originXData: '2022-09-01',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 32,
            y: 0.6291209618,
            originXData: '2022-09-02',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 33,
            y: 0.5274874441,
            originXData: '2022-09-03',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 34,
            y: 4.7935580273,
            originXData: '2022-09-04',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 35,
            y: 0.9341368829000001,
            originXData: '2022-09-05',
            type: 'Deep usage per user math study duration'
          },
          {
            x: 36,
            y: 2.3758769585,
            originXData: '2022-09-06',
            type: 'Deep usage per user math study duration'
          }
        ]
      },
      xField: ['x', 'type'],
      yField: 'y',
      seriesField: 'type'
    },
    {
      id: 'Total number of active usersseries0',
      regionId: 'Total number of active users',
      dataId: 'Total number of active users',
      type: 'line',
      xField: ['x'],
      yField: 'y',
      seriesField: 'type'
    }
  ],
  axes: [
    {
      grid: {
        visible: true,
        style: {
          lineDash: [2, 2]
        }
      },
      id: 'DAU rateleft',
      regionId: 'DAU rate',
      seriesId: ['DAU rateseries0'],
      orient: 'left',
      range: {
        min: 0,
        max: 34.5055333688
      },
      tick: {
        visible: false
      },
      forceTickCount: 3
    },
    {
      grid: {
        visible: true,
        style: {
          lineDash: [2, 2]
        }
      },
      id: 'Active timeleft',
      regionId: 'Active time',
      seriesId: ['Active timeseries0', 'Active timeseries1'],
      orient: 'left',
      range: {
        min: 0,
        max: 32.4656226827
      },
      tick: {
        visible: false
      },
      forceTickCount: 3
    },
    {
      grid: {
        visible: true,
        style: {
          lineDash: [2, 2]
        }
      },
      id: 'Total number of active usersleft',
      regionId: 'Total number of active users',
      seriesId: ['Total number of active usersseries0'],
      orient: 'left',
      range: {
        min: 0,
        max: 4053
      },
      tick: {
        visible: false
      },
      forceTickCount: 3
    },
    {
      id: 'Total number of active usersbottom',
      regionId: ['DAU rate', 'Active time', 'Total number of active users'],
      orient: 'bottom',
      label: {
        firstVisible: true,
        lastVisible: true,
        visible: true
      },
      tick: {
        visible: false
      }
    }
  ],
  markLine: [
    {
      coordinates: [
        { x: 2, y: 15, refRelativeSeriesId: 'DAU rateseries0' },
        { x: 8, y: 10, refRelativeSeriesId: 'Total number of active usersseries0' }
      ]
    }
  ],
  data: [
    {
      id: 'Deep use of user DAU rate',
      values: [
        {
          x: 0,
          y: 0.4384762505,
          originXData: '2022-08-01',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 1,
          y: 34.5055333688,
          originXData: '2022-08-02',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 2,
          y: 16.5189204722,
          originXData: '2022-08-03',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 3,
          y: 7.2681771912,
          originXData: '2022-08-04',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 4,
          y: 20.075672734,
          originXData: '2022-08-05',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 5,
          y: 20.075672734,
          originXData: '2022-08-06',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 6,
          y: 7.2681771912,
          originXData: '2022-08-07',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 7,
          y: 16.1287204022,
          originXData: '2022-08-08',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 8,
          y: 9.3422975894,
          originXData: '2022-08-09',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 9,
          y: 1.8136225235,
          originXData: '2022-08-10',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 10,
          y: 14.5715901472,
          originXData: '2022-08-11',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 11,
          y: 6.8325998786,
          originXData: '2022-08-12',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 12,
          y: 23.5616379458,
          originXData: '2022-08-13',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 13,
          y: 1.0948417472,
          originXData: '2022-08-14',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 14,
          y: 22.1355598163,
          originXData: '2022-08-15',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 15,
          y: 15.2996959776,
          originXData: '2022-08-16',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 16,
          y: 2.4856271694,
          originXData: '2022-08-17',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 17,
          y: 22.1355598163,
          originXData: '2022-08-18',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 18,
          y: 33.9041478366,
          originXData: '2022-08-19',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 19,
          y: 10.0719470274,
          originXData: '2022-08-20',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 20,
          y: 32.9413035888,
          originXData: '2022-08-21',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 21,
          y: 29.942335273,
          originXData: '2022-08-22',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 22,
          y: 17.4256097561,
          originXData: '2022-08-23',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 23,
          y: 1.7212070789,
          originXData: '2022-08-24',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 24,
          y: 21.5984819213,
          originXData: '2022-08-25',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 25,
          y: 15.4113885394,
          originXData: '2022-08-26',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 26,
          y: 15.4113885394,
          originXData: '2022-08-27',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 27,
          y: 18.3841937372,
          originXData: '2022-08-28',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 28,
          y: 18.3841937372,
          originXData: '2022-08-29',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 29,
          y: 18.3841937372,
          originXData: '2022-08-30',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 30,
          y: 22.4698864164,
          originXData: '2022-08-31',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 31,
          y: 20.432927062,
          originXData: '2022-09-01',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 32,
          y: 15.5161507751,
          originXData: '2022-09-02',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 33,
          y: 14.7165986868,
          originXData: '2022-09-03',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 34,
          y: 5.9399681276,
          originXData: '2022-09-04',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 35,
          y: 29.0753736462,
          originXData: '2022-09-05',
          type: 'Deep use of user DAU rate'
        },
        {
          x: 36,
          y: 14.2242265758,
          originXData: '2022-09-06',
          type: 'Deep use of user DAU rate'
        }
      ]
    },
    {
      id: 'Active time per user in deep use',
      values: [
        {
          x: 0,
          y: 11.4706453569,
          originXData: '2022-08-01',
          type: 'Active time per user in deep use'
        },
        {
          x: 1,
          y: 1.0113886479,
          originXData: '2022-08-02',
          type: 'Active time per user in deep use'
        },
        {
          x: 2,
          y: 0.6261438656,
          originXData: '2022-08-03',
          type: 'Active time per user in deep use'
        },
        {
          x: 3,
          y: 1.2594126034,
          originXData: '2022-08-04',
          type: 'Active time per user in deep use'
        },
        {
          x: 4,
          y: 1.110347076,
          originXData: '2022-08-05',
          type: 'Active time per user in deep use'
        },
        {
          x: 5,
          y: 1.7606185008000002,
          originXData: '2022-08-06',
          type: 'Active time per user in deep use'
        },
        {
          x: 6,
          y: 3.1996649894,
          originXData: '2022-08-07',
          type: 'Active time per user in deep use'
        },
        {
          x: 7,
          y: 1.8309153124000002,
          originXData: '2022-08-08',
          type: 'Active time per user in deep use'
        },
        {
          x: 8,
          y: 1.6276907644,
          originXData: '2022-08-09',
          type: 'Active time per user in deep use'
        },
        {
          x: 9,
          y: 2.0344430598,
          originXData: '2022-08-10',
          type: 'Active time per user in deep use'
        },
        {
          x: 10,
          y: 1.8143243486,
          originXData: '2022-08-11',
          type: 'Active time per user in deep use'
        },
        {
          x: 11,
          y: 2.3653753082,
          originXData: '2022-08-12',
          type: 'Active time per user in deep use'
        },
        {
          x: 12,
          y: 0.8402003552,
          originXData: '2022-08-13',
          type: 'Active time per user in deep use'
        },
        {
          x: 13,
          y: 12.2934695311,
          originXData: '2022-08-14',
          type: 'Active time per user in deep use'
        },
        {
          x: 14,
          y: 0.1023576737,
          originXData: '2022-08-15',
          type: 'Active time per user in deep use'
        },
        {
          x: 15,
          y: 0.8511935553000001,
          originXData: '2022-08-16',
          type: 'Active time per user in deep use'
        },
        {
          x: 16,
          y: 10.1146320918,
          originXData: '2022-08-17',
          type: 'Active time per user in deep use'
        },
        {
          x: 17,
          y: 0.1586464168,
          originXData: '2022-08-18',
          type: 'Active time per user in deep use'
        },
        {
          x: 18,
          y: 0.1545275253,
          originXData: '2022-08-19',
          type: 'Active time per user in deep use'
        },
        {
          x: 19,
          y: 1.1788916147,
          originXData: '2022-08-20',
          type: 'Active time per user in deep use'
        },
        {
          x: 20,
          y: 0.6540454701,
          originXData: '2022-08-21',
          type: 'Active time per user in deep use'
        },
        {
          x: 21,
          y: 0.327335478,
          originXData: '2022-08-22',
          type: 'Active time per user in deep use'
        },
        {
          x: 22,
          y: 0.4438853958,
          originXData: '2022-08-23',
          type: 'Active time per user in deep use'
        },
        {
          x: 23,
          y: 19.1209711562,
          originXData: '2022-08-24',
          type: 'Active time per user in deep use'
        },
        {
          x: 24,
          y: 0.23479017370000002,
          originXData: '2022-08-25',
          type: 'Active time per user in deep use'
        },
        {
          x: 25,
          y: 0.2585826425,
          originXData: '2022-08-26',
          type: 'Active time per user in deep use'
        },
        {
          x: 26,
          y: 0.44290894680000004,
          originXData: '2022-08-27',
          type: 'Active time per user in deep use'
        },
        {
          x: 27,
          y: 1.0068737375,
          originXData: '2022-08-28',
          type: 'Active time per user in deep use'
        },
        {
          x: 28,
          y: 0.5147067161000001,
          originXData: '2022-08-29',
          type: 'Active time per user in deep use'
        },
        {
          x: 29,
          y: 1.4896572078,
          originXData: '2022-08-30',
          type: 'Active time per user in deep use'
        },
        {
          x: 30,
          y: 0.0596243413,
          originXData: '2022-08-31',
          type: 'Active time per user in deep use'
        },
        {
          x: 31,
          y: 0.7171793368,
          originXData: '2022-09-01',
          type: 'Active time per user in deep use'
        },
        {
          x: 32,
          y: 0.6769330853000001,
          originXData: '2022-09-02',
          type: 'Active time per user in deep use'
        },
        {
          x: 33,
          y: 1.4653552176,
          originXData: '2022-09-03',
          type: 'Active time per user in deep use'
        },
        {
          x: 34,
          y: 3.2344905318,
          originXData: '2022-09-04',
          type: 'Active time per user in deep use'
        },
        {
          x: 35,
          y: 0.4517085496,
          originXData: '2022-09-05',
          type: 'Active time per user in deep use'
        },
        {
          x: 36,
          y: 0.7326924535,
          originXData: '2022-09-06',
          type: 'Active time per user in deep use'
        }
      ]
    },
    {
      id: 'Total number of active users',
      values: [
        {
          x: 0,
          y: 196,
          originXData: '2022-08-01',
          type: 'Total number of active users'
        },
        {
          x: 1,
          y: 683,
          originXData: '2022-08-02',
          type: 'Total number of active users'
        },
        {
          x: 2,
          y: 1115,
          originXData: '2022-08-03',
          type: 'Total number of active users'
        },
        {
          x: 3,
          y: 781,
          originXData: '2022-08-04',
          type: 'Total number of active users'
        },
        {
          x: 4,
          y: 993,
          originXData: '2022-08-05',
          type: 'Total number of active users'
        },
        {
          x: 5,
          y: 997,
          originXData: '2022-08-06',
          type: 'Total number of active users'
        },
        {
          x: 6,
          y: 103,
          originXData: '2022-08-07',
          type: 'Total number of active users'
        },
        {
          x: 7,
          y: 827,
          originXData: '2022-08-08',
          type: 'Total number of active users'
        },
        {
          x: 8,
          y: 1256,
          originXData: '2022-08-09',
          type: 'Total number of active users'
        },
        {
          x: 9,
          y: 1197,
          originXData: '2022-08-10',
          type: 'Total number of active users'
        },
        {
          x: 10,
          y: 657,
          originXData: '2022-08-11',
          type: 'Total number of active users'
        },
        {
          x: 11,
          y: 440,
          originXData: '2022-08-12',
          type: 'Total number of active users'
        },
        {
          x: 12,
          y: 1343,
          originXData: '2022-08-13',
          type: 'Total number of active users'
        },
        {
          x: 13,
          y: 245,
          originXData: '2022-08-14',
          type: 'Total number of active users'
        },
        {
          x: 14,
          y: 1459,
          originXData: '2022-08-15',
          type: 'Total number of active users'
        },
        {
          x: 15,
          y: 742,
          originXData: '2022-08-16',
          type: 'Total number of active users'
        },
        {
          x: 16,
          y: 1096,
          originXData: '2022-08-17',
          type: 'Total number of active users'
        },
        {
          x: 17,
          y: 603,
          originXData: '2022-08-18',
          type: 'Total number of active users'
        },
        {
          x: 18,
          y: 625,
          originXData: '2022-08-19',
          type: 'Total number of active users'
        },
        {
          x: 19,
          y: 477,
          originXData: '2022-08-20',
          type: 'Total number of active users'
        },
        {
          x: 20,
          y: 557,
          originXData: '2022-08-21',
          type: 'Total number of active users'
        },
        {
          x: 21,
          y: 1621,
          originXData: '2022-08-22',
          type: 'Total number of active users'
        },
        {
          x: 22,
          y: 734,
          originXData: '2022-08-23',
          type: 'Total number of active users'
        },
        {
          x: 23,
          y: 888,
          originXData: '2022-08-24',
          type: 'Total number of active users'
        },
        {
          x: 24,
          y: 493,
          originXData: '2022-08-25',
          type: 'Total number of active users'
        },
        {
          x: 25,
          y: 1800,
          originXData: '2022-08-26',
          type: 'Total number of active users'
        },
        {
          x: 26,
          y: 79,
          originXData: '2022-08-27',
          type: 'Total number of active users'
        },
        {
          x: 27,
          y: 2620,
          originXData: '2022-08-28',
          type: 'Total number of active users'
        },
        {
          x: 28,
          y: 2566,
          originXData: '2022-08-29',
          type: 'Total number of active users'
        },
        {
          x: 29,
          y: 2514,
          originXData: '2022-08-30',
          type: 'Total number of active users'
        },
        {
          x: 30,
          y: 1431,
          originXData: '2022-08-31',
          type: 'Total number of active users'
        },
        {
          x: 31,
          y: 3108,
          originXData: '2022-09-01',
          type: 'Total number of active users'
        },
        {
          x: 32,
          y: 4053,
          originXData: '2022-09-02',
          type: 'Total number of active users'
        },
        {
          x: 33,
          y: 1863,
          originXData: '2022-09-03',
          type: 'Total number of active users'
        },
        {
          x: 34,
          y: 2588,
          originXData: '2022-09-04',
          type: 'Total number of active users'
        },
        {
          x: 35,
          y: 2855,
          originXData: '2022-09-05',
          type: 'Total number of active users'
        },
        {
          x: 36,
          y: 10,
          originXData: '2022-09-06',
          type: 'Total number of active users'
        }
      ]
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[scrollBar](link)
