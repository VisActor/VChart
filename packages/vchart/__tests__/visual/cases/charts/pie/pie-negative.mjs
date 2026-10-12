import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66a9e4f5ef352c00ab73f4a7
 * 迁移方式：原配置迁移，类目文本匿名化。
 * 验证目的：混合正负值饼图同时开启全零显示和负值支持。
 * 保留条件：数据顺序及数值 1/2/-3、stack、outerRadius=0.8、label、showAllZero、supportNegative。
 * 覆盖边界：仅将类目文本匿名化，不去掉原始开关组合；不宣称复现未提供的历史缺陷。
 */
export default {
  createSpec() {
    // 返回原始配置结构的新副本，只移除宿主生命周期依赖。
    return {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'Alpha',
              value: 1
            },
            {
              type: 'Beta',
              value: 2
            },
            {
              type: 'Gamma',
              value: -3
            }
          ]
        }
      ],
      label: {
        visible: true
      },
      stack: true,
      outerRadius: 0.8,
      valueField: 'value',
      categoryField: 'type',
      showAllZero: true,
      supportNegative: true
    };
  },
  async verify(page) {
    // 精确核对所有原始数据、关联和开关，并检查真实系列状态。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      const g = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
      if (g.length !== 3 || g.some(g => !Number.isFinite(g.attribute.endAngle))) throw new Error('正负饼图扇区缺失');
    });
  }
};
