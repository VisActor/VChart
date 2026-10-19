import { verifySpec } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7f1c52a1e9eec95f9f05
 * 验证目的：拖动横向滚动条改变可视窗口。
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
          id: 'barData',
          values: [
            {
              year: '2000',
              sales: 22
            },
            {
              year: '2001',
              sales: 13
            },
            {
              year: '2002',
              sales: 25
            },
            {
              year: '2003',
              sales: 29
            },
            {
              year: '2004',
              sales: 38
            },
            {
              year: '2005',
              sales: 49
            },
            {
              year: '2006',
              sales: 58
            },
            {
              year: '2007',
              sales: 29
            },
            {
              year: '2008',
              sales: 78
            },
            {
              year: '2009',
              sales: 19
            },
            {
              year: '2010',
              sales: 23
            },
            {
              year: '2011',
              sales: 20
            },
            {
              year: '2012',
              sales: 98
            },
            {
              year: '2013',
              sales: 49
            },
            {
              year: '2014',
              sales: 28
            }
          ]
        }
      ],
      xField: 'year',
      yField: 'sales',
      scrollBar: [
        {
          orient: 'bottom',
          start: 0,
          end: 0.5,
          roam: true
        }
      ]
    };
  },
  async exercise(page) {
    // 对实际图元执行来源动作，不靠固定等待冒充动作完成。
    await page.evaluate(() => {
      const c = window.__visualChart;
      window.__scrollBefore = {
        spec: structuredClone(c.getSpec().scrollBar[0]),
        geometry: JSON.stringify(
          c
            .getChart()
            .getAllSeries()[0]
            .getSeriesMark()
            .getGraphics()
            .map(g => [
              g.globalAABBBounds.x1,
              g.globalAABBBounds.y1,
              g.globalAABBBounds.x2,
              g.globalAABBBounds.y2,
              g.attribute.points
            ])
        )
      };
      c.on('scrollBarChange', e => {
        window.__scrollResult = e.value;
      });
    });
    const geometry = await page.evaluate(() => {
      const g = window.__visualChart.getStage().find(g => g.name === 'slider', true);
      if (!g) throw Error('缺少滚动条手柄');
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(geometry.x, geometry.y);
    await page.mouse.down();
    await page.mouse.move(geometry.x + 120, geometry.y + 0, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 配置、状态及实际过滤结果须满足场景目的；动作未生效必须失败。
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const before = window.__scrollBefore,
        after = window.__scrollResult;
      if (!before || !after) return false;
      const moved =
        (Number.isFinite(before.spec.start) && Math.abs(before.spec.start - after.start) > 0.01) ||
        (Number.isFinite(before.spec.end) && Math.abs(before.spec.end - after.end) > 0.01) ||
        (before.spec.startValue !== undefined && before.spec.startValue !== after.startValue) ||
        (before.spec.endValue !== undefined && before.spec.endValue !== after.endValue);
      const graphics = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
      return (
        moved &&
        before.geometry !==
          JSON.stringify(
            graphics.map(g => [
              g.globalAABBBounds.x1,
              g.globalAABBBounds.y1,
              g.globalAABBBounds.x2,
              g.globalAABBBounds.y2,
              g.attribute.points
            ])
          )
      );
    });
  }
};
