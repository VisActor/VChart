/* eslint-disable no-duplicate-imports */
import { PREFIX } from '../../constant/base';
import type { IElement } from '@visactor/vgrammar-core';
import type { DataView } from '@visactor/vdataset';
import type { Datum, ScaleType, VisualType, IScatterInvalidType } from '../../typings';
import type { ISymbolMark } from '../../mark/symbol';
import type { IScatterSeriesSpec } from './interface';
import { CartesianSeries } from '../cartesian/cartesian';
import { isNil, isValid, isObject, isFunction, isString, isArray, isNumber, isNumeric } from '@visactor/vutils';
import { AttributeLevel } from '../../constant';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { STATE_VALUE_ENUM } from '../../compile/mark/interface';
import {
  SCATTER_DEFAULT_RANGE_SHAPE,
  SCATTER_DEFAULT_RANGE_SIZE,
  SCATTER_DEFAULT_SHAPE,
  SCATTER_DEFAULT_SHAPE_SCALE_TYPE,
  SCATTER_DEFAULT_SIZE,
  SCATTER_DEFAULT_SIZE_SCALE_TYPE
} from '../../constant/scatter';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import type { IStateAnimateSpec } from '../../animation/spec';
import { registerScatterAnimation, type ScatterAppearPreset } from './animation';
import { registerSymbolMark } from '../../mark/symbol';
import { scatterSeriesMark } from './constant';
import type { ILabelMark } from '../../mark/label';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import { ScatterSeriesSpecTransformer } from './scatter-transformer';
import { getGroupAnimationParams } from '../util/utils';

