import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f1752a1e9eec95f9efa
 * 验证目的：玫瑰图分组数据的堆叠。
 * 保留条件：categoryField, valueField, seriesField, outerRadius, stack, title, legends, color, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'rose',
      data: [
        {
          values: [
            {
              time: '12814',
              month: 'Jan',
              level: '0-3'
            },
            {
              time: '3054',
              month: 'Jan',
              level: '3-6'
            },
            {
              time: '4376',
              month: 'Jan',
              level: '6-9'
            },
            {
              time: '4229',
              month: 'Jan',
              level: '9-12'
            },
            {
              time: '8814',
              month: 'Feb',
              level: '0-3'
            },
            {
              time: '5067',
              month: 'Feb',
              level: '3-6'
            },
            {
              time: '13987',
              month: 'Feb',
              level: '6-9'
            },
            {
              time: '3932',
              month: 'Feb',
              level: '9-12'
            },
            {
              time: '11624',
              month: 'Mar',
              level: '0-3'
            },
            {
              time: '7004',
              month: 'Mar',
              level: '3-6'
            },
            {
              time: '3574',
              month: 'Mar',
              level: '6-9'
            },
            {
              time: '5221',
              month: 'Mar',
              level: '9-12'
            },
            {
              time: '8814',
              month: 'Apr',
              level: '0-3'
            },
            {
              time: '9054',
              month: 'Apr',
              level: '3-6'
            },
            {
              time: '4376',
              month: 'Apr',
              level: '6-9'
            },
            {
              time: '5256',
              month: 'Apr',
              level: '9-12'
            },
            {
              time: '9998',
              month: 'May',
              level: '0-3'
            },
            {
              time: '5043',
              month: 'May',
              level: '3-6'
            },
            {
              time: '4572',
              month: 'May',
              level: '6-9'
            },
            {
              time: '3308',
              month: 'May',
              level: '9-12'
            },
            {
              time: '12321',
              month: 'Jun',
              level: '0-3'
            },
            {
              time: '15067',
              month: 'Jun',
              level: '3-6'
            },
            {
              time: '3417',
              month: 'Jun',
              level: '6-9'
            },
            {
              time: '5432',
              month: 'Jun',
              level: '9-12'
            }
          ]
        }
      ],
      categoryField: 'month',
      valueField: 'time',
      seriesField: 'level',
      outerRadius: 1,
      stack: true,
      title: {
        visible: true,
        text: 'Wind speed in first half of year'
      },
      legends: [
        {
          visible: true,
          position: 'middle',
          orient: 'left'
        }
      ],
      color: ['#FFB84C', '#F266AB', '#A459D1', '#2CD3E1'],
      axes: [
        {
          orient: 'angle',
          domainLine: {
            visible: true,
            smooth: true
          },
          label: {
            visible: true
          },
          tick: {
            visible: true
          },
          grid: {
            visible: true
          },
          bandPadding: 0.05
        },
        {
          orient: 'radius',
          label: {
            visible: true
          },
          grid: {
            visible: true,
            smooth: true
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
