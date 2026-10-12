import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66f3bfb0e905a400f7326aa3
 * 验证目的：柱图外侧标签的智能反色配置。
 * 保留条件：xField, yField, seriesField, legends, label；原始数值、数据顺序和配置组合。
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
              type: 'Autocracies',
              year: '1930',
              value: 129
            },
            {
              type: 'Autocracies',
              year: '1940',
              value: 133
            },
            {
              type: 'Autocracies',
              year: '1950',
              value: 130
            },
            {
              type: 'Autocracies',
              year: '1960',
              value: 126
            },
            {
              type: 'Autocracies',
              year: '1970',
              value: 117
            },
            {
              type: 'Autocracies',
              year: '1980',
              value: 114
            },
            {
              type: 'Autocracies',
              year: '1990',
              value: 111
            },
            {
              type: 'Autocracies',
              year: '2000',
              value: 89
            },
            {
              type: 'Autocracies',
              year: '2010',
              value: 80
            },
            {
              type: 'Autocracies',
              year: '2018',
              value: 80
            },
            {
              type: 'Democracies',
              year: '1930',
              value: 22
            },
            {
              type: 'Democracies',
              year: '1940',
              value: 13
            },
            {
              type: 'Democracies',
              year: '1950',
              value: 25
            },
            {
              type: 'Democracies',
              year: '1960',
              value: 29
            },
            {
              type: 'Democracies',
              year: '1970',
              value: 38
            },
            {
              type: 'Democracies',
              year: '1980',
              value: 41
            },
            {
              type: 'Democracies',
              year: '1990',
              value: 57
            },
            {
              type: 'Democracies',
              year: '2000',
              value: 87
            },
            {
              type: 'Democracies',
              year: '2010',
              value: 98
            },
            {
              type: 'Democracies',
              year: '2018',
              value: 99
            }
          ]
        }
      ],
      xField: ['year', 'type'],
      yField: 'value',
      seriesField: 'type',
      legends: {
        visible: true,
        orient: 'top',
        position: 'start'
      },
      label: {
        visible: true,
        smartInvert: {
          fillStrategy: 'similarBase'
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
