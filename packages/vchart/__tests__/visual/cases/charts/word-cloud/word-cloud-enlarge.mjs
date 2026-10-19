import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64f751092937835bd5c893f2
 * 验证目的：词云的确定性布局与放大配置。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：fontSizeLimitMax 原配置保留，但不计为最大字号实际限制覆盖；仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'wordCloud',
      nameField: 'name',
      valueField: 'value',
      random: false,
      wordCloudConfig: {
        zoomToFit: {
          enlarge: true,
          fontSizeLimitMax: 20
        }
      },
      data: {
        name: 'baseData',
        values: [
          {
            name: 'Rice noodles',
            value: 957
          },
          {
            name: 'Chicken skewers',
            value: 942
          },
          {
            name: 'Chestnuts',
            value: 842
          },
          {
            name: 'Pepper soup',
            value: 828
          },
          {
            name: 'Oden',
            value: 665
          },
          {
            name: 'Lamb soup',
            value: 627
          },
          {
            name: 'Sesame noodles',
            value: 574
          }
        ]
      }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
