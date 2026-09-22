import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f1252a1e9eec95f9eea
 * 验证目的：饼图半径字段编码。
 * 保留条件：width, valueField, categoryField, outerRadius, innerRadius, scales, label, color, title, legends；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'pie',
      width: 600,
      data: [
        {
          id: 'id0',
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
      valueField: 'value',
      categoryField: 'type',
      outerRadius: {
        field: 'value',
        scale: 'outer-radius'
      },
      innerRadius: {
        field: 'value',
        scale: 'inner-radius'
      },
      scales: [
        {
          id: 'outer-radius',
          type: 'linear',
          domain: [10, 50],
          range: [120, 220]
        },
        {
          id: 'inner-radius',
          type: 'linear',
          domain: [10, 50],
          range: [110, 10]
        }
      ],
      label: {
        visible: true,
        position: 'inside'
      },
      color: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'],
      title: {
        visible: true,
        text: 'US population by age in 2021 (millions)'
      },
      legends: {
        visible: true,
        orient: 'right'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
