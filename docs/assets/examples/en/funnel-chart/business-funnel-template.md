---
category: examples
group: funnel chart
title: 业务漏斗图模版
keywords: funnelChart,composition,trend,custom,template,customMark
cover: /vchart/preview/funnel-business-template-1.0.png
option: funnelChart
---

# Business Funnel Template

## Demo source

```javascript livedemo
const spec = {
  type: 'common',
  padding: { bottom: 300, top: 0 },
  height: 600,
  color: {
    type: 'ordinal',
    range: ['#4E91FF', '#8FC7FF', '#AEE2FF']
  },
  data: [
    {
      id: 'funnel',
      values: [
        { label: '进入直播间人数', value: 10000, attach: '万', average: 2000, percent: 1 },
        { label: '商品曝光人数', value: 9000, attach: '万', average: 1000, percent: 0.9 },
        { label: '商品点击人数', value: 5000, attach: '万', average: 500, percent: 0.5 },
        { label: '创建订单人数', value: 2000, attach: '万', average: 200, percent: 0.2 }
      ]
    }
  ],
  series: [
    {
      type: 'funnel',
      isTransform: true,
      heightRatio: 1,
      gap: 2,
      maxSize: '60%',
      shape: 'rect',
      categoryField: 'label',
      valueField: 'value',
      funnelOrient: 'left',
      funnelAlign: 'bottom',
      funnel: {
        style: {
          cornerRadius: 4,
          stroke: 'white',
          lineWidth: 2
        },
        state: {
          hover: {
            stroke: '#4e83fd',
            lineWidth: 1
          }
        }
      },
      transform: {
        style: {
          fill: '#A7C6ED',
          stroke: 'white',
          strokeWidth: 6,
          fillOpacity: 0.5
        },
        state: {
          hover: {
            stroke: '#4e83fd',
            strokeWidth: 1
          }
        },
        interactive: true,
        visible: true,
        zIndex: 1
      },
      transformLabel: {
        visible: true,
        style: {
          text: datum => {
            return `${(-(1 - datum.percent) * 100).toFixed(2)}%`;
          }
        }
      },
      outerLabel: {
        visible: true,
        fontWeight: 'bold',
        line: { visible: false },
        formatMethod: (label, datum) => datum.label,
        style: {
          fontSize: 18,
          fill: 'black',
          limit: Infinity,
          y: (data, ctx) => {
            const { getPoints } = ctx;
            const [tl, tr, br, bl] = getPoints(data);
            return tl.y + 20;
          }
        }
      },
      extensionMark: [
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const curIndex = data.findIndex(d => d.label === datum.label);

              if (curIndex === 0) return '100%';

              const prevValue = data[curIndex - 1].value;
              const currentValue = datum.value;

              const percent = (currentValue / prevValue) * 100;
              return `${percent.toFixed(2)}%`;
            },
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'black',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 70;
            },
            y: 70
          }
        },
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const curIndex = data.findIndex(d => d.label === datum.label);

              if (curIndex === 0) return ' ';

              const prevValue = data[curIndex - 1].value;
              const currentValue = datum.value;

              const percent = (currentValue / prevValue) * 100;
              const prevPercent = data[curIndex - 1].percent * 100;

              const percentDifference = percent - prevPercent;

              return `${percentDifference.toFixed(2)}%`;
            },
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'green',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 - 70;
            },
            y: 70
          }
        },
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: data => data.value,
            fontSize: 15,
            fill: 'grey',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 70;
            },
            y: 100
          }
        },
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const curIndex = data.findIndex(d => d.label === datum.label);

              if (curIndex === data.length - 1) return '';

              const currentValue = datum.value;
              const nextValue = data[curIndex + 1].value;

              const valueDifference = currentValue - nextValue;

              return valueDifference.toFixed(2);
            },
            fontSize: 15,
            fill: 'grey',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 220;
            },
            y: 100
          }
        },
        //箭头
        {
          type: 'symbol',
          dataId: 'funnel',
          style: {
            visible: true,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 - 60;
            },
            y: 325,
            size: 18,
            scaleX: 0.8,
            symbolType: 'arrow2Right',
            cornerRadius: 5,
            fill: 'rgb(200,200,200)'
          }
        },
        //箭头尾巴
        {
          type: 'symbol',
          dataId: 'funnel',
          style: {
            visible: true,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 - 70;
            },
            y: 325,
            size: 15,
            scaleX: 0.8,
            symbolType: 'roundLine',
            lineWidth: 3,
            cornerRadius: 0,
            stroke: 'rgb(200,200,200)'
          }
        },
        //矩形-转化层的背景
        {
          type: 'rect',
          dataId: 'funnel',
          style: {
            fill: 'rgb(200,200,200)',
            fillOpacity: 0.1,
            width: 148,
            height: 300,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 - 148;
            },
            y: 45
          }
        },
        //矩形-跨层指标背景1
        {
          type: 'rect',
          dataId: 'funnel',
          zIndex: 0,
          state: {
            hover: {
              outerBorder: {
                stroke: 'rgb(11,136,245)',
                lineWidth: 1,
                strokeOpacity: 1,
                distance: 2
              },
              fill: 'rgb(11,136,245)',
              fillOpacity: 0.05
            }
          },
          style: {
            fill: 'rgb(249,249,251)',
            fillOpacity: 0.1,
            width: 330,
            height: 100,
            x: 5,
            y: 370
          }
        },
        //矩形-跨层指标背景2
        {
          type: 'rect',
          dataId: 'funnel',
          zIndex: 0,
          state: {
            hover: {
              outerBorder: {
                stroke: 'rgb(11,136,245)',
                lineWidth: 1,
                strokeOpacity: 1,
                distance: 2
              },
              fill: 'rgb(11,136,245)',
              fillOpacity: 0.05
            }
          },
          style: {
            fill: 'rgb(249,249,251)',
            fillOpacity: 0.1,
            width: 330,
            height: 100,
            x: 338,
            y: 370
          }
        },
        //多边形-朝上的半开矩形-第二个跨层指标指向线
        {
          type: 'polygon',
          dataId: 'funnel',
          style: {
            points: (datum, ctx, params, dataView) => {
              const rectanglePoints = [
                { x: 80, y: 340 },
                { x: 80, y: 360 },
                { x: 650, y: 360 },
                { x: 650, y: 340 }
              ];
              return rectanglePoints;
            },
            cornerRadius: 5,
            stroke: 'rgb(11,136,245)',
            lineWidth: 2,
            strokeOpacity: 0.2,
            closePath: false,
            pickable: false
          }
        },
        //第二个跨层指标指向线尾巴
        {
          type: 'line',
          dataId: 'funnel',
          style: {
            points: (datum, ctx, params, dataView) => {
              const lineX = 500;
              const lineStart = { x: lineX, y: 360 };
              const lineEnd = { x: lineX, y: 370 };
              return [lineStart, lineEnd];
            },
            stroke: 'rgb(11,136,245)',
            lineWidth: 2,
            pickable: false
          }
        },
        //矩形-跨层指标背景3
        {
          type: 'rect',
          dataId: 'funnel',
          zIndex: 0,
          state: {
            hover: {
              outerBorder: {
                stroke: 'rgb(11,136,245)',
                lineWidth: 1,
                strokeOpacity: 1,
                distance: 2
              },
              fill: 'rgb(11,136,245)',
              fillOpacity: 0.05
            }
          },
          style: {
            fill: 'rgb(249,249,251)',
            fillOpacity: 0.1,
            width: 330,
            height: 100,
            x: 670,
            y: 370
          }
        },
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: '跨层指标',
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'black',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 180;
            },
            y: 400
          }
        },
        {
          type: 'text',
          dataIndex: datum => {
            return datum.label === '商品曝光人数' || datum.label === '进入直播间人数' || datum.label === '商品点击人数';
          },
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              let ratio = '';
              if (datum.label === '商品曝光人数') {
                const current = data.find(d => d.label === '进入直播间人数').value;
                const target = data.find(d => d.label === '商品点击人数').value;
                ratio = `${((target / current) * 100).toFixed(2)}%`;
              } else if (datum.label === '进入直播间人数') {
                const current = data.find(d => d.label === '商品曝光人数').value;
                const target = data.find(d => d.label === '创建订单人数').value;
                ratio = `${((target / current) * 100).toFixed(2)}%`;
              } else if (datum.label === '商品点击人数') {
                const current = data.find(d => d.label === '商品点击人数').value;
                const target = data.find(d => d.label === '创建订单人数').value;
                ratio = `${((target / current) * 100).toFixed(2)}%`;
              }
              return ratio;
            },
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'green',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 180;
            },
            y: 430
          }
        },
        {
          type: 'text',
          dataIndex: datum => {
            return datum.label === '商品点击人数' || datum.label === '进入直播间人数' || datum.label === '商品曝光人数';
          },
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const curIndex = data.findIndex(d => d.label === datum.label);

              let diffValue = '';
              if (datum.label === '商品点击人数') {
                diffValue = data[2].value - data[3].value;
              } else if (datum.label === '进入直播间人数') {
                diffValue = data[1].value - data[3].value;
              } else if (datum.label === '商品曝光人数') {
                diffValue = data[0].value - data[2].value;
              }

              return diffValue;
            },
            fontSize: 15,
            fill: 'grey',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, tr] = getPoints(data);
              return (tl.x + tr.x) / 2 + 180;
            },
            y: 450
          }
        }
      ]
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[漏斗图](link)
