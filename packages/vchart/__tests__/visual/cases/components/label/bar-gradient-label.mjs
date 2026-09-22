import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 673dbf5979679700b2633f0e
 * 验证目的：透明渐变柱与标签布局。
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
      theme: {
        background: 'transparent',
        colorScheme: {
          default: ['red', 'green']
        }
      },
      bar: {
        style: {
          fill: {
            gradient: 'linear',
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 1,
            stops: [
              {
                offset: 0,
                opacity: 1
              },
              {
                offset: 1,
                opacity: 0
              }
            ]
          }
        }
      },
      label: {
        visible: true,
        position: 'inside-top'
      }
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
  }
};
