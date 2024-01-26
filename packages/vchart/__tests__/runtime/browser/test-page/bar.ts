import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec = {
    type: 'bar',
    data: [
      {
        name: 'data1',
        values: [
          {
            name: '产品1',
            industry: '电商',
            type: '合同金额',
            y: 88
          },
          {
            name: '产品1',
            industry: '电商',
            type: '已收款',
            y: 40
          },
          {
            name: '产品1',
            industry: '电商',
            type: '应收款',
            y: 78
          },
          {
            name: '产品1',
            industry: '游戏',
            type: '合同金额',
            y: 96
          },
          {
            name: '产品1',
            industry: '游戏',
            type: '已收款',
            y: 70
          },
          {
            name: '产品1',
            industry: '游戏',
            type: '应收款',
            y: 86
          },
          {
            name: '产品2',
            industry: '电商',
            type: '合同金额',
            y: 96
          },
          {
            name: '产品2',
            industry: '电商',
            type: '已收款',
            y: 45
          },
          {
            name: '产品2',
            industry: '电商',
            type: '应收款',
            y: 67
          },
          {
            name: '产品2',
            industry: '游戏',
            type: '合同金额',
            y: 89
          },
          {
            name: '产品2',
            industry: '游戏',
            type: '已收款',
            y: 34
          },
          {
            name: '产品2',
            industry: '游戏',
            type: '应收款',
            y: 50
          }
        ]
      }
    ],
    xField: ['name', 'industry', 'type'],
    yField: 'y',
    seriesField: 'type',
    axes: [
      {
        orient: 'bottom',
        showAllGroupLayers: true,
        layers: [
          {
            visible: false
          }
        ]
      }
    ],
    barBackground: {
      visible: true,
      fieldLevel: 1
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
