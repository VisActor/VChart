import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65572371f022be008d9a3fcb
 * 验证目的：图例项隐藏符号后的文本布局。
 * 保留条件：xField, yField, legends；原始数值、数据顺序和配置组合。
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
            value: 8
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      legends: {
        visible: true,
        item: {
          shape: {
            visible: false,
            style: {
              fill: 'red'
            }
          }
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
