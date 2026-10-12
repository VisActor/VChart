import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64d09d4eba8f75ea082eb5d7
 * 验证目的：缺失值按零处理的堆叠面积与标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const values = [
      { x: '0', type: 'A', y: '10' },
      { x: '1', type: 'A', y: '11' },
      { x: '2', type: 'A', y: undefined },
      { x: '3', type: 'A', y: '13' },
      { x: '4', type: 'A', y: '14' },
      { x: '5', type: 'A', y: '15' },
      { x: '6', type: 'A', y: '16' },
      { x: '7', type: 'A', y: '-17' },
      { x: '0', type: 'B', y: '21' },
      { x: '1', type: 'B', y: '22' },
      { x: '2', type: 'B', y: undefined },
      { x: '3', type: 'B', y: '24' },
      { x: '4', type: 'B', y: '25' },
      { x: '5', type: 'B', y: '26' },
      { x: '6', type: 'B', y: '27' },
      { x: '7', type: 'B', y: '-28' },
      { x: '0', type: 'C', y: '31' },
      { x: '1', type: 'C', y: '32' },
      { x: '2', type: 'C', y: undefined },
      { x: '3', type: 'C', y: '34' },
      { x: '4', type: 'C', y: '35' },
      { x: '5', type: 'C', y: '36' },
      { x: '6', type: 'C', y: '37' },
      { x: '7', type: 'C', y: '-38' }
    ];
    const spec = {
      type: 'area',
      data: [
        {
          id: 'id0',
          values
        }
      ],
      stack: true,
      xField: 'x',
      yField: 'y',
      label: { visible: true },
      legends: [{ visible: true, position: 'middle', orient: 'left' }],
      seriesField: 'type',
      invalidType: 'zero',
      line: {
        style: {}
      },
      point: {
        state: {
          hover: {
            size: 20,
            fill: 'red'
          }
        }
      },
      axes: [
        {
          orient: 'left',
          tickCount: 6,
          forceTickCount: 6,
          visible: true
        },
        {
          // visible: false,
          orient: 'bottom',
          label: { visible: true }
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
