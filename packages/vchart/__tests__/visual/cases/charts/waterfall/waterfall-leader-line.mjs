import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6a02d2c286b0c30067ea9ea2
 * 验证目的：反向类目轴瀑布图的连接线与变化值堆叠标签。
 * 保留条件：legends, xField, yField, seriesField, total, stackLabel, title, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'waterfall',
      data: {
        id: 'id0',
        values: [
          {
            x: 'First Quarter',
            y: 10954,
            type: 'Primary Industry'
          },
          {
            x: 'First Quarter',
            y: 106187,
            type: 'Secondary Industry'
          },
          {
            x: 'First Quarter',
            y: 153037,
            type: 'Tertiary Industry'
          },
          {
            x: 'Second Quarter',
            y: 18183,
            type: 'Primary Industry'
          },
          {
            x: 'Second Quarter',
            y: 122450,
            type: 'Secondary Industry'
          },
          {
            x: 'Second Quarter',
            y: 151831,
            type: 'Tertiary Industry'
          },
          {
            x: 'Third Quarter',
            y: 25642,
            type: 'Primary Industry'
          },
          {
            x: 'Third Quarter',
            y: 121553,
            type: 'Secondary Industry'
          },
          {
            x: 'Third Quarter',
            y: 160432,
            type: 'Tertiary Industry'
          },
          {
            x: 'Fourth Quarter',
            y: 33497,
            type: 'Primary Industry'
          },
          {
            x: 'Fourth Quarter',
            y: 132601,
            type: 'Secondary Industry'
          },
          {
            x: 'Fourth Quarter',
            y: 169411,
            type: 'Tertiary Industry'
          },
          {
            x: 'Full year',
            total: true
          }
        ]
      },
      legends: {
        visible: true,
        orient: 'bottom'
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      total: {
        type: 'field',
        tagField: 'total'
      },
      stackLabel: {
        valueType: 'change'
      },
      title: {
        visible: true,
        text: 'Chinese quarterly GDP in 2022'
      },
      axes: [
        {
          orient: 'left',
          title: {
            visible: true,
            text: 'Unit: 100 million yuan'
          }
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band',
          paddingInner: 0.4,
          title: {
            visible: false
          },
          inverse: true
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
