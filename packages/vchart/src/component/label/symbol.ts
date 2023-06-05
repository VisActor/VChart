import { merge } from '@visactor/vutils';
import type { ILabelInfo } from './label';
import type { Strategy } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';

export function symbolLabel(labelInfo: ILabelInfo) {
  const { series, baseMark } = labelInfo;
  const labelSpec = baseMark.getLabelSpec() ?? {};

  // encode position config
  const defaultPosition = (series as ICartesianSeries).direction === 'horizontal' ? 'right' : 'top';
  const position = labelSpec.position ?? defaultPosition;

  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = merge(
      {},
      {
        strategy: labelSpec.overlap?.strategy ?? symbolLabelOverlapStrategy(series as ICartesianSeries)
      }
    );
  }

  return { position, overlap };
}

function symbolLabelOverlapStrategy(series: ICartesianSeries) {
  const strategy: Strategy[] = [
    {
      type: 'position',
      position: ['top', 'bottom', 'right', 'left', 'top-right', 'top-left', 'bottom-left', 'bottom-right']
    }
  ];

  return strategy;
}
