import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0445
 * 验证目的：瀑布图绝对值堆叠标签与字段总计。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'common',
      seriesField: 'type',
      data: [
        {
          id: 'id0',
          values: [
            {
              x: 'Subtotal',
              total: true,
              start: 100,
              value: 100
            },
            {
              x: '0',
              y: 20,
              type: 'A'
            },
            {
              x: '0',
              y: 11,
              type: 'B'
            },
            {
              x: '1',
              y: 20,
              type: 'A'
            },
            {
              x: '1',
              y: 20,
              type: 'B'
            },
            {
              x: 'Subtotal1',
              total: true,
              collect: 3
            },
            {
              x: '2',
              y: -100,
              type: 'A'
            },
            {
              x: '2',
              y: -80,
              type: 'B'
            },
            {
              x: '3',
              y: -20,
              type: 'A'
            },
            {
              x: '3',
              y: -20,
              type: 'B'
            },
            {
              x: 'Subtotal2',
              total: true,
              collect: 3
            },
            {
              x: '4',
              y: 20,
              type: 'A'
            },
            {
              x: '4',
              y: 20,
              type: 'B'
            },
            {
              x: '5',
              y: 20,
              type: 'A'
            },
            {
              x: '5',
              y: 20,
              type: 'B'
            },
            {
              x: 'Total',
              total: true,
              collect: 3
            }
          ]
        }
      ],
      series: [
        {
          type: 'waterfall',
          dataIndex: 0,
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          total: {
            type: 'field',
            tagField: 'total',
            startField: 'start',
            valueField: 'value',
            collectCountField: 'collect'
          },
          stackLabel: {
            valueType: 'absolute'
          }
        }
      ],
      axes: [
        {
          orient: 'left'
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'band',
          paddingInner: 0.4
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
