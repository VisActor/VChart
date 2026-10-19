import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0440
 * 验证目的：正负数据百分比堆叠折线。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：仅检查静态最终状态；不计动画或未执行的交互配置。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'line',
      padding: {
        top: 50
      },
      data: [
        {
          id: 'id0',
          values: [
            {
              x: '0',
              type: 'A',
              y: '164'
            },
            {
              x: '1',
              type: 'A',
              y: '10'
            },
            {
              x: '2',
              type: 'A',
              y: '-90'
            },
            {
              x: '3',
              type: 'A',
              y: '-112'
            },
            {
              x: '4',
              type: 'A',
              y: '-67'
            },
            {
              x: '5',
              type: 'A',
              y: '68'
            },
            {
              x: '6',
              type: 'A',
              y: '76'
            },
            {
              x: '7',
              type: 'A',
              y: '-91'
            },
            {
              x: '8',
              type: 'A',
              y: '74'
            },
            {
              x: '9',
              type: 'A',
              y: '65'
            },
            {
              x: '0',
              type: 'B',
              y: '136'
            },
            {
              x: '1',
              type: 'B',
              y: '10'
            },
            {
              x: '2',
              type: 'B',
              y: '57'
            },
            {
              x: '3',
              type: 'B',
              y: '16'
            },
            {
              x: '4',
              type: 'B',
              y: '-116'
            },
            {
              x: '5',
              type: 'B',
              y: '-46'
            },
            {
              x: '6',
              type: 'B',
              y: '-133'
            },
            {
              x: '7',
              type: 'B',
              y: '-10'
            },
            {
              x: '8',
              type: 'B',
              y: '-98'
            },
            {
              x: '9',
              type: 'B',
              y: '-40'
            },
            {
              x: '0',
              type: 'C',
              y: '136'
            },
            {
              x: '1',
              type: 'C',
              y: '10'
            },
            {
              x: '2',
              type: 'C',
              y: '57'
            },
            {
              x: '3',
              type: 'C',
              y: '16'
            },
            {
              x: '4',
              type: 'C',
              y: '-116'
            },
            {
              x: '5',
              type: 'C',
              y: '-46'
            },
            {
              x: '6',
              type: 'C',
              y: '-133'
            },
            {
              x: '7',
              type: 'C',
              y: '-10'
            },
            {
              x: '8',
              type: 'C',
              y: '-98'
            },
            {
              x: '9',
              type: 'C',
              y: '-40'
            }
          ]
        }
      ],
      size: {
        filed: 'y',
        type: 'ordinal',
        domain: [],
        range: [1, 2]
      },
      percent: true,
      xField: 'x',
      yField: 'y',
      label: {
        visible: true
      },
      legends: [
        {
          visible: true,
          position: 'middle',
          orient: 'left'
        }
      ],
      seriesField: 'type',
      point: {
        state: {
          hover: {
            size: 20,
            fill: 'red'
          }
        }
      },
      axes: [
        {
          orient: 'left',
          tickCount: 6,
          forceTickCount: 6,
          visible: true
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          }
        }
      ]
    };
  },
  async verify(page) {
    // 配置和绘制检查与视觉差异共同验证目标条件。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
  }
};
