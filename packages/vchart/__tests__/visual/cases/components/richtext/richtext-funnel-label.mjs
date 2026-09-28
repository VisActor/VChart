import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb76d097cc3d008de5b401
 * 验证目的：漏斗内外标签富文本和装饰。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const richTextConfig = text => [
      {
        text,
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'red',
        stroke: false
      },
      {
        text: 'Alternative',
        fontSize: 10,
        lineThrough: true,
        underline: true,
        fill: 'green',
        stroke: false
      }
    ];
    const spec = {
      type: 'funnel',
      maxSize: '60%',
      width: 600,
      minSize: '10%',
      height: 500,
      isTransform: true,
      shape: 'rect',
      color: {
        type: 'ordinal',
        range: ['#00328E', '#0048AA', '#005FC5', '#2778E2', '#4E91FF', '#70ABFF', '#8FC7FF', '#AEE2FF']
      },
      funnel: {
        style: {
          cornerRadius: 4,
          stroke: 'white',
          lineWidth: 2
        },
        state: {
          hover: {
            stroke: '#4e83fd',
            lineWidth: 1
          }
        }
      },
      transform: {
        style: {
          stroke: 'white',
          lineWidth: 2
        },
        state: {
          hover: {
            stroke: '#4e83fd',
            lineWidth: 1
          }
        }
      },
      outerLabel: {
        visible: true,
        alignLabel: false,
        formatMethod: (text, datum) => {
          if (datum && datum.value > 70) {
            return {
              type: 'rich',
              text: [
                {
                  text: '1111',
                  fontWeight: 'bold',
                  fill: '#3f51b5',
                  stroke: false
                },
                {
                  text: 'Alternative',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  fill: '#3f51b5',
                  stroke: false
                }
              ]
            };
          } else {
            return text;
          }
        }
      },
      transformLabel: {
        visible: true,
        formatMethod: text => {
          return {
            type: 'rich',
            text: [
              {
                text,
                fontWeight: 'bold',
                fill: 'red',
                stroke: false
              },
              {
                text: 'Alternative',
                fontStyle: 'italic',
                textDecoration: 'underline',
                fill: '#3f51b5',
                stroke: false
              }
            ]
          };
        }
      },
      label: {
        visible: true,
        textType: 'rich',
        formatMethod: () => {
          return [
            {
              text: 'TOOLTIP',
              fontWeight: 'bold',
              fill: 'red',
              stroke: false
            },
            {
              text: 'Alternative',
              fontStyle: 'italic',
              textDecoration: 'underline',
              fill: '#3f51b5',
              stroke: false
            }
          ];
        }
      },
      data: [
        {
          name: 'funnel',
          values: [
            {
              value: 100,
              name: 'Resume Screening',
              percent: 1
            },
            {
              value: 80,
              name: 'Resume Evaluation',
              percent: 0.8
            },
            {
              value: 50,
              name: 'Evaluation Passed',
              percent: 0.5
            },
            {
              value: 30,
              name: 'Interview',
              percent: 0.3
            },
            {
              value: 10,
              name: 'Final Pass',
              percent: 0.1
            }
          ]
        }
      ],
      categoryField: 'name',
      valueField: 'value'
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (
        !window.__visualChart
          .getStage()
          .findAll(g => g.type === 'richtext' && g.attribute.visible !== false && g.globalAABBBounds.width() > 0, true)
          .length
      )
        throw new Error('富文本未实际绘制');
    });
  }
};
