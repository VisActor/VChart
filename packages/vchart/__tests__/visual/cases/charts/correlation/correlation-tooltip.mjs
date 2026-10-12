import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6530ea3a8632117ed798a239
 * 验证目的：关联图布局及源移动鼠标后的 tooltip。
 * 保留条件：三十条数据的数值、顺序、size/value 字段映射和半径。
 * 迁移说明：公开示例搜索词统一匿名化为 Input method 序号；移动鼠标按实际首个节点定位。
 * 覆盖边界：本地选择首个节点，不宣称该节点是原录制坐标目标；不代表所有节点与状态组合。
 */
export default {
  createSpec() {
    // 保留原始关联数据与大小编码，每次返回独立配置。
    return {
      type: 'correlation',
      data: [
        {
          values: [
            {
              word: 'Input method 1',
              pv: 15952,
              ratio: 94,
              sim: 3932
            },
            {
              word: 'Input method 2',
              pv: 11032,
              ratio: 97,
              sim: 2799
            },
            {
              word: 'Input method 3',
              pv: 107908,
              ratio: 102,
              sim: 2645
            },
            {
              word: 'Input method 4',
              pv: 74912,
              ratio: 99,
              sim: 2189
            },
            {
              word: 'Input method 5',
              pv: 193624,
              ratio: 121,
              sim: 2100
            },
            {
              word: 'Input method 6',
              pv: 835168,
              ratio: 88,
              sim: 2050
            },
            {
              word: 'Input method 7',
              pv: 14140,
              ratio: 96,
              sim: 1953
            },
            {
              word: 'Input method 8',
              pv: 19236,
              ratio: 97,
              sim: 1870
            },
            {
              word: 'Input method 9',
              pv: 1968,
              ratio: 109,
              sim: 1705
            },
            {
              word: 'Input method 10',
              pv: 812,
              ratio: 150,
              sim: 1567
            },
            {
              word: 'Input method 11',
              pv: 4602,
              ratio: 91,
              sim: 1522
            },
            {
              word: 'Input method 12',
              pv: 18262,
              ratio: 97,
              sim: 1486
            },
            {
              word: 'Input method 13',
              pv: 34186,
              ratio: 91,
              sim: 1278
            },
            {
              word: 'Input method 14',
              pv: 7186,
              ratio: 86,
              sim: 1009
            },
            {
              word: 'Input method 15',
              pv: 13418,
              ratio: 102,
              sim: 924
            },
            {
              word: 'Input method 16',
              pv: 4680,
              ratio: 88,
              sim: 804
            },
            {
              word: 'Input method 17',
              pv: 2206,
              ratio: 97,
              sim: 800
            },
            {
              word: 'Input method 18',
              pv: 15112,
              ratio: 85,
              sim: 764
            },
            {
              word: 'Input method 19',
              pv: 8204,
              ratio: 135,
              sim: 754
            },
            {
              word: 'Input method 20',
              pv: 5590,
              ratio: 106,
              sim: 609
            },
            {
              word: 'Input method 21',
              pv: 352,
              ratio: 132,
              sim: 593
            },
            {
              word: 'Input method 22',
              pv: 2476,
              ratio: 103,
              sim: 540
            },
            {
              word: 'Input method 23',
              pv: 1582,
              ratio: 86,
              sim: 538
            },
            {
              word: 'Input method 24',
              pv: 1298,
              ratio: 75,
              sim: 527
            },
            {
              word: 'Input method 25',
              pv: 126182,
              ratio: 102,
              sim: 521
            },
            {
              word: 'Input method 26',
              pv: 3442,
              ratio: 88,
              sim: 510
            },
            {
              word: 'Input method 27',
              pv: 24912,
              ratio: 98,
              sim: 478
            },
            {
              word: 'Input method 28',
              pv: 150,
              ratio: 125,
              sim: 465
            },
            {
              word: 'Input method 29',
              pv: 264,
              ratio: 89,
              sim: 452
            },
            {
              word: 'Input method 30',
              pv: 2772,
              ratio: 93,
              sim: 443
            }
          ]
        }
      ],
      categoryField: 'word',
      valueField: 'sim',
      sizeField: 'pv',
      sizeRange: [12, 30],
      innerRadius: '25%',
      outerRadius: '95%',
      nodePoint: {
        state: {
          hover: {
            lineWidth: 8,
            strokeOpacity: 0.2
          }
        }
      },
      centerPoint: {
        state: {
          hover: {
            lineWidth: 8,
            strokeOpacity: 0.2
          }
        }
      },
      centerLabel: {
        visible: true,
        position: 'center',
        style: {
          fill: 'white',
          text: 'Input methods'
        }
      },
      label: {
        visible: true,
        position: 'bottom',
        style: {
          fill: 'black'
        }
      }
    };
  },
  async exercise(page) {
    // 来源记录为移动鼠标；根据节点几何适配当前宿主位置。
    const point = await page.evaluate(() => {
      const g = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0];
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
  },
  async verify(page) {
    // 核对完整输入、实际布局以及目标节点 tooltip 文本。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
    await page.waitForFunction(() =>
      [...document.querySelectorAll('[class*="tooltip"]')].some(
        el =>
          el.textContent.includes('Input method 1') &&
          el.textContent.includes('3932') &&
          el.getBoundingClientRect().width > 0 &&
          getComputedStyle(el).visibility !== 'hidden' &&
          getComputedStyle(el).display !== 'none'
      )
    );
  }
};
