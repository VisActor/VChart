import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 660b8281e46a4800b369f7e1
 * 验证目的：多数据源堆叠排序、逆序与最小柱高。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'common',
      stackSort: true,
      stackInverse: true,
      height: 500,
      data: [
        {
          id: '1',
          values: [
            { x: 1, y: 2, t: 'a' },
            { x: 1, y: 20, t: 'b' },
            { x: 1, y: 20, t: 'c' },
            { x: 2, y: 20, t: 'b' },
            { x: 2, y: 20, t: 'c' },
            { x: 2, y: 20, t: 'd' }
          ]
        },
        {
          id: '2',
          values: [
            { x: 1, y: 2, t: 'd' },
            { x: 1, y: 20, t: 'b' },
            { x: 1, y: 2, t: 'c' },
            { x: 2, y: 20, t: 'd' },
            { x: 2, y: 40, t: 'b' },
            { x: 2, y: 2, t: 'a' }
          ]
        }
      ],
      series: [
        { xField: 'x', yField: 'y', seriesField: 't', stack: true, type: 'bar', dataIndex: 0, barMinHeight: 50 },
        { xField: 'x', yField: 'y', seriesField: 't', stack: true, type: 'bar', dataIndex: 1, barMinHeight: 50 }
      ],
      axes: [
        { orient: 'left', type: 'linear', max: 300 },
        { orient: 'bottom', type: 'band' }
      ]
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
