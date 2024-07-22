---
category: examples
group: funnel chart
title: 业务漏斗图模版
keywords: funnelChart,composition,trend,custom,template,customMark
cover: /vchart/preview/funnel-business-template-zh_1.11.10.png
option: funnelChart
---

# 业务漏斗图

## 代码演示

```javascript livedemo
// 计算百分比（漏斗层百分比）
function calculatePercent(currentIndex, data) {
  if (currentIndex === 0) return 100; // 第一个元素的百分比是 100%
  if (currentIndex < 0) return 0; // 处理负索引

  const prevValue = data[currentIndex - 1].value;
  const currentValue = data[currentIndex].value;

  return (currentValue / prevValue) * 100;
}

// 计算数值差异
function ValueDifference(data, label) {
  const curIndex = data.findIndex(d => d.label === label);

  if (curIndex === -1) {
    console.error('Label not found in data', label);
    return '';
  }
  const currentValue = data[curIndex].value;
  const nextValue = data[curIndex + 1]?.value ?? 0;

  return `${Math.trunc(currentValue - nextValue)}`;
}

//默认渲染次数为0
let renderCount = 0;

// 自定义箭头路径的 symbol
const arrowPath = `
<svg width="24" height="24" viewBox="-50 -50 50 50" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,0 L0,14 L7,7 Z"  />
  <path d="M-16,6 Q-16,5 -14,5 L0,5 Q0,5 0,6  L0,9 Q0,8 0,10 L-14,10 Q-16,10 -16,9 Z"  />
