import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65548e5eb53f99008e8e6db2
 * 验证目的：隐藏滚动条的初始范围及分类轴显示。
 * 保留条件：xField, yField, scrollBar, crosshair；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
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
      xField: 'year',
      yField: 'sales',
      scrollBar: [
        {
          orient: 'bottom',
          start: 0,
          end: 0.5,
          roamZoom: {
            enable: true
          },
          visible: false
        }
      ],
      crosshair: {
        xField: {
          visible: false
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
