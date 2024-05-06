import { array } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, getCommonSpec } from './common';
import { TemplateChartType } from '../constant';
import { ChartDimensionField, ChartValueField } from '../../const';

export function spec() {
  return {
    type: 'sunburst'
  };
}

export class SunburstTemp extends BaseTemp {
  static type = TemplateChartType.sunburst;
  type = SunburstTemp.type;
  checkDataEnable(data: StandardData, opt?: any): boolean {
    return CommonStandardDataCheck(data);
  }
  getSpec(data: StandardData, opt?: any) {
    const tempSpec = getCommonSpec() as any;
    tempSpec.series = [spec()];
    tempSpec.data = array(data);
    tempSpec.series[0].valueField = ChartValueField;
    tempSpec.series[0].categoryField = ChartDimensionField;
    tempSpec.series[0].dataId = tempSpec.data[0].id;
    tempSpec.series[0].seriesField = ChartDimensionField;
    tempSpec.series[0].id = `series-${tempSpec.data[0].id}`;
    return tempSpec;
  }
}
