import { isString } from '@visactor/vutils';
import type { ILabelInfo } from './label';
import type { BaseLabelAttrs, Strategy } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';
import type { Datum } from '../../typings';

export function barLabel(labelInfo: ILabelInfo) {
  const { series, baseMark } = labelInfo;
  const labelSpec = baseMark.getLabelSpec() ?? {};

  // encode position config
  const labelPosition = labelSpec.position ?? 'outside';
  let position = labelPosition as BaseLabelAttrs['position'];
  if (position !== 'inside') {
    position = (data: Datum) => {
      const { data: datum } = data;
      const dataField = series.getMeasureField()[0];
      if (labelPosition === 'outside') {
        if ((series as ICartesianSeries).direction === 'horizontal') {
          return datum?.[dataField] >= 0 ? 'right' : 'left';
        }
        return datum?.[dataField] >= 0 ? 'top' : 'bottom';
      }
      if (labelPosition === 'inside-bottom') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-left' : 'inside-bottom';
      }
      if (labelPosition === 'inside-top') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-right' : 'inside-top';
      }
      return labelPosition;
    };
  }
  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = {
      strategy: labelSpec.overlap?.strategy ?? barLabelOverlapStrategy(series as ICartesianSeries)
    };
  }

  // encode smartInvert
  let smartInvert = false;
  if (isString(labelPosition) && labelPosition.includes('inside')) {
    smartInvert = true;
  }

  return { position, overlap, smartInvert };
}

function barLabelOverlapStrategy(series: ICartesianSeries) {
  const strategy: Strategy[] = [
    {
      type: 'position',
      position: (data: any) => {
        const { data: datum } = data;
        const dataField = series.getMeasureField()[0];
        if (datum?.[dataField] >= 0) {
          return series.direction === 'horizontal' ? ['right', 'inside-right'] : ['top', 'inside-top'];
        }
        return series.direction === 'horizontal' ? ['left', 'inside-left'] : ['bottom', 'inside-bottom'];
      }
    }
  ];

  return strategy;
}