</svg>
`;

// 定义每个标签对应的计算关系
const labelMap = {
  商品曝光人数: {
    current: '商品曝光人数',
    target: '创建订单人数'
  },
  进入直播间人数: {
    current: '进入直播间人数',
    target: '商品点击人数'
  },
  商品点击人数: {
    current: '商品点击人数',
    target: '创建订单人数'
  }
};

//漏斗图配置
const spec = {
  type: 'common',
  padding: { bottom: 300, top: 0 },
  height: 600,
  color: {
    type: 'ordinal',
    range: ['#4E91FF', '#8FC7FF', '#AEE2FF']
  },
  interactions: [
    {
      type: 'element-highlight-by-key',
      highlightState: 'hover_measure',
      blurState: 'unHover_measure'
    }
  ],
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
          lineWidth: 6,
          fillOpacity: 0.5
        },
        state: {
          hover: {
            stroke: '#4e83fd',
            lineWidth: 1
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
        position: 'left',
        line: { visible: false },
        style: {
          wordWrap: true,
          wordBreak: 'break-word',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          fill: 'black',
          fontSize: 18,
          y: (data, ctx) => {
            const { getPoints } = ctx;
            const [tl] = getPoints(data);
            return tl.y + 20;
          }
        }
      },
      extensionMark: [
        //漏斗层百分比
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              const curIndex = data.findIndex(d => d.label === datum.label);
              if (curIndex === -1) return '';

              const currentPercent = calculatePercent(curIndex, data);
              return `${currentPercent.toFixed(2)}%`;
            },
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'black',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return (tl.x + tr.x) / 2;
            },
            y: 70
          }
        },
        //转化层百分比
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              const curIndex = data.findIndex(d => d.label === datum.label);
              if (curIndex === 0) return '';

              const currentPercent = calculatePercent(curIndex, data);
              const prevPercent = calculatePercent(curIndex - 1, data);
              const percentDifference = prevPercent - currentPercent;

              return `-${percentDifference.toFixed(2)}%`;
            },

            fontSize: 18,
            fontWeight: 'bold',
            fill: 'green',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              const middleX = (tr.x + tl.x) / 2;
              const spacing = tr.x - tl.x;
              const adjustedX = middleX - spacing;
              return adjustedX;
            },
            y: 70
          }
        },
        //漏斗层数值
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
              const [tl, bl, tr, br] = getPoints(data);
              return (tl.x + tr.x) / 2;
            },
            y: 100
          }
        },
        //转化层数值
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return;
              return ValueDifference(data, datum.label);
            },
            fontSize: 15,
            fill: 'grey',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              const middleX = (tr.x + tl.x) / 2;
              const spacing = tr.x - tl.x;
              const adjustedX = middleX + spacing;
              return adjustedX;
            },
            y: 100
          }
        },
        // 箭头
        {
          type: 'symbol',
          dataId: 'funnel',
          style: {
            visible: true,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              const middleX = (tr.x + tl.x) / 2;
              const spacing = tr.x - tl.x + 10;
              const adjustedX = middleX + spacing;
              return adjustedX;
            },
            y: 310,
            size: 40,
            scaleX: 0.8,
            symbolType: arrowPath,
            fill: 'rgb(200,200,200)'
          }
        },
        //矩形-转化层的背景
        {
          type: 'rect',
          dataId: 'funnel',
          style: {
            fill: 'rgb(200,200,200)',
            fillOpacity: 0.1,
            width: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return tr.x - tl.x;
            },
            height: 300,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return tr.x;
            },
            y: 45
          }
        },
        //跨层指标背景
        {
          type: 'rect',
          dataId: 'funnel',
          zIndex: 0,
          state: {
            hover_measure: {
              fill: 'blue',
              stroke: 'red'
            },
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
            fill: 'rgb(200,200,200)',
            fillOpacity: 0.1,
            width: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);
              const index = dataView.latestData.findIndex(d => d.label === datum.label);
              if (index < 3 && points.length === 4) {
                const [tl, bl, tr, br] = points;
                return (tr.x - tl.x) * 2;
              }
              return 0; // 返回默认值或隐藏
            },
            height: 100,
            x: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);
              const index = dataView.latestData.findIndex(d => d.label === datum.label);
              if (index < 3 && points.length === 4) {
                const [tl, bl, tr, br] = points;
                return (tl.x + tr.x) / 2;
              }
              return 0; // 返回默认值或隐藏
            },
            y: 370
          }
        },
        //指向线-开口向上的矩形
        {
          type: 'polygon',
          dataId: 'funnel',
          state: {
            unHover_measure: { visible: false },
            hover_measure: { visible: true }
          },
          style: {
            visible: false, // 默认不可见
            points: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);
              renderCount++; // 更新渲染次数
              if (renderCount > 3) {
                return []; // 或者 return null;
              }
              if (points.length === 4) {
                const [tl, bl, tr, br] = points;
                const middleX = (tr.x + tl.x) / 2;
                const width = (tr.x - tl.x) * 4;

                let adjustedX;
                if (renderCount === 1) {
                  adjustedX = middleX + width;
                } else if (renderCount === 2) {
                  adjustedX = middleX + width;
                } else {
                  adjustedX = middleX + (tr.x - tl.x) * 2;
                }

                return [
                  { x: middleX, y: tl.y + 40 },
                  { x: middleX, y: tl.y + 60 },
                  { x: adjustedX, y: tl.y + 60 },
                  { x: adjustedX, y: tl.y + 40 }
                ];
              }
              return [];
            },

            cornerRadius: 5,
            stroke: 'rgb(11,136,245)',
            lineWidth: 2,
            closePath: false,
            pickable: false
          }
        },
        //指向线尾巴
        {
          type: 'polygon',
          dataId: 'funnel',
          state: {
            hover_measure: { visible: true } // 悬停时可见
          },
          style: {
            visible: false, // 默认不可见
            points: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);

              if (points.length === 4) {
                // 确保有 4 个点（矩形）
                const [tl, bl, tr, br] = points;
                const middleX = (tr.x + tl.x) / 2;
                const spacing = tr.x - tl.x;
                const adjustedX = middleX + spacing;
                return [
                  { x: adjustedX, y: br.y + 60 },
                  { x: adjustedX, y: br.y + 70 }
                ];
              }
              return []; // 返回空数组以防出错
            },
            stroke: 'rgb(11,136,245)',
            lineWidth: 2,
            pickable: false
          }
        },
        //跨层指标
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const index = data.findIndex(d => d.label === datum.label);
              return index < 3 ? '跨层指标' : '';
            },
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'black',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return (tl.x + tr.x) / 2 + 140;
            },
            y: 400
          }
        },
        //跨层指标百分比
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              const currentLabel = datum.label;
              const mapping = labelMap[currentLabel];

              if (!mapping) return '';

              const currentData = data.find(d => d.label === mapping.current);
              const targetData = data.find(d => d.label === mapping.target);

              if (!currentData || !targetData) return '';

              const ratio = ((targetData.value / currentData.value) * 100).toFixed(2);
              return `${ratio}%`;
            },

            fontSize: 18,
            fontWeight: 'bold',
            fill: 'green',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return (tl.x + tr.x) / 2 + 140;
            },
            y: 430
          }
        },
        //跨层指标数值
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              // 定义每个标签对应的计算关系
              const labelMap = {
                商品曝光人数: {
                  current: '商品曝光人数',
                  target: '创建订单人数'
                },
                进入直播间人数: {
                  current: '进入直播间人数',
                  target: '商品点击人数'
                },
                商品点击人数: {
                  current: '商品点击人数',
                  target: '创建订单人数'
                }
              };

              const currentLabel = datum.label;
              const mapping = labelMap[currentLabel];

              if (!mapping) return '';

              const currentData = data.find(d => d.label === mapping.current);
              const targetData = data.find(d => d.label === mapping.target);

              if (!currentData || !targetData) return '';

              const differentValue = currentData.value - targetData.value;
              return `${differentValue}`;
            },

            fontSize: 15,
            fill: 'grey',
            textAlign: 'center',
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              return (tl.x + tr.x) / 2 + 140;
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

// Just for the convenience of console debugging, do not copy
window['vchart'] = vchart;
```

## 相关教程

[漏斗图](link)
