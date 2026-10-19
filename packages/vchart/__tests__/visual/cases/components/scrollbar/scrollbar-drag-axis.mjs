import { verifySpec } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7f1d52a1e9eec95f9f06
 * 验证目的：拖动滚动条调整轴范围。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'line',
      data: {
        values: [
          {
            time: '0:05',
            value: 10
          },
          {
            time: '0:10',
            value: 18
          },
          {
            time: '0:15',
            value: 20
          },
          {
            time: '0:20',
            value: 18
          },
          {
            time: '0:25',
            value: 20
          },
          {
            time: '0:30',
            value: 18
          },
          {
            time: '0:35',
            value: 20
          },
          {
            time: '0:40',
            value: 18
          },
          {
            time: '0:45',
            value: 20
          },
          {
            time: '0:50',
            value: 18
          },
          {
            time: '0:55',
            value: 10
          },
          {
            time: '1:00',
            value: 28
          },
          {
            time: '1:05',
            value: 18
          },
          {
            time: '1:10',
            value: 14
          },
          {
            time: '1:15',
            value: 12
          },
          {
            time: '1:20',
            value: 9
          },
          {
            time: '1:25',
            value: 20
          },
          {
            time: '1:30',
            value: 3
          },
          {
            time: '1:35',
            value: 4
          },
          {
            time: '1:40',
            value: 5
          },
          {
            time: '1:45',
            value: 10
          },
          {
            time: '1:50',
            value: 16
          },
          {
            time: '1:55',
            value: 10
          },
          {
            time: '2:00',
            value: 8
          },
          {
            time: '2:05',
            value: 18
          },
          {
            time: '2:10',
            value: 14
          },
          {
            time: '2:15',
            value: 12
          },
          {
            time: '2:20',
            value: 9
          },
          {
            time: '2:25',
            value: 20
          },
          {
            time: '2:30',
            value: 3
          },
          {
            time: '2:35',
            value: 4
          },
          {
            time: '2:40',
            value: 5
          },
          {
            time: '2:45',
            value: 10
          },
          {
            time: '2:50',
            value: 16
          },
          {
            time: '2:55',
            value: 10
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      scrollBar: [
        {
          orient: 'bottom',
          start: 0.8,
          end: 1,
          roam: true,
          filterMode: 'axis'
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
    await page.mouse.move(geometry.x - 120, geometry.y + 0, { steps: 12 });
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
