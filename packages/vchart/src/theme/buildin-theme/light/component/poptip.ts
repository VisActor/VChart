import type { PopTipAttributes } from '@visactor/vrender-components';

export const poptip: PopTipAttributes = {
  visible: true,
  position: 'auto',
  padding: 8,
  titleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#4E5969'
  },
  contentStyle: {
    fontSize: 12,
    fill: '#4E5969'
  },
  panel: {
    visible: true,
    fill: '#fff',
    stroke: '#ffffff',
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
