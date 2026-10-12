import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 650481368f73d6fa71c7eed0
 * 验证目的：直方图区间边界与最小柱高。
 * 保留条件：xField, x2Field, yField, bar, barMinHeight；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      data: [
        {
          name: 'data1',
          values: [
            {
              x0: -400,
              x1: -380,
              frequency: 0
            },
            {
              x0: -380,
              x1: -360,
              frequency: 4
            },
            {
              x0: -360,
              x1: -340,
              frequency: 7
            },
            {
              x0: -340,
              x1: -320,
              frequency: 7
            },
            {
              x0: -320,
              x1: -300,
              frequency: 18
            },
            {
              x0: -300,
              x1: -280,
              frequency: 30
            },
            {
              x0: -280,
              x1: -260,
              frequency: 33
            },
            {
              x0: -260,
              x1: -240,
              frequency: 80
            },
            {
              x0: -240,
              x1: -220,
              frequency: 98
            },
            {
              x0: -220,
              x1: -200,
              frequency: 124
            },
            {
              x0: -200,
              x1: -180,
              frequency: 161
            },
            {
              x0: -180,
              x1: -160,
              frequency: 176
            },
            {
              x0: -160,
              x1: -140,
              frequency: 227
            },
            {
              x0: -140,
              x1: -120,
              frequency: 276
            },
            {
              x0: -120,
              x1: -100,
              frequency: 321
            },
            {
              x0: -100,
              x1: -80,
              frequency: 452
            },
            {
              x0: -80,
              x1: -60,
              frequency: 441
            },
            {
              x0: -60,
              x1: -40,
              frequency: 505
            },
            {
              x0: -40,
              x1: -20,
              frequency: 521
            },
            {
              x0: -20,
              x1: 0,
              frequency: 733
            },
            {
              x0: 0,
              x1: 20,
              frequency: 892
            },
            {
              x0: 20,
              x1: 40,
              frequency: 362
            },
            {
              x0: 40,
              x1: 60,
              frequency: 267
            },
            {
              x0: 60,
              x1: 80,
              frequency: 223
            },
            {
              x0: 80,
              x1: 100,
              frequency: 157
            },
            {
              x0: 100,
              x1: 120,
              frequency: 170
            },
            {
              x0: 120,
              x1: 140,
              frequency: 124
            },
            {
              x0: 140,
              x1: 160,
              frequency: 112
            },
            {
              x0: 160,
              x1: 180,
              frequency: 73
            },
            {
              x0: 180,
              x1: 200,
              frequency: 80
            },
            {
              x0: 200,
              x1: 220,
              frequency: 49
            },
            {
              x0: 220,
              x1: 240,
              frequency: 33
            },
            {
              x0: 240,
              x1: 260,
              frequency: 30
            },
            {
              x0: 260,
              x1: 280,
              frequency: 21
            },
            {
              x0: 280,
              x1: 300,
              frequency: 9
            },
            {
              x0: 300,
              x1: 320,
              frequency: 13
            },
            {
              x0: 320,
              x1: 340,
              frequency: 11
            },
            {
              x0: 340,
              x1: 360,
              frequency: 5
            },
            {
              x0: 360,
              x1: 380,
              frequency: 4
            },
            {
              x0: 380,
              x1: 400,
              frequency: 4
            },
            {
              x0: 400,
              x1: 420,
              frequency: 2
            },
            {
              x0: 420,
              x1: 440,
              frequency: 8
            },
            {
              x0: 440,
              x1: 460,
              frequency: 2
            },
            {
              x0: 460,
              x1: 480,
              frequency: 3
            },
            {
              x0: 480,
              x1: 500,
              frequency: 10
            },
            {
              x0: 500,
              x1: 520,
              frequency: 7
            },
            {
              x0: 520,
              x1: 540,
              frequency: 14
            },
            {
              x0: 540,
              x1: 560,
              frequency: 6
            },
            {
              x0: 560,
              x1: 580,
              frequency: 1
            },
            {
              x0: 580,
              x1: 600,
              frequency: 3
            },
            {
              x0: 600,
              x1: 620,
              frequency: 0
            },
            {
              x0: 620,
              x1: 640,
              frequency: 6
            },
            {
              x0: 640,
              x1: 660,
              frequency: 5
            },
            {
              x0: 660,
              x1: 680,
              frequency: 3
            },
            {
              x0: 680,
              x1: 700,
              frequency: 2
            },
            {
              x0: 700,
              x1: 720,
              frequency: 0
            }
          ]
        }
      ],
      type: 'histogram',
      xField: 'x0',
      x2Field: 'x1',
      yField: 'frequency',
      bar: {
        style: {
          stroke: 'white',
          lineWidth: 1
        }
      },
      barMinHeight: 5
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
