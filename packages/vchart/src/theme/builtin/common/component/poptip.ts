import type { PopTipAttributes } from '@visactor/vrender-components';

export const poptip: PopTipAttributes = {
  visible: true,
  position: 'auto',
  padding: 8,
  titleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    fill: { type: 'palette', key: 'labelFontColor' } as any
  },
  contentStyle: {
    fontSize: 12,
    fill: { type: 'palette', key: 'labelFontColor' } as any
  },
  panel: {
    visible: true,
    fill: { type: 'palette', key: 'backgroundColor' } as any,
    stroke: { type: 'palette', key: 'backgroundColor' } as any,
    lineWidth: 0,
    cornerRadius: 3,
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    size: 0,
    space: 12
  }
};
