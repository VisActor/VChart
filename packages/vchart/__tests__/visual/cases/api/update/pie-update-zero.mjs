import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 67ed18f4d3963500b3ec8262
 * 验证目的：全零饼图经原始 updateData 更新为有效扇区。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：执行来源公开更新 API 并核验实际数据与图元，宿主截图钩子由测试流程替代。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'oxygen', value: 0 },
            { type: 'silicon', value: 0 },
            { type: 'aluminum', value: 0 }
          ]
        }
      ],
      outerRadius: 0.8,
      innerRadius: 0.5,
      padAngle: 0.6,
      valueField: 'value',
      categoryField: 'type',
      pie: {
        style: { cornerRadius: 10 },
        state: {
          hover: { outerRadius: 0.85, stroke: '#000', lineWidth: 1 },
          selected: { outerRadius: 0.85, stroke: '#000', lineWidth: 1 }
        }
      },
      legends: {},
      label: { visible: true },
      emptyPlaceholder: { showEmptyCircle: true }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await verifySourceSpec(page);
    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      window.__zeroBefore = chartSpace
        .getChart()
        .getAllSeries()[0]
        .getViewData()
        .latestData.every(d => d.value === 0);
      chartSpace.updateData('id0', [
        { type: 'oxygen', value: 10 },
        { type: 'silicon', value: 30 },
        { type: 'aluminum', value: 50 }
      ]);
    });
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。

    await verifyRendered(page);
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries()[0];
      if (
        !window.__zeroBefore ||
        JSON.stringify(s.getViewData().latestData.map(d => d.value)) !== '[10,30,50]' ||
        s.getSeriesMark().getGraphics().length !== 3
      )
        throw Error('全零饼图未更新为三个扇区');
    });
  }
};
