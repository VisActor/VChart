# Rich Text and DOM Extensions

## Rich Text

TODO

### Capabilities Supported by Rich Text

## DOM Extensions

To meet user needs for rendering custom DOM elements in charts, the underlying VRender supports two types of DOM extensions:

- HTML extension
- React extension

### HTML Extension

#### How to Enable the HTML Extension Plugin

Enable the HTML extension plugin by passing the chart configuration `enableHtmlAttribute`

```ts
const vchart = new VChart(spec, { dom: 'chart', enableHtmlAttribute: true });
```

#### How to Use HTML Extension Attributes

```javascript livedemo
const spec = {
  type: 'line',
  data: [
    {
      id: 'barData',
      values: [
        {
          State: 'WY',
          Age: 'Under 5 Years',
          Population: 25635
        },
        {
          State: 'WY',
          Age: '5 to 13 Years',
          Population: 1890
        },
        {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 9314
        },
        {
          State: 'DC',
          Age: 'Under 5 Years',
          Population: 30352
        },
        {
          State: 'DC',
          Age: '5 to 13 Years',
          Population: 20439
        },
        {
          State: 'DC',
          Age: '14 to 17 Years',
          Population: 10225
        },
        {
          State: 'VT',
          Age: 'Under 5 Years',
          Population: 38253
        },
        {
          State: 'VT',
          Age: '5 to 13 Years',
          Population: 42538
        },
        {
          State: 'VT',
          Age: '14 to 17 Years',
          Population: 15757
        },
        {
          State: 'ND',
          Age: 'Under 5 Years',
          Population: 51896
        },
        {
          State: 'ND',
          Age: '5 to 13 Years',
          Population: 67358
        },
        {
          State: 'ND',
          Age: '14 to 17 Years',
          Population: 18794
        },
        {
          State: 'AK',
          Age: 'Under 5 Years',
          Population: 72083
        },
        {
          State: 'AK',
          Age: '5 to 13 Years',
          Population: 85640
        },
        {
          State: 'AK',
          Age: '14 to 17 Years',
          Population: 22153
        }
      ]
    }
  ],
  customMark: [
    {
      type: 'rect',
      layoutType: 'region-relative',
      orient: 'top',
      height: 40,
      visible: true,
      zIndex: 10001,
      style: {
        html: {
          id: 'yAxisSwitch',
          style: ({ width }) => {
            return { width: `${width}px` };
          },
          dom: `<div style="display:flex;width:100%;">
            <h1 style="margin: 0;line-height:40px;flex:auto;">
            This is a title implemented by html
            </h1>
            <p style="margin: 0;line-height:40px;text-align: right;flex:auto;">
              @author: @Visactor
            </p>
          </div>`
        },
        fill: '#c9c9c9',
        x: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();
          return bounds.x1;
        },

        y: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.y1;
        },
        width: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.width();
        },
        height: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.height();
        }
      }
    },
    {
      type: 'rect',
      layoutType: 'region-relative',
      orient: 'bottom',
      height: 20,
      visible: true,
      zIndex: 10001,
      style: {
        html: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return {
            id: 'xAxisSwitch',
            anchorType: 'right',
            style: {
              width: '100%',
              transform: 'translate(-100%, -50%)'
            },
            dom: `<p style="margin: 0;line-height:20px; text-align:right;">this is a chart of trend </p>`
          };
        },
        fill: '#e8e8e8',
        x: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();
          // return (bounds.x1 + bounds.x2) / 2;
          return bounds.x1;
        },

        y: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.y1;
        },
        width: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.width();
        },
        height: (datum, ctx) => {
          const bounds = ctx.getLayoutBounds();

          return bounds.height();
        }
      }
    }
  ],
  xField: 'State',
  yField: 'Population',
  seriesField: 'Age',
  legends: {
    visible: true
  },
  point: {
    style: {
      size: 0,
      fill: 'white',
      stroke: null,
      lineWidth: 2
    },
    state: {
      dimension_hover: {
        size: 8
      },

      unHover_line: {
        size: 0
      }
    }
  },
  line: {
    state: {
      hover_line: {
        strokeOpacity: 1
      },
      unHover_line: {
        strokeOpacity: 0.1
      }
    }
  },
  crosshair: {
    xField: {
      line: {
        type: 'line'
      }
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID, enableHtmlAttribute: true });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

### React Extension

#### How to Enable the React Extension Plugin

Enable the React extension plugin by passing the `ReactDOM` export object into the chart configuration.

```ts
import ReactDOM from 'react-dom/client';

const vchart = new VChart(spec, { dom: 'chart', ReactDOM: ReactDOM });
```

#### How to Use React Extension Attributes

```javascript livedemo template=react-vchart
const root = document.getElementById(CONTAINER_ID);
const { VChart, FunnelChart, Pie, Legend } = ReactVChart;
const { useState, useRef, useEffect, useCallback } = React;

const data = [
  { type: 'oxygen', value: '46.60' },
  { type: 'silicon', value: '27.72' },
  { type: 'aluminum', value: '8.13' },
  { type: 'iron', value: '5' },
  { type: 'calcium', value: '3.63' },
  { type: 'sodium', value: '2.83' },
  { type: 'potassium', value: '2.59' },
  { type: 'others', value: '3.5' }
];

const Card = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    window['vchart'] = chartRef;
  }, []);

  const renderFunnelLabel = useCallback(datum => {
    return {
      element: <button style={{ color: 'black' }}>{datum.name}</button>,
      anchorType: 'middle',
      pointerEvents: 'all',
      style: 'transform:translate(-50%, -50%);'
    };
  }, []);

  return (
    <FunnelChart
      ref={chartRef}
      options={{
        // 注意，在实际使用场景中，需要自己引入：`import ReactDOM from 'react-dom/client';`
        ReactDOM: ReactDom
      }}
      spec={{
        type: 'funnel',
        categoryField: 'name',
        valueField: 'value',
        data: [
          {
            id: 'funnel',
            values: [
              {
                value: 100,
                name: 'Step1'
              },
              {
                value: 80,
                name: 'Step2'
              },
              {
                value: 60,
                name: 'Step3'
              },
              {
                value: 40,
                name: 'Step4'
              },
              {
                value: 20,
                name: 'Step5'
              }
            ]
          }
        ],
        funnel: {
          style: {
            react: renderFunnelLabel
          }
        },

        legends: {
          visible: true,
          orient: 'bottom'
        }
      }}
    />
  );
};

ReactDom.createRoot(root).render(<Card />);

// release react instance, do not copy
window.customRelease = () => {
  ReactDom.unmountComponentAtNode(root);
};
```
