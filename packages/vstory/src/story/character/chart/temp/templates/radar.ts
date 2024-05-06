import type { StandardData } from '../../data/interface';
import { CommonStandardDataCheck, getCommonSpec } from './common';
import { TemplateChartType } from '../constant';
import { PolarSingleSeriesTemp } from './polar-single';

export class RadarTemp extends PolarSingleSeriesTemp {
  static type = TemplateChartType.radar;
  type = RadarTemp.type;
  checkDataEnable(data: StandardData, opt?: any): boolean {
    return CommonStandardDataCheck(data);
  }

  protected _getSeriesSpec() {
    return {
      type: 'radar'
    };
  }
}
