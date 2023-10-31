import { ICrosshairTheme } from '@visactor/vchart-types/component/crosshair';

export const crosshair: ICrosshairTheme = {
  bandField: {
    line: {
      type: 'rect',
      visible: true,
      style: {
        fill: { type: 'palette', key: 'axisGridColor' },
        opacity: 0.2
      }
    }
  }
};
