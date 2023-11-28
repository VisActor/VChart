import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';
import { getCartesianCommonSpec, getCartesianSpec, getDimensions } from './common';

export function spec() {
  const _spec = getCartesianCommonSpec('vertical', true, true);
  _spec.series.push({
    id: 'areaPercent-0',
    type: 'area',
    stack: true,
    percent: true,
    line: {
      style: {
        lineCap: 'butt'
      }
    },
    label: {
      visible: true,
      position: 'inside'
    }
  });
  return _spec;
}

export class AreaPercentTemp extends BaseTemp {
  type = 'areaPercent';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const { ordinalFields, linearFields } = getDimensions(info);
    if (ordinalFields.length === 0 || linearFields.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    return getCartesianSpec(spec(), 'vertical', data, info, {
      ordinalFieldCount: 1
    });
  }
}
