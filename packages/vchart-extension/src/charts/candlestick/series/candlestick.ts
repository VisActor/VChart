import { registerCandlestickMark, ICandlestickMark } from '../mark/candlestick';
import {
  registerSymbolMark,
  registerScaleInOutAnimation,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  CartesianSeries,
  IMark,
  Factory,
  STATE_VALUE_ENUM,
  AttributeLevel,
  Datum,
  IModelInitOption,
  getGroupAnimationParams,
  animationConfig,
  userAnimationConfig
} from '@visactor/vchart';
import { valueInScaleRange } from '@visactor/vchart';
import { IGlyphMark } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import type { ICandlestickSeriesSpec } from './interface';
import { registerCandlestickScaleAnimation } from './animation';
import { CANDLESTICK_SERIES_TYPE, CandlestickSeriesMark } from './constant';
import { CandlestickSeriesTooltipHelper } from './tooltip-helper';
import { candlestick } from './theme';

const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_STROKE_COLOR = '#000';
export class CandlestickSeries<T extends ICandlestickSeriesSpec = ICandlestickSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = CANDLESTICK_SERIES_TYPE;
  type = CANDLESTICK_SERIES_TYPE;

  static readonly builtInTheme = { candlestick };
  static readonly mark = CandlestickSeriesMark;
  protected _openField: string;
  getOpenField(): string {
    return this._openField;
  }
  protected _highField: string;
  getHighField(): string {
    return this._highField;
  }
  protected _lowField: string;
  getLowField(): string {
    return this._lowField;
  }
  protected _closeField: string;
  getCloseField(): string {
    return this._closeField;
  }
  protected _lineWidth: number;
  protected _boxWidth: number;
  protected _boxFill: string | ((datum: Datum) => string);
  getBoxFill(): string | ((datum: Datum) => string) {
    return this._boxFill;
  }
  protected _strokeColor: string;
  getStrokeColor(): string {
    return this._strokeColor;
  }
  protected _riseFill: string;
  getRiseFill(): string {
    return this._riseFill;
  }
  protected _riseStroke: string;
  getRiseStroke(): string {
    return this._riseStroke;
  }
  protected _fallFill: string;
  getFallFill(): string {
    return this._fallFill;
  }
  protected _fallStroke: string;
  getFallStroke(): string {
    return this._fallStroke;
  }
  protected _dojiFill: string;
  getDojiFill(): string {
    return this._dojiFill;
  }
  protected _dojiStroke: string;
  getDojiStroke(): string {
    return this._dojiStroke;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    const spec = this._spec;
    const CandlestickStyle: any = spec.candlestick?.style ?? {};
    const risingStyle: any = spec.rising?.style ?? {};
    const fallingStyle: any = spec.falling?.style ?? {};
    const dojiStyle: any = spec.doji?.style ?? {};
    this._openField = spec.openField;
    this._highField = spec.highField;
    this._lowField = spec.lowField;
    this._closeField = spec.closeField;
    this._lineWidth = CandlestickStyle.lineWidth ?? DEFAULT_STROKE_WIDTH;
    this._boxWidth = CandlestickStyle.boxWidth;
    this._boxFill = CandlestickStyle.boxFill;
    this._riseFill = risingStyle.boxFill;
    this._riseStroke = risingStyle.stroke;
    this._fallFill = fallingStyle.boxFill;
    this._fallStroke = fallingStyle.stroke;
    this._dojiFill = dojiStyle.boxFill;
    this._dojiStroke = dojiStyle.stroke;
    this._strokeColor = CandlestickStyle.strokeColor;
  }

  private _candlestickMark?: ICandlestickMark;

  initMark(): void {
    this._candlestickMark = this._createMark(CandlestickSeries.mark.candlestick, {
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as ICandlestickMark;
  }

  initMarkStyle(): void {
    const candlestickMark = this._candlestickMark;
    if (candlestickMark) {
      const CandlestickStyles = {
        boxWidth: this._boxWidth,
        fill: this._boxFill ?? this.getCandlestickColorAttribute.bind(this),
        stroke: this._strokeColor ?? this.getCandlestickColorAttribute.bind(this),
        x: this.dataToPositionX.bind(this)
      };
      (candlestickMark as IGlyphMark).setGlyphConfig({});
      this.setMarkStyle(candlestickMark, CandlestickStyles, STATE_VALUE_ENUM.STATE_NORMAL, AttributeLevel.Series);
    }
  }

  initCandlestickMarkStyle() {
    const candlestickMark = this._candlestickMark;
    const axisHelper = this._yAxisHelper;
    if (candlestickMark && axisHelper) {
      const { dataToPosition } = axisHelper;
      const scale = axisHelper?.getScale?.(0);
      this.setMarkStyle(
        candlestickMark,
        {
          open: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._openField), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          high: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._highField), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          low: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._lowField), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          close: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._closeField), {
                bandPosition: this._bandPosition
              }),
              scale
            )
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }
  }

  init(option: IModelInitOption): void {
    super.init(option);
    //init在axis初始化之后才被执行，此时axisHelper不为空
    this.initCandlestickMarkStyle();
  }

  private _initAnimationSpec(config: any = {}) {
    const newConfig = merge({}, config);
    ['appear', 'enter', 'update', 'exit', 'disappear'].forEach(state => {
      if (newConfig[state] && newConfig[state].type === 'scaleIn') {
        newConfig[state].type = 'candlestickScaleIn';
      } else if (newConfig[state] && newConfig[state].type === 'scaleOut') {
        newConfig[state].type = 'candlestickScaleOut';
      }
    });
    return newConfig;
  }

  initAnimation() {
    const animationParams = getGroupAnimationParams(this);

    if (this._candlestickMark) {
      const newDefaultConfig = this._initAnimationSpec(Factory.getAnimationInKey('scaleInOut')?.());
      const newConfig = this._initAnimationSpec(
        userAnimationConfig(CANDLESTICK_SERIES_TYPE, this._spec, this._markAttributeContext)
      );
      this._candlestickMark.setAnimationConfig(animationConfig(newDefaultConfig, newConfig, animationParams));
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new CandlestickSeriesTooltipHelper(this);
    this._candlestickMark && this._tooltipHelper.activeTriggerSet.mark.add(this._candlestickMark);
  }

  getCandlestickColorAttribute(datum: Datum): string {
    const openArr = this.getDatumPositionValues(datum, this._openField);
    const closeArr = this.getDatumPositionValues(datum, this._closeField);
    const open = openArr[0];
    const close = closeArr[0];
    if (open < close) {
      return this._riseFill;
    } else if (open > close) {
      return this._fallFill;
    }
    return this._strokeColor ?? DEFAULT_STROKE_COLOR;
  }

  getActiveMarks(): IMark[] {
    return [this._candlestickMark];
  }
}

export const registerCandlestickSeries = () => {
  registerCandlestickMark();
  registerSymbolMark();
  registerScaleInOutAnimation();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();
  registerCandlestickScaleAnimation();
  Factory.registerSeries(CandlestickSeries.type, CandlestickSeries);
};
