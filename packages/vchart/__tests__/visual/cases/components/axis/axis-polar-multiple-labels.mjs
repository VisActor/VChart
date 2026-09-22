import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6593fc588da89e00998d7b76
 * 验证目的：极坐标多层标签布局。
 * 保留条件：categoryField, valueField, seriesField, outerRadius, axes, crosshair；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'rose',
      data: {
        id: '0',
        values: [
          {
            time: '2:00',
            value: 27,
            type: 'Sales'
          },
          {
            time: '6:00',
            value: 25,
            type: 'Sales'
          },
          {
            time: '10:00',
            value: 18,
            type: 'Sales'
          },
          {
            time: '14:00',
            value: 15,
            type: 'Sales'
          },
          {
            time: '18:00',
            value: 10,
            type: 'Sales'
          },
          {
            time: '22:00',
            value: 5,
            type: 'Sales'
          },
          {
            time: '2:00',
            value: 7,
            type: 'Discount'
          },
          {
            time: '6:00',
            value: 5,
            type: 'Discount'
          },
          {
            time: '10:00',
            value: 38,
            type: 'Discount'
          },
          {
            time: '14:00',
            value: 5,
            type: 'Discount'
          },
          {
            time: '18:00',
            value: 20,
            type: 'Discount'
          },
          {
            time: '22:00',
            value: 15,
            type: 'Discount'
          }
        ]
      },
      categoryField: ['time', 'type'],
      valueField: 'value',
      seriesField: 'type',
      outerRadius: 0.9,
      axes: [
        {
          orient: 'angle',
          showAllGroupLayers: true,
          domainLine: {
            visible: true
          },
          grid: {
            visible: true,
            alignWithLabel: false
          },
          label: {
            visible: true
          },
          tick: {
            visible: true
          }
        },
        {
          orient: 'radius',
          grid: {
            visible: true,
            smooth: true
          }
        }
      ],
      crosshair: {
        categoryField: {
          visible: true,
          line: {
            type: 'rect'
          }
        },
        label: {
          visible: true
        }
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
