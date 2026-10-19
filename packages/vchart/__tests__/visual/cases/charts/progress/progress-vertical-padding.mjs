import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03f7
 * 验证目的：纵向线性进度左右内边距。
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
              value: 0.2
            }
          ]
        }
      ],
      direction: 'vertical',
      xField: 'type',
      yField: 'value',
      cornerRadius: 20,
      bandWidth: 30,
      axes: [
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band'
        },
        {
          orient: 'left',
          label: {
            visible: true
          },
          type: 'linear'
        }
      ],
      progress: {
        leftPadding: 0,
        rightPadding: 0,
        style: {
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0.2,
            x1: 0.5,
            y1: 0,
            stops: [
              {
                offset: 0,
                color: '#4FC6B4'
              },
              {
                offset: 1,
                color: '#31679E'
              }
            ]
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
