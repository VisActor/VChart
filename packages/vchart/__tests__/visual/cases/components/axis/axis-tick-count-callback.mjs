import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 6509407dd99606ff3a6fec86
 * 验证目的：依据轴长和字体计算数值轴刻度数量。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'bar',
      height: 200,
      data: [
        {
          name: 'bar',
          fields: { y: { alias: 'Quantity' } },
          values: [
            { x: '2021-12-21 2:00', y: 82 },
            { x: '2021-12-21 4:00', y: 50 },
            { x: '2021-12-21 6:00', y: 64 },
            { x: '2021-12-21 8:00', y: 30 },
            { x: '2021-12-21 10:00', y: 40 },
            { x: '2021-12-21 12:00', y: 40 },
            { x: '2021-12-21 14:00', y: 56 },
            { x: '2021-12-21 16:00', y: 40 },
            { x: '2021-12-21 18:00', y: 64 },
            { x: '2021-12-21 20:00', y: 74 },
            { x: '2021-12-21 22:00', y: 98 }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      axes: [
        {
          orient: 'left',
          tick: {
            tickCount: ({ axisLength, labelStyle }) => {
              const density = 1;
              const height = axisLength ?? 200;
              const fontSize = labelStyle?.fontSize ?? 12;
              return Math.max(Math.ceil((height / (fontSize * 1.5)) * (0.2 * density)), 2);
            }
          }
        }
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
