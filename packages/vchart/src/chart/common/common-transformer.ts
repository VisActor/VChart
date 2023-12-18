import type { AdaptiveSpec, ISeriesSpec } from '../../typings';
import { get, mergeSpec } from '../../util';
import { BaseChartSpecTransformer } from '../base';
import { getTrimPaddingConfig } from '../util';
import type { ICommonChartSpec } from './interface';

export class CommonChartSpecTransformer<T extends ICommonChartSpec = ICommonChartSpec> extends BaseChartSpecTransformer<
  AdaptiveSpec<T, 'series'>
> {
  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'series'>) {
    const defaultSpec = super._getDefaultSeriesSpec(spec);
    // 组合图系列的默认配置由系列自身配置 data/dataIndex/dataId 决定，无需默认配置
    delete defaultSpec.data;
    return defaultSpec;
  }

  transformSpec(spec: AdaptiveSpec<T, 'series'>): void {
    super.transformSpec(spec);
    if (spec.series && spec.series.length) {
      const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
      spec.series.forEach((s: ISeriesSpec) => {
        if (!this._isValidSeries(s.type)) {
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
