import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64ab81a9a7d9c63765bac951
 * 验证目的：双数值轴的刻度对齐。
 * 保留条件：seriesField, series, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'common',
      seriesField: 'color',
      data: [
        {
          id: 'id0',
          values: [
            {
              x: 'Monday',
              type: 'Breakfast',
              y: 15
            },
            {
              x: 'Monday',
              type: 'Lunch',
              y: 25
            },
            {
              x: 'Tuesday',
              type: 'Breakfast',
              y: 12
            },
            {
              x: 'Tuesday',
              type: 'Lunch',
              y: 30
            },
            {
              x: 'Wednesday',
              type: 'Breakfast',
              y: 15
            },
            {
              x: 'Wednesday',
              type: 'Lunch',
              y: 24
            },
            {
              x: 'Thursday',
              type: 'Breakfast',
              y: 10
            },
            {
              x: 'Thursday',
              type: 'Lunch',
              y: 25
            },
            {
              x: 'Friday',
              type: 'Breakfast',
              y: 13
            },
            {
              x: 'Friday',
              type: 'Lunch',
              y: 20
            },
            {
              x: 'Saturday',
              type: 'Breakfast',
              y: 10
            },
            {
              x: 'Saturday',
              type: 'Lunch',
              y: 10
            },
            {
              x: 'Sunday',
              type: 'Breakfast',
              y: 20
            },
            {
              x: 'Sunday',
              type: 'Lunch',
              y: 19
            }
          ]
        },
        {
          id: 'id1',
          values: [
            {
              x: 'Monday',
              type: 'Drinks',
              y: -52
            },
            {
              x: 'Tuesday',
              type: 'Drinks',
              y: -43
            },
            {
              x: 'Wednesday',
              type: 'Drinks',
              y: -33
            },
            {
              x: 'Thursday',
              type: 'Drinks',
              y: -22
            },
            {
              x: 'Friday',
              type: 'Drinks',
              y: -10
            },
            {
              x: 'Saturday',
              type: 'Drinks',
              y: -30
            },
            {
              x: 'Sunday',
              type: 'Drinks',
              y: -50
            }
          ]
        }
      ],
      series: [
        {
          type: 'line',
          id: 'bar',
          dataIndex: 0,
          stack: false,
          label: {
            visible: true
          },
          seriesField: 'type',
          xField: ['x', 'type'],
          yField: 'y'
        },
        {
          type: 'line',
          id: 'line',
          dataIndex: 1,
          label: {
            visible: true
          },
          seriesField: 'type',
          xField: 'x',
          yField: 'y',
          stack: false
        }
      ],
      axes: [
        {
          orient: 'left',
          seriesIndex: [0],
          id: 'axisLeft',
          nice: false,
          zero: false
        },
        {
          orient: 'right',
          seriesId: ['line'],
          gird: {
            visible: false
          },
          label: {
            autoLimit: false
          },
          maxWidth: '50%',
          nice: false,
          zero: false,
          sync: {
            axisId: 'axisLeft',
            zeroAlign: true,
            tickAlign: true
          }
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band'
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
