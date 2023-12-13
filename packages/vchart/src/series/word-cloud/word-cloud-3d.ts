import { AttributeLevel, DEFAULT_DATA_KEY } from '../../constant';
import { TextMark, type ITextMark } from '../../mark/text';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IWordCloud3dSeriesSpec } from './interface';
import type { Datum } from '../../typings';
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
import { BaseWordCloudSeries } from './base';
import { Factory } from '../../core/factory';
import { registerWordCloud3dAnimation } from './animation';
import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';

export class WordCloud3dSeries<
  T extends IWordCloud3dSeriesSpec = IWordCloud3dSeriesSpec
> extends BaseWordCloudSeries<T> {
  static readonly type: string = SeriesTypeEnum.wordCloud3d;
  type = SeriesTypeEnum.wordCloud3d;

  compile(): void {
    super.compile();

    const wordCloudTransforms: any[] = [];
    const valueField = this._valueField;
    const valueScale = new LinearScale();
    const fontWeightRange = this._fontWeightRange;
    const rotateAngles = this._rotateAngles;
    const fontWeightField = this._fontWeightField;
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

    // text fromat method 处理
    if (this._spec.word?.formatMethod) {
      wordCloudTransforms.push({
        type: 'map',
        as: WORD_CLOUD_TEXT,
        callback: this._spec.word.formatMethod
      });
    }

    const textField = this._spec.word?.formatMethod ? WORD_CLOUD_TEXT : this._nameField;

    // 词云 transform
    if (!this._isWordCloudShape) {
      wordCloudTransforms.push({
        type: 'wordcloud',
        layoutType: this._wordCloudConfig.layoutMode,
        size: [this._region.getLayoutRect().width, this._region.getLayoutRect().height],
        shape: this._maskShape,
        postProjection: this._spec.postProjection ?? 'StereographicProjection',
        dataIndexKey: DEFAULT_DATA_KEY,
        text: { field: textField },
        fontSize: valueField ? { field: valueField } : this._fontSizeRange[0],
        fontSizeRange: this._fontSizeRange,
        padding: this._fontPadding,
        rotate: { field: WORD_CLOUD_ANGLE },
        fontFamily: this._fontFamilyField ?? this._spec.word?.style?.fontFamily ?? this._defaultFontFamily,
        fontWeight: fontWeightField ? { field: fontWeightField } : valueField ? { field: WORD_CLOUD_WEIGHT } : null,
        fontStyle: this._fontStyleField ?? this._spec.word?.style?.fontStyle,
        depth_3d: this._spec.depth_3d,

        randomVisible: this._random,
        clip: this._wordCloudConfig.drawOutOfBound === 'clip',
        shrink: this._wordCloudConfig.zoomToFit.shrink,
        enlarge: this._wordCloudConfig.zoomToFit.enlarge,
        minFontSize: this._wordCloudConfig.zoomToFit.fontSizeLimitMin,
        progressiveTime: this._wordCloudConfig.progressiveTime,
        progressiveStep: this._wordCloudConfig.progressiveStep
      });
      // 挂到mark的trnsform上，注册的时候决定transform的执行时机
      (this._wordMark as ICompilableMark).getProduct().transform(wordCloudTransforms);
    }
    // 形状词云 transform
    else {
      wordCloudTransforms.push({
        type: 'wordcloudShape',
        size: [this._region.getLayoutRect().width, this._region.getLayoutRect().height],
        shape: this._maskShape,
        postProjection: this._spec.postProjection ?? 'StereographicProjection',
        dataIndexKey: DEFAULT_DATA_KEY,
        text: { field: textField },
        fontSize: valueField ? { field: valueField } : this._fontSizeRange[0],
        fontSizeRange: this._fontSizeRange,
        padding: this._fontPadding,
        rotateList: rotateAngles,
        fontFamily: this._fontFamilyField ?? this._spec.word?.style?.fontFamily ?? this._defaultFontFamily,
        fontWeight: fontWeightField ? { field: fontWeightField } : valueField ? { field: WORD_CLOUD_WEIGHT } : null,
        fontStyle: this._fontStyleField ?? this._spec.word?.style?.fontStyle,
        depth_3d: this._spec.depth_3d,

        fillingFontFamily:
          this._wordCloudShapeConfig?.fillingFontFamilyField ??
          this._spec.word?.style?.fontFamily ??
          this._defaultFontFamily,
        fillingPadding: this._fillingFontPadding,
        fillingFontStyle: this._wordCloudShapeConfig?.fillingFontStyleField ?? this._spec.word?.style?.fontStyle,
        fillingFontWeight: this._wordCloudShapeConfig?.fillingFontWeightField ?? this._spec.word?.style?.fontWeight, // 填充词fontWeight默认不跟随valueField
        fillingRotateList: fillingRotateAngles,

        fillingTimes: this._wordCloudShapeConfig?.fillingTimes,
        fillingXStep: this._wordCloudShapeConfig?.fillingXStep,
        fillingYStep: this._wordCloudShapeConfig?.fillingYStep,
        fillingXRatioStep: this._wordCloudShapeConfig?.fillingXRatioStep,
        fillingYRatioStep: this._wordCloudShapeConfig?.fillingYRatioStep,
        fillingInitialOpacity: this._wordCloudShapeConfig?.fillingInitialOpacity,
        fillingDeltaOpacity: this._wordCloudShapeConfig?.fillingDeltaOpacity,
        fillingInitialFontSize: this._wordCloudShapeConfig?.fillingInitialFontSize,
        fillingDeltaFontSize: this._wordCloudShapeConfig?.fillingDeltaFontSize,

        ratio: this._wordCloudShapeConfig?.ratio,
        fillingRatio: this._wordCloudShapeConfig?.fillingRatio,
        removeWhiteBorder: this._wordCloudShapeConfig?.removeWhiteBorder,
        textLayoutTimes: this._wordCloudShapeConfig?.textLayoutTimes,
        fontSizeShrinkFactor: this._wordCloudShapeConfig?.fontSizeShrinkFactor,
        stepFactor: this._wordCloudShapeConfig?.stepFactor,
        layoutMode: this._wordCloudShapeConfig?.layoutMode,
        importantWordCount: this._wordCloudShapeConfig?.importantWordCount,
        globalShinkLimit: this._wordCloudShapeConfig?.globalShinkLimit,
        fontSizeEnlargeFactor: this._wordCloudShapeConfig?.fontSizeEnlargeFactor,
        fillingDeltaFontSizeFactor: this._wordCloudShapeConfig?.fillingDeltaFontSizeFactor
      });
    }
    // 把transform挂载到data的product上
    this._data.getProduct().transform(wordCloudTransforms);
  }

  initMark(): void {
    this._wordMark = this._createMark(BaseWordCloudSeries.mark.word, {
      groupKey: this._seriesField,
      support3d: true,
      isSeriesMark: true
    }) as ITextMark;
    if (this._isWordCloudShape) {
      this._fillingWordMark = this._createMark(BaseWordCloudSeries.mark.fillingWord, {
        groupKey: this._seriesField,
        support3d: true,
        isSeriesMark: true
      }) as ITextMark;
    }
  }

  initMarkStyle() {
    const wordMark = this._wordMark;
    const fillingWordMark = this._fillingWordMark;
    if (wordMark) {
      this.setMarkStyle(
        wordMark,
        {
          fill: this._colorHexField
            ? (datum: Datum) => datum[this._colorHexField]
            : this.getWordColorAttribute(this._seriesField, false),
          text: (datum: Datum) => datum[this._nameField],
          x: (datum: Datum) => datum.x,
          y: (datum: Datum) => datum.y,
          z: (datum: Datum) => datum.z ?? 0,
          fontFamily: (datum: Datum) => datum.fontFamily,
          fontSize: (datum: Datum) => datum.fontSize,
          fontStyle: (datum: Datum) => datum.fontStyle,
          fontWeight: (datum: Datum) => datum.fontWeight,
          angle: (datum: Datum) => datum.angle,
          visible: (datum: Datum) => !datum.isFillingWord
        },
        'normal',
        AttributeLevel.Series
      );
      this.setMarkStyle(
        wordMark,
        {
          fontFamily: this._spec.word?.style?.fontFamily ?? this._defaultFontFamily
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
          text: (datum: Datum) => datum[this._nameField],
          x: (datum: Datum) => datum.x,
          y: (datum: Datum) => datum.y,
          z: (datum: Datum) => datum.z ?? 0,
          fontFamily: (datum: Datum) => datum.fontFamily,
          fontSize: (datum: Datum) => datum.fontSize,
          fontStyle: (datum: Datum) => datum.fontStyle,
          fontWeight: (datum: Datum) => datum.fontWeight,
          angle: (datum: Datum) => datum.angle,
          visible: (datum: Datum) => datum.isFillingWord
        },
        'normal',
        AttributeLevel.Series
      );
      this.setMarkStyle(
        fillingWordMark,
        {
          fontFamily: this._spec.word?.style?.fontFamily ?? this._defaultFontFamily
        },
        'normal',
        AttributeLevel.User_Mark
      );
    }
    this._trigger.registerMark(wordMark);
    this._trigger.registerMark(fillingWordMark);
  }

  initAnimation() {
    const padding = this._padding ?? {};
    if (this._wordMark) {
      this._wordMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('wordCloud3d')?.(() => {
            const srView = this.getCompiler().getVGrammarView();
            const width = srView.width() - padding.left || 0 - padding.right || 0;
            const height = srView.height() - padding.top || 0 - padding.bottom || 0;
            const r = Math.max(width, height) / 2;
            return {
              center: { x: r, y: r, z: this._spec.depth_3d ?? r },
              r
            };
          }),
          userAnimationConfig(SeriesMarkNameEnum.word, this._spec, this._markAttributeContext)
        )
      );
    }
    if (this._fillingWordMark) {
      this._fillingWordMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('wordCloud3d')?.(() => {
            const srView = this.getCompiler().getVGrammarView();
            const width = srView.width() - padding.left || 0 - padding.right || 0;
            const height = srView.height() - padding.top || 0 - padding.bottom || 0;
            const r = Math.max(width, height) / 2;
            return {
              center: { x: r, y: r, z: this._spec.depth_3d ?? r },
              r
            };
          }),
          userAnimationConfig(SeriesMarkNameEnum.fillingWord, this._spec, this._markAttributeContext)
        )
      );
    }
  }
}

export const registerWordCloud3dSeries = () => {
  registerWordCloudTransforms();
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(WordCloud3dSeries.type, WordCloud3dSeries);
  registerWordCloud3dAnimation();
};

export const registerWordCloudShape3dSeries = () => {
  registerWordCloudShapeTransforms();
  registerWordCloud3dSeries();
};
