import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7eeb52a1e9eec95f9e76
 * 验证目的：四方向轴的内侧刻度、标签格式与轴线组合。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'line',
      theme: { fontFamily: 'serif' },
      data: [
        {
          id: 'line',
          values: [
            { x: 'Monday', y: 12 },
            { x: 'Tuesday', y: 13 },
            { x: 'Wednesday', y: 11 },
            { x: 'Thursday', y: 10 },
            { x: 'Friday', y: 12 },
            { x: 'Saturday', y: 14 },
            { x: 'Sunday', y: 17 }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      axes: [
        {
          orient: 'right',
          title: { visible: true, space: 12, text: '右轴标题' },
          label: {
            formatMethod: val => `${val}°C`,
            style: {
              fill: '#000'
            }
          },
          tick: {
            visible: true,
            tickStep: 2,
            tickSize: 6,
            style: {
              stroke: '#000'
            }
          },
          domainLine: {
            visible: true,
            style: {
              stroke: '#000'
            }
          },
          grid: {
            visible: false
          }
        },
        {
          orient: 'left',
          title: {
            visible: true,
            space: 12,
            text: '左轴标题'
          },
          label: {
            formatMethod: val => `${val}°C`,
            style: {
              fill: '#000'
            }
          },
          tick: {
            visible: true,
            tickStep: 2,
            tickSize: 6,
            style: {
              stroke: '#000'
            }
          },
          domainLine: {
            visible: true,
            style: {
              stroke: '#000'
            }
          },
          grid: {
            visible: true,
            style: {
              lineDash: [0]
            }
          }
        },
        {
          orient: 'top',
          label: {
            style: {
              fill: '#000'
            }
          },
          tick: {
            inside: true,
            tickSize: 8,
            style: {
              stroke: '#000'
            }
          },
          domainLine: {
            style: {
              stroke: '#000'
            }
          },
          grid: {
            visible: true,
            style: {
              lineDash: [0]
            }
          }
        },
        {
          orient: 'bottom',
          label: {
            inside: true,
            style: {
              fill: '#000'
            }
          },
          domainLine: {
            style: {
              stroke: '#000'
            }
          },
          grid: {
            visible: false
          },
          tick: {
            inside: true,
            tickSize: 8,
            style: {
              stroke: '#000'
            }
          }
        }
      ]
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
