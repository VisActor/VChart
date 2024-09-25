import type { ITooltipSpec, TooltipHandlerParams } from '../../component/tooltip/interface';
import type { ITooltipLinePattern, ITooltipPattern, ShapeType, TooltipActiveType } from '../../typings';
import { array, isValid } from '@visactor/vutils';
import type { ISeries, ISeriesTooltipHelper } from '../interface';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type { Datum } from '@visactor/vgrammar-core';
import type { IMark } from '../../mark/interface/common';

interface ISeriesCacheInfo {
  seriesFields: string[];
  dimensionFields: string[];
  measureFields: string[];
  type: string;
}

export class BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  series: ISeries;

  spec: ITooltipSpec | undefined;
  activeType: TooltipActiveType[];

  activeTriggerSet = {
    mark: new Set<IMark>(),
    group: new Set<IMark>()
  };
  ignoreTriggerSet = {
    mark: new Set<IMark>()
  };
  protected _seriesCacheInfo: ISeriesCacheInfo;

  constructor(series: ISeries) {
    this.series = series;
    this.updateTooltipSpec();
  }

  updateTooltipSpec() {
    const seriesTooltipSpec = this.series.getSpec()?.tooltip;

    this.spec = seriesTooltipSpec;
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

  protected _getSeriesFieldData = (datum: any) => {
    const { dimensionFields, seriesFields } = this._seriesCacheInfo;

    if (isValid(seriesFields[0]) && datum?.[seriesFields[0]]) {
      return datum?.[seriesFields[0]];
    }

    const subDimensionField = dimensionFields[dimensionFields.length - 1];
    if (dimensionFields.length > 1 && (seriesFields.length === 0 || this.series.getSeriesKeys().length <= 1)) {
      return datum?.[subDimensionField];
    }

    return datum?.[subDimensionField];
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

  markTooltipKeyCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getSeriesFieldData(datum);
  };

  markTooltipValueCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getMeasureData(datum);
  };

  shapeTypeCallback = (datum: Datum, params?: TooltipHandlerParams): ShapeType | undefined => {
    return (
      this._getSeriesStyle(datum, 'shape', null) ??
      this._getSeriesStyle(datum, 'symbolType', this.series.getDefaultShapeType())
    );
  };

  shapeColorCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getSeriesStyle(datum, ['fill', 'stroke']);
  };

  shapeStrokeCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getSeriesStyle(datum, ['stroke', 'fill']);
  };

  dimensionTooltipTitleCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getDimensionData(datum);
  };

  groupTooltipTitleCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    return this._getSeriesFieldData(datum);
  };

  groupTooltipKeyCallback = (datum: Datum, params?: TooltipHandlerParams): string | undefined => {
    const { seriesFields } = this._seriesCacheInfo;
    let dimensionFields = this._seriesCacheInfo.dimensionFields;
    if (seriesFields[0]) {
      dimensionFields = dimensionFields.filter(field => field !== seriesFields[0]);
    }
    return dimensionFields.map(field => datum?.[field]).join('-');
  };

  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    switch (activeType) {
      case 'mark':
        return {
          visible: true,
          activeType,
          title: {
            key: undefined,
            value: this.dimensionTooltipTitleCallback,
            hasShape: false
          },
          content: [
            {
              seriesId: this.series.id,
              key: this.markTooltipKeyCallback,
              value: this.markTooltipValueCallback,
              hasShape: true,
              shapeType: this.shapeTypeCallback,
              shapeColor: this.shapeColorCallback,
              shapeStroke: this.shapeStrokeCallback,
              shapeHollow: false
            }
          ]
        };
      case 'group':
        return {
          visible: true,
          activeType,
          title: {
            key: undefined,
            value: this.groupTooltipTitleCallback,
            hasShape: false
          },
          content: [
            {
              seriesId: this.series.id,
              key: this.groupTooltipKeyCallback,
              value: this.markTooltipValueCallback,
              hasShape: true,
              shapeType: this.shapeTypeCallback,
              shapeColor: this.shapeColorCallback,
              shapeStroke: this.shapeStrokeCallback,
              shapeHollow: false
            }
          ]
        };
      case 'dimension':
        if (dimensionInfo) {
          const title: ITooltipLinePattern = {
            key: undefined,
            value: this.dimensionTooltipTitleCallback,
            hasShape: false
          };
          const content: ITooltipLinePattern[] = [];
          dimensionInfo.forEach(({ data }) =>
            data.forEach(({ series }) => {
              content.push({
                seriesId: series.id,
                key: this.markTooltipKeyCallback,
                value: this.markTooltipValueCallback,
                hasShape: true,
                shapeType: this.shapeTypeCallback,
                shapeColor: this.shapeColorCallback,
                shapeStroke: this.shapeStrokeCallback,
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
        break;
    }
    return null;
  }
}
