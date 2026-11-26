import { array } from '../../util';
import { RoseLikeChartSpecTransformer } from '../polar';
import type { IRoseChartSpec } from '../rose';
import { mergeSpec } from '@visactor/vutils-extension';
import { getPolarAxisTheme } from '../../component/axis/polar/util/common';
import type { IPolarAxisCommonTheme } from '../../component/axis/polar/interface/theme';
import type { IComponentTheme } from '../../component/interface';

export class RadarChartSpecTransformer<
  T extends IRoseChartSpec = IRoseChartSpec
> extends RoseLikeChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: any): any {
    const series = super._getDefaultSeriesSpec(spec);
    const areaTheme = this._option.getTheme?.('series', 'radar', 'area');
    this._addSeriesRelatedSpecKeys(['line', 'point', 'area']);
    series.line = spec.line;
    series.point = spec.point;
    series.stack = spec.stack;
    series.percent = spec.percent;
    series.area = mergeSpec(
      {
        visible: areaTheme?.visible ?? false
      },
      spec.area
    );
    series.seriesMark = spec.seriesMark ?? 'area';
    series.activePoint = spec.activePoint;
    series.pointDis = spec.pointDis;
    series.pointDisMul = spec.pointDisMul;
    series.markOverlap = spec.markOverlap;
    return series;
  }

  transformSpec(spec: T) {
    super.transformSpec(spec);
    // 只检查配置的主题，避免把通用组件的内置可见性当成雷达图的显式设置。
    const componentTheme: IComponentTheme | undefined = this._option.getTheme?.('component');
    const getConfiguredComponentTheme = (_scope: string, key: string) => componentTheme?.[key];
    spec.axes?.forEach(axis => {
      if (axis.orient === 'radius') {
        const axisTheme: IPolarAxisCommonTheme = getPolarAxisTheme(
          axis.orient,
          axis.type ?? 'linear',
          getConfiguredComponentTheme
        );
        for (const configName of ['domainLine', 'label', 'tick'] as const) {
          if (!axis[configName] && axisTheme[configName]?.visible === undefined) {
            axis[configName] = { visible: false };
          }
        }
        if (!axis.grid) {
          axis.grid = { visible: true };
        }
      }
    });

    // set default config for crosshair
    spec.crosshair = array(spec.crosshair || {}).map(crosshairCfg => {
      return mergeSpec(
        {
          categoryField: {
            visible: true,
            line: {
              visible: true,
              type: 'line'
            }
          }
        },
        crosshairCfg
      );
    });
  }
}
