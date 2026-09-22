import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 652f89517b1b18b9934f7e17
 * 验证目的：自动缩进与单位文本偏移。
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
              State: 'WY',
              Age: 'Under 5 Years',
              Population: 25635
            },
            {
              State: 'WY',
              Age: '5 to 13 Years',
              Population: 1890
            },
            {
              State: 'WY',
              Age: '14 to 17 Years',
              Population: 9314
            },
            {
              State: 'DC',
              Age: 'Under 5 Years',
              Population: 30352
            },
            {
              State: 'DC',
              Age: '5 to 13 Years',
              Population: 20439
            },
            {
              State: 'DC',
              Age: '14 to 17 Years',
              Population: 10225
            },
            {
              State: 'VT',
              Age: 'Under 5 Years',
              Population: 38253
            },
            {
              State: 'VT',
              Age: '5 to 13 Years',
              Population: 42538
            },
            {
              State: 'VT',
              Age: '14 to 17 Years',
              Population: 15757
            },
            {
              State: 'ND',
              Age: 'Under 5 Years',
              Population: 51896
            },
            {
              State: 'ND',
              Age: '5 to 13 Years',
              Population: 67358
            },
            {
              State: 'ND',
              Age: '14 to 17 Years',
              Population: 18794
            },
            {
              State: 'AK',
              Age: 'Under 5 Years',
              Population: 72083
            },
            {
              State: 'AK',
              Age: '5 to 13 Years',
              Population: 85640
            },
            {
              State: 'AK',
              Age: '14 to 17 Years',
              Population: 22153
            }
          ]
        }
      ],
      xField: 'State',
      yField: 'Population',
      seriesField: 'Age',
      stack: true,
      legends: {
        visible: true
      },
      bar: {
        state: {
          hover: {
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      axes: [
        {
          orient: 'left',
          autoIndent: true,
          label: {
            style: {}
          },
          unit: {
            visible: true,
            text: 'Celsius',
            style: {
              dy: -10
            }
          }
        },
        {
          orient: 'bottom',
          inverse: true,
          unit: {
            visible: true,
            text: 'Celsius',
            style: {
              textAlign: 'right',
              textBaseline: 'top',
              dy: 10
            }
          }
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
