import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';
import { getCartesianCommonSpec, getCartesianSpec, getDimensions } from './common';

export function spec() {
  const _spec = getCartesianCommonSpec('vertical', true);
  _spec.series.push({
    id: 'barPercent-0',
    type: 'bar',
    stack: true,
    percent: true,
    bar: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    label: {
      visible: true,
      position: 'inside'
    }
  });
  return _spec;
}

export class BarPercentTemp extends BaseTemp {
  type = 'barPercent';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const { ordinalFields, linearFields } = getDimensions(info);
    if (ordinalFields.length === 0 || linearFields.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    return getCartesianSpec(spec(), 'vertical', data, info, 1);
  }
}
