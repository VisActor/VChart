import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 64ad3a0c147e41008a658030
 * 验证目的：显式轴定义域与多系列。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
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
          nice: false,
          zero: false,
          sync: {
            axisId: 'axisLeft',
            zeroAlign: true,
            tickAlign: true
          },
          label: {
            autoLimit: false
          },
          maxWidth: '50%'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band',
          domain: ['Monday', 'Tuesday', 'Wednesday']
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
