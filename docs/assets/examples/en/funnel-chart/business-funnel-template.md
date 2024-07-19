---
category: examples
group: funnel chart
title: Business Funnel Chart Template
keywords: funnelChart,composition,trend,custom,template,customMark
cover: /vchart/preview/funnel-business-template-1.1.png
option: funnelChart
---

# Business Funnel Chart

## Code Demonstration

```javascript livedemo
// Calculate percentage (funnel layer percentage)
function calculatePercent(currentIndex, data) {
  if (currentIndex === 0) return 100; // The percentage of the first element is 100%
  if (currentIndex < 0) return 0; // Handle negative indices

  const prevValue = data[currentIndex - 1].value;
  const currentValue = data[currentIndex].value;

  return (currentValue / prevValue) * 100;
}

// Calculate value difference
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

// Default render count is 0
let renderCount = 0;

// Funnel chart configuration
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
        { label: 'VisitorstoLiveRoom', value: 10000, attach: 'k', average: 2000, percent: 1 },
        { label: 'ProductExposure', value: 9000, attach: 'k', average: 1000, percent: 0.9 },
        { label: 'ProductClicks', value: 5000, attach: 'k', average: 500, percent: 0.5 },
        { label: 'OrdersCreated', value: 2000, attach: 'k', average: 200, percent: 0.2 }
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
          fontSize: 14,
          y: (data, ctx) => {
            const { getPoints } = ctx;
            const [tl] = getPoints(data);
            return tl.y + 20;
          }
        }
      },
      extensionMark: [
        // Funnel layer percentage
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
        // Transformation layer percentage
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
        // Funnel layer values
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
        // Transformation layer values
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
        // Arrow
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
            y: 325,
            size: 18,
            scaleX: 0.8,
            symbolType: 'arrow2Right',
            cornerRadius: 5,
            fill: 'rgb(200,200,200)'
          }
        },
        // Arrow tail
        {
          type: 'symbol',
          dataId: 'funnel',
          style: {
            visible: true,
            x: (data, ctx) => {
              const { getPoints } = ctx;
              const [tl, bl, tr, br] = getPoints(data);
              const middleX = (tr.x + tl.x) / 2;
              const spacing = tr.x - tl.x;
              const adjustedX = middleX + spacing;
              return adjustedX;
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

        // Rectangle - Conversion Layer Background
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
        // Cross-layer Indicator Background
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
              return 0; // Return default or hide
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
              return 0; // Return default or hide
            },
            y: 370
          }
        },
        // Pointer Line - Rectangle with Upward Opening
        {
          type: 'polygon',
          dataId: 'funnel',
          state: {
            unHover_measure: { visible: false },
            hover_measure: { visible: true }
          },
          style: {
            visible: false, // Default not visible
            points: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);
              renderCount++; // Update render count
              if (renderCount > 3) {
                return []; // Or return null;
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
        // Pointer Line Tail
        {
          type: 'polygon',
          dataId: 'funnel',
          state: {
            hover_measure: { visible: true } // Visible on hover
          },
          style: {
            visible: false, // Default not visible
            points: (datum, ctx, params, dataView) => {
              const { getPoints } = ctx;
              const points = getPoints(datum);

              if (points.length === 4) {
                // Ensure there are 4 points (rectangle)
                const [tl, bl, tr, br] = points;
                const middleX = (tr.x + tl.x) / 2;
                const spacing = tr.x - tl.x;
                const adjustedX = middleX + spacing;
                return [
                  { x: adjustedX, y: br.y + 60 },
                  { x: adjustedX, y: br.y + 70 }
                ];
              }
              return []; // Return empty array to prevent errors
            },
            stroke: 'rgb(11,136,245)',
            lineWidth: 2,
            pickable: false
          }
        },
        // Cross-layer Indicator
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              const index = data.findIndex(d => d.label === datum.label);
              return index < 3 ? 'Cross-layer Indicator' : '';
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
        // Cross-layer Indicator Percentage
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              // Define the calculation relationship for each label
              const labelMap = {
                ProductExposure: {
                  current: 'ProductExposure',
                  target: 'OrdersCreated'
                },
                VisitorstoLiveRoom: {
                  current: 'VisitorstoLiveRoom',
                  target: 'ProductClicks'
                },
                ProductClicks: {
                  current: 'ProductClicks',
                  target: 'OrdersCreated'
                }
              };

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
        // Cross-layer Indicator Value
        {
          type: 'text',
          dataIndex: 0,
          style: {
            text: (datum, ctx, params, dataView) => {
              const data = dataView.latestData;
              if (!data) return '';

              // Define the calculation relationship for each label
              const labelMap = {
                ProductExposure: {
                  current: 'ProductExposure',
                  target: 'OrdersCreated'
                },
                VisitorstoLiveRoom: {
                  current: 'VisitorstoLiveRoom',
                  target: 'ProductClicks'
                },
                ProductClicks: {
                  current: 'ProductClicks',
                  target: 'OrdersCreated'
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

## Related Tutorial

[Funnel Chart](link)
