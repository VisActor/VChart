import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 671f2e27c21c5900b3182301
 * 验证目的：多层分类轴标签自动换行。
 * 保留条件：width, xField, yField, seriesField, barGapInGroup, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'bar',
      width: 200,
      data: [
        {
          name: 'data1',
          values: [
            {
              name: 'Product 1',
              industry: 'E-commerce',
              type: 'Contract amount',
              y: 88
            },
            {
              name: 'Product 1',
              industry: 'E-commerce',
              type: 'Paid for',
              y: 40
            },
            {
              name: 'Product 1',
              industry: 'E-commerce',
              type: 'Receivables',
              y: 78
            },
            {
              name: 'Product 1',
              industry: 'Game',
              type: 'Contract amount',
              y: 96
            },
            {
              name: 'Product 1',
              industry: 'Game',
              type: 'Paid for',
              y: 70
            },
            {
              name: 'Product 1',
              industry: 'Game',
              type: 'Receivables',
              y: 86
            },
            {
              name: 'Product 2',
              industry: 'E-commerce',
              type: 'Contract amount',
              y: 96
            },
            {
              name: 'Product 2',
              industry: 'E-commerce',
              type: 'Paid for',
              y: 45
            },
            {
              name: 'Product 2',
              industry: 'E-commerce',
              type: 'Receivables',
              y: 67
            },
            {
              name: 'Product 2',
              industry: 'Game',
              type: 'Contract amount',
              y: 89
            },
            {
              name: 'Product 2',
              industry: 'Game',
              type: 'Paid for',
              y: 34
            },
            {
              name: 'Product 2',
              industry: 'Game',
              type: 'Receivables',
              y: 50
            }
          ]
        }
      ],
      xField: ['name', 'industry', 'type'],
      yField: 'y',
      seriesField: 'type',
      barGapInGroup: 0,
      axes: [
        {
          orient: 'bottom',
          sampling: false,
          label: {
            autoHide: false,
            autoWrap: true,
            overlap: false,
            style: {
              _debug_bounds: true
            }
          },
          showAllGroupLayers: true,
          layers: [
            {
              visible: false
            }
          ]
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
