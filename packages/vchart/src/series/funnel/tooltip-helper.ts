import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import { FunnelSeries } from './funnel';
import { FUNNEL_REACH_RATIO } from '../../constant/funnel';
import { isValid } from '@visactor/vutils';
import type { TooltipHandlerParams } from '../../component/tooltip/interface';
import type { Datum } from '@visactor/vgrammar';

export class FunnelSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  titleValueCallback = (datum: Datum, params?: TooltipHandlerParams) => {
    const series = this.series as FunnelSeries;
    if (params?.mark?.name === FunnelSeries.mark.transform?.name) {
      // TODO: i18n
      return `转化率`;
    }
    return this._getDimensionData(datum) ?? datum.properties?.[`${series.categoryField}`];
  };

  contentValueCallback = (datum: Datum) => {
    const series = this.series as FunnelSeries;
    if (series.isTransformLevel(datum)) {
      const measureData = datum?.[FUNNEL_REACH_RATIO];
      return `${(measureData * 100).toFixed(1)}%`;
    }
    return this._getMeasureData(datum);
  };

  contentKeyCallback = (datum: Datum, params?: TooltipHandlerParams) => {
    if (params?.mark?.name === FunnelSeries.mark.transform?.name) {
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
