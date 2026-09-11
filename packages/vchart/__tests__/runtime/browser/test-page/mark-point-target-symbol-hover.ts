import type { ISpec } from '../../../../src';

export const targetSymbolHoverSpec: ISpec = {
  type: 'line',
  title: {
    text: 'MarkPoint targetSymbol 的 dimension_hover 状态'
  },
  data: [
    {
      id: 'target-symbol-hover-data',
      values: [
        { month: '1月', value: 28 },
        { month: '2月', value: 46 },
        { month: '3月', value: 66 },
        { month: '4月', value: 51 },
        { month: '5月', value: 74 },
        { month: '6月', value: 62 }
      ]
    }
  ],
  xField: 'month',
  yField: 'value',
  axes: [{ orient: 'bottom' }, { orient: 'left', grid: { visible: true } }],
  tooltip: {
    visible: false
  },
  point: {
    style: {
      size: 8
    }
  },
  markPoint: [
    {
      coordinate: { month: '3月', value: 66 },
      itemContent: {
        type: 'text',
        offsetX: 42,
        offsetY: -72,
        autoRotate: false,
        style: {
          text: '悬停到对应 x 轴区域：targetSymbol 变透明；移出后恢复',
          fill: '#d94801',
          fontSize: 14
        }
      },
      itemLine: {
        startSymbol: { visible: false },
        line: {
          style: {
            stroke: '#d94801',
            lineWidth: 2
          }
        }
      },
      targetSymbol: {
        visible: true,
        size: 32,
        style: {
          symbolType: 'circle',
          fill: '#fff7ed',
          stroke: '#ea580c',
          lineWidth: 4
        },
        state: {
          dimension_hover: {
            opacity: 0.001
          }
        }
      }
    },
    {
      coordinate: { month: '5月', value: 74 },
      itemContent: {
        type: 'text',
        offsetX: -42,
        offsetY: -72,
        autoRotate: false,
        style: {
          text: '仅命中当前 x 值的 targetSymbol',
          fill: '#0f766e',
          fontSize: 14
        }
      },
      itemLine: {
        startSymbol: { visible: false },
        line: {
          style: {
            stroke: '#0f766e',
            lineWidth: 2
          }
        }
      },
      targetSymbol: {
        visible: true,
        size: 32,
        style: {
          symbolType: 'circle',
          fill: '#f0fdfa',
          stroke: '#0f766e',
          lineWidth: 4
        },
        state: {
          dimension_hover: {
            opacity: 0.001
          }
        }
      }
    }
  ]
};
