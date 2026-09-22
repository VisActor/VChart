import { verifySpec, verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 685e3725e565f800a58eb3ed
 * 验证目的：更新轴 sampling 开关后保留旋转标签。
 * 保留条件：源数据、配置、确定性回调；宿主及通用文字适配本地。
 * 覆盖边界：仅验证指定最终状态，不覆盖动画过程或全部录制步骤。
 */
export default {
  createSpec() {
    // 返回独立源配置，保持数据顺序及计算关系。
    const spec = {
      type: 'bar',
      data: [
        {
          name: 'bar',
          fields: {
            y: {
              alias: 'Sales count'
            }
          },
          values: [
            {
              x: '2021-12-21 2:00',
              y: 82
            },
            {
              x: '2021-12-21 4:00',
              y: 50
            },
            {
              x: '2021-12-21 6:00',
              y: 64
            },
            {
              x: '2021-12-21 8:00',
              y: 30
            },
            {
              x: '2021-12-21 10:00',
              y: 40
            },
            {
              x: '2021-12-21 12:00',
              y: 40
            },
            {
              x: '2021-12-21 14:00',
              y: 56
            },
            {
              x: '2021-12-21 16:00',
              y: 40
            },
            {
              x: '2021-12-21 18:00',
              y: 64
            },
            {
              x: '2021-12-21 20:00',
              y: 74
            },
            {
              x: '2021-12-21 22:00',
              y: 98
            }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      axes: [
        {
          orient: 'bottom',
          sampling: true,
          label: {
            autoHide: false,
            autoRotate: true
          }
        }
      ]
    };

    return spec;
  },
  async exercise(page) {
    // 保留源操作类型，并以真实实例或图元定位执行。
    await page.evaluate(() => {
      const c = window.__visualChart;
      const spec = c.getSpec();
      if (spec.axes[0].sampling !== true) throw Error('初始 sampling 未开启');
      c.updateSpecSync({
        ...spec,
        axes: [{ orient: 'bottom', sampling: false, label: { autoHide: false, autoRotate: true } }]
      });
    });
  },
  async verify(page) {
    // 验证目标状态及实际绘制，动作缺失不能通过。
    const expected = this.createSpec();
    expected.axes = [{ orient: 'bottom', sampling: false, label: { autoHide: false, autoRotate: true } }];
    await verifySpec(page, expected);
    await verifyRendered(page, 'axis');
  }
};
