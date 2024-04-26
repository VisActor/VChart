import { array } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, getCommonSpec } from './common';
import { TemplateChartType } from '../constant';
import { ChartDimensionField, ChartValueField } from '../../const';

export function spec() {
  return {
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
      visible: true,
      style: {
        lineHeight: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'D-Din' // 配置上默认字体
      },
      overlap: true,
      smartInvert: true
    }
  };
}

export class PieTemp extends BaseTemp {
  static type = TemplateChartType.pie;
  type = PieTemp.type;
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    return CommonStandardDataCheck(data);
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
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
