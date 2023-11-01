import type { ITooltipActiveTypeAsKeys, ITooltipSpec, TooltipHandlerParams } from '../../component/tooltip/interface';
import type { IToolTipLinePattern, ITooltipPattern, ShapeType, TooltipActiveType } from '../../typings';
import { array, isFunction, isValid } from '@visactor/vutils';
import type { ISeries, ISeriesTooltipHelper } from '../interface';
import { BaseTooltipHelper } from '../../model/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type { Datum } from '@visactor/vgrammar-core';
import { getTooltipActualActiveType } from '../../component/tooltip/utils/common';

interface ISeriesCacheInfo {
  seriesFields: string[];
  dimensionFields: string[];
  measureFields: string[];
  type: string;
}

export class BaseSeriesTooltipHelper extends BaseTooltipHelper implements ISeriesTooltipHelper {
  series: ISeries;

  protected _seriesCacheInfo: ISeriesCacheInfo;

  constructor(series: ISeries) {
    super();
    this.series = series;
    this.updateTooltipSpec();
  }

  updateTooltipSpec() {
    const seriesTooltipSpec = this.series.getSpec()?.tooltip ?? {};
    const chartTooltipSpec = this.series.getChart().getSpec()?.tooltip ?? {};

    const spec = {
      ...chartTooltipSpec,
      ...seriesTooltipSpec
    } as ITooltipSpec;

    // 将 series id 放入 pattern
    (['mark', 'dimension'] as Array<keyof ITooltipActiveTypeAsKeys<any, any>>).forEach(activeType => {
      const pattern = spec[activeType];
      if (isValid(pattern)) {
        spec[activeType] = {
          ...pattern,
          title: isValid(pattern.title)
            ? isFunction(pattern.title)
              ? pattern.title
              : ({
                  ...pattern.title,
                  seriesId: this.series.id
                } as IToolTipLinePattern)
            : undefined,
          content: isValid(pattern.content)
            ? isFunction(pattern.content)
              ? pattern.content
              : array(pattern.content).map(line =>
                  isFunction(line)
                    ? line
                    : ({
                        ...line,
                        seriesId: this.series.id
                      } as IToolTipLinePattern)
                )
            : undefined
        };
      }
    });

    this.spec = spec;
    this.activeType = getTooltipActualActiveType(spec);

    this._seriesCacheInfo = this._getSeriesCacheInfo();
  }

  protected _getSeriesCacheInfo = (): ISeriesCacheInfo => {
    const { series } = this;
    const _seriesField = series.getSeriesField();
    const seriesFields = isValid(_seriesField) ? array(_seriesField) : series.getSeriesKeys() ?? [];
    return {
      seriesFields,
      dimensionFields: series.getDimensionField() ?? [],
      measureFields: series.getMeasureField() ?? [],
      type: series.type
    };
  };

  protected _getDimensionData = (datum: any) => {
    const { dimensionFields } = this._seriesCacheInfo;
    return dimensionFields[0] && datum?.[dimensionFields[0]];
  };

  protected _getMeasureData = (datum: any) => {
    const { measureFields } = this._seriesCacheInfo;
    return measureFields[0] && datum?.[measureFields[0]];
  };

  protected _getSeriesStyle = (datum: any, styleKey: string | string[], defaultValue?: any) => {
    for (const key of array(styleKey)) {
      const value = this.series.getSeriesStyle(datum)?.(key);
      if (isValid(value)) {
        return value;
      }
    }
    return defaultValue;
  };

  contentKeyCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    const { dimensionFields, seriesFields } = this._seriesCacheInfo;
    const subDimensionField = dimensionFields[dimensionFields.length - 1];

    if (isValid(seriesFields[0]) && datum?.[seriesFields[0]]) {
      return datum?.[seriesFields[0]];
    }

    if (dimensionFields.length > 1 && (seriesFields.length === 0 || this.series.getSeriesKeys().length <= 1)) {
      return datum?.[subDimensionField];
    }

    return datum?.[subDimensionField];
  };

  contentValueCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getMeasureData(datum);
  };

  contentShapeTypeCallback = (datum: Datum, params?: TooltipHandlerParams): ShapeType | undefined => {
    return (
      this._getSeriesStyle(datum, 'shape', null) ??
      this._getSeriesStyle(datum, 'symbolType', this.series.getDefaultShapeType())
    );
  };

  contentShapeColorCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getSeriesStyle(datum, ['fill', 'stroke']);
  };

  titleValueCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getDimensionData(datum);
  };

  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    if (activeType === 'mark') {
      return {
        visible: true,
        activeType,
        title: {
          key: undefined,
          value: this.titleValueCallback,
          hasShape: false
        },
        content: [
          {
            seriesId: this.series.id,
            key: this.contentKeyCallback,
            value: this.contentValueCallback,
            hasShape: true,
            shapeType: this.contentShapeTypeCallback,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            shapeHollow: false
          }
        ]
      };
    } else if (activeType === 'dimension' && dimensionInfo) {
      const title: IToolTipLinePattern = {
        key: undefined,
        value: this._getDimensionData,
        hasShape: false
      };
      const content: IToolTipLinePattern[] = [];
      dimensionInfo.forEach(({ data }) =>
        data.forEach(({ series }) => {
          content.push({
            seriesId: series.id,
            key: this.contentKeyCallback,
            value: this.contentValueCallback,
            hasShape: true,
            shapeType: this.contentShapeTypeCallback,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            shapeHollow: false
          });
        })
      );
      return {
        visible: true,
        activeType,
        title,
        content
      };
    }

    return null;
  }
}
