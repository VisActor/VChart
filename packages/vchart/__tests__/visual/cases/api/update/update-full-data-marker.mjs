import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 64fefdf896294da1e9b882c3
 * 验证目的：updateFullDataSync 原始更新值与标记组件。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：执行来源公开更新 API 并核验实际数据与图元，宿主截图钩子由测试流程替代。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'line',
      data: {
        id: 'line',
        values: [
          { time: '2:00', value: 8 },
          { time: '4:00', value: 9 },
          { time: '6:00', value: 11 },
          { time: '8:00', value: 14 },
          { time: '10:00', value: 16 },
          { time: '12:00', value: 17 },
          { time: '14:00', value: 17 },
          { time: '16:00', value: 16 },
          { time: '18:00', value: 15 }
        ]
      },
      xField: 'time',
      yField: 'value',
      markLine: [
        {
          y: data => {
            console.log('y', data);
            return data[2].value;
          },
          startSymbol: { visible: true, symbolType: 'triangleDown', style: { size: 10, fill: '#f3a016' } },
          endSymbol: { visible: false },
          autoRange: true,
          label: {
            visible: true,
            style: { dx: -4, dy: 0, fontSize: 12, fontWeight: 'normal', fill: '#fff', cursor: 'pointer' },
            position: 'insideStartTop',
            labelBackground: {
              visible: true,
              padding: { left: 5, right: 5, top: 2, bottom: 2 },
              style: { fill: '#2F3B52', fillOpacity: 0.9, dx: -4, dy: 0 }
            }
          },
          line: { style: { stroke: '#f3a016', lineWidth: 2, lineDash: [3, 3], cursor: 'pointer' } },
          relativeSeriesId: 'mainSeries',
          id: '7d14708c-de9d-49a1-919a-26c65ff95b42',
          interactive: true
        }
      ]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await verifySourceSpec(page);
    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      window.__beforeData = JSON.stringify(
        chartSpace
          .getChart()
          .getAllSeries()[0]
          .getViewData()
          .latestData.map(d => [d.time, d.value])
      );
      chartSpace.updateFullDataSync([
        {
          id: 'line',
          values: [
            { time: '2:00', value: 8 },
            { time: '4:00', value: 9 },
            { time: '6:00', value: 20 },
            { time: '8:00', value: 14 },
            { time: '10:00', value: 16 },
            { time: '12:00', value: 17 },
            { time: '14:00', value: 17 },
            { time: '16:00', value: 16 },
            { time: '18:00', value: 15 }
          ]
        }
      ]);
    });
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。

    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart,
        data = c
          .getChart()
          .getAllSeries()[0]
          .getViewData()
          .latestData.map(d => [d.time, d.value]);
      const expected = [
        ['2:00', 8],
        ['4:00', 9],
        ['6:00', 20],
        ['8:00', 14],
        ['10:00', 16],
        ['12:00', 17],
        ['14:00', 17],
        ['16:00', 16],
        ['18:00', 15]
      ];
      if (JSON.stringify(data) !== JSON.stringify(expected) || JSON.stringify(data) === window.__beforeData)
        throw Error('批量数据更新未生效');
      if (
        !c
          .getChart()
          .getAllComponents()
          .some(c => c.type === 'markLine')
      )
        throw Error('更新后标记线缺失');
    });
  }
};
