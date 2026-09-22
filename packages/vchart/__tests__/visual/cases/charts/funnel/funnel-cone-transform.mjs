import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03ee
 * 验证目的：锥形漏斗与转化区域标签。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：仅检查静态最终状态；不计动画或未执行的交互配置。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'funnel',
      isCone: true,
      animation: false,
      label: {
        visible: true
      },
      outerLabel: {
        visible: true,
        alignLabel: true
      },
      transformLabel: {
        visible: true
      },
      isTransform: true,
      data: [
        {
          name: 'funnel',
          values: [
            {
              value: 100,
              name: 'Revenue Revenue Revenue'
            },
            {
              value: 80,
              name: 'Impressions Impressions'
            },
            {
              value: 50,
              name: 'Clicks'
            },
            {
              value: 30,
              name: 'Visits'
            },
            {
              value: 10,
              name: 'Inquiries Inquiries'
            },
            {
              value: 5,
              name: 'Orders'
            }
          ]
        }
      ],
      categoryField: 'name',
      valueField: 'value'
    };
  },
  async verify(page) {
    // 配置和绘制检查与视觉差异共同验证目标条件。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
  }
};
