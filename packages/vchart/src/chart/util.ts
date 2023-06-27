import { Direction } from '../typings';
import { merge } from '../util';
import type { ICartesianChartSpec } from './cartesian/interface';

export function setDefaultCrosshairForChart(spec: ICartesianChartSpec) {
  spec.crosshair = merge(
    {
      [spec.direction === Direction.horizontal ? 'yField' : 'xField']: {
        visible: true,
        label: {
          visible: false
        },
        line: {
          visible: true,
          type: 'rect'
        }
      }
    },
    spec.crosshair
  );
}
