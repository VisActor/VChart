/* eslint-disable no-duplicate-imports */
import type { IPadding } from '@visactor/vutils';
import { isValidNumber } from '@visactor/vutils';
import { isValid } from '@visactor/vutils';
import { AttributeLevel, DEFAULT_DATA_KEY, DEFAULT_DATA_SERIES_FIELD } from '../../constant';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface/type';
import { isTrueBrowser } from '../../util/env';
import {
  DEFAULT_DRAW_OUT_OF_BOUND,
  DEFAULT_FONTSIZE_RANGE,
  DEFAULT_FONT_PADDING,
  DEFAULT_FONT_WEIGHT_RANGE,
  DEFAULT_MASK_SHAPE,
  DEFAULT_MIN_FONT_SIZE,
  DEFAULT_RANDOM,
  DEFAULT_ROTATE_ANGLES,
  DEFAULT_ZOOM_TO_FIT,
  SHAPE_TYPE
} from './config';
import type {
  IWordCloudSeriesSpec,
  WordCloudConfigType,
  WordCloudShapeConfigType,
  WordCloudShapeType
} from './interface';
import type { Datum, IPoint } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { LinearScale } from '@visactor/vscale';
import { extent } from '@visactor/vgrammar-util';
import {
  WORD_CLOUD_ANGLE,
  WORD_CLOUD_FILLING_ANGLE,
  WORD_CLOUD_TEXT,
  WORD_CLOUD_WEIGHT
} from '../../constant/word-cloud';
import type { ICompilableMark } from '../../compile/mark';
import { BaseSeries } from '../base/base-series';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';
import { wordCloudSeriesMark } from './constant';
import type { IStateAnimateSpec } from '../../animation/spec';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';

export type IBaseWordCloudSeriesSpec = Omit<IWordCloudSeriesSpec, 'type'> & { type: string };

export class BaseWordCloudSeries<T extends IBaseWordCloudSeriesSpec = IBaseWordCloudSeriesSpec> extends BaseSeries<T> {
  static readonly mark: SeriesMarkMap = wordCloudSeriesMark;

  protected _nameField: string;
  protected _valueField?: string;
  setValueField(field: string) {
    if (isValid(field)) {
      this._valueField = field;
    }
  }

  protected _fontFamilyField: string;
  protected _fontWeightField: string;
  protected _fontStyleField: string;
  protected _colorHexField: string;
  protected _colorMode: 'linear' | 'ordinal';
  protected _colorList: string[];
  protected _rotateAngles?: number[];
  protected _fontWeightRange?: [number, number];
  protected _textField?: string;

  protected _fontSizeRange?: [number, number] | 'auto' = [DEFAULT_MIN_FONT_SIZE, DEFAULT_MIN_FONT_SIZE];
  setFontSizeRange(fontSizeRange: [number, number] | 'auto') {
    if (isValid(fontSizeRange)) {
      this._fontSizeRange = fontSizeRange;
    } else {
      this._fontSizeRange = DEFAULT_FONTSIZE_RANGE;
    }
  }

  protected _maskShape?: string | WordCloudShapeType;
  protected _isWordCloudShape: boolean = false;

  protected _keepAspect?: boolean;
  protected _random?: boolean;
  protected _fontPadding?: number;
  protected _fillingFontPadding?: number;
  protected _wordCloudConfig?: WordCloudConfigType;
  protected _wordCloudShapeConfig?: WordCloudShapeConfigType;

  protected _padding?: IPadding;
  protected _defaultFontFamily: string;

