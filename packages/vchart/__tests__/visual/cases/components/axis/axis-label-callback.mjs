import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0358
 * 验证目的：坐标轴标签格式化回调。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'bar',
      axes: [
        {
          orient: 'bottom',
          paddingOuter: 0.1
        },
        {
          orient: 'left',
          grid: {
            visible: false
          },
          tick: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          tickCount: 3,
          label: {
            formatMethod: value => {
              return `${value}%`;
            }
          }
        }
      ],
      data: [
        {
          name: 'data',
          values: [
            {
              x: 'Mon',
              y: 100,
              type: 'Sales'
            },
            {
              x: 'Tues',
              y: 66,
              type: 'Sales'
            },
            {
              x: 'Wed',
              y: 95,
              type: 'Sales'
            },
            {
              x: 'Thus',
              y: 52,
              type: 'Sales'
            },
            {
              x: 'Fri',
              y: 68,
              type: 'Sales'
            },
            {
              x: 'Sat',
              y: 52,
              type: 'Sales'
            },
            {
              x: 'sun',
              y: 48,
              type: 'Sales'
            },
            {
              x: 'Mon',
              y: 43,
              type: 'Profit'
            },
            {
              x: 'Tues',
              y: 80,
              type: 'Profit'
            },
            {
              x: 'Wed',
              y: 68,
              type: 'Profit'
            },
            {
              x: 'Thus',
              y: 40,
              type: 'Profit'
            },
            {
              x: 'Fri',
              y: 53,
              type: 'Profit'
            },
            {
              x: 'Sat',
              y: 72,
              type: 'Profit'
            },
            {
              x: 'sun',
              y: 71,
              type: 'Profit'
            }
          ]
        }
      ],
      xField: ['x', 'type'],
      yField: 'y',
      seriesField: 'type',
      label: {
        style: {
          visible: false
        }
      }
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
