import { verifyRendered } from '../../../helpers.mjs';

/**
 * 验证目的：数字分类轴的预览与缩放范围保持分类顺序，不受同字段连续统计影响。
 * 图表类型：bar。
 * 关键配置：xField 与 yField 使用同一字段，横轴 band、纵轴 linear、filterMode: axis。
 * 场景条件：数字分类按非升序输入，更新数据后通过 API 缩小窗口。
 * 最终检查：更新后的分类域、预览顺序、轴范围因子与实际可见分类；截图检查预览和柱形布局。
 * 覆盖边界：不覆盖鼠标拖动、联动轴和连续轴统计开销，另有交互用例和单元测试。
 */
export default {
  createSpec() {
    // 使用同一字段触发分类值与 min/max 共存的合法统计场景。
    return {
      type: 'bar',
      animation: false,
      xField: 'value',
      yField: 'value',
      data: { id: 'data', values: [{ value: 3 }, { value: 1 }, { value: 2 }] },
      axes: [
        { orient: 'bottom', type: 'band' },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ orient: 'bottom', filterMode: 'axis' }]
    };
  },
  async exercise(page) {
    // 更新真实数据并缩放，最终断言分别检测两项动作是否生效。
    await page.evaluate(() => {
      const chart = window.__visualChart;
      chart.updateDataSync('data', [{ value: 6 }, { value: 4 }, { value: 5 }]);
      chart
        .getChart()
        .getAllComponents()
        .find(c => c.type === 'dataZoom')
        .setStartAndEnd(0, 0.5);
    });
  },
  async verify(page) {
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const zoom = chart
        .getChart()
        .getAllComponents()
        .find(c => c.type === 'dataZoom');
      const expected = JSON.stringify([6, 4, 5]);
      if (JSON.stringify(zoom.stateScale.domain()) !== expected) throw new Error('更新后的缩放分类域顺序错误');
      if (
        JSON.stringify(
          zoom
            .getData()
            .getLatestData()
            .map(d => d.x)
        ) !== expected
      )
        throw new Error('数字分类轴的预览被按数值重新排序');
      const scale = zoom.relatedAxisComponent.getScale();
      if (JSON.stringify(scale.rangeFactor()) !== JSON.stringify([0, 0.5])) throw new Error('缩放窗口没有更新');
      const range = scale.range();
      const visible = scale.domain().filter(value => {
        const position = scale.scale(value);
        return position >= Math.min(...range) && position <= Math.max(...range);
      });
      if (JSON.stringify(visible) !== JSON.stringify([6, 4])) throw new Error('缩放显示了错误的分类');
    });
  }
};
