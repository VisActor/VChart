import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64b6cffbb3874866684fe349
 * 迁移方式：原配置迁移。
 * 验证目的：求和标注线扩展数据范围。
 * 保留条件：数值 x=1..4、y=80/40/10/20、markLine 数组、y=sum、autoRange=true。
 * 覆盖边界：不替换数值坐标为文本类目，不新增标注标签；不宣称复现未提供的历史缺陷。
 */
export default {
  createSpec() {
    // 返回原始配置结构的新副本，只移除宿主生命周期依赖。
    return {
      type: 'line',
      data: {
        id: 'data2',
        values: [
          {
            x: 1,
            y: 80
          },
          {
            x: 2,
            y: 40
          },
          {
            x: 3,
            y: 10
          },
          {
            x: 4,
            y: 20
          }
        ]
      },
      xField: 'x',
      yField: 'y',
      markLine: [
        {
          y: 'sum',
          autoRange: true
        }
      ]
    };
  },
  async verify(page) {
    // 精确核对所有原始数据、关联和开关，并检查真实系列状态。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries()[0];
      if (s.getViewData().latestData.reduce((v, r) => v + r.y, 0) !== 150) throw new Error('求和触发数据改变');
      const a = window.__visualChart
        .getChart()
        .getAllComponents()
        .find(c => c.getSpec?.().orient === 'left');
      if (!a || Math.max(...a.getScale().domain()) < 150) throw new Error('求和标注未扩轴');
    });
  }
};
