import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03f8
 * 验证目的：线性进度阈值颜色映射。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：仅检查静态最终状态；不计动画或未执行的交互配置。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'linearProgress',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'A',
              value: 0.7
            }
          ]
        }
      ],
      direction: 'horizontal',
      xField: 'value',
      yField: 'type',
      cornerRadius: 20,
      bandWidth: 30,
      progress: {
        style: {
          fill: {
            type: 'threshold',
            field: 'value',
            domain: [0.6, 0.8],
            range: ['#D04D5B', '#ED9747', '#579E78']
          }
        }
      },
      animation: false
    };
  },
  async verify(page) {
    // 配置和绘制检查与视觉差异共同验证目标条件。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
  }
};
