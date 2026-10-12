import { verifySourceSpec, verifyEmptyPie } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66a8d642ef352c00ab73f490
 * 验证目的：空数据时显示自定义饼图占位环。
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
          values: []
        }
      ],
      radius: 0.8,
      innerRadius: 0.5,
      valueField: 'value',
      categoryField: 'type',
      emptyPlaceholder: {
        showEmptyCircle: true,
        emptyCircle: {
          style: {
            fill: '#ff00ffee',
            innerRadius: 0.1
          }
        }
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
