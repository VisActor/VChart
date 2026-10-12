import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65a79c21c82eb000a1d92908
 * 验证目的：关联不同系列的 region-relative-overlap 多轴布局。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'common',
      seriesField: 'color',
      data: [
        {
          id: 'id0',
          values: [
            { x: 'Monday', type: 'Breakfast', y: 15 },
            { x: 'Monday', type: 'Lunch', y: 25 },
            { x: 'Tuesday', type: 'Breakfast', y: 12 },
            { x: 'Tuesday', type: 'Lunch', y: 30 },
            { x: 'Wednesday', type: 'Breakfast', y: 15 },
            { x: 'Wednesday', type: 'Lunch', y: 24 },
            { x: 'Thursday', type: 'Breakfast', y: 10 },
            { x: 'Thursday', type: 'Lunch', y: 25 },
            { x: 'Friday', type: 'Breakfast', y: 13 },
            { x: 'Friday', type: 'Lunch', y: 20 },
            { x: 'Saturday', type: 'Breakfast', y: 10 },
            { x: 'Saturday', type: 'Lunch', y: 22 },
            { x: 'Sunday', type: 'Breakfast', y: 12 },
            { x: 'Sunday', type: 'Lunch', y: 19 }
          ]
        },
        {
          id: 'id1',
          values: [
            { x: 'Monday', type: 'Drinks', y: 22 },
            { x: 'Tuesday', type: 'Drinks', y: 43 },
            { x: 'Wednesday', type: 'Drinks', y: 33 },
            { x: 'Thursday', type: 'Drinks', y: 22 },
            { x: 'Friday', type: 'Drinks', y: 10 },
            { x: 'Saturday', type: 'Drinks', y: 30 },
            { x: 'Sunday', type: 'Drinks', y: 50 }
          ]
        }
      ],
      series: [
        {
          type: 'bar',
          id: 'bar',
          dataIndex: 0,
          label: { visible: true },
          seriesField: 'type',
          xField: ['x', 'type'],
          yField: 'y'
        },
        {
          type: 'line',
          id: 'line',
          dataIndex: 1,
          label: { visible: true },
          seriesField: 'type',
          xField: 'x',
          yField: 'y',
          stack: false
        }
      ],
      axes: [
        { orient: 'left', label: { style: { fill: 'red' } } },
        { orient: 'left', layoutType: 'region-relative-overlap', seriesIndex: [0], label: { style: { fill: 'red' } } },
        {
          orient: 'left',
          seriesId: ['line'],
          gird: { visible: false },
          layoutType: 'region-relative-overlap',
          label: {
            style: { dy: -14, fill: 'blue' },
            formatMethod: () => {
              return 12345678;
            }
          }
        },
        {
          orient: 'left',
          seriesId: ['line'],
          gird: { visible: false },
          layoutType: 'region-relative-overlap',
          label: { style: { dy: 14, fill: 'green' } }
        },
        { orient: 'left', seriesId: ['line'], gird: { visible: false }, label: { style: { dy: 14, fill: 'green' } } },
        { orient: 'bottom', label: { visible: true }, type: 'band' }
      ],
      legends: { visible: true, orient: 'top', position: 'start' }
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
