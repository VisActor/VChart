import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { dataWordCloudShape } from '../../../data/data-wordcloud-shape';
const run = () => {
  const spec = {
    type: 'wordCloud',
    nameField: 'name',
    valueField: 'value',
    data: {
      name: '0',
      values: [
        {
          name: '螺蛳粉',
          value: 957
        },
        {
          name: '钵钵鸡',
          value: 942
        }
      ]
    }
  };

  const spec1 = {
    type: 'wordCloud',
    nameField: 'name',
    valueField: 'value',
    data: {
      name: '1',
      values: [
        {
          name: '螺蛳粉',
          value: 957
        },
        {
          name: '钵钵鸡',
          value: 942
        },
        {
          name: '板栗',
          value: 842
        },
        {
          name: '胡辣汤',
          value: 828
        },
        {
          name: '关东煮',
          value: 665
        },
        {
          name: '羊肉汤',
          value: 627
        },
        {
          name: '热干面',
          value: 574
        }
      ]
    }
  };
  const cs = new VChart(spec, { dom: 'chart' });
  cs.renderAsync().then(() => {
    setTimeout(() => {
      console.log('updateSpec');
      cs.updateSpec(spec1);
    }, 3000);
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
