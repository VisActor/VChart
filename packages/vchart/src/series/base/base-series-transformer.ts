import type { IChartSpecInfo } from '../../chart/interface';
import type { ILabelSpec, TransformedLabelSpec } from '../../component/label';
import type { ILabelMark } from '../../mark/label';
import type { IBaseModelSpecTransformerResult } from '../../model/interface';
import { BaseModelSpecTransformer } from '../../model/base-model-transformer';
import type { ISeriesSpec } from '../../typings';
import { array, get, isValid, mergeSpec, transformSeriesThemeToMerge } from '../../util';
import type { SeriesMarkNameEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import type { ISeries } from '../interface';
import { getDirectionFromSeriesSpec } from '../util/spec';

export class BaseSeriesSpecTransformer<T extends ISeriesSpec, K> extends BaseModelSpecTransformer<T, K> {
  markLabelSpec: Partial<Record<SeriesMarkNameEnum, TransformedLabelSpec[]>> = {};

  getLabelSpec(markName: string) {
    return this.markLabelSpec[markName];
  }

  setLabelSpec(markName: string, label: TransformedLabelSpec | TransformedLabelSpec[]) {
    this.markLabelSpec[markName] = array(label);
  }

  addLabelSpec(markName: string, label: TransformedLabelSpec, head = false) {
    if (!this.markLabelSpec[markName]) {
      this.markLabelSpec[markName] = [];
    }
    if (head) {
      // 排序靠前的 label 优先布局，尽可能避免碰撞隐藏
      this.markLabelSpec[markName].unshift(label);
    } else {
      this.markLabelSpec[markName].push(label);
    }
  }

  getTheme(spec: T, chartSpec: any): K {
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

  /** 不建议重写该方法，最好重写对应子步骤 */
  transformSpec(spec: T, chartSpec: any, chartSpecInfo?: IChartSpecInfo): IBaseModelSpecTransformerResult<T, K> {
    this._transformSpec(spec, chartSpec, chartSpecInfo);
    const result = this._initTheme(spec, chartSpec);
    this._transformLabelSpec(result.spec);
    return {
      ...result,
      markLabelSpec: this.markLabelSpec
    };
  }

  protected _transformLabelSpec(spec: T) {
    // empty
  }

  protected _addMarkLabelSpec<V extends ISeries = ISeries>(
    spec: T,
    markName: SeriesMarkNameEnum,
    labelSpecKey: keyof T = 'label' as any,
    styleHandlerName: keyof V = 'initLabelMarkStyle',
    hasAnimation?: boolean,
    head?: boolean
  ): void {
    const labelSpec = spec?.[labelSpecKey] as ILabelSpec;
    if (labelSpec?.visible) {
      this.addLabelSpec(
        markName,
        {
          animation: hasAnimation ?? spec.animation,
          ...labelSpec,
          getStyleHandler: (series: V) => (series[styleHandlerName] as any)?.bind(series)
        } as TransformedLabelSpec,
        head
      );
    }
  }

  protected _getDefaultSpecFromChart(chartSpec: any): any {
    const spec = (super._getDefaultSpecFromChart(chartSpec) as any) ?? {};
    const { outerRadius, innerRadius } = chartSpec;
    if (isValid(outerRadius)) {
      spec.outerRadius = outerRadius;
    }
    if (isValid(innerRadius)) {
      spec.innerRadius = innerRadius;
    }
    return Object.keys(spec).length > 0 ? spec : undefined;
  }
}
