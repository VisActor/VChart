import { Direction } from '../typings';
import { array, merge } from '../util';
import type { ICartesianChartSpec } from './cartesian/interface';

export function setDefaultCrosshairForCartesianChart(spec: ICartesianChartSpec) {
  spec.crosshair = array(spec.crosshair || {}).map(crosshairCfg => {
    return merge(
      {
        [spec.direction === Direction.horizontal ? 'yField' : 'xField']: {
          visible: true,
          line: {
            visible: true,
            type: 'rect'
          }
        }
      },
      crosshairCfg
    );
  });
}
