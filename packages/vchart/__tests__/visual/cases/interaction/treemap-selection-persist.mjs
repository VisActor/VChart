import { interactionTarget, interactionFrame } from '../../interaction-helpers.mjs';
import { verifySpec } from '../../helpers.mjs';
/**
 * BugServer case IDs: 6582ac01847639595bfc6181
 * 验证目的：矩形树图 triggerOff=none 时空白点击保留选择。
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
        style: {
          fontSize: 12
        }
      },
      tooltip: false,
      region: [
        {
          clip: true,
          style: {
            cornerRadius: 10
          }
        }
      ],
      select: {
        triggerOff: 'none'
      }
    };
  },
  async exercise(page) {
    // 对两个不同叶节点执行源 click，再以空白点击验证 triggerOff:none 的保留行为。
    const observations = [];
    for (const index of [0, 1]) {
      const p = await interactionTarget(page, 'leaf', index);
      await page.mouse.click(p.x, p.y);
      await interactionFrame(page);
      observations.push(
        await page.evaluate(() =>
          window.__visualChart
            .getChart()
            .getAllSeries()[0]
            .getMarks()
            .find(m => m.name === 'leaf')
            .getGraphics()
            .flatMap((g, i) => (g.currentStates?.includes('selected') ? [i] : []))
        )
      );
    }
    await page.mouse.click(790, 590);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    await page.evaluate(observations => {
      window.__leafSelections = observations;
    }, observations);
  },
  async verify(page) {
    // 第二个叶节点必须被选中，空白点击后仍保留；仅执行一次 click 无法满足两步证据。
    await verifySpec(page, this.createSpec());
    await page.evaluate(() => {
      const rows = window.__leafSelections;
      if (
        rows?.length !== 2 ||
        !rows[0].includes(0) ||
        !rows[1].includes(1) ||
        JSON.stringify(rows[0]) === JSON.stringify(rows[1])
      )
        throw Error('叶节点选择没有切换');
      const indices = window.__visualChart
        .getChart()
        .getAllSeries()[0]
        .getMarks()
        .find(m => m.name === 'leaf')
        .getGraphics()
        .flatMap((g, i) => (g.currentStates?.includes('selected') ? [i] : []));
      if (JSON.stringify(indices) !== JSON.stringify(rows[1])) throw Error('空白点击清除了持久选择');
    });
  }
};