  /**
   * @override
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    // series布局相关
    this._padding = this._option.getChart().padding;

    // 普通词云 & 形状词云 共有spec相关
    this._nameField = this._spec.nameField;
    this._fontFamilyField = this._spec.fontFamilyField;
    this._fontWeightField = this._spec.fontWeightField;
    this._fontStyleField = this._spec.fontStyleField;
    this._colorHexField = this._spec.colorHexField;
    this._colorMode = this._spec.colorMode ?? 'ordinal';
    this._colorList = this._spec.colorList;
    this.setValueField(this._spec.valueField);
    this._fontWeightRange = this._spec.fontWeightRange ?? DEFAULT_FONT_WEIGHT_RANGE;
    this._rotateAngles = this._spec.rotateAngles ?? DEFAULT_ROTATE_ANGLES;
    this.setFontSizeRange(this._spec.fontSizeRange);
    this._maskShape = this._spec.maskShape ?? DEFAULT_MASK_SHAPE;
    this._keepAspect = this._spec.keepAspect;
    this._random = this._spec.random ?? DEFAULT_RANDOM;
    this._fontPadding = this._spec.word?.padding ?? DEFAULT_FONT_PADDING;
    this._textField = this._spec.word?.formatMethod ? WORD_CLOUD_TEXT : this._nameField;
    // 普通词云spec相关
    this._wordCloudConfig = {
      drawOutOfBound: DEFAULT_DRAW_OUT_OF_BOUND,
      layoutMode: 'default',
      zoomToFit: DEFAULT_ZOOM_TO_FIT,
      ...this._spec.wordCloudConfig
    };

    // 形状词云spec相关
    this._wordCloudShapeConfig = {
      fillingSeriesField: this.getSeriesField(),
      fillingRotateAngles: DEFAULT_ROTATE_ANGLES,
      layoutMode: 'default',
      ...this._spec.wordCloudShapeConfig
    };
    this._fillingFontPadding = this._spec.fillingWord?.padding ?? DEFAULT_FONT_PADDING;

    this._isWordCloudShape = !SHAPE_TYPE.includes(this._maskShape);
    this._defaultFontFamily = this._option.getTheme().fontFamily;
  }

  protected _wordMark: ITextMark;
  protected _fillingWordMark: ITextMark;
  initMark(): void {
    this._wordMark = this._createMark(BaseWordCloudSeries.mark.word, {
      defaultMorphElementKey: this._seriesField,
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as ITextMark;
    if (this._isWordCloudShape) {
      this._fillingWordMark = this._createMark(BaseWordCloudSeries.mark.fillingWord) as ITextMark;
    }
  }

  initMarkStyle() {
    const wordMark = this._wordMark;
    const fillingWordMark = this._fillingWordMark;
    const wordSpec = this._spec.word ?? {};
    if (wordMark) {
      this.setMarkStyle(
        wordMark,
        {
          fill: this._colorHexField
            ? (datum: Datum) => datum[this._colorHexField]
            : this.getWordColorAttribute(this._seriesField, false),
          text: (datum: Datum) => datum[this._textField],
          x: (datum: Datum) => datum.x,
          y: (datum: Datum) => datum.y,
          fontFamily: (datum: Datum) => datum.fontFamily,
          fontSize: (datum: Datum) => datum.fontSize,
          fontStyle: (datum: Datum) => datum.fontStyle,
          fontWeight: (datum: Datum) => datum.fontWeight,
          angle: (datum: Datum) => datum.angle,
          visible: (datum: Datum) => !datum.isFillingWord && datum.visible
        },
        'normal',
        AttributeLevel.Series
      );
      this.setMarkStyle(
        wordMark,
        {
          fontFamily: wordSpec.style?.fontFamily ?? this._defaultFontFamily
        },
        'normal',
        AttributeLevel.User_Mark
      );
    }
    if (fillingWordMark) {
      this.setMarkStyle(
        fillingWordMark,
        {
          fill: this._wordCloudShapeConfig.fillingColorHexField
            ? (datum: Datum) => datum[this._wordCloudShapeConfig.fillingColorHexField]
            : this.getWordColorAttribute(this._wordCloudShapeConfig.fillingSeriesField, true),
          text: (datum: Datum) => datum[this._textField],
          x: (datum: Datum) => datum.x,
          y: (datum: Datum) => datum.y,
          fontFamily: (datum: Datum) => datum.fontFamily,
          fontSize: (datum: Datum) => datum.fontSize,
          fontStyle: (datum: Datum) => datum.fontStyle,
          fontWeight: (datum: Datum) => datum.fontWeight,
          angle: (datum: Datum) => datum.angle,
          visible: (datum: Datum) => datum.isFillingWord && datum.visible
        },
        'normal',
        AttributeLevel.Series
      );

      this.setMarkStyle(
        fillingWordMark,
        {
          fontFamily: wordSpec.style?.fontFamily ?? this._defaultFontFamily
        },
        'normal',
        AttributeLevel.User_Mark
      );
    }
    this._trigger.registerMark(wordMark);
    this._trigger.registerMark(fillingWordMark);
  }

  protected initTooltip() {
    super.initTooltip();

    this._wordMark && this._tooltipHelper.activeTriggerSet.mark.add(this._wordMark);
    this._fillingWordMark && this._tooltipHelper.activeTriggerSet.mark.add(this._fillingWordMark);
  }

  initAnimation() {
    [this._wordMark, this._fillingWordMark].forEach(mark => {
      if (mark) {
        const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<any>)?.preset;
        const params = {
          animationConfig: () => mark.getAnimationConfig()?.appear?.[0]
        };
        mark.setAnimationConfig(
          animationConfig(
            Factory.getAnimationInKey('wordCloud')(params, appearPreset),
            userAnimationConfig(SeriesMarkNameEnum.word, this._spec, this._markAttributeContext)
          )
        );
      }
    });
  }

  protected getWordOrdinalColorScale(field: string, isFillingWord: boolean) {
    const colorList = isFillingWord ? this._wordCloudShapeConfig.fillingColorList : this._colorList;
    const colorDomain = field ? this.getViewData()?.latestData.map((datum: Datum) => datum[field]) : [];
    const colorRange = colorList ?? this._option.globalScale.getScale('color')?.range() ?? this._getDataScheme();
    return new ColorOrdinalScale().domain(colorDomain).range?.(colorRange);
  }

  getWordColorAttribute(field: string, isFillingWord: boolean) {
    if (this._colorMode === 'ordinal') {
      return {
        scale: this.getWordOrdinalColorScale(field, isFillingWord),
        field: this._seriesField ?? DEFAULT_DATA_SERIES_FIELD
      };
    }
    // const valueScale = new LinearScale()
    //   .domain(extent(this.getViewData()?.latestData.map((datum: Datum) => datum[field])), true)
    //   .range([0, 1]);
    let colorList =
      (isFillingWord ? this._colorList : this._wordCloudShapeConfig.fillingColorList) ??
      this._option.globalScale.getScale('color').range();
    // 如果用户只输入了一个 color，无法构成 colorRange，则进行兜底
    if (colorList.length === 1) {
      colorList = [colorList[0], colorList[0]];
    }
    // 颜色插值 todo@chensiji
    // const interpolate = interpolateColors(colorList)
    // return (datum: Datum) => interpolate(valueScale.scale(datum[field]))
    return (datum: Datum) => colorList[0];
  }

  compile(): void {
    super.compile();
    const { width, height } = this._region.getLayoutRectExcludeIndent();
    // 非正常尺寸下不进行布局
    if (!isValidNumber(width) || !isValidNumber(height) || !(height > 0 && width > 0)) {
      return;
    }

    const wordCloudTransforms: any[] = [];
    const valueField = this._valueField;
    const valueScale = new LinearScale();
    const fontWeightRange = this._fontWeightRange;
    const rotateAngles = this._rotateAngles;
    const fillingRotateAngles = this._wordCloudShapeConfig.fillingRotateAngles;

    // fontWeight处理
    if (valueField) {
      const [minValue, maxValue] = extent(this.getViewData()?.latestData.map((datum: any) => +datum[valueField]));
      valueScale.domain([minValue, maxValue], true).range(fontWeightRange);
      wordCloudTransforms.push({
        type: 'map',
        as: WORD_CLOUD_WEIGHT,
        callback: (datum: any) => {
          if (minValue === maxValue) {
            return valueScale.scale(maxValue);
          }
          return valueScale.scale(datum[valueField]);
        }
      });
    }

    // rotateAngles处理
    wordCloudTransforms.push({
      type: 'map',
      as: WORD_CLOUD_ANGLE,
      callback: () => {
        return rotateAngles[Math.floor(Math.random() * rotateAngles.length)];
      }
    });
    wordCloudTransforms.push({
      type: 'map',
      as: WORD_CLOUD_FILLING_ANGLE,
      callback: () => {
        return fillingRotateAngles[Math.floor(Math.random() * fillingRotateAngles.length)];
      }
    });
    const wordSpec = this._spec.word ?? {};

    // text fromat method 处理
    if (wordSpec.formatMethod) {
      wordCloudTransforms.push({
        type: 'map',
        as: WORD_CLOUD_TEXT,
        callback: wordSpec.formatMethod
      });
    }

    // 词云 transform
    if (!this._isWordCloudShape) {
      wordCloudTransforms.push({
        type: 'wordcloud',
        ...this._wordCloudTransformOption()
      });
      // 挂到mark的transform上
      (this._wordMark as ICompilableMark).getProduct().transform(wordCloudTransforms);
    }
    // 形状词云 transform
    else {
      wordCloudTransforms.push({
        type: 'wordcloudShape',
        // 形状词云中必须要传入dataIndexKey, 否则填充词无法绘制
        ...this._wordCloudShapeTransformOption()
      });
    }
    // 把transform挂载到data的product上
    this._data.getProduct().transform(wordCloudTransforms);
  }

  protected _wordCloudTransformOption(): Object {
    const { width, height } = this._region.getLayoutRectExcludeIndent();
    const wordStyleSpec = this._spec.word?.style ?? {};

    return {
      // TIP: 非浏览器环境下，使用 fast 布局，否则会出现兼容问题
      layoutType: !isTrueBrowser(this._option.mode) ? 'fast' : this._wordCloudConfig.layoutMode,
      size: [width, height],
      shape: this._maskShape,
      dataIndexKey: DEFAULT_DATA_KEY,
      text: { field: this._textField },
      fontSize: this._valueField ? { field: this._valueField } : this._fontSizeRange[0],
      fontSizeRange: this._fontSizeRange === 'auto' ? null : this._fontSizeRange,
      padding: this._fontPadding,
      rotate: { field: WORD_CLOUD_ANGLE },
      fontFamily: this._fontFamilyField ?? wordStyleSpec.fontFamily ?? this._defaultFontFamily,
      fontWeight: this._fontWeightField
        ? { field: this._fontWeightField }
        : this._valueField
        ? { field: WORD_CLOUD_WEIGHT }
        : null,
      fontStyle: this._fontStyleField ?? wordStyleSpec.fontStyle,

      randomVisible: this._random,
      clip: this._wordCloudConfig.drawOutOfBound === 'clip',
      shrink: this._wordCloudConfig.zoomToFit.shrink,
      enlarge: this._wordCloudConfig.zoomToFit.enlarge,
      minFontSize: this._wordCloudConfig.zoomToFit.fontSizeLimitMin,
      progressiveTime: this._wordCloudConfig.progressiveTime,
      progressiveStep: this._wordCloudConfig.progressiveStep
    };
  }

  protected _wordCloudShapeTransformOption(): Object {
    const { width, height } = this._region.getLayoutRectExcludeIndent();
    const wordStyleSpec = this._spec.word?.style ?? {};
    const wordCloudShapeConfig = this._wordCloudShapeConfig ?? {};
    const fillingRotateAngles = this._wordCloudShapeConfig.fillingRotateAngles;

    return {
      dataIndexKey: DEFAULT_DATA_KEY,

      size: [width, height],
      shape: this._maskShape,

      text: { field: this._textField },
      fontSize: this._valueField ? { field: this._valueField } : this._fontSizeRange[0],
      fontSizeRange: this._fontSizeRange === 'auto' ? null : this._fontSizeRange, // 如果配置为'auto', 则形状词云fontSizeRange不设默认值(对齐3.x效果)
      padding: this._fontPadding,
      rotateList: this._rotateAngles,
      fontFamily: this._fontFamilyField ?? wordStyleSpec.fontFamily ?? this._defaultFontFamily,
      fontWeight: this._fontWeightField
        ? { field: this._fontWeightField }
        : this._valueField
        ? { field: WORD_CLOUD_WEIGHT }
        : null,
      fontStyle: this._fontStyleField ?? wordStyleSpec.fontStyle,

      fillingFontFamily:
        wordCloudShapeConfig.fillingFontFamilyField ?? wordStyleSpec.fontFamily ?? this._defaultFontFamily,
      fillingPadding: this._fillingFontPadding,
      fillingFontStyle: wordCloudShapeConfig.fillingFontStyleField ?? wordStyleSpec.fontStyle,
      fillingFontWeight: wordCloudShapeConfig.fillingFontWeightField ?? wordStyleSpec.fontWeight, // 填充词fontWeight默认不跟随valueField
      fillingRotateList: fillingRotateAngles,

      fillingTimes: wordCloudShapeConfig.fillingTimes,
      fillingXStep: wordCloudShapeConfig.fillingXStep,
      fillingYStep: wordCloudShapeConfig.fillingYStep,
      fillingXRatioStep: wordCloudShapeConfig.fillingXRatioStep,
      fillingYRatioStep: wordCloudShapeConfig.fillingYRatioStep,
      fillingInitialOpacity: wordCloudShapeConfig.fillingInitialOpacity,
      fillingDeltaOpacity: wordCloudShapeConfig.fillingDeltaOpacity,
      fillingInitialFontSize: wordCloudShapeConfig.fillingInitialFontSize,
      fillingDeltaFontSize: wordCloudShapeConfig.fillingDeltaFontSize,

      ratio: wordCloudShapeConfig.ratio,
      fillingRatio: wordCloudShapeConfig.fillingRatio,
      removeWhiteBorder: wordCloudShapeConfig.removeWhiteBorder,
      textLayoutTimes: wordCloudShapeConfig.textLayoutTimes,
      fontSizeShrinkFactor: wordCloudShapeConfig.fontSizeShrinkFactor,
      stepFactor: wordCloudShapeConfig.stepFactor,
      layoutMode: wordCloudShapeConfig.layoutMode,
      importantWordCount: wordCloudShapeConfig.importantWordCount,
      globalShinkLimit: wordCloudShapeConfig.globalShinkLimit,
      fontSizeEnlargeFactor: wordCloudShapeConfig.fontSizeEnlargeFactor,
      fillingDeltaFontSizeFactor: wordCloudShapeConfig.fillingDeltaFontSizeFactor
    };
  }

  getStatisticFields() {
    const fields: { key: string; operations: Array<'max' | 'min' | 'values'> }[] = [];
    fields.push({ key: this._nameField, operations: ['values'] });
    fields.push({ key: this._valueField, operations: ['max', 'min'] });
    return fields;
  }
  dataToPosition(data: Datum): IPoint {
    return null;
  }
  dataToPositionX(data: any): number {
    return null;
  }
  dataToPositionY(data: any): number {
    return null;
  }
  dataToPositionZ(data: any): number {
    return null;
  }
  valueToPosition(value1: any, value2?: any): IPoint {
    return null;
  }

  getGroupFields(): string[] {
    // do nothing
    return [];
  }

  getStackGroupFields(): string[] {
    // do nothing
    return [];
  }

  getStackValueField(): string {
    // do nothing
    return '';
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this.compile();
  }

  getActiveMarks(): IMark[] {
    return [this._wordMark, this._fillingWordMark];
  }
}
