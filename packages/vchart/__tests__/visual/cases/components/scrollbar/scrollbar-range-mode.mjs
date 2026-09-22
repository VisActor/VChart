import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 66d527361ea06200dae97791
 * 验证目的：滚动条值和比例混合范围。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              year: '2000',
              sales: 22
            },
            {
              year: '2001',
              sales: 13
            },
            {
              year: '2002',
              sales: 25
            },
            {
              year: '2003',
              sales: 29
            },
            {
              year: '2004',
              sales: 38
            },
            {
              year: '2005',
              sales: 49
            },
            {
              year: '2006',
              sales: 58
            },
            {
              year: '2007',
              sales: 29
            },
            {
              year: '2008',
              sales: 78
            },
            {
              year: '2009',
              sales: 19
            },
            {
              year: '2010',
              sales: 23
            },
            {
              year: '2011',
              sales: 20
            },
            {
              year: '2012',
              sales: 98
            },
            {
              year: '2013',
              sales: 49
            },
            {
              year: '2014',
              sales: 28
            }
          ]
        }
      ],
      direction: 'horizontal',
      yField: 'year',
      xField: 'sales',
      scrollBar: [
        {
          orient: 'right',
          rangeMode: ['percent', 'value'],
          start: 0,
          endValue: '2006',
          roam: true
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
