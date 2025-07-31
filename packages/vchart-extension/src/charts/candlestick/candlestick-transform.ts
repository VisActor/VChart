import { CartesianChartSpecTransformer } from '@visactor/vchart';
import type { ICandlestickChartSpecBase } from './interface';

export class CandlestickChartSpecTransformer extends CartesianChartSpecTransformer<ICandlestickChartSpecBase> {
  transformSpec(spec: ICandlestickChartSpecBase): void {
    spec.extensionMark = spec.extensionMark ?? [];
    super.transformSpec(spec);
  }

  _getDefaultSeriesSpec(spec: ICandlestickChartSpecBase) {
    const seriesSpec = super._getDefaultSeriesSpec(spec);
    (seriesSpec as ICandlestickChartSpecBase).candlestick = spec.candlestick;
    (seriesSpec as ICandlestickChartSpecBase).openField = spec.openField;
    (seriesSpec as ICandlestickChartSpecBase).closeField = spec.closeField;
    (seriesSpec as ICandlestickChartSpecBase).highField = spec.highField;
    (seriesSpec as ICandlestickChartSpecBase).lowField = spec.lowField;
    (seriesSpec as ICandlestickChartSpecBase).upStyle = spec.upStyle;
    (seriesSpec as ICandlestickChartSpecBase).downStyle = spec.downStyle;
    (seriesSpec as ICandlestickChartSpecBase).noChangeStyle = spec.noChangeStyle;
    return seriesSpec;
  }
}
