import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64ce5d63a77f904af107fe72
 * 验证目的：雷达图负值与面积区域。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'radar',
      data: [
        {
          id: 'Platinum',
          values: [
            {
              key: 'Power',
              value: 5
            },
            {
              key: 'Speed',
              value: -15
            },
            {
              key: 'Range',
              value: 3
            },
            {
              key: 'Stamina',
              value: 5
            },
            {
              key: 'Precision',
              value: 5
            },
            {
              key: 'Growth',
              value: 5
            }
          ]
        }
      ],
      categoryField: 'key',
      valueField: 'value',
      point: {
        visible: false // 不展示点
      },
      area: {
        visible: true, // 展示面积
        state: {
          // 面积 hover 状态下的样式
          hover: {
            fillOpacity: 0.5
          }
        }
      },
      line: {
        style: {
          lineWidth: 4
        }
      },
      axes: [
        {
          orient: 'radius', // 半径轴配置
          zIndex: 100,

          max: 8,
          domainLine: {
            visible: false
          },
          label: {
            visible: true,
            space: 0,
            style: {
              textAlign: 'center',
              stroke: '#fff',
              lineWidth: 4
            }
          },
          grid: {
            smooth: false,
            style: {
              lineDash: [0]
            }
          }
        },
        {
          orient: 'angle', // 角度轴配置
          zIndex: 50,
          tick: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          label: {
            space: 20
          },
          grid: {
            style: {
              lineDash: [0]
            }
          }
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
