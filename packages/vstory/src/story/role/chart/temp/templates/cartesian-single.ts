import { DirectionType } from '../../const';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, getCartesianCommonSpec, getCartesianSpec } from './common';

export abstract class CartesianSingleSeriesTemp extends BaseTemp {
  // 唯一系列类型
  seriesType: string;
  direction: DirectionType = 'vertical';
  // 是否有维度轴分组
  multiDimensionField = false;
  // 是否堆积
  stack = true;
  // 是否默认有总计标签
  defaultTotalLabel = false;
  // 是否是百分百图表
  percent = false;
  // 是否消除维度轴的2测留白
  trimPadding = false;
  // 是否默认展示图例
  defaultLegendVisible = false;

  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    return CommonStandardDataCheck(data);
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const cartesianCommonSpec = getCartesianCommonSpec(this.direction, this.percent, this.trimPadding) as any;
    if (cartesianCommonSpec.legends) {
      cartesianCommonSpec.legends.visible = this.defaultLegendVisible;
    }

    return getCartesianSpec(this._getSeriesSpec.bind(this), cartesianCommonSpec, this.direction, data, {
      multiDimensionField: this.multiDimensionField,
      stack: this.stack
    });
  }

  protected abstract _getSeriesSpec(): any;
}
