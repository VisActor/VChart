/* eslint-disable no-duplicate-imports */
import { degreeToRadian, isValid } from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';
import {
  AttributeLevel,
  ARC_START_ANGLE,
  ARC_END_ANGLE,
  ARC_RATIO,
  ARC_MIDDLE_ANGLE,
  ARC_RADIAN,
  ARC_QUADRANT,
  ARC_K,
  PREFIX,
  ARC_LABEL_POINT_BX,
  ARC_LABEL_POINT_BY,
  ARC_LABEL_POINT_CX,
  ARC_LABEL_POINT_CY,
  DEFAULT_LABEL_VISIBLE,
  POLAR_START_RADIAN,
  POLAR_END_RADIAN,
  DEFAULT_DATA_INDEX,
  ChartEvent,
  DEFAULT_DATA_KEY
} from '../../constant';
import type { Maybe, IPoint, Datum, StateValueType } from '../../typings';
import { normalizeStartEndAngle, polarToCartesian } from '../../util/math';
import { isSpecValueWithScale } from '../../util/scale';
import { field } from '../../util/object';
import type { IModelLayoutOption } from '../../model/interface';
import { PolarSeries } from '../polar/polar';
import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { IArcMark } from '../../mark/arc';
import type { ITextMark } from '../../mark/text';
import type { IPathMark } from '../../mark/path';
import type { IArcSeries, SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IPieOpt } from '../../data/transforms/pie';
// eslint-disable-next-line no-duplicate-imports
import { pie } from '../../data/transforms/pie';
import { registerDataSetInstanceTransform } from '../../data/register';
import { registerPieAnimation, type IPieAnimationParams, type PieAppearPreset } from './animation/animation';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import { AnimationStateEnum } from '../../animation/interface';
import type { IArcLabelSpec, IPieSeriesSpec, IPieSeriesTheme } from './interface';
import { SeriesData } from '../base/series-data';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { centerOffsetConfig } from './animation/centerOffset';
import { ArcMark } from '../../mark/arc';
import { mergeSpec } from '../../util/spec/merge-spec';
import { pieSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import { isNil } from '@visactor/vutils';

type IBasePieSeriesSpec = Omit<IPieSeriesSpec, 'type'> & { type: string };

export class BasePieSeries<T extends IBasePieSeriesSpec> extends PolarSeries<T> implements IArcSeries {
  protected _pieMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.pie;
  protected _pieMarkType: MarkTypeEnum = MarkTypeEnum.arc;

  static readonly mark: SeriesMarkMap = pieSeriesMark;

  protected _viewDataLabel!: SeriesData;

  // 饼图渲染不依赖于极坐标系轴，因此由 series 自己存储相关配置信息
  protected _center!: IPoint | null;
  public get center(): IPoint {
    return {
      x: this._spec?.centerX ?? this._region.getLayoutRect().width / 2,
      y: this._spec?.centerY ?? this._region.getLayoutRect().height / 2
    };
  }
  protected _centerOffset!: number;

  protected _cornerRadius!: number;

  protected _startAngle: number = POLAR_START_RADIAN;
  protected _endAngle: number = POLAR_END_RADIAN;
  protected _padAngle!: number;

  protected _pieMark: IArcMark | null = null;
  protected _labelMark: ITextMark | null = null;
  protected _labelLineMark: IPathMark | null = null;

  protected declare _theme: Maybe<IPieSeriesTheme>;

  protected _buildMarkAttributeContext() {
    super._buildMarkAttributeContext();
    // center
    this._markAttributeContext.getCenter = () => {
      return {
        x: () => this._center?.x ?? this._region.getLayoutRect().width / 2,
        y: () => this._center?.y ?? this._region.getLayoutRect().height / 2
      };
    };
  }

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._centerOffset = this._spec?.centerOffset ?? 0;
    this._cornerRadius = this._spec?.cornerRadius ?? 0;

    const normalized = normalizeStartEndAngle(
      isValid(this._spec?.startAngle) ? degreeToRadian(this._spec.startAngle) : this._startAngle,
      isValid(this._spec?.endAngle) ? degreeToRadian(this._spec.endAngle) : this._endAngle
    );
    this._startAngle = normalized.startAngle;
    this._endAngle = normalized.endAngle;
    this._padAngle = isValid(this._spec?.padAngle) ? degreeToRadian(this._spec.padAngle) : 0;

    // 值信息给角度，angleField 是为了兼容小组件用法，因为 spec 改造前已经开放了
    this.setAngleField(this._spec.valueField || this._spec.angleField);
    if (this._spec.categoryField) {
      this.setSeriesField(this._spec.categoryField);
    }
    this._radiusField = [];
  }

  initData() {
    super.initData();

    const viewData = this.getViewData();
    if (!viewData) {
      return;
    }

    registerDataSetInstanceTransform(this._dataSet, 'pie', pie);

    viewData.transform(
      {
        type: 'pie',
        options: {
          angleField: this._angleField[0],
          startAngle: this._startAngle,
          endAngle: this._endAngle,
          minAngle: isValid(this._spec?.minAngle) ? degreeToRadian(this._spec.minAngle) : 0,
          asStartAngle: ARC_START_ANGLE,
          asEndAngle: ARC_END_ANGLE,
          asRatio: ARC_RATIO,
          asMiddleAngle: ARC_MIDDLE_ANGLE,
          asRadian: ARC_RADIAN,
          asQuadrant: ARC_QUADRANT,
          asK: ARC_K
        } as IPieOpt
      },
      false
    );

    const viewDataLabel = new DataView(this._dataSet, { name: `${PREFIX}_series_${this.id}_viewDataLabel` });
    viewDataLabel.parse([this.getViewData()], {
      type: 'dataview'
    });

    this._viewDataLabel = new SeriesData(this._option, viewDataLabel);
  }

  initMark(): void {
    this._pieMark = this._createMark(
      {
        ...BasePieSeries.mark.pie,
        name: this._pieMarkName,
        type: this._pieMarkType
      },
      {
        morph: shouldMarkDoMorph(this._spec, this._pieMarkName),
        defaultMorphElementKey: this._seriesField,
        key: DEFAULT_DATA_KEY,
        groupKey: this._seriesField,
        skipBeforeLayouted: true,
        isSeriesMark: true,
        label: this._preprocessLabelSpec(this._spec.label),
        customShape: this._spec.pie?.customShape
      }
    ) as IArcMark;
  }

  initMarkStyle(): void {
    const pieMark = this._pieMark;
    if (pieMark) {
      this.setMarkStyle(
        pieMark,
        {
          x: () => this._center?.x ?? this._region.getLayoutRect().width / 2,
          y: () => this._center?.y ?? this._region.getLayoutRect().height / 2,
          fill: this.getColorAttribute(),
          outerRadius: isSpecValueWithScale(this._outerRadius)
            ? this._outerRadius
            : () => this.computeLayoutRadius() * this._outerRadius,
          innerRadius: isSpecValueWithScale(this._innerRadius)
            ? this._innerRadius
            : () => this.computeLayoutRadius() * this._innerRadius,
          cornerRadius: () => this.computeLayoutRadius() * this._cornerRadius,
          startAngle: field(ARC_START_ANGLE).bind(this),
          endAngle: field(ARC_END_ANGLE).bind(this),
          padAngle: this._padAngle,
          centerOffset: this._centerOffset
        },
        'normal',
        AttributeLevel.Series
      );

      this._trigger.registerMark(pieMark);
    }
  }

  protected initTooltip() {
    super.initTooltip();

    this._pieMark && this._tooltipHelper.activeTriggerSet.mark.add(this._pieMark);
  }

  initMarkStyleWithSpec(mark?: IMark, spec?: any, key?: string): void {
    super.initMarkStyleWithSpec(mark, spec, key);
    if (mark.name === this._pieMarkName) {
      // radius 配置需要额外处理比例值
      const pieSpec = this.getSpec()[mark.name];
      if (pieSpec) {
        for (const state in pieSpec.state || {}) {
          this.setMarkStyle(mark, this.generateRadiusStyle(pieSpec.state[state]), state, AttributeLevel.User_Mark);
        }
      }
    }
  }

  initLabelMarkStyle(textMark: ITextMark) {
    if (!textMark) {
      return;
    }
    this.setMarkStyle(textMark, {
      visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
      text: (datum: Datum) => {
        return datum[this.getDimensionField()[0]];
      },
      fill: this._spec.label?.style?.fill || this.getColorAttribute(),
      angle: this._spec.label?.style?.angle,
      limit: this._spec.label?.style?.limit,
      z: this.dataToPositionZ.bind(this)
    });
  }

  afterInitMark(): void {
    super.afterInitMark();
    this._trigger.setStateKeys([this._seriesField as string, ...this._radiusField]);
  }

  initEvent(): void {
    super.initEvent();
    this._viewDataLabel.getDataView()?.target.addListener('change', this.viewDataLabelUpdate.bind(this));
  }

  // 饼图不支持分组
  initGroups() {
    return;
  }

  /**
   * @override
   * @param ctx
   */
  onLayoutEnd(ctx: IModelLayoutOption): void {
    this._viewDataLabel.getDataView().reRunAllTransform();
    this.onMarkPositionUpdate();
    super.onLayoutEnd(ctx);
  }

  getDimensionField(): string[] {
    return this._seriesField ? [this._seriesField] : [];
  }
  getMeasureField(): string[] {
    return this._angleField;
  }

  private viewDataLabelUpdate() {
    this.event.emit(ChartEvent.viewDataLabelUpdate, { model: this });
    this._viewDataLabel.updateData();
  }

  protected generateRadiusStyle(spec: any) {
    const style: any = {};
    spec?.outerRadius && (style.outerRadius = () => this.computeLayoutRadius() * spec?.outerRadius);
    spec?.innerRadius && (style.innerRadius = () => this.computeLayoutRadius() * spec?.innerRadius);
    spec?.cornerRadius && (style.cornerRadius = () => this.computeLayoutRadius() * spec?.cornerRadius);
    return style;
  }

  protected computeLayoutRadius() {
    const { width, height } = this._region.getLayoutRect();
    return Math.min(width / 2, height / 2);
  }

  computeCenter(datum: Datum): IPoint {
    return {
      x: this._pieMark.getAttribute('x', datum, 'normal') as number,
      y: this._pieMark.getAttribute('y', datum, 'normal') as number
    };
  }

  protected generateLinePath(state: StateValueType) {
    const key = state === 'normal' ? 'POINT' : state.toUpperCase();
    return {
      path: (datum: Datum) => {
        return (
          `M${Math.round(datum[`${PREFIX}_ARC_LABEL_${key}_AX`])},${Math.round(
            datum[`${PREFIX}_ARC_LABEL_${key}_AY`]
          )}` +
          ` L${Math.round(datum[ARC_LABEL_POINT_BX])},${Math.round(datum[ARC_LABEL_POINT_BY])}` +
          ` L${Math.round(datum[ARC_LABEL_POINT_CX])},${Math.round(datum[ARC_LABEL_POINT_CY])}`
        );
      }
    };
  }

  getRadius(state: StateValueType = 'normal'): number {
    const styleRadius =
      state === 'normal'
        ? this.getSpec()[this._pieMark?.name || 'pie']?.style?.outerRadius
        : this.getSpec()[this._pieMark?.name || 'pie']?.state?.[state]?.outerRadius;
    return styleRadius ?? this._outerRadius;
  }

  getInnerRadius(state: StateValueType = 'normal'): number {
    const styleRadius =
      state === 'normal'
        ? this.getSpec()[this._pieMark?.name || 'pie']?.style?.innerRadius
        : this.getSpec()[this._pieMark?.name || 'pie']?.state?.[state]?.innerRadius;
    return styleRadius ?? this._innerRadius;
  }

  getLabelConfig(): IArcLabelSpec {
    // TODO: 转换 series spec
    return {
      visible: true,
      position: 'outside',
      showRule: 'all',
      rotate: true,
      coverEnable: false,
      spaceWidth: 5,
      layoutArcGap: 6,
      ...this._spec.label,

      style: {
        visible: true,
        ...this._spec.label?.style
      },
      line: {
        visible: true,
        line1MinLength: this._spec.label?.line?.line1MinLength ?? 20,
        line2MinLength: this._spec.label?.line?.line2MinLength ?? 10,
        ...this._spec.label?.line
      },
      layout: {
        align: 'arc',
        strategy: 'priority',
        tangentConstraint: true,
        ...this._spec.label?.layout
      }
    };
  }

  computeRadius(r: number, k?: number): number {
    return this.computeLayoutRadius() * r * (isNil(k) ? 1 : k) + this._centerOffset;
  }

  computeDatumRadius(datum: Datum, state?: string): number {
    return this.computeLayoutRadius() * this.getRadius(state) + this._centerOffset;
  }

  _compareSpec(ignoreCheckKeys?: { [key: string]: true }) {
    ignoreCheckKeys = ignoreCheckKeys ?? { data: true };
    ignoreCheckKeys.centerX = true;
    ignoreCheckKeys.centerX = true;
    ignoreCheckKeys.centerY = true;
    ignoreCheckKeys.centerOffset = true;
    ignoreCheckKeys.radius = true;
    ignoreCheckKeys.innerRadius = true;
    ignoreCheckKeys.cornerRadius = true;
    ignoreCheckKeys.startAngle = true;
    ignoreCheckKeys.endAngle = true;
    ignoreCheckKeys.padAngle = true;
    const { centerX, centerY, centerOffset, radius, innerRadius, cornerRadius, startAngle, endAngle, padAngle } =
      this._originalSpec;
    const result = super._compareSpec(ignoreCheckKeys);
    if (
      this._spec?.centerY !== centerY ||
      this._spec?.centerX !== centerX ||
      this._spec?.centerOffset !== centerOffset ||
      this._spec?.radius !== radius ||
      this._spec?.innerRadius !== innerRadius ||
      this._spec?.cornerRadius !== cornerRadius ||
      this._spec?.startAngle !== startAngle ||
      this._spec?.endAngle !== endAngle ||
      this._spec?.padAngle !== padAngle
    ) {
      result.reRender = true;
      result.change = true;
    }
    return result;
  }

  computeDatumInnerRadius(datum: Datum, state?: string): number {
    return this.computeLayoutRadius() * this.getInnerRadius(state) + this._centerOffset;
  }

  dataToPosition(datum: Datum): IPoint | null {
    const angle = datum[ARC_MIDDLE_ANGLE];
    if (isNil(angle)) {
      return null;
    }
    const radius = this.computeDatumRadius(datum);
    const center = this.computeCenter(datum);
    const delta = polarToCartesian({ angle, radius });
    return { x: center.x + delta.x, y: center.y + delta.y };
  }

  dataToCentralPosition = (datum: Datum): IPoint | null => {
    // 和 PieSeries.dataToPosition 实现不同，这里考虑了美观性，返回的位置是曲边梯形的中心
    const angle = datum[ARC_MIDDLE_ANGLE];
    if (isNil(angle)) {
      return null;
    }
    const radius = this.computeDatumRadius(datum);
    const innerRadius = this.computeDatumInnerRadius(datum);
    const center = this.computeCenter(datum);
    const delta = polarToCartesian({ angle, radius: (radius + innerRadius) / 2 });
    return { x: center.x + delta.x, y: center.y + delta.y };
  };

  initAnimation() {
    const animationParams: IPieAnimationParams = {
      growFrom: (datum, element, state) => {
        if (state === AnimationStateEnum.appear) {
          return this._startAngle;
        }
        if (state === AnimationStateEnum.disappear) {
          return this._endAngle;
        }

        const outState = [AnimationStateEnum.disappear, AnimationStateEnum.exit];
        const markElements = element.mark.elements;

        const data = datum;
        const dataIndex = data?.[DEFAULT_DATA_INDEX];

        // 当前 mark 在上个状态是否处于第一个
        if (markElements.find(e => e.data[0]?.[DEFAULT_DATA_INDEX] < dataIndex) === undefined) {
          return this._startAngle;
        }
        // 当前 mark 在上个状态是否处于最后一个
        if (markElements.find(e => e.data[0]?.[DEFAULT_DATA_INDEX] > dataIndex) === undefined) {
          return this._endAngle;
        }

        // 扇形不在边缘时，获取扇形生长点：获取相邻状态下相邻扇形的边缘
        const prevMarkElement = [...markElements].reverse().find(e => e.data[0]?.[DEFAULT_DATA_INDEX] < dataIndex);

        if (outState.includes(state)) {
          return prevMarkElement?.getNextGraphicAttributes()?.endAngle;
        }
        return prevMarkElement?.getGraphicAttribute('endAngle', true);
      }
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<PieAppearPreset>)?.preset;

    if (this._pieMark) {
      const pieAnimationConfig = animationConfig(
        Factory.getAnimationInKey('pie')?.(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.pie, this._spec, this._markAttributeContext)
      );

      if (pieAnimationConfig.normal && (pieAnimationConfig.normal as IAnimationTypeConfig).type) {
        pieAnimationConfig.normal = centerOffsetConfig(
          this._pieMark,
          pieAnimationConfig.normal as IAnimationTypeConfig
        );
      }

      this._pieMark.setAnimationConfig(pieAnimationConfig);
    }
  }

  getDefaultShapeType() {
    return 'circle';
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

  // make sure this function fast
  protected _noAnimationDataKey(datum: Datum, index: number) {
    return index;
  }

  getActiveMarks(): IMark[] {
    return [this._pieMark];
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec() {
    if (this._shouldMergeThemeToSpec()) {
      const specFromChart = this._getDefaultSpecFromChart(this.getChart().getSpec());

      // this._originalSpec + specFromChart + this._theme = this._spec
      // 动态处理 label 样式，对于展示在内部的 label 默认使用 innerLabel 样式
      const result = mergeSpec({}, this._theme, specFromChart, this._originalSpec) as any;
      if (result.label.position === 'inside') {
        result.label = mergeSpec({}, this._theme.innerLabel, result.label);
      } else {
        result.label = mergeSpec({}, this._theme.outerLabel, result.label);
      }

      this._spec = result;
    }
  }
}

export class PieSeries<T extends IPieSeriesSpec = IPieSeriesSpec> extends BasePieSeries<T> implements IArcSeries {
  static readonly type: string = SeriesTypeEnum.pie;
  type = SeriesTypeEnum.pie;
}

export const registerPieSeries = () => {
  Factory.registerMark(ArcMark.type, ArcMark);
  Factory.registerSeries(PieSeries.type, PieSeries);
  registerPieAnimation();
};
