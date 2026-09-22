import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb79e297cc3d008de5b40e
 * 验证目的：区间柱富文本标签。
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
      type: 'rangeColumn',
      data: [
        {
          values: [
            { type: 'Category One', min: 76, max: 100 },
            { type: 'Category Two', min: 56, max: 108 },
            { type: 'Category Three', min: 38, max: 129 },
            { type: 'Category Four', min: 58, max: 155 },
            { type: 'Category Five', min: 45, max: 120 },
            { type: 'Category Six', min: 23, max: 99 },
            { type: 'Category Seven', min: 18, max: 56 },
            { type: 'Category Eight', min: 18, max: 34 }
          ]
        }
      ],
      xField: 'type',
      yField: ['min', 'max'],
      label: {
        visible: true,
        formatMethod: (text, datum) => {
          if (datum.min > 30) {
            return {
              type: 'rich',
              text: richTextConfig(text)
            };
          }
          return 111;
        },
        position: 'middle',
        minLabel: {
          visible: false,
          formatMethod: text => {
            return {
              type: 'rich',
              text: richTextConfig(text)
            };
          }
        },
        maxLabel: {
          visible: true,
          formatMethod: text => {
            return {
              type: 'rich',
              text: richTextConfig(text)
            };
          }
        }
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
