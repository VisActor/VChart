import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0e52a1e9eec95f9ede
 * 验证目的：坐标点定位标注线。
 * 保留条件：xField, yField, markLine；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'line',
      data: {
        id: 'data2',
        values: [
          {
            x: 1,
            y: 80
          },
          {
            x: 2,
            y: 40
          },
          {
            x: 3,
            y: 10
          },
          {
            x: 4,
            y: 20
          }
        ]
      },
      xField: 'x',
      yField: 'y',
      markLine: [
        {
          coordinates: [
            {
              x: 1,
              y: 80
            },
            {
              x: 2,
              y: 40
            },
            {
              x: 3,
              y: 10
            }
          ],
          label: {
            text: 'Highlighted data',
            autoRotate: true,
            position: 'insideMiddleTop',
            labelBackground: {
              padding: 2,
              style: {
                fill: '#E8346D'
              }
            }
          },
          endSymbol: {
            style: {
              visible: false
            }
          },
          line: {
            style: {
              stroke: '#E8346D',
              lineDash: [],
              lineWidth: 2
            }
          }
        }
      ]
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
