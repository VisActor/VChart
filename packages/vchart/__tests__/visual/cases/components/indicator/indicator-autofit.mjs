import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65a0e60c918eea2d9742291c
 * 验证目的：环图指标文字自动适应。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const data = [
      { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
      { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
      { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
      { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
      { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
      { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
      { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
      { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
    ];
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: data
        }
      ],
      outerRadius: 0.8,
      innerRadius: 0.5,
      padAngle: 0.6,
      valueField: 'value',
      categoryField: 'type',
      pie: {
        style: {
          cornerRadius: 10,
          texture: datum => datum['texture']
        },
        state: {
          hover: {
            outerRadius: 0.85,
            stroke: '#000',
            lineWidth: 1
          },
          selected: {
            outerRadius: 0.85,
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      title: {
        visible: true,
        text: 'Statistics of Surface Element Content'
      },
      indicator: {
        visible: true,
        trigger: 'hover',
        limitRatio: 0.5,
        title: {
          visible: true,
          autoFit: true,
          fitStrategy: 'inscribed',
          style: {
            fontWeight: 'bolder',
            fontFamily: 'Times New Roman',
            fill: '#888',
            text: datum => {
              const d = datum ?? data[0];
              return d['formula'];
            }
          }
        },
        content: [
          {
            visible: true,
            autoFit: true,
            fitStrategy: 'inscribed',
            style: {
              fontSize: 20,
              fill: 'orange',
              fontWeight: 'bolder',
              fontFamily: 'Times New Roman',
              text: datum => {
                const d = datum ?? data[0];
                return d['type'];
              }
            }
          },
          {
            visible: true,
            autoFit: true,
            fitStrategy: 'inscribed',
            style: {
              fontSize: 18,
              fill: 'orange',
              fontFamily: 'Times New Roman',
              text: datum => {
                const d = datum ?? data[0];
                return d['value'] + '%';
              }
            }
          }
        ]
      },
      legends: {
        visible: true,
        orient: 'left',
        item: {
          shape: {
            style: {
              symbolType: 'circle',
              texture: datum => datum['texture']
            }
          }
        }
      },
      tooltip: {
        mark: {
          content: [
            {
              key: datum => datum['type'],
              value: datum => datum['value'] + '%'
            }
          ]
        }
      }
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await verifyRendered(page, 'indicator');
  }
};
