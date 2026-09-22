import { verifySpec } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7f0952a1e9eec95f9ecd
 * 验证目的：单选图例切换与数据过滤。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'line',
      data: [
        {
          id: 'line',
          values: [
            {
              name: 'Type A',
              value: 33934,
              year: 2010
            },
            {
              name: 'Type A',
              value: 52503,
              year: 2011
            },
            {
              name: 'Type A',
              value: 57177,
              year: 2012
            },
            {
              name: 'Type A',
              value: 69658,
              year: 2013
            },
            {
              name: 'Type A',
              value: 97031,
              year: 2014
            },
            {
              name: 'Type A',
              value: 119931,
              year: 2015
            },
            {
              name: 'Type A',
              value: 137133,
              year: 2016
            },
            {
              name: 'Type A',
              value: 154175,
              year: 2017
            },
            {
              name: 'Type B',
              value: 24916,
              year: 2010
            },
            {
              name: 'Type B',
              value: 24064,
              year: 2011
            },
            {
              name: 'Type B',
              value: 29742,
              year: 2012
            },
            {
              name: 'Type B',
              value: 29851,
              year: 2013
            },
            {
              name: 'Type B',
              value: 32490,
              year: 2014
            },
            {
              name: 'Type B',
              value: 30282,
              year: 2015
            },
            {
              name: 'Type B',
              value: 38121,
              year: 2016
            },
            {
              name: 'Type B',
              value: 40434,
              year: 2017
            },
            {
              name: 'Type C',
              value: 11744,
              year: 2010
            },
            {
              name: 'Type C',
              value: 17722,
              year: 2011
            },
            {
              name: 'Type C',
              value: 16005,
              year: 2012
            },
            {
              name: 'Type C',
              value: 19771,
              year: 2013
            },
            {
              name: 'Type C',
              value: 20185,
              year: 2014
            },
            {
              name: 'Type C',
              value: 24377,
              year: 2015
            },
            {
              name: 'Type C',
              value: 32147,
              year: 2016
            },
            {
              name: 'Type C',
              value: 39389,
              year: 2017
            },
            {
              name: 'Type D',
              value: null,
              year: 2010
            },
            {
              name: 'Type D',
              value: null,
              year: 2011
            },
            {
              name: 'Type D',
              value: 7988,
              year: 2012
            },
            {
              name: 'Type D',
              value: 12169,
              year: 2013
            },
            {
              name: 'Type D',
              value: 15112,
              year: 2014
            },
            {
              name: 'Type D',
              value: 22452,
              year: 2015
            },
            {
              name: 'Type D',
              value: 34400,
              year: 2016
            },
            {
              name: 'Type D',
              value: 34227,
              year: 2017
            },
            {
              name: 'Other',
              value: 12908,
              year: 2010
            },
            {
              name: 'Other',
              value: 5948,
              year: 2011
            },
            {
              name: 'Other',
              value: 8105,
              year: 2012
            },
            {
              name: 'Other',
              value: 11248,
              year: 2013
            },
            {
              name: 'Other',
              value: 8989,
              year: 2014
            },
            {
              name: 'Other',
              value: 11816,
              year: 2015
            },
            {
              name: 'Other',
              value: 18274,
              year: 2016
            },
            {
              name: 'Other',
              value: 18111,
              year: 2017
            }
          ]
        }
      ],
      xField: 'year',
      yField: 'value',
      seriesField: 'name',
      legends: {
        orient: 'right',
        selectMode: 'single',
        defaultSelected: ['Type D'],
        title: {
          visible: true,
          text: 'Single selection'
        }
      },
      axes: [
        {
          orient: 'left',
          label: {
            inside: true,
            space: 2,
            style: {
              textBaseline: 'bottom',
              textAlign: 'start',
              fontWeight: 'bold'
            }
          },
          tick: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          title: {
            visible: true,
            text: 'Title'
          }
        }
      ]
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
          return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
        })
    );
    if (items.length < 2) throw Error('缺少图例项');
    await page.mouse.click(items[1].x, items[1].y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 配置、状态及实际过滤结果须满足场景目的；动作未生效必须失败。
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const now = window.__visualChart.getLegendSelectedDataByIndex();
      return (
        window.__selectedBefore && now.length === 1 && JSON.stringify(now) !== JSON.stringify(window.__selectedBefore)
      );
    });
    await page.evaluate(() => {
      const data = JSON.stringify(window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData);
      if (data === window.__legendDataBefore) throw Error('图例没有改变实际数据');
    });
  }
};
