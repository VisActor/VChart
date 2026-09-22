import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e034e
 * 验证目的：标注线端点符号与显隐组合。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
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
          x: '1',
          endSymbol: {
            visible: true,
            symbolType: 'square',
            style: {
              fill: 'purple',
              stroke: '#fff',
              lineWidth: 3,
              size: 20
            }
          }
        },
        {
          y: 30,
          endSymbol: {
            visible: false
          }
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'mark-line');
  }
};
