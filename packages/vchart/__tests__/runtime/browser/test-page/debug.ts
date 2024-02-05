import type { IDataZoom } from '../../../../src/component/data-zoom';
import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  // const spec = {
  //   type: 'bar',
  //   yField: 'value',
  //   stack: false,
  //   label: {
  //     visible: true,
  //     position: 'outside'
  //   },
  //   legends: [
  //     {
  //       visible: true
  //     }
  //   ],
  //   xField: ['filterKey', 'type'],
  //   seriesField: 'filterKey',
  //   axes: [
  //     {
  //       orient: 'bottom',
  //       visible: true,
  //       showAllGroupLayers: true,
  //       layers: [
  //         {
  //           visible: true
  //         },
  //         {
  //           visible: false
  //         }
  //       ],
  //       label: {
  //         visible: true
  //       }
  //     },
  //     {
  //       orient: 'left',
  //       visible: true,
  //       zero: false,
  //       label: {
  //         visible: true
  //       }
  //     }
  //   ],
  //   data: [
  //     {
  //       name: 'bar',
  //       values: [
  //         {
  //           type: 'normal',
  //           filterKey: '非首日（1）',
  //           value: 3531
  //         },
  //         {
  //           type: 'compare',
  //           filterKey: '非首日（1）',
  //           value: 3530
  //         },
  //         {
  //           type: 'normal',
  //           filterKey: '已登录（2）',
  //           value: 0
  //         },
  //         {
  //           type: 'compare',
  //           filterKey: '已登录（2）',
  //           value: 0
  //         }
  //       ]
  //     }
  //   ]
  // };

  const spec = {
    type: 'bar',
    data: [
      {
        values: [
          {
            type: 'Category One',
            min: 76,
            max: 100,
            range: 'A',
            type2: 'p',
            color: 'A_p'
          },
          {
            type: 'Category Two',
            min: 56,
            max: 108,
            range: 'A',
            type2: 'p',
            color: 'A_p'
          },
          {
            type: 'Category One',
            min: 56,
            max: 100,
            range: 'B',
            type2: 'p',
            color: 'B_p'
          },
          {
            type: 'Category Two',
            min: 36,
            max: 108,
            range: 'B',
            type2: 'p',
            color: 'B_p'
          },

          {
            type: 'Category One',
            min: 76,
            max: 100,
            range: 'A',
            type2: 'k',
            color: 'A_k'
          },
          {
            type: 'Category Two',
            min: 56,
            max: 108,
            range: 'A',
            type2: 'k',
            color: 'A_k'
          },
          {
            type: 'Category One',
            min: 56,
            max: 100,
            range: 'B',
            type2: 'k',
            color: 'B_k'
          },
          {
            type: 'Category Two',
            min: 36,
            max: 108,
            range: 'B',
            type2: 'k',
            color: 'B_k'
          }
        ]
      }
    ],
    xField: ['type', 'range', 'type2'],
    yField: 'min',
    seriesField: 'color',
    // barGapInGroup: [0, 5],
    barWidth: 20,
    paddingInner: [0.6, 0.6, 0.6],
    bandPadding: [0.6, 0.6, 0.6],
    label: {
      position: 'bothEnd'
    },
    axes: [
      {
        orient: 'bottom',
        showAllGroupLayers: true,
        layers: [
          {
            visible: true
          },
          {
            visible: false
            // tickCount: 2
          },
          {
            // visible: false
          }
        ],
        // sampling: false,
        label: {
          // autoRotate: true
        },
        tick: {
          tickCount: 2
        }
      }
    ],
    legends: {
      visible: true
    }
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
