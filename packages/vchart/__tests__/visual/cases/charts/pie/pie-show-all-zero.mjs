import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66a8d730ef352c00ab73f491
 * 验证目的：showAllZero 下全零数据的扇区及外侧标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'pie',
      data: [
        {
          values: [
            {
              value: 0,
              type: 'Tradition Industries',
              percentage: '71.6%'
            },
            {
              value: 0,
              type: 'Business Companies',
              percentage: '22.5%'
            },
            {
              value: 0,
              type: 'Customer-facing Companies',
              percentage: '5.9%'
            }
          ]
        }
      ],
      radius: 0.8,
      innerRadius: 0.5,
      valueField: 'value',
      categoryField: 'type',
      label: {
        visible: true,
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
        fixed: false,
        trigger: 'select',
        gap: 10,
        title: {
          field: 'type',
          autoLimit: true,
          style: {
            fontSize: 16
          }
        },
        content: [
          {
            field: 'value',
            style: {
              fontSize: 42,
              fontWeight: 'bolder'
            }
          },
          {
            field: 'percentage',
            style: {
              fontSize: 20
            }
          }
        ]
      },
      showAllZero: true
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'label');
    await page.evaluate(() => {
      const graphics = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
      if (
        graphics.length !== 3 ||
        graphics.some(
          g => g.attribute.innerRadius <= 0 || Math.abs(g.attribute.endAngle - g.attribute.startAngle) < 0.01
        )
      )
        throw new Error('全零数据未呈现三个环形扇区');
    });
  }
};
