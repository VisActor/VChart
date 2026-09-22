import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66d683dc71a15300f7f1fb51
 * 验证目的：数值轴断轴及柱图分段。
 * 保留条件：height, xField, yField, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      height: 400,
      type: 'bar',
      data: {
        values: [
          {
            country: 'USA',
            visits: 23725
          },
          {
            country: 'China',
            visits: 1882
          },
          {
            country: 'Japan',
            visits: 1809
          },
          {
            country: 'Germany',
            visits: 1322
          },
          {
            country: 'UK',
            visits: 1122
          },
          {
            country: 'France',
            visits: 1114
          },
          {
            country: 'India',
            visits: 984
          },
          {
            country: 'Spain',
            visits: 711
          },
          {
            country: 'Netherlands',
            visits: 665
          },
          {
            country: 'Russia',
            visits: 580
          },
          {
            country: 'South Korea',
            visits: 443
          },
          {
            country: 'Canada',
            visits: 441
          }
        ]
      },
      xField: 'country',
      yField: 'visits',
      axes: [
        {
          orient: 'left',
          breaks: [
            {
              scopeType: 'count',
              range: [2100, 22900]
            },
            {
              range: [700, 900]
            }
          ],
          domainLine: {
            visible: true
          }
        }
      ]
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
