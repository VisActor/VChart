import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6566fdc5fb5448e50e23a367
 * 验证目的：极坐标默认选中的径向和角度 crosshair。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'radar',
      data: {
        id: 'radar',
        values: [
          { theta: '0', type: 'A', r: '873' },
          { theta: '1', type: 'A', r: '713' },
          { theta: '2', type: 'A', r: '742' },
          { theta: '3', type: 'A', r: '861' },
          { theta: '4', type: 'A', r: '815' },
          { theta: '5', type: 'A', r: '660' },
          { theta: '6', type: 'A', r: '795' },
          { theta: '7', type: 'A', r: '722' },
          { theta: '8', type: 'A', r: '818' },
          { theta: '9', type: 'A', r: '666' },
          { theta: '0', type: 'B', r: '896' },
          { theta: '1', type: 'B', r: '814' },
          { theta: '2', type: 'B', r: '856' },
          { theta: '3', type: 'B', r: '840' },
          { theta: '4', type: 'B', r: '634' },
          { theta: '5', type: 'B', r: '616' },
          { theta: '6', type: 'B', r: '652' },
          { theta: '7', type: 'B', r: '831' },
          { theta: '8', type: 'B', r: '614' },
          { theta: '9', type: 'B', r: '648' }
        ]
      },
      categoryField: 'theta',
      valueField: 'r',
      seriesField: 'type',
      groupBy: 'type',
      startAngle: 90,
      axes: [
        {
          orient: 'angle',
          domainLine: { visible: true, smooth: false },
          tick: { visible: true },
          grid: { visible: true },
          label: { visible: true }
        },
        {
          orient: 'radius',
          label: { visible: true },
          grid: { visible: true, smooth: false },
          domainLine: { visible: true, smooth: false },
          tick: { visible: true }
        }
      ],
      crosshair: {
        categoryField: {
          visible: true,
          line: {
            type: 'rect',
            style: {
              stroke: 'red'
            }
          },
          label: {
            visible: true,
            style: {
              fontSize: 14
            },
            labelBackground: {
              style: {
                fill: 'pink'
              }
            }
          },
          bindingAxesIndex: [0],
          defaultSelect: {
            axisIndex: 0,
            datum: '6'
          }
        },
        valueField: {
          visible: true,
          line: {
            style: {
              stroke: 'red'
            }
          },
          label: {
            visible: true,
            style: {
              fill: 'blue'
            },
            labelBackground: {
              style: {
                fill: 'pink'
              }
            }
          },
          bindingAxesIndex: [1],
          defaultSelect: {
            axisIndex: 1,
            datum: 550
          }
        }
      }
      // tooltip: {
      //   visible: false
      // }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'crosshair');
  }
};
