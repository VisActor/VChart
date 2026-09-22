import { verifySpec } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0433
 * 验证目的：图例全部取消后恢复选择（空态检查不截图）。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: [
            {
              city: 'Shijiazhuang',
              type: 'Fruit',
              value: 14500
            },
            {
              city: 'Shijiazhuang',
              type: 'Rice and flour',
              value: 8500
            },
            {
              city: 'Shijiazhuang',
              type: 'Snacks',
              value: 10000
            },
            {
              city: 'Shijiazhuang',
              type: 'Tea',
              value: 7000
            },
            {
              city: 'Shenzhen',
              type: 'Fruit',
              value: 9000
            },
            {
              city: 'Shenzhen',
              type: 'Rice and flour',
              value: 8500
            },
            {
              city: 'Shenzhen',
              type: 'Snacks',
              value: 11000
            },
            {
              city: 'Shenzhen',
              type: 'Tea',
              value: 6000
            },
            {
              city: 'Wenzhou',
              type: 'Fruit',
              value: 16000
            },
            {
              city: 'Wenzhou',
              type: 'Rice and flour',
              value: 5000
            },
            {
              city: 'Wenzhou',
              type: 'Snacks',
              value: 6000
            },
            {
              city: 'Wenzhou',
              type: 'Tea',
              value: 10000
            },
            {
              city: 'Ningbo',
              type: 'Fruit',
              value: 14000
            },
            {
              city: 'Ningbo',
              type: 'Rice and flour',
              value: 9000
            },
            {
              city: 'Ningbo',
              type: 'Snacks',
              value: 10000
            },
            {
              city: 'Ningbo',
              type: 'Tea',
              value: 9000
            },
            {
              city: 'Wuxi',
              type: 'Fruit',
              value: 14000
            },
            {
              city: 'Wuxi',
              type: 'Rice and flour',
              value: 9000
            },
            {
              city: 'Wuxi',
              type: 'Snacks',
              value: 10000
            },
            {
              city: 'Wuxi',
              type: 'Tea',
              value: 6000
            },
            {
              city: 'Hangzhou',
              type: 'Fruit',
              value: 9000
            },
            {
              city: 'Hangzhou',
              type: 'Rice and flour',
              value: 8500
            },
            {
              city: 'Hangzhou',
              type: 'Snacks',
              value: 10000
            },
            {
              city: 'Hangzhou',
              type: 'Tea',
              value: 6000
            },
            {
              city: 'Beijing',
              type: 'Fruit',
              value: 17000
            },
            {
              city: 'Beijing',
              type: 'Rice and flour',
              value: 6000
            },
            {
              city: 'Beijing',
              type: 'Snacks',
              value: 7000
            },
            {
              city: 'Beijing',
              type: 'Tea',
              value: 10000
            },
            {
              city: 'Shanghai',
              type: 'Fruit',
              value: 18000
            },
            {
              city: 'Shanghai',
              type: 'Rice and flour',
              value: 11000
            },
            {
              city: 'Shanghai',
              type: 'Snacks',
              value: 15000
            },
            {
              city: 'Shanghai',
              type: 'Tea',
              value: 14000
            }
          ]
        }
      ],
      xField: ['city', 'type'],
      yField: 'value',
      seriesField: 'type',
      legends: {
        orient: 'right',
        position: 'start',
        padding: {
          left: 12
        },
        item: {
          focus: true
        },
        defaultSelected: ['Snacks', 'Rice and flour'],
        allowAllCanceled: true
      }
    };
  },
  async exercise(page) {
    // 对实际图元执行来源动作，不靠固定等待冒充动作完成。
    await page.evaluate(() => {
      window.__selectedBefore = window.__visualChart.getLegendSelectedDataByIndex();
      window.__legendDataBefore = JSON.stringify(
        window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData
      );
    });
    const items = await page.evaluate(() =>
      window.__visualChart
        .getStage()
        .findAll(g => g.name === 'legendItem', true)
        .map(g => {
          const b = g.globalAABBBounds;
          return {
            x: (b.x1 + b.x2) / 2,
            y: (b.y1 + b.y2) / 2,
            texts: g.findAll(n => n.type === 'text', true).map(n => String(n.attribute.text))
          };
        })
    );
    if (items.length < 2) throw Error('缺少图例项');
    const selected = await page.evaluate(() => window.__selectedBefore);
    for (const p of items.filter(p => p.texts.some(t => selected.includes(t)))) await page.mouse.click(p.x, p.y);
    await page.waitForFunction(
      () =>
        window.__visualChart.getLegendSelectedDataByIndex().length === 0 &&
        window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData.length === 0
    );
    await page.evaluate(() => {
      window.__clearedAll = true;
    });
    await page.mouse.click(items[0].x, items[0].y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 配置、状态及实际过滤结果须满足场景目的；动作未生效必须失败。
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const now = window.__visualChart.getLegendSelectedDataByIndex();
      return (
        window.__selectedBefore &&
        window.__clearedAll === true &&
        now.length === 1 &&
        JSON.stringify(now) !== JSON.stringify(window.__selectedBefore)
      );
    });
    await page.evaluate(() => {
      const data = JSON.stringify(window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData);
      if (data === window.__legendDataBefore) throw Error('图例没有改变实际数据');
    });
  }
};
