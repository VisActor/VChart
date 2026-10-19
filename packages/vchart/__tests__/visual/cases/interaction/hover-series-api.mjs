import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65969dc589f0d500a1fdd476
 * 验证目的：源 pointerover 回调按 Age 更新同组及反向状态。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            { State: 'WY', Age: 'Under 5 Years', Population: 25635 },
            { State: 'WY', Age: '5 to 13 Years', Population: 1890 },
            { State: 'WY', Age: '14 to 17 Years', Population: 9314 },
            { State: 'DC', Age: 'Under 5 Years', Population: 30352 },
            { State: 'DC', Age: '5 to 13 Years', Population: 20439 },
            { State: 'DC', Age: '14 to 17 Years', Population: 10225 },
            { State: 'VT', Age: 'Under 5 Years', Population: 38253 },
            { State: 'VT', Age: '5 to 13 Years', Population: 42538 },
            { State: 'VT', Age: '14 to 17 Years', Population: 15757 },
            { State: 'ND', Age: 'Under 5 Years', Population: 51896 },
            { State: 'ND', Age: '5 to 13 Years', Population: 67358 },
            { State: 'ND', Age: '14 to 17 Years', Population: 18794 },
            { State: 'AK', Age: 'Under 5 Years', Population: 72083 },
            { State: 'AK', Age: '5 to 13 Years', Population: 85640 },
            { State: 'AK', Age: '14 to 17 Years', Population: 22153 }
          ]
        }
      ],
      yField: 'State',
      xField: 'Population',
      seriesField: 'Age',
      direction: 'horizontal',
      stack: true,
      percent: true,
      legends: { visible: true },
      label: {
        visible: true,
        position: 'center',
        smartInvert: true,
        syncState: true,
        style: { fill: '#222', stroke: null },
        state: { hover_series: { opacity: 1 }, unHover_series: { opacity: 0.1 } }
      },
      bar: { state: { hover_series: { opacity: 1 }, unHover_series: { opacity: 0.2 } } },
      tooltip: { transitionDuration: 0 },
      axes: [
        {
          orient: 'top',
          label: {
            formatMethod: val => {
              return `${(val * 100).toFixed(2)}%`;
            }
          }
        }
      ]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      chartSpace.on('pointerover', { level: 'mark' }, ({ datum, mark }) => {
        if (mark?.name === 'bar' && datum) {
          const series = datum.Age;
          chartSpace.updateState({
            hover_series: {
              filter: datum => datum.Age === series
            },
            unHover_series: {
              filter: datum => datum.Age !== series
            }
          });
        }
      });
      chartSpace.on('pointerout', { level: 'mark' }, ({ datum, mark }) => {
        if (mark?.name === 'bar' && datum) {
          chartSpace.updateState({
            hover_series: {
              filter: () => false
            },
            unHover_series: {
              filter: () => false
            }
          });
        }
      });
    });
    const p = await interactionTarget(page, 'bar');
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    const hover = await seriesStates(page);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    const off = await seriesStates(page);
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(v => (window.__apiStates = v), { hover, off });
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const r = window.__apiStates;
      if (
        !r?.hover.some(m => m.states.hover_series > 0) ||
        !r.hover.some(m => m.states.unHover_series > 0) ||
        r.off.some(m => m.states.hover_series > 0 || m.states.unHover_series > 0)
      )
        throw Error('自定义系列 hover/filter 未生效');
    });
  }
};
