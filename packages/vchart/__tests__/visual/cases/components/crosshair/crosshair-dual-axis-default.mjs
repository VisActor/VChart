import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7ef952a1e9eec95f9e9e
 * 验证目的：双轴绑定的默认选中十字线。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'line',
      data: [
        {
          id: 'line',
          values: [
            {
              x: 'Round 1',
              y: 21,
              c: 'Green slime'
            },
            {
              x: 'Round 1',
              y: 38,
              c: 'Flying pig'
            },
            {
              x: 'Round 2',
              y: 28,
              c: 'Green slime'
            },
            {
              x: 'Round 2',
              y: 45,
              c: 'Flying pig'
            },
            {
              x: 'Round 3',
              y: 22,
              c: 'Green slime'
            },
            {
              x: 'Round 3',
              y: 56,
              c: 'Flying pig'
            },
            {
              x: 'Round 4',
              y: 34,
              c: 'Green slime'
            },
            {
              x: 'Round 4',
              y: 48,
              c: 'Flying pig'
            },
            {
              x: 'Round 5',
              y: 34,
              c: 'Green slime'
            },
            {
              x: 'Round 5',
              y: 64,
              c: 'Flying pig'
            },
            {
              x: 'Round 6',
              y: 44,
              c: 'Green slime'
            },
            {
              x: 'Round 6',
              y: 72,
              c: 'Flying pig'
            },
            {
              x: 'Round 7',
              y: 38,
              c: 'Green slime'
            },
            {
              x: 'Round 7',
              y: 65,
              c: 'Flying pig'
            },
            {
              x: 'Round 8',
              y: 24,
              c: 'Green slime'
            },
            {
              x: 'Round 8',
              y: 70,
              c: 'Flying pig'
            },
            {
              x: 'Round 9',
              y: 28,
              c: 'Green slime'
            },
            {
              x: 'Round 9',
              y: 62,
              c: 'Flying pig'
            }
          ]
        }
      ],
      legends: {
        visible: true,
        orient: 'bottom'
      },
      axes: [
        {
          orient: 'left',
          max: 100
        },
        {
          orient: 'bottom'
        },
        {
          orient: 'right',
          max: 100
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'c',
      point: {
        style: {
          size: 5
        },
        state: {
          dimension_hover: {
            size: 10
          }
        }
      },
      crosshair: {
        xField: {
          visible: true,
          line: {
            type: 'line',
            style: {
              lineWidth: 1,
              opacity: 1,
              strokeOpacity: 1,
              stroke: '#000',
              lineDash: [2, 2]
            }
          },
          bindingAxesIndex: [1],
          defaultSelect: {
            axisIndex: 1,
            datum: 'Round 6'
          },
          label: {
            visible: true
          }
        },
        yField: {
          visible: true,
          bindingAxesIndex: [0, 2],
          defaultSelect: {
            axisIndex: 2,
            datum: 40
          },
          label: {
            visible: true
          },
          line: {
            style: {
              lineWidth: 1,
              opacity: 1,
              strokeOpacity: 1,
              stroke: '#000',
              lineDash: [2, 2]
            }
          }
        }
      }
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'crosshair');
  }
};
