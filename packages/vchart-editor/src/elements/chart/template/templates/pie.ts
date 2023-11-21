import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';
import { getCommonSpec, getDimensions } from './common';

export function spec() {
  const _spec = getCommonSpec();
  _spec.series.push({
    id: 'pie-0',
    type: 'pie',
    outerRadius: 0.8,
    pie: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    label: {
      visible: true
    }
  });
  return _spec;
}

export class PieTemp extends BaseTemp {
  type = 'pie';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const { ordinalFields, linearFields } = getDimensions(info);
    if (ordinalFields.length === 0 || linearFields.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const tempSpec = spec() as any;
    tempSpec.data = [
      {
        id: data.name,
        values: data.latestData,
        fields: data.getFields()
      }
    ];
    const { ordinalFields, linearFields } = getDimensions(info);
    tempSpec.series[0].valueField = linearFields[0];
    tempSpec.series[0].categoryField = ordinalFields[0];
    tempSpec.series[0].dataId = data.name;
    tempSpec.series[0].seriesField = ordinalFields[0];
    return tempSpec;
  }
}
