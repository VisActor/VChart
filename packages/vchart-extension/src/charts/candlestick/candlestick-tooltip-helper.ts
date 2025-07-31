import { CANDLESTICK_TOOLTIP_KEYS } from './constants';
import type { CandlestickSeries } from './candlestick';
import type { Datum, ISeriesTooltipHelper, ITooltipLinePattern, TooltipActiveType } from '@visactor/vchart';
import { BaseSeriesTooltipHelper } from '@visactor/vchart';

export class CandlestickSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  protected getDefaultContentList(activeType: TooltipActiveType): ITooltipLinePattern[] {
    return [
      {
        key: this.getContentKey(CANDLESTICK_TOOLTIP_KEYS.OPEN),
        value: this.getContentValue(CANDLESTICK_TOOLTIP_KEYS.OPEN),
        shapeType: this.shapeTypeCallback
      },
      {
        key: this.getContentKey(CANDLESTICK_TOOLTIP_KEYS.CLOSE),
        value: this.getContentValue(CANDLESTICK_TOOLTIP_KEYS.CLOSE)
      },
      {
        key: this.getContentKey(CANDLESTICK_TOOLTIP_KEYS.HIGH),
        value: this.getContentValue(CANDLESTICK_TOOLTIP_KEYS.HIGH)
      },
      {
        key: this.getContentKey(CANDLESTICK_TOOLTIP_KEYS.LOW),
        value: this.getContentValue(CANDLESTICK_TOOLTIP_KEYS.LOW)
      }
    ];
  }
  getContentKey = (contentType: CANDLESTICK_TOOLTIP_KEYS) => (datum: any) => {
    switch (contentType) {
      case CANDLESTICK_TOOLTIP_KEYS.OPEN: {
        return (this.series as CandlestickSeries).openField;
      }
      case CANDLESTICK_TOOLTIP_KEYS.CLOSE: {
        return (this.series as CandlestickSeries).closeField;
      }
      case CANDLESTICK_TOOLTIP_KEYS.HIGH: {
        return (this.series as CandlestickSeries).highField;
      }
      case CANDLESTICK_TOOLTIP_KEYS.LOW: {
        return (this.series as CandlestickSeries).lowField;
      }
    }

    return null;
  };

  getContentValue = (contentType: CANDLESTICK_TOOLTIP_KEYS) => (datum: any) => {
    switch (contentType) {
      case CANDLESTICK_TOOLTIP_KEYS.OPEN: {
        const openField = (this.series as CandlestickSeries).openField;
        return datum[openField];
      }
      case CANDLESTICK_TOOLTIP_KEYS.CLOSE: {
        const closeField = (this.series as CandlestickSeries).closeField;
        return datum[closeField];
      }
      case CANDLESTICK_TOOLTIP_KEYS.HIGH: {
        const highField = (this.series as CandlestickSeries).highField;
        return datum[highField];
      }
      case CANDLESTICK_TOOLTIP_KEYS.LOW: {
        const lowField = (this.series as CandlestickSeries).lowField;
        return datum[lowField];
      }
    }

    return null;
  };
  shapeColorCallback = (datum: Datum) => {
    const seriesField = (this.series as CandlestickSeries).getSeriesField();
    if (seriesField) {
      return this.series.getMarkAttributeContext().seriesColor(datum[seriesField]);
    }
    return (
      (this.series as CandlestickSeries).datumStyle(datum, 'bodyFill') ??
      (this.series as CandlestickSeries).datumStyle(datum, 'bodyStroke') ??
      (this.series as CandlestickSeries).datumStyle(datum, 'shadowStroke')
    );
  };
}
