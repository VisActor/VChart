import { array } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, getCommonSpec } from './common';
import { TemplateChartType } from '../constant';
import { ChartDimensionField, ChartValueField } from '../../const';

export function spec() {
  return {
    type: 'wordCloud'
  };
}

export class WordCloudTemp extends BaseTemp {
  static type = TemplateChartType.wordcloud;
  type = WordCloudTemp.type;
  checkDataEnable(data: StandardData, opt?: any): boolean {
    const check = CommonStandardDataCheck(data);
    return check;
  }
  getSpec(data: StandardData, opt?: any) {
    const tempSpec = getCommonSpec() as any;
    tempSpec.series = [spec()];
    tempSpec.data = array(data);
    tempSpec.series[0].valueField = ChartValueField;
    tempSpec.series[0].nameField = ChartDimensionField;
    tempSpec.series[0].dataId = tempSpec.data[0].id;
    tempSpec.series[0].seriesField = ChartDimensionField;
    tempSpec.series[0].id = `series-${tempSpec.data[0].id}`;
    console.log('tempSpec', tempSpec);
    return tempSpec;
  }
}
