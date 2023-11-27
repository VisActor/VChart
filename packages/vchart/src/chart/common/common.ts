import { get } from '@visactor/vutils';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import type { ISeries } from '../../series';
import { Factory } from '../../core/factory';
import { mergeSpec } from '../../util/spec';
import { getTrimPaddingConfig } from '../util';

export class CommonChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.common;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.common;
  protected _canStack: boolean = true;

  protected _getDefaultSeriesSpec(spec: any) {
    const defaultSpec = super._getDefaultSeriesSpec(spec);
    // 组合图系列的默认配置由系列自身配置 data/dataIndex/dataId 决定，无需默认配置
    delete defaultSpec.data;
    return defaultSpec;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    if (spec.series && spec.series.length) {
      const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
      spec.series.forEach((s: ISeries) => {
        if (!this.isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
    if (spec.axes && spec.axes.length) {
      spec.axes.forEach((axis: any) => {
        if (get(axis, 'trimPadding')) {
          mergeSpec(axis, getTrimPaddingConfig(this.type, spec));
        }
      });
    }
  }
}

export const registerCommonChart = () => {
  Factory.registerChart(CommonChart.type, CommonChart);
};
