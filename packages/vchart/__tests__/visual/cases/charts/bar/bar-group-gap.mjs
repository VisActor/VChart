import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 64cc5eff378e90815866d456
 * 验证目的：分组柱的组内间距。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'bar',
      color: ['#becef3', '#6a8edc', '#77caeb', '#52c93b', '#d3f5e8'],
      data: [
        {
          id: 'barData',
          values: [
            {
              type: 'A',
              year: '2000',
              value: 25
            },
            {
              type: 'A',
              year: '2010',
              value: 28
            },
            {
              type: 'A',
              year: '2018',
              value: 18
            },
            {
              type: 'B',
              year: '2000',
              value: 23
            },
            {
              type: 'B',
              year: '2010',
              value: 32
            },
            {
              type: 'B',
              year: '2018',
              value: 22
            },
            {
              type: 'C',
              year: '2000',
              value: 18
            },
            {
              type: 'C',
              year: '2010',
              value: 18
            },
            {
              type: 'C',
              year: '2018',
              value: 18
            },
            {
              type: 'D',
              year: '2000',
              value: 15
            },
            {
              type: 'D',
              year: '2010',
              value: 22
            },
            {
              type: 'D',
              year: '2018',
              value: 19
            },
            {
              type: 'E',
              year: '2000',
              value: 5
            },
            {
              type: 'E',
              year: '2010',
              value: 12
            },
            {
              type: 'E',
              year: '2018',
              value: 5
            }
          ]
        }
      ],
      xField: ['year', 'type'],
      yField: 'value',
      seriesField: 'type',
      axes: [
        {
          orient: 'bottom',
          paddingInner: 0.3
        }
      ],
      bar: {
        style: {
          fillOpacity: 0.9
        }
      },
      barWidth: 10,
      barGapInGroup: '20%'
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
