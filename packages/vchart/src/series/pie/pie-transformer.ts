import { isArray } from '@visactor/vutils';
import { mergeSpec } from '../../util';
import { BaseSeriesSpecTransformer } from '../base';
import { SeriesMarkNameEnum } from '../interface';
import type { IArcLabelSpec, IBasePieSeriesSpec, IPieSeriesTheme } from './interface';

export class PieSeriesSpecTransformer<
  T extends IBasePieSeriesSpec = IBasePieSeriesSpec,
  K extends IPieSeriesTheme = IPieSeriesTheme
> extends BaseSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.pie);
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec(spec: T, chartSpec: any): { spec: T; theme: K } {
    const theme = this._theme;
    let newSpec = spec;
    if (this._shouldMergeThemeToSpec()) {
      const specFromChart = this._getDefaultSpecFromChart(chartSpec);

      // this._originalSpec + specFromChart + this._theme = this._spec
      // 动态处理 label 样式，对于展示在内部的 label 默认使用 innerLabel 样式
      newSpec = mergeSpec({}, this._theme, specFromChart, spec) as any;

      const getMergedLabelSpec = (position: IArcLabelSpec['position'], label: IArcLabelSpec) => {
        if (position === 'inside') {
          return mergeSpec({}, this._theme.innerLabel, label);
        } else {
          return mergeSpec({}, this._theme.outerLabel, label);
        }
      };

      if (isArray(newSpec.label)) {
        newSpec.label = newSpec.label.map(label => getMergedLabelSpec(label.position, label));
      } else {
        newSpec.label = getMergedLabelSpec(newSpec.label.position, newSpec.label);
      }
    }

    return { spec: newSpec, theme };
  }
}
