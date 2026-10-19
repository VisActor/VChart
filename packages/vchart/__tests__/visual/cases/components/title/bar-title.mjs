import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 69d75d25943f32005d412309
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：基础柱图显示主标题。
 * 保留条件：四个原始月份和值、data 数组、可见主标题；原文无副标题。
 * 改写说明：仅替换说明中提及的通用类目或标题文本；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'bar',
      data: [
        {
          id: 'id0',
          values: [
            {
              month: 'Jan',
              value: 32
            },
            {
              month: 'Feb',
              value: 41
            },
            {
              month: 'Mar',
              value: 36
            },
            {
              month: 'Apr',
              value: 54
            }
          ]
        }
      ],
      xField: 'month',
      yField: 'value',
      title: {
        visible: true,
        text: 'VChart Demo'
      },
      animation: false
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'title');
    await page.evaluate(() => {
      const series = window.__visualChart.getChart().getAllSeries();
      if (series.length !== 1 || series[0].getSeriesMark().getGraphics().length !== 4)
        throw new Error('主标题场景的四根柱图未完整绘制');
    });
  }
};
