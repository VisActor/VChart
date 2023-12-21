import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec = {
    type: 'bar',
    data: [
      {
        id: 'barData',
        values: [
          {
            date: '2019-08-29',
            group: 'Cake',
            value: 154,
            stack: 'Dessert'
          },
          {
            date: '2019-08-29',
            group: 'Bread',
            value: 378,
            stack: 'Dessert'
          },
          {
            date: '2019-08-29',
            group: 'Tea',
            value: 103,
            stack: 'Drink'
          },
          {
            date: '2019-08-29',
            group: 'Coffee',
            value: 310,
            stack: 'Drink'
          },
          {
            date: '2019-08-29',
            group: 'Rib',
            value: 419,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-29',
            group: 'Crayfish',
            value: 810,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-30',
            group: 'Cake',
            value: 153,
            stack: 'Dessert'
          },
          {
            date: '2019-08-30',
            group: 'Bread',
            value: 398,
            stack: 'Dessert'
          },
          {
            date: '2019-08-30',
            group: 'Tea',
            value: 105,
            stack: 'Drink'
          },
          {
            date: '2019-08-30',
            group: 'Coffee',
            value: 298,
            stack: 'Drink'
          },
          {
            date: '2019-08-30',
            group: 'Rib',
            value: 416,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-30',
            group: 'Crayfish',
            value: 796,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-31',
            group: 'Cake',
            value: 151,
            stack: 'Dessert'
          },
          {
            date: '2019-08-31',
            group: 'Bread',
            value: 408,
            stack: 'Dessert'
          },
          {
            date: '2019-08-31',
            group: 'Tea',
            value: 110,
            stack: 'Drink'
          },
          {
            date: '2019-08-31',
            group: 'Coffee',
            value: 302,
            stack: 'Drink'
          },
          {
            date: '2019-08-31',
            group: 'Rib',
            value: 400,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-31',
            group: 'Crayfish',
            value: 811,
            stack: 'Meat dishes'
          },
          {
            date: '2019-09-01',
            group: 'Cake',
            value: 135,
            stack: 'Dessert'
          },
          {
            date: '2019-09-01',
            group: 'Bread',
            value: 407,
            stack: 'Dessert'
          },
          {
            date: '2019-09-01',
            group: 'Tea',
            value: 944,
            stack: 'Drink'
          },
          {
            date: '2019-09-01',
            group: 'Coffee',
            value: 298,
            stack: 'Drink'
          },
          {
            date: '2019-09-01',
            group: 'Rib',
            value: 343,
            stack: 'Meat dishes'
          },
          {
            date: '2019-09-01',
            group: 'Crayfish',
            value: 771,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-29',
            group: 'Cake(last week)',
            value: -365,
            stack: 'Dessert'
          },
          {
            date: '2019-08-29',
            group: 'Bread(last week)',
            value: -235,
            stack: 'Dessert'
          },
          {
            date: '2019-08-29',
            group: 'Tea(last week)',
            value: -832,
            stack: 'Drink'
          },
          {
            date: '2019-08-29',
            group: 'Coffee(last week)',
            value: -610,
            stack: 'Drink'
          },
          {
            date: '2019-08-29',
            group: 'Rib(last week)',
            value: -305,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-29',
            group: 'Crayfish(last week)',
            value: -462,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-30',
            group: 'Cake(last week)',
            value: -522,
            stack: 'Dessert'
          },
          {
            date: '2019-08-30',
            group: 'Bread(last week)',
            value: -258,
            stack: 'Dessert'
          },
          {
            date: '2019-08-30',
            group: 'Tea(last week)',
            value: -689,
            stack: 'Drink'
          },
          {
            date: '2019-08-30',
            group: 'Coffee(last week)',
            value: -688,
            stack: 'Drink'
          },
          {
            date: '2019-08-30',
            group: 'Rib(last week)',
            value: -106,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-30',
            group: 'Crayfish(last week)',
            value: -159,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-31',
            group: 'Cake(last week)',
            value: -352,
            stack: 'Dessert'
          },
          {
            date: '2019-08-31',
            group: 'Bread(last week)',
            value: -760,
            stack: 'Dessert'
          },
          {
            date: '2019-08-31',
            group: 'Tea(last week)',
            value: -332,
            stack: 'Drink'
          },
          {
            date: '2019-08-31',
            group: 'Coffee(last week)',
            value: -368,
            stack: 'Drink'
          },
          {
            date: '2019-08-31',
            group: 'Rib(last week)',
            value: -222,
            stack: 'Meat dishes'
          },
          {
            date: '2019-08-31',
            group: 'Crayfish(last week)',
            value: -205,
            stack: 'Meat dishes'
          },
          {
            date: '2019-09-01',
            group: 'Cake(last week)',
            value: -471,
            stack: 'Dessert'
          },
          {
            date: '2019-09-01',
            group: 'Bread(last week)',
            value: -535,
            stack: 'Dessert'
          },
          {
            date: '2019-09-01',
            group: 'Tea(last week)',
            value: -319,
            stack: 'Drink'
          },
          {
            date: '2019-09-01',
            group: 'Coffee(last week)',
            value: -363,
            stack: 'Drink'
          },
          {
            date: '2019-09-01',
            group: 'Rib(last week)',
            value: -243,
            stack: 'Meat dishes'
          },
          {
            date: '2019-09-01',
            group: 'Crayfish(last week)',
            value: -129,
            stack: 'Meat dishes'
          }
        ]
      }
    ],
    direction: 'horizontal',
    xField: 'value',
    yField: ['date', 'stack'],
    seriesField: 'group',
    stack: true,
    barWidth: 10,
    barBackground: {
      visible: true,
      isGroupLevel: true
    },
    axes: [
      {
        orient: 'top',
        title: {
          visible: true,
          text: 'Week-on-week (sales)'
        },
        tick: {
          tickCount: 10
        }
      },
      {
        orient: 'left',
        domainLine: {
          onZero: true // Axis baseline is at value 0
        }
        //paddingOuter: 0
      }
    ],
    legends: {
      visible: true,
      orient: 'right',
      position: 'end'
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
