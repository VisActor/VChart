import type { AdaptiveSpec, ISeriesSpec } from '../../typings';
import { array, get, isArray, isNumber, isObject, isValid } from '../../util';
import { BaseChartSpecTransformer } from '../base';
import { getTrimPaddingConfig } from '../util';
import type { ICommonChartSpec } from './interface';
import { mergeSpec } from '@visactor/vutils-extension';
import type { ICartesianBandAxisSpec } from '../../component';

export class CommonChartSpecTransformer<T extends ICommonChartSpec = ICommonChartSpec> extends BaseChartSpecTransformer<
  AdaptiveSpec<T, 'series'>
> {
  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'series'>) {
    const defaultSpec = super._getDefaultSeriesSpec(spec);
    // 组合图系列的默认配置由系列自身配置 data/dataIndex/dataId 决定，无需默认配置
    delete defaultSpec.data;
    return defaultSpec;
  }

  // bar series 支持 autoBandSize 配置
  protected _transformAxisSpec(spec: AdaptiveSpec<T, 'series'>) {
    if (!spec.axes) {
      return;
    }
    // 遍历series
    // 1. 找到bar系列
    // 2. 如果bar系列配置了autoBandSize
    // 3. 找到bar系列对应的axis
    // 4. 为该axis配置bandSize
    spec.series.forEach((series: any, seriesIndex: number) => {
      if (series.type === 'bar' && !!series.autoBandSize) {
        const isHorizontal = series.direction === 'horizontal';
        const matchOrient = isHorizontal ? ['left', 'right'] : ['top', 'bottom'];
        const relatedAxis: any = spec.axes.find((axis: any) => {
          if (!matchOrient.includes(axis.orient)) {
            // orient必须匹配
            return false;
          }
          if (isValid(axis.seriesId)) {
            // 1. 通过seriesId绑定
            if (array(axis.seriesId).includes(series?.id)) {
              return true;
            }
          } else if (isValid(axis.seriesIndex)) {
            // 2. 通过seriesIndex绑定
            if (array(axis.seriesIndex).includes(seriesIndex)) {
              return true;
            }
          } else if (axis.type === 'band') {
            // 3. 通过axis type识别
            return true;
          }
          // 4. 剩下的情况满足axis orient要求
          return true;
        });
        if (relatedAxis && !relatedAxis.bandSize && !relatedAxis.maxBandSize && !relatedAxis.minBandSize) {
          const extend = isObject(series.autoBandSize) ? series.autoBandSize.extend ?? 0 : 0;
          const { barMaxWidth, barMinWidth, barWidth, barGapInGroup } = series;
          let hasBarWidth = false;
          if (isNumber(barMinWidth)) {
            relatedAxis.minBandSize = barMinWidth;
            hasBarWidth = true;
          } else if (isNumber(barWidth)) {
            relatedAxis.minBandSize = barWidth;
            hasBarWidth = true;
          } else if (isNumber(barMaxWidth)) {
            relatedAxis.minBandSize = barMaxWidth;
            hasBarWidth = true;
          }
          if (hasBarWidth) {
            relatedAxis.bandSizeLevel = Number.MAX_VALUE; // 影响最底层的 scale
            relatedAxis.bandSizeExtend = {
              extend,
              gap: isArray(barGapInGroup) ? barGapInGroup[barGapInGroup.length - 1] : barGapInGroup
            };
          }
        }
      }
    });
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
    this._transformAxisSpec(spec);
  }
}
