import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 66dec3a612d09a05ebba9967
 * 验证目的：环形进度系列级轨道配置。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'circularProgress',
      valueField: 'value',
      categoryField: 'type',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'Tradition Industries',
              value: 0.795,
              text: '79.5%'
            }
          ]
        }
      ],
      series: [
        {
          valueField: 'value',
          categoryField: 'type',
          track: {
            style: {
              fill: 'red'
            }
          },
          circularProgress: {
            id: 'CircularProgress-0-circularProgress'
          },
          type: 'circularProgress'
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
