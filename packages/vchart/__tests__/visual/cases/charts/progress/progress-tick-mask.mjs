import { verifySpec, verifyRendered, seriesGraphicCenter } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65e1ca90a5483e00afa58635
 * 验证目的：环形进度刻度遮罩、强制对齐及悬停指标。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：保留来源 move 动作，以实际进度图元定位替代旧宿主坐标；不改变数据或配置。
 * 覆盖边界：验证遮罩布局及 progress hover 留白、indicator 内容；不计选择或动画过程。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'circularProgress',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'Tradition Industries',
              value: 0.795,
              text: '79.5%'
            },
            {
              type: 'Business Companies',
              value: 0.5,
              text: '50%'
            },
            {
              type: 'Customer-facing Companies',
              value: 0.25,
              text: '25%'
            }
          ]
        }
      ],
      color: ['rgb(255, 222, 0)', 'rgb(171, 205, 5)', 'rgb(0, 154, 68)'],
      valueField: 'value',
      categoryField: 'type',
      seriesField: 'type',
      radius: 0.8,
      innerRadius: 0.4,
      progress: {
        style: {
          innerPadding: 5,
          outerPadding: 5
        },
        state: {
          hover: {
            innerPadding: 0,
            outerPadding: 0
          }
        }
      },
      tickMask: {
        visible: true,
        angle: 10,
        offsetAngle: 0,
        forceAlign: true,
        style: {
          cornerRadius: 15
        }
      },
      axes: [
        {
          visible: false,
          type: 'linear',
          orient: 'angle'
        },
        {
          visible: false,
          type: 'band',
          orient: 'radius'
        }
      ],
      indicator: {
        visible: true,
        trigger: 'hover',
        title: {
          visible: true,
          field: 'type',
          autoLimit: true,
          style: {
            fontSize: 20,
            fill: 'black'
          }
        },
        content: [
          {
            visible: true,
            field: 'text',
            style: {
              fontSize: 16,
              fill: 'gray'
            }
          }
        ]
      },
      legends: {
        visible: true,
        orient: 'bottom',
        title: {
          visible: false
        }
      },
      animation: false
    };
  },
  async exercise(page) {
    // 源记录为一次 move；先检查初始留白，再悬停第一个有效进度图元。
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const graphics = chart
        .getChart()
        .getAllSeries()[0]
        .getMarks()
        .find(mark => mark.name === 'progress')
        .getGraphics();
      if (
        graphics.length !== 3 ||
        graphics.some(g => g.attribute.innerPadding !== -5 || g.attribute.outerPadding !== -5)
      )
        throw new Error('进度初始留白不正确');
      if (chart.getStage().findAll(g => g.name === 'indicator-title' && g.attribute.visible !== false, true).length)
        throw new Error('悬停前指标不应显示');
    });
    const point = await seriesGraphicCenter(page, 'progress');
    await page.mouse.move(point.x, point.y);
    await page.waitForFunction(() =>
      window.__visualChart
        .getChart()
        .getAllSeries()[0]
        .getMarks()
        .find(mark => mark.name === 'progress')
        .getGraphics()
        .some(g => g.currentStates?.includes('hover'))
    );
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    // 同时验证图元状态与实际指标文字，跳过 move 时不能靠配置相同通过。
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const graphics = chart
        .getChart()
        .getAllSeries()[0]
        .getMarks()
        .find(mark => mark.name === 'progress')
        .getGraphics();
      const hovered = graphics.filter(g => g.currentStates?.includes('hover'));
      if (
        hovered.length !== 1 ||
        hovered[0] !== graphics[0] ||
        hovered[0].attribute.innerPadding !== 0 ||
        hovered[0].attribute.outerPadding !== 0
      )
        throw new Error('进度 hover 留白未生效');
      const stage = chart.getStage();
      const title = stage.find(g => g.name === 'indicator-title' && g.attribute.visible !== false, true);
      const content = stage.find(g => g.name === 'indicator-content-0' && g.attribute.visible !== false, true);
      if (title?.attribute.text !== 'Tradition Industries' || content?.attribute.text !== '79.5%')
        throw new Error('进度 hover 指标内容不正确');
    });
  }
};
