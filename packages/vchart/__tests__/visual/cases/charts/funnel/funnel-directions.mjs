import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0052a1e9eec95f9eb0
 * 验证目的：四区域漏斗的方向、对齐与外侧标签。
 * 保留条件：padding, region, series, legends；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'common',
      padding: 0,
      data: [
        {
          id: 'funnel1',
          values: [
            {
              value: 100,
              name: 'Step1'
            },
            {
              value: 80,
              name: 'Step2'
            },
            {
              value: 60,
              name: 'Step3'
            },
            {
              value: 40,
              name: 'Step4'
            },
            {
              value: 20,
              name: 'Step5'
            }
          ]
        },
        {
          name: 'funnel2',
          values: [
            {
              value: 200,
              name: 'Step1'
            },
            {
              value: 160,
              name: 'Step2'
            },
            {
              value: 120,
              name: 'Step3'
            },
            {
              value: 80,
              name: 'Step4'
            },
            {
              value: 40,
              name: 'Step5'
            }
          ]
        }
      ],
      region: [
        {
          width: '25%'
        },
        {
          width: '25%',
          offsetX: '25%',
          padding: {
            left: 1
          }
        },
        {
          height: '45%',
          width: '50%',
          offsetX: '50%'
        },
        {
          height: '45%',
          width: '50%',
          offsetX: '50%',
          offsetY: '45%',
          padding: {
            top: 1
          }
        }
      ],
      series: [
        {
          type: 'funnel',
          dataIndex: 0,
          gap: 2,
          range: {
            max: 200
          },
          funnelOrient: 'top',
          funnelAlign: 'right',
          categoryField: 'name',
          valueField: 'value',
          isCone: false,
          funnel: {
            style: {
              cornerRadius: 4
            }
          },
          label: {
            visible: true,
            style: {
              text: ''
            }
          },
          outerLabel: {
            visible: true,
            alignLabel: false,
            position: 'left'
          }
        },
        {
          type: 'funnel',
          regionIndex: 1,
          dataIndex: 1,
          gap: 2,
          funnelOrient: 'top',
          funnelAlign: 'left',
          categoryField: 'name',
          valueField: 'value',
          isCone: false,
          label: {
            visible: true,
            style: {
              text: ''
            }
          },
          outerLabel: {
            visible: true,
            alignLabel: false,
            position: 'right'
          },
          funnel: {
            style: {
              cornerRadius: 4
            }
          }
        },
        {
          type: 'funnel',
          dataIndex: 0,
          regionIndex: 2,
          gap: 1,
          funnelOrient: 'top',
          funnelAlign: 'left',
          categoryField: 'name',
          valueField: 'value',
          isCone: false,
          label: {
            visible: true,
            style: {
              text: ''
            }
          },
          outerLabel: {
            visible: true,
            alignLabel: false,
            position: 'right'
          }
        },
        {
          type: 'funnel',
          regionIndex: 3,
          dataIndex: 1,
          gap: 1,
          funnelOrient: 'bottom',
          funnelAlign: 'left',
          categoryField: 'name',
          valueField: 'value',
          isCone: false,
          label: {
            visible: true,
            style: {
              text: ''
            }
          },
          outerLabel: {
            visible: true,
            alignLabel: false,
            position: 'right'
          }
        }
      ],
      legends: {
        visible: true,
        orient: 'top'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
