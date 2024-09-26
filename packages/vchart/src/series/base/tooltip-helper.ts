import type { ISeriesTooltipSpec, ITooltipSpec, TooltipHandlerParams } from '../../component/tooltip/interface';
import type {
  ITooltipLinePattern,
  ITooltipPattern,
  MaybeArray,
  ShapeType,
  TooltipActiveType,
  TooltipData,
  TooltipPatternProperty
} from '../../typings';
import { array, isValid } from '@visactor/vutils';
import type { ISeries, ISeriesTooltipHelper } from '../interface';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type { Datum } from '@visactor/vgrammar-core';
import type { IMark } from '../../mark/interface/common';
import { isActiveTypeVisible, parseContent } from '../../component/tooltip/utils/common';

interface ISeriesCacheInfo {
  seriesFields: string[];
  dimensionFields: string[];
  measureFields: string[];
  type: string;
}

export class BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  series: ISeries;

  spec: ISeriesTooltipSpec | undefined;
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

  getShapeAttrs(activeType: TooltipActiveType, chartTooltipSpec?: ITooltipSpec) {
    const shapeAttrs = {
      ...chartTooltipSpec?.style?.shape,
      ...chartTooltipSpec?.[activeType],
      ...this.spec?.[activeType]
    };

    return {
      shapeType: shapeAttrs.shapeType ?? this.shapeTypeCallback,
      shapeFill: shapeAttrs.shapeFill ?? shapeAttrs.shapeColor ?? this.shapeColorCallback,
      shapeStroke: shapeAttrs.shapeStroke ?? this.shapeStrokeCallback,
      shapeHollow: shapeAttrs.shapeHollow ?? false,
      shapeLineWidth: shapeAttrs.shapeLineWidth,
      shapeSize: shapeAttrs.shapeSize ?? shapeAttrs.size
    };
  }

  enableByType(activeType: TooltipActiveType) {
    return true;
  }

  getDefaultContentList(
    activeType: TooltipActiveType
  ): MaybeArray<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>> {
    return [{}];
  }

  getContentList(
    activeType: TooltipActiveType,
    contentSpec: MaybeArray<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>>,
    data?: TooltipData,
    params?: TooltipHandlerParams
  ): ITooltipLinePattern[] {
    return parseContent(contentSpec ?? this.getDefaultContentList(activeType), data, params);
  }

  getTooltipPattern(
    activeType: TooltipActiveType,
    chartTooltipSpec?: ITooltipSpec,
    data?: TooltipData,
    params?: TooltipHandlerParams
  ): ITooltipPattern | null {
    if (!this.enableByType(activeType) || !isActiveTypeVisible(activeType, this.spec)) {
      return null;
    }
    const patternSpec = this.spec?.[activeType] ?? chartTooltipSpec?.[activeType];
    const shapeAttrs = this.getShapeAttrs(activeType, chartTooltipSpec);

    if (activeType === 'dimension') {
      if (data && data.length) {
        const content: ITooltipLinePattern[] = [];
        (data as IDimensionInfo[]).forEach(info =>
          info.data.forEach(({ series }) => {
            const userContents = this.getContentList(activeType, patternSpec?.content, data, params);

            userContents.forEach(entry => {
              content.push({
                ...shapeAttrs,
                ...this.getDefaultContentPattern(activeType),
                ...entry
              });
            });
          })
        );

        return {
          visible: true,
          activeType,
          title: patternSpec?.title
            ? { ...shapeAttrs, ...this.getDefaultTitlePattern(activeType), ...patternSpec.title }
            : { ...shapeAttrs, ...this.getDefaultTitlePattern(activeType) },
          content
        };
      }
      return null;
    }

    return {
      visible: true,
      activeType,
      title: patternSpec?.title
        ? { ...shapeAttrs, ...this.getDefaultTitlePattern(activeType), ...patternSpec.title }
        : { ...shapeAttrs, ...this.getDefaultTitlePattern(activeType) },
      content: this.getContentList(activeType, patternSpec?.content, data, params).map(entry => {
        return { ...shapeAttrs, ...this.getDefaultContentPattern(activeType), ...entry };
      })
    };
  }

  getDefaultTitlePattern(activeType: TooltipActiveType): ITooltipPattern['title'] {
    return {
      key: undefined,
      value: activeType === 'group' ? this.groupTooltipTitleCallback : this.dimensionTooltipTitleCallback,
      hasShape: false
    };
  }

  getDefaultContentPattern(activeType: TooltipActiveType): ITooltipPattern['content'] {
    return {
      seriesId: this.series.id,
      key: activeType === 'group' ? this.groupTooltipKeyCallback : this.markTooltipKeyCallback,
      value: this.markTooltipValueCallback,
      hasShape: true
    };
  }
}
