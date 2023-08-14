import { ChartEvent } from './../../constant/event';
import type { ITrigger } from '../../interaction/interface';
import type { ISeries } from '../interface/series';
import { AttributeLevel, STACK_FIELD_END } from '../../constant';

import type { IMark, IMarkProgressiveConfig, IMarkRaw } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../../mark/interface';
import type { ILineMark } from '../../mark/line';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import type {
  DirectionType,
  IInvalidType,
  InterpolateType,
  ILineMarkSpec,
  ISymbolMarkSpec,
  Maybe,
  Datum,
  IMarkTheme,
  ICommonSpec
} from '../../typings';
import { DEFAULT_SMOOTH_INTERPOLATE } from '../../typings/interpolate';
import { Direction } from '../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_CLOSE_STROKE_JOIN, DEFAULT_LINEAR_CLOSED_INTERPOLATE } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { couldBeValidNumber, isValid, merge } from '../../util';
import type { ISeriesMarkInfo, ISeriesMarkInitOption, ISeriesTooltipHelper, SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum } from '../interface';
import type { ILabelSpec } from '../../component/label';
import { shouldDoMorph, userAnimationConfig } from '../../animation/utils';

export interface ILineLikeSeriesTheme {
  line?: Partial<IMarkTheme<ILineMarkSpec>>;
  point?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  label?: Partial<ILabelSpec>;
}

export interface LineLikeSeriesMixin extends ISeries {
  _spec: any;
  _seriesField: string;
  _theme: Maybe<ILineLikeSeriesTheme>;
  _trigger: ITrigger;
  _tooltipHelper: ISeriesTooltipHelper;
  _invalidType: IInvalidType;

  _lineMark: ILineMark;
  _symbolMark: ISymbolMark;
  _labelMark: ITextMark;
  _fieldZ?: string[];

  _createMark: (markInfo: ISeriesMarkInfo, option?: ISeriesMarkInitOption) => IMark;
  _getInvalidDefined: () => boolean;
  _getInvalidConnectType: () => IInvalidType;
}

export class LineLikeSeriesMixin {
  initLineMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean) {
    this._lineMark = this._createMark(lineLikeSeriesMarkMap.line, {
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: isSeriesMark ?? true,
      progressive
    }) as ILineMark;
    return this._lineMark;
  }

  initLineMarkStyle(direction?: DirectionType, areaCurveType?: InterpolateType) {
    const lineMark = this._lineMark;
    if (lineMark) {
      this.setMarkStyle(
        lineMark,
        {
          stroke: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );
      if (this._invalidType !== 'zero') {
        this.setMarkStyle(
          lineMark,
          {
            defined: this._getInvalidDefined,
            connectedType: this._getInvalidConnectType()
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this.event.on(ChartEvent.viewDataStatisticsUpdate, { filter: param => param.model === this }, () => {
        this.encodeDefined(lineMark, 'defined');
      });
      if (this.coordinate === 'polar') {
        // 极坐标系下需要关闭
        this.setMarkStyle(
          lineMark,
          {
            lineJoin: DEFAULT_CLOSE_STROKE_JOIN,
            curveType: DEFAULT_LINEAR_CLOSED_INTERPOLATE
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        const userCurveType = areaCurveType ?? this.getSpec().line?.style?.curveType;
        const curveType =
          userCurveType === DEFAULT_SMOOTH_INTERPOLATE
            ? direction === Direction.vertical
              ? 'monotoneX'
              : 'monotoneY'
            : userCurveType;

        this.setMarkStyle(
          lineMark,
          {
            curveType
          },
          'normal',
          AttributeLevel.Built_In
        );
      }

      this.setMarkStyle(
        lineMark,
        {
          x: this.dataToPositionX.bind(this),
          y: this.dataToPositionY.bind(this),
          z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(lineMark);
      this._tooltipHelper?.activeTriggerSet.dimension.add(lineMark);
    }
    return lineMark;
  }

  initSymbolMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean) {
    this._symbolMark = this._createMark(lineLikeSeriesMarkMap.point, {
      morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig('point', this._spec)),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      label: merge({ animation: this._spec.animation }, this._spec.label),
      progressive,
      isSeriesMark: !!isSeriesMark
    }) as ISymbolMark;
    return this._symbolMark;
  }

  initSymbolMarkStyle() {
    const symbolMark = this._symbolMark;
    if (!symbolMark) {
      return symbolMark;
    }
    this.setMarkStyle(
      symbolMark,
      {
        fill: this.getColorAttribute()
      },
      'normal',
      AttributeLevel.Series
    );
    if (this._invalidType !== 'zero') {
      this.setMarkStyle(
        symbolMark,
        {
          visible: this._getInvalidDefined
        },
        'normal',
        AttributeLevel.Series
      );
    }

    this.event.on(ChartEvent.viewDataStatisticsUpdate, { filter: param => param.model === this }, () => {
      this.encodeDefined(symbolMark, 'visible');
    });

    this.setMarkStyle(
      symbolMark,
      {
        x: this.dataToPositionX.bind(this),
        y: this.dataToPositionY.bind(this),
        z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
      },
      'normal',
      AttributeLevel.Series
    );
    this._trigger.registerMark(symbolMark);
    this._tooltipHelper?.activeTriggerSet.mark.add(symbolMark);
    return symbolMark;
  }

  initLabelMarkStyle(labelMark?: ITextMark) {
    if (!labelMark) {
      return;
    }
    this.setMarkStyle(labelMark, {
      fill: this.getColorAttribute(),
      text: (datum: Datum) => {
        return datum[this.getStackValueField()];
      },
      z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
    });
    if (this._invalidType !== 'zero') {
      this.setMarkStyle(
        labelMark,
        {
          visible: this._getInvalidDefined
        },
        'normal',
        AttributeLevel.Series
      );
    }

    this.event.on(ChartEvent.viewDataStatisticsUpdate, { filter: param => param.model === this }, () => {
      this.encodeDefined(labelMark, 'visible');
    });
  }

  encodeDefined(mark: IMark, attr: string) {
    if (!mark) {
      return;
    }
    const statistics = this.getViewDataStatistics()?.latestData?.[this.getStackValueField()];
    if (this._invalidType === 'zero' || (statistics && statistics?.allValid)) {
      this.setMarkStyle(mark, { [attr]: true }, 'normal', AttributeLevel.Series);
    } else {
      this.setMarkStyle(mark, { [attr]: this._getInvalidDefined }, 'normal', AttributeLevel.Series);
    }
  }
}

export const lineLikeSeriesMarkMap: SeriesMarkMap = {
  [SeriesMarkNameEnum.point]: { name: SeriesMarkNameEnum.point, type: MarkTypeEnum.symbol },
  [SeriesMarkNameEnum.line]: { name: SeriesMarkNameEnum.line, type: MarkTypeEnum.line }
};
