import { verifySpec, verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03e8
 * 验证目的：左向漏斗底部对齐与外标签。
 * 保留条件：源数据、配置、确定性回调；宿主及通用文字适配本地。
 * 覆盖边界：仅验证指定最终状态，不覆盖动画过程或全部录制步骤。
 */
export default {
  createSpec() {
    // 返回独立源配置，保持数据顺序及计算关系。
    const spec = {
      type: 'funnel',
      isCone: false,
      gap: 10,
      animation: false,
      funnelAlign: 'bottom',
      funnelOrient: 'left',
      funnel: {
        style: {
          stroke: 'red',
          lineWidth: 1
        }
      },
      label: {
        visible: true
      },
      outerLabel: {
        visible: true,
        alignLabel: false
      },
      transformLabel: {
        visible: false
      },
      isTransform: true,
      data: [
        {
          name: 'funnel',
          values: [
            {
              value: 100,
              name: 'Revenue with a very long label'
            },
            {
              value: 80,
              name: 'Long impressions'
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
              name: 'Long consultations'
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

    return spec;
  },
  async verify(page) {
    // 验证目标状态及实际绘制，动作缺失不能通过。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
