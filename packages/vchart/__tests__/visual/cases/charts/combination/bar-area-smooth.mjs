import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0393
 * 迁移方式：原配置迁移。
 * 验证目的：同一区域的柱图与平滑轮廓面积图叠加。
 * 保留条件：两个独立数据源、两个非堆叠系列、600×600、area.line 的 monotone 配置。
 * 覆盖边界：不改为单面积图，也不改变两份数据的对应关系；不宣称复现未提供的历史缺陷。
 */
export default {
  createSpec() {
    // 返回原始配置结构的新副本，只移除宿主生命周期依赖。
    return {
      type: 'common',
      data: [
        {
          id: 'id0',
          values: [
            {
              x: 1,
              y: 20
            },
            {
              x: 2,
              y: 40
            },
            {
              x: 3,
              y: 30
            },
            {
              x: 4,
              y: 50
            },
            {
              x: 5,
              y: 40
            }
          ]
        },
        {
          id: 'id1',
          values: [
            {
              x: 1,
              y: 20
            },
            {
              x: 2,
              y: 40
            },
            {
              x: 3,
              y: 30
            },
            {
              x: 4,
              y: 50
            },
            {
              x: 5,
              y: 40
            }
          ]
        }
      ],
      width: 600,
      height: 600,
      region: [{}],
      series: [
        {
          stack: false,
          type: 'bar',
          dataIndex: 0,
          xField: 'x',
          yField: 'y'
        },
        {
          stack: false,
          type: 'area',
          dataIndex: 1,
          xField: 'x',
          yField: 'y',
          line: {
            style: {
              curveType: 'monotone'
            }
          }
        }
      ],
      axes: [
        {
          orient: 'left'
        },
        {
          orient: 'bottom'
        }
      ]
    };
  },
  async verify(page) {
    // 精确核对所有原始数据、关联和开关，并检查真实系列状态。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries();
      if (s.length !== 2 || s[0].type !== 'bar' || s[1].type !== 'area') throw new Error('柱与面积系列组合丢失');
    });
  }
};
