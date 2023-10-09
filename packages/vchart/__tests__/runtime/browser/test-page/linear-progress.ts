import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
  const spec = {
    type: 'linearProgress',
    title: {
      text: '条形进度图'
    },
    // animation: false,
    data: {
      values: [
        {
          type: 'Tradition Industries',
          value: 0.5,
          text: '50%'
        },
        {
          type: 'Business Companies',
          value: 0.25,
          text: '25%'
        }
      ]
    },
    direction: 'horizontal',
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    axes: [
      {
        orient: 'left',
        domainLine: { visible: false }
      }
    ]
  };

  const spec1 = {
    type: 'linearProgress',
    data: [
      {
        id: 'data',
        values: [
          {
            current: 16068954.132933617,
            name: 'Name',
            percent: '80.34%',
            progress: 0.5356318044311206,
            detail: 'Cur 16,068,954.13 / Goal 20,000,000.00 / Max 30,000,000.00',
            goalProgress: 0.6666666666666666
          }
        ]
      }
    ],
    yField: 'name',
    xField: 'progress',
    cornerRadius: 15,
    bandWidth: 15,
    progress: {
      style: {
        fill: '#f9868c'
      }
    },
    track: {
      style: {
        fill: 'rgba(249, 134, 140, 0.1)'
      }
    },
    axes: [
      {
        visible: true,
        orient: 'right',
        type: 'band',
        domainLine: {
          visible: false
        },
        tick: {
          visible: false
        },
        label: {
          style: {
            visible: true,
            fontSize: 30,
            fill: '#161616',
            fontWeight: 400
          }
        },
        maxWidth: '60%'
      }
    ],
    extensionMark: [
      {
        type: 'text',
        dataId: 'data',
        visible: true,
        style: {
          text: 'Title',
          textAlign: 'start',
          textBaseline: 'bottom',
          fontSize: 16,
          fill: '#666666',
          fontWeight: 500,
          dy: 0,
          x: (_datum, ctx) => {
            return ctx.valueToX([0]);
          },
          y: (datum, ctx) => {
            return ctx.valueToY([datum.name]) - 19;
          }
        }
      },
      {
        type: 'text',
        dataId: 'data',
        visible: true,
        style: {
          text: datum => datum.detail,
          fontWeight: 500,
          fontSize: 16,
          fill: '#666666',
          textAlign: 'start',
          textBaseline: 'top',
          x: (_datum, ctx) => {
            return ctx.valueToX([0]);
          },
          y: (datum, ctx) => {
            return ctx.valueToY([datum.name]) + 15;
          },
          maxLineWidth: (_datum, ctx) => {
            const length = ctx.valueToX([1]) - ctx.valueToX([0]);
            return length;
          }
        }
      },
      {
        type: 'text',
        dataId: 'data',
        visible: true,
        style: {
          // eslint-disable-next-line max-len
          text: 'Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~Long Text~~~',
          fontSize: 12,
          fontWeight: 500,
          fill: 'white',
          textAlign: 'center',
          textBaseline: 'middle',
          maxLineWidth: (datum, ctx) => {
            // 进度条有圆角, 需要给文字预留空间.
            const roundPadding = 4;
            return ctx.valueToX([datum.progress]) - roundPadding;
          },
          x: (datum, ctx) => {
            return ctx.valueToX([datum.progress]) / 2;
          },
          y: (datum, ctx) => {
            return ctx.valueToY([datum.name]);
          },
          x1: (datum, ctx) => {
            return ctx.valueToX([datum.progress]);
          },
          y1: (datum, ctx) => {
            return ctx.valueToY([datum.name]);
          }
        }
      }
    ]
  };

  const cs = new VChart(spec1, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
