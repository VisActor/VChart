import { verifySpec } from '../../helpers.mjs';
/**
 * BugServer case IDs: 65969e5f89f0d500a1fdd478
 * 验证目的：矩形树图标签同步选中状态。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'treemap',
      data: [
        {
          id: 'data',
          values: [
            {
              name: 'add',
              value: 593
            },
            {
              name: 'and',
              value: 330
            },
            {
              name: 'average',
              value: 287
            },
            {
              name: 'count',
              value: 277
            },
            {
              name: 'distinct',
              value: 292
            },
            {
              name: 'div',
              value: 595
            },
            {
              name: 'eq',
              value: 594
            },
            {
              name: 'fn',
              value: 460
            },
            {
              name: 'gt',
              value: 603
            },
            {
              name: 'gte',
              value: 625
            },
            {
              name: 'iff',
              value: 748
            },
            {
              name: 'isa',
              value: 461
            },
            {
              name: 'lt',
              value: 597
            },
            {
              name: 'lte',
              value: 619
            },
            {
              name: 'max',
              value: 283
            },
            {
              name: 'min',
              value: 283
            },
            {
              name: 'mod',
              value: 591
            },
            {
              name: 'mul',
              value: 603
            },
            {
              name: 'neq',
              value: 599
            },
            {
              name: 'not',
              value: 386
            },
            {
              name: 'or',
              value: 323
            },
            {
              name: 'orderby',
              value: 307
            },
            {
              name: 'range',
              value: 772
            },
            {
              name: 'select',
              value: 296
            },
            {
              name: 'stddev',
              value: 363
            },
            {
              name: 'sub',
              value: 600
            },
            {
              name: 'sum',
              value: 280
            },
            {
              name: 'update',
              value: 307
            },
            {
              name: 'variance',
              value: 335
            },
            {
              name: 'where',
              value: 299
            },
            {
              name: 'xor',
              value: 354
            },
            {
              name: '_',
              value: 264
            }
          ]
        }
      ],
      leaf: {
        state: {
          selected: {
            fill: 'red'
          }
        }
      },
      categoryField: 'name',
      valueField: 'value',
      label: {
        visible: true,
        syncState: true,
        smartInvert: true,
        style: {
          fontSize: 12
        },
        state: {
          selected: {
            fill: 'blue'
          }
        }
      },
      region: [
        {
          clip: true,
          style: {
            cornerRadius: 10
          }
        }
      ],
      tooltip: {
        transitionDuration: 0
      },
      select: {}
    };
  },
  async exercise(page) {
    // 对实际图元执行来源动作，不靠固定等待冒充动作完成。
    const p = await page.evaluate(mark => {
      const chart = window.__visualChart;
      let graphic;
      for (const s of chart.getChart().getAllSeries()) {
        const m = s.getMarks().find(m => m.name === mark);
        graphic = m?.getGraphics().find(g => g.attribute.visible !== false && g.globalAABBBounds.width() > 0);
        if (graphic) break;
      }
      if (!graphic) throw Error('缺少交互图元 ' + mark);
      const a = graphic.attribute,
        b = graphic.globalAABBBounds;
      if (a.startAngle !== undefined) {
        const angle = (a.startAngle + a.endAngle) / 2,
          radius = ((a.innerRadius || 0) + a.outerRadius) / 2;
        const p = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
        return graphic.globalTransMatrix.transformPoint(p, {});
      }
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    }, 'leaf');
    await page.mouse.click(p.x, p.y);
  },
  async verify(page) {
    // 配置、状态及实际过滤结果须满足场景目的；动作未生效必须失败。
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const all = window.__visualChart.getStage().findAll(g => g.currentStates?.includes('selected'), true);
      return all.length > 0;
    });
    await page.waitForFunction(
      () =>
        window.__visualChart.getStage().findAll(g => g.type === 'text' && g.currentStates?.includes('selected'), true)
          .length > 0
    );
  }
};
