import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65030e7dce75480c0b15d21f
 * 验证目的：仪表盘刻度分段和指针。
 * 保留条件：gauge, pointer, categoryField, valueField, outerRadius, innerRadius, startAngle, endAngle, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'gauge',
      data: [
        {
          id: 'pointer',
          values: [
            {
              type: 'A',
              value: 0.6
            }
          ]
        },
        {
          id: 'segment',
          values: [
            {
              type: 'level1',
              value: 0.4
            },
            {
              type: 'level2',
              value: 0.6
            },
            {
              type: 'level3',
              value: 0.8
            }
          ]
        }
      ],
      gauge: {
        type: 'gauge',
        dataIndex: 1,
        categoryField: 'type',
        valueField: 'value',
        seriesField: 'type',
        tickMask: {
          visible: true,
          angle: 3,
          offsetAngle: 0,
          forceAlign: true,
          style: {
            cornerRadius: 15
          }
        }
      },
      pointer: {
        style: {
          fill: '#666666'
        }
      },
      categoryField: 'type',
      valueField: 'value',
      outerRadius: 0.8,
      innerRadius: 0.5,
      startAngle: -180,
      endAngle: 0,
      axes: [
        {
          type: 'linear',
          orient: 'angle',
          grid: {
            visible: false
          }
        }
      ]
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
