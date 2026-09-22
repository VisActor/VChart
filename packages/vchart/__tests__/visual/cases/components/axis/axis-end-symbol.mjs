import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7ee852a1e9eec95f9e73
 * 验证目的：坐标轴端点符号。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'area',
      data: [
        {
          id: 'line',
          values: [
            {
              x: 'Monday',
              y: 12
            },
            {
              x: 'Tuesday',
              y: 13
            },
            {
              x: 'Wednesday',
              y: 11
            },
            {
              x: 'Thursday',
              y: 10
            },
            {
              x: 'Friday',
              y: 12
            },
            {
              x: 'Saturday',
              y: 14
            },
            {
              x: 'Sunday',
              y: 17
            }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      axes: [
        {
          zIndex: 100,
          orient: 'bottom'
        },
        {
          zIndex: 100,
          orient: 'left',
          inverse: true,
          domainLine: {
            visible: true,
            endSymbol: {
              visible: true,
              style: {
                fill: '#000'
              }
            }
          }
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
