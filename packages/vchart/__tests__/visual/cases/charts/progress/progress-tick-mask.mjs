import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65e1ca90a5483e00afa58635
 * 验证目的：环形进度刻度遮罩和强制对齐。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'circularProgress',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'Tradition Industries',
              value: 0.795,
              text: '79.5%'
            },
            {
              type: 'Business Companies',
              value: 0.5,
              text: '50%'
            },
            {
              type: 'Customer-facing Companies',
              value: 0.25,
              text: '25%'
            }
          ]
        }
      ],
      color: ['rgb(255, 222, 0)', 'rgb(171, 205, 5)', 'rgb(0, 154, 68)'],
      valueField: 'value',
      categoryField: 'type',
      seriesField: 'type',
      radius: 0.8,
      innerRadius: 0.4,
      progress: {
        style: {
          innerPadding: 5,
          outerPadding: 5
        },
        state: {
          hover: {
            innerPadding: 0,
            outerPadding: 0
          }
        }
      },
      tickMask: {
        visible: true,
        angle: 10,
        offsetAngle: 0,
        forceAlign: true,
        style: {
          cornerRadius: 15
        }
      },
      axes: [
        {
          visible: false,
          type: 'linear',
          orient: 'angle'
        },
        {
          visible: false,
          type: 'band',
          orient: 'radius'
        }
      ],
      indicator: {
        visible: true,
        trigger: 'hover',
        title: {
          visible: true,
          field: 'type',
          autoLimit: true,
          style: {
            fontSize: 20,
            fill: 'black'
          }
        },
        content: [
          {
            visible: true,
            field: 'text',
            style: {
              fontSize: 16,
              fill: 'gray'
            }
          }
        ]
      },
      legends: {
        visible: true,
        orient: 'bottom',
        title: {
          visible: false
        }
      },
      animation: false
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
