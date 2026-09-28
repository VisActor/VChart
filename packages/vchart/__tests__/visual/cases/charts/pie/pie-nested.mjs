import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f1152a1e9eec95f9ee7
 * 验证目的：多系列嵌套环形饼图。
 * 保留条件：series, color, title, legends；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'common',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: '0~29',
              value: '126.04'
            },
            {
              type: '30~59',
              value: '128.77'
            },
            {
              type: '60 and over',
              value: '77.09'
            }
          ]
        },
        {
          id: 'id1',
          values: [
            {
              type: '0~9',
              value: '39.12'
            },
            {
              type: '10~19',
              value: '43.01'
            },
            {
              type: '20~29',
              value: '43.91'
            },
            {
              type: '30~39',
              value: '45.4'
            },
            {
              type: '40~49',
              value: '40.89'
            },
            {
              type: '50~59',
              value: '42.48'
            },
            {
              type: '60~69',
              value: '39.63'
            },
            {
              type: '70~79',
              value: '25.17'
            },
            {
              type: '80 and over',
              value: '12.29'
            }
          ]
        }
      ],
      series: [
        {
          type: 'pie',
          dataIndex: 0,
          outerRadius: 0.65,
          innerRadius: 0,
          valueField: 'value',
          categoryField: 'type',
          label: {
            position: 'inside',
            visible: true,
            style: {
              fill: 'white'
            }
          },
          pie: {
            style: {
              stroke: '#ffffff',
              lineWidth: 2
            }
          }
        },
        {
          type: 'pie',
          dataIndex: 1,
          outerRadius: 0.8,
          innerRadius: 0.67,
          valueField: 'value',
          categoryField: 'type',
          label: {
            visible: true
          },
          pie: {
            style: {
              stroke: '#ffffff',
              lineWidth: 2
            }
          }
        }
      ],
      color: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'],
      title: {
        visible: true,
        text: 'US population by age in 2021 (millions)'
      },
      legends: {
        visible: true,
        orient: 'left'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
