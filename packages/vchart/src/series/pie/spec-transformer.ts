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
    if (this._shouldMergeThemeToSpec()) {
      // this._originalSpec + specFromChart + this._theme = this._spec
      let specFromChart = this._getDefaultSpecFromChart(chartSpec);
      specFromChart = this._prepareSpecBeforeMergingTheme(specFromChart);
      const specFromUser = this._prepareSpecBeforeMergingTheme(spec);

      const labelSpec = mergeSpec({}, theme.label, specFromChart.label, specFromUser.label) as IArcLabelSpec;
      const labelTheme = mergeSpec(
        {},
        theme.label,
        labelSpec.position === 'inside' ? theme.innerLabel : theme.outerLabel
      );
      const newTheme = {
        ...theme,
        label: labelTheme
      } as K;
      return {
        spec: mergeSpec({}, newTheme, specFromChart, specFromUser),
        theme: newTheme
      };
    }
    return { spec, theme };
  }
}
