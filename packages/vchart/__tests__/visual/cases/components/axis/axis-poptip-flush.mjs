import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 64b7beba14220f89e4720c80
 * 迁移边界：来源固定 350×200；执行时缩窄到 180×200，形成截断后悬停，保留 flush/autoLimit 配置和原始数据。
 * 验证目的：截断轴标签悬停后显示完整文本（源录制 poptip）。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'bar',
      height: 200,
      width: 350,
      data: [
        {
          id: 'barData',
          values: [
            { month: 'Monday', sales: 22 },
            { month: 'Tuesday', sales: 13 },
            { month: 'Wednesday', sales: 25 },
            { month: 'Thursday', sales: 29 },
            { month: 'Friday', sales: 38 }
          ]
        }
      ],
      xField: 'month',
      yField: 'sales',
      axes: [
        { orient: 'bottom', sampling: false, label: { autoRotate: true, autoLimit: true, autoHide: true } },
        {
          orient: 'left',
          sampling: false,
          label: { autoRotate: true, autoLimit: true, autoHide: true, formatMethod: () => 'AAAAAAAAAAA', flush: true }
        }
      ]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => window.__visualChart.resize(180, 200));
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
