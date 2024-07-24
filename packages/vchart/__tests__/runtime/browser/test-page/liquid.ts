import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';
// import { registerLiquidChart } from '@visactor/vchart';
import { registerLiquidChart } from '../../../../src/index';
import { reverse } from 'dns';
registerLiquidChart();

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

  const targetRatio = 0.8;
  const spec = {
    type: 'liquid',
    valueField: 'value',
    width: 500,
    height: 500,
    data: {
      id: 'data2',
      values: [
        {
          value: 0.7
        }
      ]
    },
    outlineMargin: 20,
    outlinePadding: 40,
    reverse: true,
    indicator: {
      visible: true,
      trigger: 'select',
      title: {
        visible: true,
        style: {
          fontSize: 18,
          text: '进度'
        }
      },
      content: [
        {
          visible: true,
          style: {
            fontSize: 18,
            text: data => {
              if (data) {
                const value = data['value'];
                return value ? `${value}%` : null;
              }
              return 1234;
            }
          }
        }
      ]
    },
    // indicatorSmartInvert: false,
    // liquidBackground: {
    //     style: {
    //       fill: 'red'
    //     }
    //   },
    //   liquidOutline: {
    //     style: {
    //       fill: 'blue'
    //     }
    //   },
    // animationAppear: false,
    animationAppear: {
      liquid: {
        duration: 2000,
        loop: false,
        channel: {
          wave: {
            from: 0,
            to: 1
          },
          height: {
            from: 0,
            to: (...p) => {
              return p[3].getLiquidHeight();
            }
          },
          dy: {
            // to: 0,
            from: (...p) => {
              let liquidY = 0;
              const { startY: liquidBackStartY, size: liquidBackSize } = p[3].getLiquidBackPosAndSize();
              // const liquidHeight = liquidBackSize * this._heightRatio;
              if (spec.reverse) {
                liquidY = liquidBackStartY;
              } else {
                liquidY = liquidBackSize + liquidBackStartY;
              }
              return liquidY;
            },
            to: (...p) => {
              console.log('p', p);
              return p[1].graphicItem.attribute.dy;
            }
          }
        }
      }
    },
    // animationNormal: {
    //   loop: true,
    //   liquid: {
    //     channel: {
    //       wave: {
    //         from: 0,
    //         to: 1
    //       },
    //       height: {
    //         from: 0,
    //         to: (...p) => {
    //           return p[3].getLiquidHeight
    //         }
    //       },
    //       y: {
    //         from: (...p) => {
    //           const { y: liquidBackY, size: liquidBackSize } = p[3].getLiquidBackPosAndSize();
    //           return liquidBackY + liquidBackSize / 2;
    //         },
    //         to: (...p) => {
    //           return p[3].getLiquidPosY()
    //         }
    //       }
    //     }
    //   }

    // }
    extensionMark: [
      {
        type: 'rule',
        style: {
          stroke: 'red',
          x: (datum, context) => {
            const { x: liquidBackCenterX, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            const ruleLen = (Math.sqrt(1 - (targetRatio - 0.5) * (targetRatio - 0.5) * 4) * liquidBackSize) / 2;
            return liquidBackCenterX - ruleLen;
          },
          x1: (datum, context) => {
            const { x: liquidBackCenterX, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            const ruleLen = (Math.sqrt(1 - (targetRatio - 0.5) * (targetRatio - 0.5) * 4) * liquidBackSize) / 2;
            return liquidBackCenterX + ruleLen;
          },
          y: (datum, context) => {
            const offsetReverse = spec.reverse ? 1 : -1;
            const { y: liquidBackCenterY, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            return liquidBackCenterY + offsetReverse * (targetRatio - 0.5) * liquidBackSize;
          },
          y1: (datum, context) => {
            const offsetReverse = spec.reverse ? 1 : -1;
            const { y: liquidBackCenterY, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            return liquidBackCenterY + offsetReverse * (targetRatio - 0.5) * liquidBackSize;
          }
        }
      },
      {
        type: 'symbol',
        style: {
          fill: 'red',
          size: 5,
          x: (datum, context) => {
            const { x: liquidBackCenterX, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            const ruleLen = (Math.sqrt(1 - (targetRatio - 0.5) * (targetRatio - 0.5) * 4) * liquidBackSize) / 2;
            return liquidBackCenterX - ruleLen;
          },
          y: (datum, context) => {
            const offsetReverse = spec.reverse ? 1 : -1;
            const { y: liquidBackCenterY, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            return liquidBackCenterY + offsetReverse * (targetRatio - 0.5) * liquidBackSize;
          },
          symbolType: 'triangle',
          angle: 90
        }
      },
      {
        type: 'symbol',
        style: {
          fill: 'red',
          size: 5,
          x: (datum, context) => {
            const { x: liquidBackCenterX, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            const ruleLen = (Math.sqrt(1 - (targetRatio - 0.5) * (targetRatio - 0.5) * 4) * liquidBackSize) / 2;
            return liquidBackCenterX + ruleLen;
          },
          y: (datum, context) => {
            const offsetReverse = spec.reverse ? 1 : -1;
            const { y: liquidBackCenterY, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            return liquidBackCenterY + offsetReverse * (targetRatio - 0.5) * liquidBackSize;
          },
          symbolType: 'triangle',
          angle: -90
        }
      },
      {
        type: 'text',
        style: {
          text: '目标值' + targetRatio * 100 + '%',
          fill: 'red',
          fontSize: 8,
          x: (datum, context) => {
            const { x: liquidBackCenterX, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            const ruleLen = (Math.sqrt(1 - (targetRatio - 0.5) * (targetRatio - 0.5) * 4) * liquidBackSize) / 2;
            return liquidBackCenterX + ruleLen + 10;
          },
          y: (datum, context) => {
            const offsetReverse = spec.reverse ? 1 : -1;
            const { y: liquidBackCenterY, size: liquidBackSize } = context.getLiquidBackPosAndSize();
            return liquidBackCenterY + offsetReverse * (targetRatio - 0.5) * liquidBackSize;
          },
          textBaseline: 'middle',
          textAlign: 'left'
        }
      }
    ]
  };

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  // setTimeout(() => {
  //   cs.updateSpec({
  //     ...spec,
  //     // width: 200,
  //     // height: 200,
  //     maskShape: 'star',
  //     data: {
  //       id: 'data2',
  //       values: [
  //         {
  //           value: 0.2
  //         }
  //       ]
  //     },
  //     liquidOutline: {
  //       style: {
  //         fill: 'blue'
  //       }
  //     },
  //     liquidBackground: {
  //       style: {
  //         fill: 'red'
  //       }
  //     }
  //   })
  // }, 5000);
  window['vchart'] = cs;
  console.log(cs);
};
run();
