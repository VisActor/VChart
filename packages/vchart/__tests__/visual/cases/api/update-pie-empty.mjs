import { verifySpec, verifyEmptyPie } from '../../helpers.mjs';

/**
 * BugServer case IDs: 67ed193db17ad700a7818601
 * 验证目的：更新饼图数据为 null 和零后切换占位图。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：保留来源动作或按源事件执行操作并检查结果。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'oxygen', value: 10 },
            { type: 'silicon', value: 30 },
            { type: 'aluminum', value: 50 }
          ]
        }
      ],
      // supportNegative: true,
      outerRadius: 0.8,
      innerRadius: 0.5,
      padAngle: 0.6,
      valueField: 'value',
      categoryField: 'type',
      pie: {
        style: {
          cornerRadius: 10
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
      legends: {},
      label: {
        visible: true
      },
      emptyPlaceholder: {
        showEmptyCircle: true
      }
    };

    return spec;
  },
  async exercise(page) {
    // 适配源动作；鼠标定位按实际图元，避免绑定旧宿主像素坐标。
    await page.evaluate(() =>
      window.__visualChart.updateData('id0', [
        { type: 'oxygen', value: null },
        { type: 'silicon', value: null },
        { type: 'aluminum', value: 0 }
      ])
    );
  },
  async verify(page) {
    // 完整配置和回调由 verifySpec 检查，另验证最终绘制或操作结果。
    await verifySpec(page, { type: 'pie', emptyPlaceholder: this.createSpec().emptyPlaceholder });
    await verifyEmptyPie(page);
    await page.evaluate(() => {
      const data = window.__visualChart.getChart().getAllSeries()[0].getRawData().latestData;
      if (data.length !== 3 || data[0].value !== null || data[1].value !== null || data[2].value !== 0)
        throw new Error('空值更新未生效');
    });
  }
};
