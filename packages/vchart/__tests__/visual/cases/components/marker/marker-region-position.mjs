import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 656ed882f69e0e008d9809e3
 * 验证目的：区域相对百分比坐标标注线。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'line',
      data: {
        id: 'data2',
        values: [
          {
            x: 1,
            y: 80
          },
          {
            x: 2,
            y: 40
          },
          {
            x: 3,
            y: 10
          },
          {
            x: 4,
            y: 20
          }
        ]
      },
      xField: 'x',
      yField: 'y',
      markLine: [
        {
          positions: [
            {
              x: '0%',
              y: '50%'
            },
            {
              x: '100%',
              y: '50%'
            }
          ],
          regionRelative: true
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
