import { STATE_HOVER_REVERSE } from './../../../../cjs/compile/mark/interface.d';
import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec = {
    type: 'sankey',
    data: [
      {
        name: 'data',
        values: [
          {
            nodes: [
              {
                value: 100,
                name: 'A',
                children: [
                  {
                    name: 'top',
                    value: 40,
                    children: [
                      { name: '00', value: 15 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'middle',
                    value: 30,
                    children: [
                      { name: '00', value: 10 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                value: 80,
                name: 'B',
                children: [
                  {
                    name: 'top',
                    value: 40,
                    children: [
                      { name: '00', value: 100 },
                      { name: '01', value: 40 }
                    ]
                  },
                  {
                    name: 'middle',
                    value: 10
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                value: 50,
                name: 'C',
                children: [
                  {
                    name: 'top',
                    value: 20
                  },
                  {
                    name: 'middle',
                    value: 20
                  },
                  {
                    name: 'bottom',
                    value: 10
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    categoryField: 'name',
    valueField: 'value',

    nodeAlign: 'left',
    nodeGap: 8,
    nodeWidth: 10,
    minNodeHeight: 4,
    nodeKey: datum => datum.name,

    label: {
      visible: true,
      state: {
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    node: {
      state: {
        hover: {
          fill: 'red'
        },
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    link: {
      state: {
        selected: {
          backgroundStyle: { fill: '#e8e8e8' }
        },
        hover: {
          stroke: '#000000'
        },
        blur: {
          fill: '#e8e8e8'
        }
      }
    },

    emphasis: {
      enable: true,
      effect: 'related'
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
