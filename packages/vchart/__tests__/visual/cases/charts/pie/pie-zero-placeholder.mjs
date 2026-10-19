import { verifySourceSpec, verifyEmptyPie } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 670cd7da124bb700a650178e
 * 验证目的：全零数据时显示饼图占位环。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'oxygen', value: 0 },
            { type: 'silicon', value: 0 },
            { type: 'aluminum', value: 0 }
          ]
        }
      ],
      // supportNegative: true,
      outerRadius: 0.8,
      innerRadius: 0.5,
      padAngle: 0.6,
      valueField: 'value',
      categoryField: 'type',
      pie: {
        style: {
          cornerRadius: 10
        },
        state: {
          hover: {
            outerRadius: 0.85,
            stroke: '#000',
            lineWidth: 1
          },
          selected: {
            outerRadius: 0.85,
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      legends: {},
      label: {
        visible: true
      },
      emptyPlaceholder: {
        showEmptyCircle: true
      }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyEmptyPie(page);
  }
};
