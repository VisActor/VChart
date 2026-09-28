import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 64b7bf3f14220f89e4720c82
 * 迁移边界：定位实际截断的中间轴标签，避免轴交点的遮挡；记录的旧坐标未被当作新宿主的目标。
 * 验证目的：截断轴标签悬停后显示完整文本（源录制 poptip）。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      width: 290,
      type: 'line',
      axes: [
        {
          orient: 'left',
          label: {
            style: { fontSize: 10, fill: '#000000' },
            autoLimit: true,
            formatMethod: val => `+++++++++_${val}_+++++++++`
          }
        },
        {
          orient: 'bottom',
          label: {
            space: 4,
            style: {
              fontSize: 12,
              fill: '#000000'
            },
            autoLimit: true,
            autoHide: true,
            autoRotate: true,
            autoRotateAngle: [0, 30, 45],
            formatMethod: val => `++++++_${val}_++++++`
          }
        }
      ],
      data: [
        {
          id: 'line',
          fields: {
            y: {
              alias: '最高气温'
            }
          },
          values: [
            {
              x: '周一',
              y: 12
            },
            {
              x: '周二',
              y: 13
            },
            {
              x: '周三',
              y: 11
            },
            {
              x: '周四',
              y: 10
            },
            {
              x: '周五',
              y: 12
            },
            {
              x: '周六',
              y: 14
            },
            {
              x: '周日',
              y: 17
            }
          ]
        }
      ],
      xField: 'x',
      yField: 'y'
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await page.evaluate(() => {
      const g = window.__visualChart
        .getStage()
        .find(
          g =>
            g.name === 'axis-label' &&
            g.type === 'text' &&
            g.cliped &&
            g.globalAABBBounds.y1 > 30 &&
            g.globalAABBBounds.y2 < 500,
          true
        );
      if (!g) throw Error('来源未产生截断轴标签');
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2, text: String(g.attribute.text) };
    });
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(p => (window.__poptipTarget = p), p);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.waitForFunction(() => {
      const c = window.__visualChart,
        g = c.getStage().find(g => g.name === 'poptip', true);
      return g && g.attribute.visible !== false && JSON.stringify(g.attribute).includes(window.__poptipTarget?.text);
    });
  }
};
