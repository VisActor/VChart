import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65b8ca75c00fc9008c750045
 * 验证目的：分类轴多层标签显示。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
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
            },
            {}
          ],
          label: {},
          tick: {
            tickCount: 2
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
