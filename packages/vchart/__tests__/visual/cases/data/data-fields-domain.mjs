import { verifySpec, verifyRendered } from '../../helpers.mjs';

/**
 * BugServer case IDs: 649d7efc52a1e9eec95f9ea8
 * 验证目的：数据字段定义域过滤异常数据并保留域内点。
 * 保留条件：xField, yField, axes, title；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主，翻译通用类目/说明文字（关联引用同步替换）。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'scatter',
      data: [
        {
          id: 'data',
          values: [
            {
              height: 150,
              weight: 45.5
            },
            {
              height: 152,
              weight: 52.5
            },
            {
              height: 154.3,
              weight: 53.5
            },
            {
              height: 161.6,
              weight: 53.5
            },
            {
              height: 156,
              weight: 55.5
            },
            {
              height: 158,
              weight: 57.5
            },
            {
              height: 160,
              weight: 52.5
            },
            {
              height: 161,
              weight: 58.5
            },
            {
              height: 160.4,
              weight: 56.5
            },
            {
              height: 160.6,
              weight: 64.5
            },
            {
              height: 162,
              weight: 54.5
            },
            {
              height: 162,
              weight: 54.5
            },
            {
              height: 162,
              weight: 56.5
            },
            {
              height: 162,
              weight: 58.5
            },
            {
              height: 162,
              weight: 64.5
            },
            {
              height: 161,
              weight: 56.5
            },
            {
              height: 164,
              weight: 60.5
            },
            {
              height: 166,
              weight: 64.5
            },
            {
              height: 168,
              weight: 67.5
            },
            {
              height: 170,
              weight: 63.5
            },
            {
              height: 172,
              weight: 64.5
            },
            {
              height: 174,
              weight: 65.5
            },
            {
              height: 176,
              weight: 65.5
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 170,
              weight: 70
            },
            {
              height: 160,
              weight: 59
            },
            {
              height: 173,
              weight: 75
            },
            {
              height: 165,
              weight: 68
            },
            {
              height: 167,
              weight: 69
            },
            {
              height: 174,
              weight: 75
            },
            {
              height: 173.4,
              weight: 75
            },
            {
              height: 173,
              weight: 72
            },
            {
              height: 173,
              weight: 76
            },
            {
              height: 171,
              weight: 71
            },
            {
              height: 172,
              weight: 70
            },
            {
              height: 172,
              weight: 70
            },
            {
              height: 172,
              weight: 70
            },
            {
              height: 172,
              weight: 70
            },
            {
              height: 175,
              weight: 76
            },
            {
              height: 174,
              weight: 79
            },
            {
              height: 172,
              weight: 81
            },
            {
              height: 172,
              weight: 70
            },
            {
              height: 170,
              weight: 73
            },
            {
              height: 185,
              weight: 80
            },
            {
              height: 1.89,
              weight: 86
            },
            {
              height: 1.7,
              weight: 86
            },
            {
              height: 1.8,
              weight: 80
            },
            {
              height: 1.7,
              weight: 75
            },
            {
              height: 1.6,
              weight: 62
            },
            {
              height: 1.65,
              weight: 70
            },
            {
              height: 1.58,
              weight: 66
            },
            {
              height: 1.65,
              weight: 67200
            },
            {
              height: 1.55,
              weight: 50000
            },
            {
              height: 160,
              weight: 56000
            },
            {
              height: 152,
              weight: 46000
            }
          ],
          fields: {
            height: {
              domain: [30, 300]
            },
            weight: {
              domain: [10, 200]
            }
          }
        }
      ],
      xField: 'height',
      yField: 'weight',
      axes: [
        {
          orient: 'left',
          type: 'linear',
          zero: false,
          title: {
            visible: true,
            text: 'Unit: kg'
          }
        },
        {
          orient: 'bottom',
          type: 'linear',
          zero: false,
          title: {
            visible: true,
            text: 'Unit: cm'
          }
        }
      ],
      title: {
        visible: true,
        text: 'Height and weight sample with invalid entries'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    const expected = this.createSpec().data[0].values.filter(
      d => d.height >= 30 && d.height <= 300 && d.weight >= 10 && d.weight <= 200
    );
    await page.evaluate(expected => {
      const series = window.__visualChart.getChart().getAllSeries()[0];
      const values = series.getViewData().latestData.map(d => ({ height: d.height, weight: d.weight }));
      if (JSON.stringify(values) !== JSON.stringify(expected))
        throw new Error('字段定义域未按来源过滤异常数据或丢失重复点');
      if (series.getSeriesMark().getGraphics().length !== expected.length) throw new Error('域内数据未完整绘制');
    }, expected);
  }
};