export class ScatterSeries<T extends IScatterSeriesSpec = IScatterSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.scatter;
  type = SeriesTypeEnum.scatter;

  static readonly mark: SeriesMarkMap = scatterSeriesMark;
  static readonly transformerConstructor = ScatterSeriesSpecTransformer as any;
  readonly transformerConstructor = ScatterSeriesSpecTransformer;

  private _symbolMark: ISymbolMark;
  private _labelMark: ILabelMark;

  private _size: IScatterSeriesSpec['size'];
  private _sizeField: string;
  private _shape: IScatterSeriesSpec['shape'];
  private _shapeField: string;

  protected _invalidType: IScatterInvalidType = 'zero';

  setAttrFromSpec() {
    super.setAttrFromSpec();

    // size
    this._size = this._spec.size;
    this._sizeField = this._spec.sizeField;
    // shape
    this._shape = this._spec.shape;
    this._shapeField = this._spec.shapeField;
  }

  private _getSeriesAttribute<T>(
    field: string,
    spec: VisualType<T>,
    {
      defaultScaleType,
      defaultRange
    }: {
      defaultScaleType: ScaleType;
      defaultRange: T[];
    },
    key: string
  ): VisualType<T> {
    // 若sizeSpec是函数
    if (isFunction(spec)) {
      return spec;
    }

    if (isArray(spec)) {
      if (isNil(field)) {
        this._option?.onError(`${key}Field is required.`);
        return spec;
      }

      if (defaultScaleType !== 'ordinal' && (spec as any[]).length > 2) {
        this._option?.onError(`${key} length is invalid, specify up to 2 ${key}s.`);
        return spec;
      }
      const scaleName = `${PREFIX}_series_scatter_${this.id}_scale_${key}`;
      this._option.globalScale.registerModelScale({
        id: scaleName,
        type: defaultScaleType,
        domain: [
          {
            dataId: this._rawData.name,
            fields: [field]
          }
        ],
        range: spec
      });
      return {
        scale: scaleName,
        field
      };
    }

    // 若sizeSpec是对象
    if (isObject(spec)) {
      if (isNil(field)) {
        this._option?.onError(`${key}Field is required.`);
        return spec;
      }
      const scaleName = `${PREFIX}_series_scatter_${this.id}_scale_${key}`;
      const visualSpec = {
        id: scaleName,
        type: defaultScaleType,
        domain: [
          {
            dataId: this._rawData.name,
            fields: [field]
          }
        ],
        range: defaultRange,
        ...spec
      };

      this._option.globalScale.registerModelScale(visualSpec);
      return {
        scale: visualSpec.id,
        field
      };
    }

    // 其余情况报错
    this._option?.onError(`${key} attribute is invalid.`);
    return spec;
  }

  /**
   * 计算sizeScale
   * @param field 数据对应字段
   * @param sizeSpec size配置
   */
  private getSizeAttribute(field: string, sizeSpec: IScatterSeriesSpec['size']): VisualType<number> {
    // 若sizeSpec不存在
    if (isNil(sizeSpec)) {
      // Tips: spec会被theme配置merge, 所以Spec没配置, 不一定会触发这里.
      return SCATTER_DEFAULT_SIZE;
    }

    // 若sizeSpec是数值
    if (isNumber(sizeSpec)) {
      return sizeSpec;
    }

    // 若sizeSpec是字符串中的数值
    if (isString(sizeSpec) && isNumeric(sizeSpec)) {
      return parseFloat(sizeSpec);
    }

    return this._getSeriesAttribute<number>(
      field,
      sizeSpec as VisualType<number>,
      {
        defaultScaleType: SCATTER_DEFAULT_SIZE_SCALE_TYPE,
        defaultRange: SCATTER_DEFAULT_RANGE_SIZE
      },
      'size'
    );
  }

  /**
   * 计算shapeScale
   * @param field 数据对应字段
   * @param shapeSpec shape配置
   */
  private getShapeAttribute(field: string, shapeSpec: IScatterSeriesSpec['shape']): VisualType<string> {
    // 若shapeSpec不存在
    if (isNil(shapeSpec)) {
      // Tips: spec会被theme配置merge, 所以Spec没配置, 不一定会触发这里.
      return SCATTER_DEFAULT_SHAPE;
    }

    // 若shapeSpec是字符串
    if (isString(shapeSpec)) {
      return shapeSpec;
    }

    return this._getSeriesAttribute<string>(
      field,
      shapeSpec as VisualType<string>,
      {
        defaultScaleType: SCATTER_DEFAULT_SHAPE_SCALE_TYPE,
        defaultRange: SCATTER_DEFAULT_RANGE_SHAPE
      },
      'shape'
    );
  }

  /**
   * 初始化Mark
   */
  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    this._symbolMark = this._createMark(ScatterSeries.mark.point, {
      morph: shouldMarkDoMorph(this._spec, ScatterSeries.mark.point.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      progressive,
      isSeriesMark: true,
      customShape: this._spec.point?.customShape
    }) as ISymbolMark;
  }

  /**
   * 初始化散点图各类Mark的Style
   */
  initMarkStyle(): void {
    this.initSymbolMarkStyle();
  }

  /**
   * 初始化动画
   */
  initAnimation(): void {
    const animationParams = getGroupAnimationParams(this);
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<ScatterAppearPreset>)?.preset;
    this._symbolMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('scatter')?.({}, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.point, this._spec, this._markAttributeContext),
        animationParams
      )
    );
  }

  /**
   * 初始化SymbolMark
   */
  private initSymbolMarkStyle(): void {
    const symbolMark = this._symbolMark;
    if (!symbolMark) {
      return;
    }

    if (this._invalidType !== 'zero') {
      this.setMarkStyle(symbolMark, {
        visible: this._getInvalidDefined
      });
    }

    this.setMarkStyle(
      symbolMark,
      {
        x: this.dataToPositionX.bind(this),
        y: this.dataToPositionY.bind(this),
        z: this._fieldZ ? this.dataToPositionZ.bind(this) : null,
        fill: this.getColorAttribute(),
        size: isNumber(this._size) || isFunction(this._size) ? this._size : SCATTER_DEFAULT_SIZE,
        symbolType: isString(this._shape) || isFunction(this._shape) ? this._shape : SCATTER_DEFAULT_SHAPE
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );

    if (isValid(this._sizeField) || isValid(this._size)) {
      this.setMarkStyle(
        symbolMark,
        {
          size: this.getSizeAttribute(this._sizeField, this._size) as VisualType<number>
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.User_Mark
      );
    }

    if (isValid(this._shapeField) || isValid(this._shape)) {
      this.setMarkStyle(
        symbolMark,
        {
          symbolType: this.getShapeAttribute(this._shapeField, this._shape) as VisualType<string>
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.User_Mark
      );
    }

    this._trigger.registerMark(symbolMark);
  }

  protected initTooltip() {
    super.initTooltip();

    this._symbolMark && this._tooltipHelper.activeTriggerSet.mark.add(this._symbolMark);
  }

  viewDataStatisticsUpdate(d: DataView) {
    super.viewDataStatisticsUpdate(d);
    const fields = [this.getDimensionField()[0], this.getStackValueField()];
    const allValid = fields.every(field => field && this.getViewDataStatistics()?.latestData?.[field]?.allValid);
    if (this._invalidType === 'zero' || allValid) {
      this.setMarkStyle(this._symbolMark, { visible: true }, 'normal', AttributeLevel.Series);
    } else {
      this.setMarkStyle(this._symbolMark, { visible: this._getInvalidDefined }, 'normal', AttributeLevel.Series);
    }
  }

  /**
   * 初始化LabelMark
   */
  initLabelMarkStyle(labelMark?: ILabelMark): void {
    if (!labelMark) {
      return;
    }
    this._labelMark = labelMark;
    this.setMarkStyle(
      labelMark,
      {
        fill: this.getColorAttribute(),
        text: (datum: Datum) => {
          return datum[this.getStackValueField()];
        },
        z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
    if (this._invalidType !== 'zero') {
      this.setMarkStyle(
        labelMark,
        {
          visible: this._getInvalidDefined
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }
  }

  /**
   * 处理缩放
   */
  handleZoom(e: any) {
    this.getMarksWithoutRoot().forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const elements = vGrammarMark.elements;

      elements.forEach((el: IElement, i: number) => {
        const graphicItem = el.getGraphicItem();
        const datum = el.getDatum();
        const newPosition = this.dataToPosition(datum);
        if (newPosition && graphicItem) {
          graphicItem.translateTo(newPosition.x, newPosition.y);
        }
      });
    });

    const vgrammarLabel = this._labelMark?.getComponent()?.getProduct();

    if (vgrammarLabel) {
      vgrammarLabel.evaluateSync(null, null);
    }
  }

  handlePan(e: any) {
    this.getMarksWithoutRoot().forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const elements = vGrammarMark.elements;

      elements.forEach((el: IElement, i: number) => {
        const graphicItem = el.getGraphicItem();
        const datum = el.getDatum();
        const newPosition = this.dataToPosition(datum);
        if (newPosition && graphicItem) {
          graphicItem.translateTo(newPosition.x, newPosition.y);
        }
      });
    });
    const vgrammarLabel = this._labelMark?.getComponent()?.getProduct();

    if (vgrammarLabel) {
      vgrammarLabel.evaluateSync(null, null);
    }
  }

  getDefaultShapeType() {
    return 'circle';
  }

  getActiveMarks(): IMark[] {
    return [this._symbolMark];
  }
}

export const registerScatterSeries = () => {
  registerSymbolMark();
  registerScatterAnimation();
  Factory.registerSeries(ScatterSeries.type, ScatterSeries);
};
