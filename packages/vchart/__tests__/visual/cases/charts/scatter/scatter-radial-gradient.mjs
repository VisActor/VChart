import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7f0352a1e9eec95f9eba
 * 验证目的：散点径向渐变填充。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'scatter',
      data: {
        values: [
          {
            type: 'A',
            x: 9,
            y: 81,
            r: 63
          },
          {
            type: 'A',
            x: 98,
            y: 5,
            r: 89
          },
          {
            type: 'A',
            x: 51,
            y: 50,
            r: 73
          },
          {
            type: 'A',
            x: 41,
            y: 22,
            r: 14
          },
          {
            type: 'A',
            x: 58,
            y: 24,
            r: 20
          },
          {
            type: 'A',
            x: 78,
            y: 37,
            r: 34
          },
          {
            type: 'A',
            x: 55,
            y: 56,
            r: 53
          },
          {
            type: 'A',
            x: 18,
            y: 45,
            r: 70
          },
          {
            type: 'A',
            x: 42,
            y: 44,
            r: 28
          },
          {
            type: 'A',
            x: 3,
            y: 52,
            r: 59
          },
          {
            type: 'A',
            x: 31,
            y: 18,
            r: 97
          },
          {
            type: 'A',
            x: 79,
            y: 91,
            r: 63
          },
          {
            type: 'A',
            x: 93,
            y: 23,
            r: 23
          },
          {
            type: 'A',
            x: 44,
            y: 83,
            r: 22
          },
          {
            type: 'B',
            x: 42,
            y: 38,
            r: 20
          },
          {
            type: 'B',
            x: 6,
            y: 18,
            r: 1
          },
          {
            type: 'B',
            x: 1,
            y: 93,
            r: 55
          },
          {
            type: 'B',
            x: 57,
            y: 2,
            r: 90
          },
          {
            type: 'B',
            x: 80,
            y: 76,
            r: 22
          },
          {
            type: 'B',
            x: 11,
            y: 74,
            r: 96
          },
          {
            type: 'B',
            x: 88,
            y: 56,
            r: 10
          },
          {
            type: 'B',
            x: 30,
            y: 47,
            r: 49
          },
          {
            type: 'B',
            x: 57,
            y: 62,
            r: 98
          },
          {
            type: 'B',
            x: 4,
            y: 16,
            r: 16
          },
          {
            type: 'B',
            x: 46,
            y: 10,
            r: 11
          },
          {
            type: 'B',
            x: 22,
            y: 87,
            r: 89
          },
          {
            type: 'B',
            x: 57,
            y: 91,
            r: 82
          },
          {
            type: 'B',
            x: 45,
            y: 15,
            r: 98
          }
        ]
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      sizeField: 'r',
      size: {
        type: 'linear',
        range: [6, 35]
      },
      color: [
        {
          gradient: 'radial',
          x0: 0.5,
          y0: 0.5,
          r0: 0,
          x1: 0.5,
          y1: 1,
          r1: 0.7,
          stops: [
            {
              offset: 0,
              color: 'rgba(255,255,255,0.5)'
            },
            {
              offset: 1,
              color: '#6690F2'
            }
          ]
        },
        {
          gradient: 'radial',
          x0: 0.5,
          y0: 0.5,
          r0: 0,
          x1: 0.5,
          y1: 1,
          r1: 0.7,
          stops: [
            {
              offset: 0,
              color: 'rgba(255,255,255,0.5)'
            },
            {
              offset: 1,
              color: '#FFDC83'
            }
          ]
        }
      ],
      axes: [
        {
          type: 'linear',
          orient: 'left',
          min: -10
        },
        {
          type: 'linear',
          orient: 'bottom',
          domainLine: {
            visible: true
          }
        }
      ],
      legends: {
        visible: true
      }
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
