import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb77ed97cc3d008de5b402
 * 验证目的：饼图富文本标题副标题及标签。
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
        fill: 'red'
      },
      {
        text: 'Alternative',
        fontSize: 10,
        lineThrough: true,
        underline: true,
        fill: 'green'
      }
    ];
    const spec = {
      type: 'pie',
      data: [
        {
          values: [
            {
              value: '159',
              type: 'Tradition Industries',
              percentage: '71.6%'
            },
            {
              value: '50',
              type: 'Business Companies',
              percentage: '22.5%'
            },
            {
              value: '13',
              type: 'Customer-facing Companies',
              percentage: '5.9%'
            }
          ]
        }
      ],
      title: {
        visible: true,
        align: 'left',
        verticalAlign: 'top',
        orient: 'top',
        textType: 'rich',
        text: [
          {
            text: 'Chinese Character Test',
            fontSize: 30,
            textAlign: 'center',
            textDecoration: 'underline',
            stroke: '#0f51b5',
            fill: false
          }
        ],
        subtextType: 'rich',
        subtext: [
          {
            text: 'Mapbox',
            fontWeight: 'bold',
            fontSize: 30,
            fill: '#3f51b5'
          },
          {
            text: 'was established in 2010 with the goal of providing an alternative solution',
            fill: '#000'
          },
          {
            text: 'alternative solution',
            fontStyle: 'italic',
            fill: '#3f51b5'
          },
          {
            text: ' to Google Maps. At that time, Google Map',
            fill: '#000'
          },
          {
            text: 'Map',
            textDecoration: 'line-through',
            fill: '#000'
          },
          {
            text: '[1]',
            script: 'super',
            fill: '#000'
          },
          {
            text: 'almost monopolized the online mapping business. However, within Google Maps, there was hardly any possibility for customization, and there were no tools available for map creators to create maps according to their own vision',
            fill: '#000'
          },
          {
            text: '.\n',
            fill: '#30ff05'
          }
        ]
      },
      radius: 0.8,
      innerRadius: 0.5,
      valueField: 'value',
      categoryField: 'type',
      label: {
        visible: true,
        textType: 'rich',
        formatMethod: text => richTextConfig(text),
        style: {
          fontSize: 16
        },
        line: {
          style: {},
          line1MinLength: 30
        },
        layout: {
          align: 'edge'
        }
      },
      pie: {
        state: {
          selected: {
            outerRadius: 0.85
          }
        }
      },
      indicator: {
        visible: true,
        fixed: true,
        gap: 10,
        title: {
          autoLimit: true,
          style: {
            fontSize: 16,
            text: datum => {
              if (datum && datum.value > 50) {
                return 111;
              }
              return {
                type: 'rich',
                text: [
                  {
                    text: 'type:',
                    fontWeight: 'bold',
                    fontSize: 20,
                    fill: '#3f51b5'
                  },
                  {
                    text: datum ? datum.type : '',
                    fontStyle: 'italic',
                    textDecoration: 'underline',
                    fill: '#3f51b5'
                  }
                ]
              };
            }
          }
        },
        content: [
          {
            style: {
              fontSize: 42,
              fontWeight: 'bolder',
              type: 'rich',
              text: [
                {
                  text: 'type:',
                  fontWeight: 'bold',
                  fontSize: 20,
                  fill: '#3f51b5'
                },
                {
                  text: '11111',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  fill: '#3f51b5'
                }
              ]
            }
          },
          {
            field: 'percentage',
            style: {
              fontSize: 20
            }
          }
        ]
      }
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
