import { cloneDeep } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';

const spec = {
  type: 'common',
  series: [
    {
      id: 'pie-0',
      type: 'pie',
      outerRadius: 0.8,
      valueField: 'value',
      categoryField: 'type',
      seriesField: 'type',
      pie: {
        // The state style of pie
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
    }
  ],
  data: [
    {
      id: 'pieData',
      // @ts-ignore
      values: [
        { type: 'oxygen', value: '46.60' },
        { type: 'silicon', value: '27.72' },
        { type: 'aluminum', value: '8.13' }
      ]
    }
  ],
  legends: {
    id: 'legend-discrete',
    visible: true
  },
  region: [
    {
      id: 'region-0',
      style: {}
    }
  ]
};

export class PieTemp extends BaseTemp {
  type = 'pie';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    let typeField: string = null;
    let valueField: string = null;
    Object.keys(info).forEach(key => {
      if (key.startsWith('VGRAMMAR_') || key.startsWith('__VCHART_')) {
        return;
      }
      if (info[key].type === 'linear') {
        valueField = key;
      } else if (info[key].type === 'ordinal') {
        typeField = key;
      }
    });
    if (valueField && typeField) {
      return true;
    }
    return false;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const tempSpec = cloneDeep(spec);
    tempSpec.data = [data];
    let categoryField: string = null;
    let valueField: string = null;
    Object.keys(info).forEach(key => {
      if (key.startsWith('VGRAMMAR_') || key.startsWith('__VCHART_')) {
        return;
      }
      if (info[key].type === 'linear') {
        valueField = key;
      } else if (info[key].type === 'ordinal') {
        categoryField = key;
      }
    });
    if (!valueField || !categoryField) {
      return false;
    }
    tempSpec.series[0].valueField = valueField;
    tempSpec.series[0].categoryField = categoryField;
    tempSpec.series[0].dataId = data.name;
    tempSpec.series[0].seriesField = categoryField;
    return tempSpec;
  }
}
