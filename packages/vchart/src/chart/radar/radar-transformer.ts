import { array } from '../../util';
import { RoseLikeChartSpecTransformer } from '../polar';
import type { IRoseChartSpec } from '../rose';
import { mergeSpec } from '@visactor/vutils-extension';
import type { IPolarAxisCommonTheme } from '../../component/axis/polar/interface/theme';

export class RadarChartSpecTransformer<
  T extends IRoseChartSpec = IRoseChartSpec
> extends RoseLikeChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: any): any {
    const series = super._getDefaultSeriesSpec(spec);
    series.line = spec.line;
    series.point = spec.point;
    series.stack = spec.stack;
    series.percent = spec.percent;
    series.area = mergeSpec(
      {
        visible: false
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
    // 默认不显示轴的 domainLine 和 Tick, 优先使用 theme 中的配置
    (spec.axes ?? []).forEach((axis: any) => {
      if (axis.orient === 'radius') {
        ['domainLine', 'label', 'tick'].forEach(configName => {
          if (!axis[configName]) {
            // 获取 theme 中的配置
            const theme = this._option.getTheme?.();
            const themeConfig = theme?.component?.axisRadius;
            // 如果 theme 中设置了 visible,则使用 theme 的值,否则默认为 false
            const themeVisible = themeConfig?.[configName as keyof IPolarAxisCommonTheme]?.visible ?? false;
            axis[configName] = { visible: themeVisible };
          }
        });
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
