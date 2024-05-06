import { array } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, getCommonSpec } from './common';
import { TemplateChartType } from '../constant';
import { ChartDimensionField, ChartValueField } from '../../const';
import { PolarSingleSeriesTemp } from './polar-single';

export class RoseTemp extends PolarSingleSeriesTemp {
  static type = TemplateChartType.rose;
  type = RoseTemp.type;
  protected _getSeriesSpec() {
    return {
      type: 'rose'
    };
  }
}
