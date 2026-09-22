import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7ef752a1e9eec95f9e9a
 * 验证目的：折线和饼图在独立区域共存。
 * 保留条件：padding, layout, region, legends, series, axes, tooltip；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'common',
      padding: {
        top: 10
      },
      layout: {
        type: 'grid',
        col: 2,
        row: 4,
        elements: [
          {
            modelId: 'legend',
            col: 0,
            colSpan: 2,
            row: 0
          },
          {
            modelId: 'pie-region',
            col: 0,
            colSpan: 2,
            row: 1
          },
          {
            modelId: 'axis-left',
            col: 0,
            row: 2
          },
          {
            modelId: 'line-region',
            col: 1,
            row: 2
          },
          {
            modelId: 'axis-bottom',
            col: 1,
            row: 3
          }
        ]
      },
      region: [
        {
          id: 'pie-region',
          height: '40%'
        },
        {
          id: 'line-region'
        }
      ],
      legends: {
        visible: true,
        orient: 'top',
        id: 'legend',
        regionId: ['pie-region', 'line-region']
      },
      series: [
        {
          regionId: 'pie-region',
          type: 'pie',
          valueField: 'value',
          categoryField: 'type',
          data: {
            id: 'pie',
            values: [
              {
                type: 'a',
                value: 10
              },
              {
                type: 'b',
                value: 20
              }
            ]
          },
          seriesField: 'type'
        },
        {
          regionId: 'line-region',
          type: 'line',
          xField: 'x',
          yField: 'y',
          data: {
            id: 'line',
            values: [
              {
                x: '1',
                y: 10,
                type: 'a'
              },
              {
                x: '1',
                y: 20,
                type: 'b'
              },
              {
                x: '2',
                y: 30,
                type: 'a'
              },
              {
                x: '2',
                y: 40,
                type: 'b'
              }
            ]
          },
          seriesField: 'type'
        }
      ],
      axes: [
        {
          id: 'axis-left',
          regionId: 'line-region',
          orient: 'left'
        },
        {
          id: 'axis-bottom',
          regionId: 'line-region',
          orient: 'bottom'
        }
      ],
      tooltip: {
        dimension: {
          visible: true
        }
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
