import { verifySpec, verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 6620e204d4511700f688557f
 * 验证目的：图例选择后更新分类数据。
 * 保留条件：源数据、配置、确定性回调；宿主及通用文字适配本地。
 * 覆盖边界：仅验证指定最终状态，不覆盖动画过程或全部录制步骤。
 */
export default {
  createSpec() {
    // 返回独立源配置，保持数据顺序及计算关系。
    const data = [
      { value: 10, category: 'One' },
      { value: 9, category: 'Two' },
      { value: 6, category: 'Three' },
      { value: 5, category: 'Four' },
      { value: 4, category: 'Five' },
      { value: 3, category: 'Six' },
      { value: 1, category: 'Seven' }
    ];
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'pie',
          values: data
        }
      ],
      categoryField: 'category',
      valueField: 'value',
      legends: {
        visible: true,
        orient: 'right',
        item: {
          width: '20%',
          value: {
            alignRight: true,
            style: {
              fill: '#333',
              fillOpacity: 0.8,
              fontSize: 10
            },
            state: {
              unselected: {
                fill: '#d8d8d8'
              }
            }
          }
        }
      }
    };

    return spec;
  },
  async exercise(page) {
    // 保留源操作类型，并以真实实例或图元定位执行。
    await page.evaluate(
      data => {
        const c = window.__visualChart;
        c.setLegendSelectedDataByIndex(0, ['One', 'Four']);
        window.__selectedBeforeUpdate = c.getLegendSelectedDataByIndex(0);
        c.updateDataSync('pie', data);
      },
      [
        { value: 8, category: 'One000' },
        { value: 9, category: 'Two000' },
        { value: 60, category: 'Three' },
        { value: 50, category: 'Four' },
        { value: 32, category: 'Five' },
        { value: 30, category: 'Six' },
        { value: 12, category: 'Seven' }
      ]
    );
  },
  async verify(page) {
    // 验证目标状态及实际绘制，动作缺失不能通过。
    await page.evaluate(
      data => {
        const c = window.__visualChart,
          selected = c.getLegendSelectedDataByIndex(0);
        if (JSON.stringify(window.__selectedBeforeUpdate) !== JSON.stringify(['One', 'Four']))
          throw Error('未先选择图例');
        const values = c.getChart().getAllSeries()[0].getViewData().latestData;
        if (
          !values.length ||
          !values.some(d => d.category === 'Four' && d.value === 50) ||
          values.some(d => d.value === 5)
        )
          throw Error('更新结果未生效');
        if (!selected.includes('Four')) throw Error('更新丢失仍然有效的图例选择');
      },
      [
        { value: 8, category: 'One000' },
        { value: 9, category: 'Two000' },
        { value: 60, category: 'Three' },
        { value: 50, category: 'Four' },
        { value: 32, category: 'Five' },
        { value: 30, category: 'Six' },
        { value: 12, category: 'Seven' }
      ]
    );
    await verifyRendered(page);
  }
};
