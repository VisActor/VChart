import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const data1 = [
    { date: 'Day 1', workload: 7000 },
    { date: 'Day 2', workload: 1000 },
    { date: 'Day 3', workload: 6000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 6', workload: 3000 },
    { date: 'Day 7', workload: 9000 },
    { date: 'Day 8', workload: 2000 },
    { date: 'Day 9', workload: 5000 }
  ];

  const data2 = [
    { date: 'Day 1', workload: 1000 },
    { date: 'Day 2', workload: 2000 },
    { date: 'Day 3', workload: 3000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 5000 }
  ];

  const data3 = [
    { date: 'Day 0', workload: 3000 },
    { date: 'Day 1', workload: 4000 },
    { date: 'Day 2', workload: 5000 },
    { date: 'Day3', workload: 6000 },
    { date: 'Day4', workload: 7000 },
    { date: 'Day5', workload: 8000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 10', workload: 8000 }
  ];

  const spec = {
    type: 'liquid',
    maskShape: 'pin',
    background: '#111',
    valueField: 'value',
    padding: {
      left: 100,
      top: 100
    },
    // color: ['red'],
    // region: [{
    //   id: 'region',
    //   style: {
    //     fill: 'blue',
    //     fillOpacity: 1
    //   }
    // }],
    animationAppear: {
      preset: 'wave',
      // loop: true,
      delay: 0,
      delayAfter: 0
    },
    indicatorSmartInvert: true,
    indicator: {
      visible: true,
      // trigger: 'hover',
      limitRatio: 0.4,
      title: {
        visible: true,
        autoFit: true,
        style: {
          // fontWeight: 'bolder',
          fontFamily: 'Times New Roman',
          fill: 'red',
          text: '指标'
          // dx: 20,
          // dy: 20
        }
      },
      content: [
        {
          visible: true,
          style: {
            // fontSize: 20,
            fill: 'red',
            // fontWeight: 'bolder',
            // fontFamily: 'Times New Roman',
            text: '0.2'
            // dx: 20,
            // dy: 20
          }
        },
        {
          visible: true,
          style: {
            fontSize: 18,
            fill: 'orange',
            fontFamily: 'Times New Roman'
            // text: datum => {
            //   const d = datum ?? data[0];
            //   return d['value'] + '%';
            // }
          }
        }
      ]
    },
    data: [
      {
        id: 'id0',
        values: [
          {
            name: 'A',
            value: 0.5
          }
        ]
      }
    ],
    // outlineMargin: 40,
    outlinePadding: 40
    // liquidOutline: {
    //   style: {
    //     // fill: '#FFF',
    //     stroke: 'red',
    //     lineWdith: 2
    //   }
    // },
    // liquidBackground: {
    //   style: {
    //     fill: 'red',
    //     stroke: 'red',
    //     lineWdith: 2
    //   }
    // },
    // liquid: {
    //   style: {
    //     // fill: 'red',
    //     stroke: 'red',
    //     lineWdith: 2
    //   }
    // }
  };

  const percent_area_spec = {
    type: 'area',
    data: {
      values: [
        { type: 'Nail polish', country: 'Africa', value: 4229 },
        { type: 'Nail polish', country: 'EU', value: 4376 },
        { type: 'Nail polish', country: 'China', value: 3054 },
        { type: 'Nail polish', country: 'USA', value: 12814 },
        { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
        { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
        { type: 'Eyebrow pencil', country: 'China', value: 5067 },
        { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
        { type: 'Rouge', country: 'Africa', value: 5221 },
        { type: 'Rouge', country: 'EU', value: 3574 },
        { type: 'Rouge', country: 'China', value: 7004 },
        { type: 'Rouge', country: 'USA', value: 11624 },
        { type: 'Lipstick', country: 'Africa', value: 9256 },
        { type: 'Lipstick', country: 'EU', value: 4376 },
        { type: 'Lipstick', country: 'China', value: 9054 },
        { type: 'Lipstick', country: 'USA', value: 8814 },
        { type: 'Eyeshadows', country: 'Africa', value: 3308 },
        { type: 'Eyeshadows', country: 'EU', value: 4572 },
        { type: 'Eyeshadows', country: 'China', value: 12043 },
        { type: 'Eyeshadows', country: 'USA', value: 12998 },
        { type: 'Eyeliner', country: 'Africa', value: 5432 },
        { type: 'Eyeliner', country: 'EU', value: 3417 },
        { type: 'Eyeliner', country: 'China', value: 15067 },
        { type: 'Eyeliner', country: 'USA', value: 12321 },
        { type: 'Foundation', country: 'Africa', value: 13701 },
        { type: 'Foundation', country: 'EU', value: 5231 },
        { type: 'Foundation', country: 'China', value: 10119 },
        { type: 'Foundation', country: 'USA', value: 10342 },
        { type: 'Lip gloss', country: 'Africa', value: 4008 },
        { type: 'Lip gloss', country: 'EU', value: 4572 },
        { type: 'Lip gloss', country: 'China', value: 12043 },
        { type: 'Lip gloss', country: 'USA', value: 22998 },
        { type: 'Mascara', country: 'Africa', value: 18712 },
        { type: 'Mascara', country: 'EU', value: 6134 },
        { type: 'Mascara', country: 'China', value: 10419 },
        { type: 'Mascara', country: 'USA', value: 11261 }
      ]
    },
    title: {
      visible: true,
      text: '100% stacked area chart of cosmetic products sales'
    },
    percent: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'country',
    legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
    axes: [
      {
        orient: 'left',
        label: {
          formatMethod(val) {
            return `${(val * 100).toFixed(2)}%`;
          }
        }
      }
    ],
    label: {
      visible: true,
      formatter: '{_percent_}'
    }
  };

  const cs = new VChart(spec, {
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
