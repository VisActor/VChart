import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e035d
 * 验证目的：标注线标签背景与偏移布局。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
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
          label: {
            visible: true,
            text: 'test middle333',
            refX: -20,
            refY: -10,
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily: 'pingfang-sc',
              fill: '#333',
              stroke: '#fff',
              lineWidth: 6
            },
            labelBackground: {
              visible: false
            }
          }
        },
        {
          y: 30,
          label: {
            visible: true,
            text: 'test middle333',
            position: 'insideEndBottom',
            refX: 0,
            refY: -20,
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily: 'pingfang-sc',
              fill: '#333',
              stroke: '#fff',
              lineWidth: 6
            },
            labelBackground: {
              visible: true,
              padding: [6, 6, 8, 8],
              style: {
                fill: 'red',
                borderRadius: [10, 10, 10, 10],
                cornerRadius: [10, 10, 10, 10]
              }
            }
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
