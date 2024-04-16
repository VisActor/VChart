import type { IFunnelSeries, ISeriesTooltipHelper } from '../interface';
import { SeriesMarkNameEnum } from '../interface/type';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import { FUNNEL_REACH_RATIO } from '../../constant/funnel';
import { isValid } from '@visactor/vutils';
import type { TooltipHandlerParams } from '../../component/tooltip/interface';
import type { Datum } from '@visactor/vgrammar-core';

export class FunnelSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  dimensionTooltipTitleCallback = (datum: Datum, params?: TooltipHandlerParams) => {
    const series = this.series as IFunnelSeries;
    if (params?.mark?.name === SeriesMarkNameEnum.transform) {
      // TODO: i18n
      return `转化率`;
    }
    return this._getDimensionData(datum) ?? datum.properties?.[`${series.getCategoryField()}`];
  };

  markTooltipValueCallback = (datum: Datum, params?: TooltipHandlerParams) => {
    if (params?.mark?.name === SeriesMarkNameEnum.transform) {
      const measureData = datum?.[FUNNEL_REACH_RATIO];
      return `${(measureData * 100).toFixed(1)}%`;
    }
    return this._getMeasureData(datum);
  };

  markTooltipKeyCallback = (datum: Datum, params?: TooltipHandlerParams) => {
    if (params?.mark?.name === SeriesMarkNameEnum.transform) {
      // TODO: i18n
      return `转化率`;
    }
    const { dimensionFields, seriesFields } = this._seriesCacheInfo;
    const subDimensionField = dimensionFields[dimensionFields.length - 1];

    if (isValid(seriesFields[0])) {
      return datum?.[seriesFields[0]];
    }
    return datum?.[subDimensionField];
  };
}
