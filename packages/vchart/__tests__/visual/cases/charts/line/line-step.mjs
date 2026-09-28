import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0c52a1e9eec95f9ed6
 * 验证目的：阶梯折线的曲线类型与点布局。
 * 保留条件：xField, yField, point, line；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'line',
      data: {
        values: [
          {
            time: '2:00',
            value: 38
          },
          {
            time: '4:00',
            value: 56
          },
          {
            time: '6:00',
            value: 10
          },
          {
            time: '8:00',
            value: 70
          },
          {
            time: '10:00',
            value: 36
          },
          {
            time: '12:00',
            value: 94
          },
          {
            time: '14:00',
            value: 24
          },
          {
            time: '16:00',
            value: 44
          },
          {
            time: '18:00',
            value: 36
          },
          {
            time: '20:00',
            value: 68
          },
          {
            time: '22:00',
            value: 22
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      point: {
        visible: false
      },
      line: {
        style: {
          curveType: 'stepAfter'
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
