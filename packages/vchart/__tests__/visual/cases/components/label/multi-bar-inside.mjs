import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 6479a64ac48954008d952da9
 * 迁移方式：原配置迁移。
 * 验证目的：两份数据中的四个分组使用两个柱系列并显示内部标签。
 * 保留条件：两个数据源及 dataIndex、各四行数据、seriesField、inside 标签、600×600。
 * 覆盖边界：不折叠为单柱系列，不合并分组；不宣称复现未提供的历史缺陷。
 */
export default {
  createSpec() {
    // 返回原始配置结构的新副本，只移除宿主生命周期依赖。
    return {
      type: 'common',
      autoFit: true,
      data: [
        {
          id: 'id0',
          values: [
            {
              x: 1,
              y: 20,
              type: 'a'
            },
            {
              x: 2,
              y: 40,
              type: 'a'
            },
            {
              x: 1,
              y: 20,
              type: 'b'
            },
            {
              x: 2,
              y: 40,
              type: 'b'
            }
          ]
        },
        {
          id: 'id1',
          values: [
            {
              x: 1,
              y: 20,
              type: 'c'
            },
            {
              x: 2,
              y: 40,
              type: 'c'
            },
            {
              x: 1,
              y: 20,
              type: 'd'
            },
            {
              x: 2,
              y: 40,
              type: 'd'
            }
          ]
        }
      ],
      width: 600,
      height: 600,
      series: [
        {
          type: 'bar',
          dataIndex: 0,
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true,
            position: 'inside'
          }
        },
        {
          type: 'bar',
          dataIndex: 1,
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          label: {
            visible: true,
            position: 'inside'
          }
        }
      ],
      axes: [
        {
          orient: 'left'
        },
        {
          orient: 'bottom',
          type: 'band'
        }
      ]
    };
  },
  async verify(page) {
    // 精确核对所有原始数据、关联和开关，并检查真实系列状态。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries();
      if (s.length !== 2 || s.some(s => s.getViewData().latestData.length !== 4)) throw new Error('双数据源或分组丢失');
    });
  }
};
