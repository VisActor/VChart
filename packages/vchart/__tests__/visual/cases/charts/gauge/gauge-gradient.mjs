import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0152a1e9eec95f9eb5
 * 验证目的：仪表盘渐变圆弧和指针组件。
 * 保留条件：radiusField, angleField, seriesField, outerRadius, innerRadius, startAngle, endAngle, gauge, pointer, pin, pinBackground；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'gauge',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'Target A',
              value: 0.6
            }
          ]
        }
      ],
      radiusField: 'type',
      angleField: 'value',
      seriesField: 'type',
      outerRadius: 0.8,
      innerRadius: 0.5,
      startAngle: -225,
      endAngle: 45,
      gauge: {
        type: 'circularProgress',
        progress: {
          style: {
            fill: {
              gradient: 'conical',
              stops: [
                {
                  offset: 0,
                  color: '#4FC6B4'
                },
                {
                  offset: 1,
                  color: '#31679E'
                }
              ]
            }
          }
        },
        track: {
          style: {
            fill: '#ccc'
          }
        }
      },
      pointer: {
        width: 0.5,
        height: 0.5,
        style: {
          path: 'M-0.020059 -0.978425 C-0.018029 -0.9888053 -0.013378 -1 0 -1 C0.01342 -1 0.01812 -0.989146 0.0201 -0.978425 C0.02161 -0.9702819 0.0692 -0.459505 0.09486 -0.184807 C0.10298 -0.097849 0.1089 -0.034548 0.11047 -0.018339 C0.11698 0.04908 0.07373 0.11111 0.00002 0.11111 C-0.07369 0.11111 -0.117184 0.04991 -0.110423 -0.018339 C-0.103662 -0.086591 -0.022089 -0.9680447 -0.020059 -0.978425Z',
          fill: '#5A595E'
        }
      },
      pin: {
        style: {
          path: 'M1 0 C1 0.55228 0.55228 1 0 1 C-0.552285 1 -1 0.55228 -1 0 C-1 -0.552285 -0.552285 -1 0 -1 C0.55228 -1 1 -0.552285 1 0Z',
          fill: '#888'
        }
      },
      pinBackground: {
        width: 0.08,
        height: 0.08,
        style: {
          path: 'M1 0 C1 0.55228 0.55228 1 0 1 C-0.552285 1 -1 0.55228 -1 0 C-1 -0.552285 -0.552285 -1 0 -1 C0.55228 -1 1 -0.552285 1 0Z',
          fill: '#ddd'
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
