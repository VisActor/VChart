import { BaseModelSpecTransformer } from '../../model/spec-transformer';
import type { ISeriesSpec } from '../../typings';
import { get, mergeSpec, transformSeriesThemeToMerge } from '../../util';
import { getDirectionFromSeriesSpec } from '../util/spec';

export class BaseSeriesSpecTransformer<T extends ISeriesSpec> extends BaseModelSpecTransformer<T> {
  getTheme(spec: T, chartSpec: any): any {
    const direction = getDirectionFromSeriesSpec(spec);
    const chartTheme = this._option?.getTheme();
    const { markByName, mark } = chartTheme;
    const type = this._option.type;
    const theme = transformSeriesThemeToMerge(get(chartTheme, `series.${type}`), type, mark, markByName);
    const themeWithDirection = transformSeriesThemeToMerge(
      get(chartTheme, `series.${type}_${direction}`),
      `${type}_${direction}`,
      mark,
      markByName
    );
    return mergeSpec({}, theme, themeWithDirection);
  }
}
