import { IChartCharacterSpec } from '../../../dsl-interface';
import type { StandardData } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { getPolarCommonSpec, getPolarSpec } from './common';

export abstract class PolarSingleSeriesTemp extends BaseTemp {
  // 唯一系列类型
  seriesType: string;
  defaultLegendVisible = false;

  constructor(characterSpec: IChartCharacterSpec) {
    super();
  }

  checkDataEnable(data: StandardData, opt?: any): boolean {
    return !!data; // CommonStandardDataCheck(data);
  }
  getSpec(data: StandardData, opt?: any) {
    const polarCommonSpec = getPolarCommonSpec() as any;
    if (polarCommonSpec.legends) {
      polarCommonSpec.legends.visible = this.defaultLegendVisible;
    }

    return getPolarSpec(this._getSeriesSpec.bind(this), polarCommonSpec, data, {
      categoryField: opt.character.specProcess.getCharacterSpec().options.categoryField,
      valueField: opt.character.specProcess.getCharacterSpec().options.valueField,
      seriesField: opt.character.specProcess.getCharacterSpec().options.seriesField
    });
  }

  protected abstract _getSeriesSpec(): any;
}
