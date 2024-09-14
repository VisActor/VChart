import { isMobile } from 'react-device-detect';
import type { IGaugeChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart, registerMediaQuery } from '../../../../src/index';
import type { Datum } from '../../../../src/typings';

const data = [
  {
    type: 'Email',
    value: 2013,
    realValue: 2013
  },
  {
    type: 'Live Chat',
    value: 2847,
    realValue: 834
  },
  {
    type: 'Contact Form',
    value: 3123,
    realValue: 276
  },
  {
    type: 'Messenger',
    value: 3373,
    realValue: 250
  },
  {
    type: 'WhatsApp',
    value: 3476,
    realValue: 103
  }
];

const totalTickets = data.reduce((acc, curr) => acc + curr.value, 0);

const spec: IGaugeChartSpec = {
  type: 'gauge',
  data: [
    {
      id: 'pointer',
      values: [
        {
          type: 'A',
          value: 0.6
        }
      ]
    },
    {
      id: 'segment',
      values: [
        {
          type: 'Level 1',
          color: '#07A35A',
          value: 0.4
        },
        {
          type: 'Level 2',
          color: '#FFC528',
          value: 0.6
        },
        {
          type: 'Level 3',
          color: '#E33232',
          value: 0.8
        }
      ]
    }
  ],
  gauge: {
    type: 'gauge',
    dataIndex: 1,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    segment: {
      style: {
        cornerRadius: 10,
        fill: datum => datum['color']
      }
    }
  },
  pointer: {
    style: {
      fill: '#666666'
    }
  },
  radiusField: 'type',
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.9,
  innerRadius: 0.6,
  startAngle: -180,
  endAngle: 0,
  centerY: '100%',
  layoutRadius: 'auto',
  axes: [
    {
      type: 'linear',
      orient: 'angle',
      inside: true,
      grid: { visible: false }
    }
  ],
  legends: [
    {
      type: 'discrete',
      visible: true,
      orient: 'top'
    }
  ]
};

const run = () => {
  registerMediaQuery();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  window['vchart'] = cs;
  console.log(cs);
};
run();
