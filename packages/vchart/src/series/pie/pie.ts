import { isValid } from '@visactor/vutils';
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
  DEFAULT_LABEL_X,
  DEFAULT_LABEL_Y,
  DEFAULT_LABEL_TEXT,
  ARC_LABEL_POINT_BX,
  ARC_LABEL_POINT_BY,
  ARC_LABEL_POINT_CX,
  ARC_LABEL_POINT_CY,
  DEFAULT_LABEL_LIMIT,
  DEFAULT_LABEL_ALIGN,
  DEFAULT_LABEL_VISIBLE,
  POLAR_START_RADIAN,
  POLAR_END_RADIAN,
  DEFAULT_DATA_INDEX,
  ChartEvent
} from '../../constant';
import type { Maybe, IPoint, Datum, StateValueType } from '../../typings';
import {
  degrees,
  field,
  isNil,
  isSpecValueWithScale,
  normalizeStartEndAngle,
  polarToCartesian,
  radians
} from '../../util';
import type { IModelLayoutOption } from '../../model/interface';
import { PolarSeries } from '../polar/polar';
import { MarkTypeEnum } from '../../mark/interface';
import type { IArcMark } from '../../mark/arc';
import type { ITextMark } from '../../mark/text';
import type { IPathMark } from '../../mark/path';
import type { IArcSeries, SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IPieOpt } from '../../data/transforms/pie';
// eslint-disable-next-line no-duplicate-imports
import { pie } from '../../data/transforms/pie';

import { arcLabel } from '../../layout/label/arc-label';
import { registerDataSetInstanceTransform } from '../../data/register';
import type { IPieAnimationParams, PieAppearPreset } from './animation/animation';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import { AnimationStateEnum } from '../../animation/interface';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IArcLabelSpec, IPie3dSeriesSpec, IPieSeriesSpec, IPieSeriesTheme } from './interface';
import { SeriesData } from '../base/series-data';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { IAnimationTypeConfig } from '@visactor/vgrammar';
import { centerOffsetConfig } from './animation/centerOffset';
import { BaseSeries } from '../base/base-series';

type IBasePieSeriesSpec = Omit<IPieSeriesSpec, 'type'> & { type: string };

export class BasePieSeries<T extends IBasePieSeriesSpec> extends PolarSeries<T> implements IArcSeries {
  protected _pieMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.pie;
  protected _pieMarkType: MarkTypeEnum = MarkTypeEnum.arc;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.pie]: { name: SeriesMarkNameEnum.pie, type: MarkTypeEnum.arc },
    [SeriesMarkNameEnum.labelLine]: { name: SeriesMarkNameEnum.labelLine, type: MarkTypeEnum.path }
  };

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

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._centerOffset = this._spec?.centerOffset ?? 0;
    this._cornerRadius = this._spec?.cornerRadius ?? 0;

    const normalized = normalizeStartEndAngle(
      isValid(this._spec?.startAngle) ? radians(this._spec.startAngle) : this._startAngle,
      isValid(this._spec?.endAngle) ? radians(this._spec.endAngle) : this._endAngle
    );
    this._startAngle = normalized.startAngle;
    this._endAngle = normalized.endAngle;
    this._padAngle = isValid(this._spec?.padAngle) ? radians(this._spec.padAngle) : 0;

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
    registerDataSetInstanceTransform(this._dataSet, 'arcLabel', arcLabel);

    viewData.transform(
      {
        type: 'pie',
        options: {
          angleField: this._angleField[0],
          startAngle: this._startAngle,
          endAngle: this._endAngle,
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

    const viewDataLabel = new DataView(this._dataSet);
    viewDataLabel.parse([this.getViewData()], {
      type: 'dataview'
    });
    viewDataLabel.name = `${PREFIX}_series_${this.id}_viewDataLabel`;
    viewDataLabel.transform(
      {
        type: 'arcLabel',
        options: { series: this }
      },
      false
    );

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
        morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig(this.type, this._spec)),
        defaultMorphElementKey: this._seriesField,
        key: this._seriesField,
        groupKey: this._seriesField,
        skipBeforeLayouted: true,
        isSeriesMark: true
      }
    ) as IArcMark;

    if (this._spec?.label?.visible) {
      const spec = this.getSpec();
      this._labelMark = this._createMark(BasePieSeries.mark.label, {
        dataView: this._viewDataLabel.getDataView(),
        dataProductId: this._viewDataLabel.getProductId(),
        skipBeforeLayouted: true,
        themeSpec: this._theme?.label,
        support3d: spec?.label?.support3d,
        markSpec: {
          visible: true,
          ...this.getSpec()?.label
        }
      }) as ITextMark;

      this._labelLineMark = this._createMark(BasePieSeries.mark.labelLine, {
        dataView: this._viewDataLabel.getDataView(),
        dataProductId: this._viewDataLabel.getProductId(),
        skipBeforeLayouted: true,
        themeSpec: this._theme?.label?.line,
        support3d: spec?.label?.support3d,
        markSpec: {
          visible: true,
          ...this.getSpec()?.label?.line
        }
      }) as ITextMark;
    }
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

      // radius 配置需要额外处理比例值
      const pieSpec = this.getSpec()[pieMark.name];
      if (pieSpec) {
        // pieMark.setStyle(pieSpec.style, 'normal', AttributeLevel.User_Mark);
        for (const state in pieSpec.state || {}) {
          this.setMarkStyle(pieMark, this.generateRadiusStyle(pieSpec.state[state]), state, AttributeLevel.User_Mark);
        }
      }

      this._trigger.registerMark(pieMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(pieMark);
    }

    const labelMark = this._labelMark;
    if (labelMark) {
      this.setMarkStyle(
        labelMark,
        {
          visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
          x: field(DEFAULT_LABEL_X).bind(this),
          y: field(DEFAULT_LABEL_Y).bind(this),
          text: field(DEFAULT_LABEL_TEXT).bind(this),
          fill: this._spec.label?.style?.fill || this.getColorAttribute(),
          textAlign: field(DEFAULT_LABEL_ALIGN).bind(this),
          textBaseline: this._spec.label?.position === 'inside' ? 'middle' : 'top',
          angle: (datum: Datum) => {
            const angle = datum[ARC_MIDDLE_ANGLE];
            return this._spec.label?.position === 'inside' ? degrees(angle) : 0;
          },
          limit: field(DEFAULT_LABEL_LIMIT).bind(this)
        },
        undefined,
        // 标签属性基于用户配置生成，样式优先级应当为用户级
        AttributeLevel.User_Mark
      );

      this._trigger.registerMark(labelMark);
    }

    const labelLineMark = this._labelLineMark;
    if (labelLineMark) {
      this.setMarkStyle(labelLineMark, {
        visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
        stroke: (this._spec.label?.line?.style?.stroke as any) || this.getColorAttribute(),
        lineWidth: 1,
        ...this.generateLinePath('normal')
      });
      this.setMarkStyle(labelLineMark, this.generateLinePath('hover'), 'hover');
      this.setMarkStyle(labelLineMark, this.generateLinePath('selected'), 'selected');

      this._trigger.registerMark(labelLineMark);
    }
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

  updateSpec(spec: any) {
    // super updateSpec 会执行 setAttrFromSpec 所以先缓存比对值
    const originalSpec = this._originalSpec;
    const { centerX, centerY, centerOffset, radius, innerRadius, cornerRadius, startAngle, endAngle, padAngle } =
      originalSpec;
    const result = super.updateSpec(spec);
    if (
      spec?.centerX !== centerX ||
      spec?.centerY !== centerY ||
      spec?.centerOffset !== centerOffset ||
      spec?.radius !== radius ||
      spec?.innerRadius !== innerRadius ||
      spec?.cornerRadius !== cornerRadius ||
      spec?.startAngle !== startAngle ||
      spec?.endAngle !== endAngle ||
      spec?.padAngle !== padAngle
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
        // @ts-ignore
        // TODO: findLast is a new prototype function, we will later polyfill it in v-util.
        const prevMarkElement = markElements.findLast(e => e.data[0]?.[DEFAULT_DATA_INDEX] < dataIndex);
        if (outState.includes(state)) {
          return prevMarkElement?.getGraphicItem().nextAttrs?.endAngle;
        }
        return prevMarkElement?.getGraphicItem().prevAttrs?.endAngle;
      }
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<PieAppearPreset>)?.preset;

    if (this._pieMark) {
      const pieAnimationConfig = animationConfig(
        DEFAULT_MARK_ANIMATION.pie(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.pie, this._spec)
      );

      if (pieAnimationConfig.normal && (pieAnimationConfig.normal as IAnimationTypeConfig).type) {
        pieAnimationConfig.normal = centerOffsetConfig(
          this._pieMark,
          pieAnimationConfig.normal as IAnimationTypeConfig
        );
      }

      this._pieMark.setAnimationConfig(pieAnimationConfig);
    }

    if (this._labelMark) {
      this._labelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.label, this._spec))
      );

      if (this._labelLineMark) {
        this._labelLineMark.setAnimationConfig(
          animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.labelLine, this._spec))
        );
      }
    }
  }

  getDefaultShapeType(): string {
    return 'square';
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

  setValueFieldToStack(): void {
    // do nothing
  }

  setValueFieldToPercent(): void {
    //do nothing
  }
}

export class PieSeries extends BasePieSeries<IPieSeriesSpec> implements IArcSeries {
  static readonly type: string = SeriesTypeEnum.pie;
  type = SeriesTypeEnum.pie;
}

export class Pie3dSeries extends BasePieSeries<IPie3dSeriesSpec> implements IArcSeries {
  static readonly type: string = SeriesTypeEnum.pie3d;
  type = SeriesTypeEnum.pie3d;
  protected _pieMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.pie3d;
  protected _pieMarkType: MarkTypeEnum = MarkTypeEnum.arc3d;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.pie3d]: { name: SeriesMarkNameEnum.pie3d, type: MarkTypeEnum.arc3d },
    [SeriesMarkNameEnum.labelLine]: { name: SeriesMarkNameEnum.labelLine, type: MarkTypeEnum.path }
  };

  protected _angle3d: number;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._angle3d = this._spec?.angle3d ?? -Math.PI / 3;
  }

  initMarkStyle(): void {
    const pieMark = this._pieMark;
    if (pieMark) {
      this.setMarkStyle(
        pieMark,
        {
          x: () => this._center?.x ?? this._region.getLayoutRect().width / 2,
          y: () => this._center?.y ?? this._region.getLayoutRect().height / 2,
          beta: () => this._angle3d,
          fill: this.getColorAttribute(),
          outerRadius: () => this.computeLayoutRadius() * this._outerRadius,
          innerRadius: () => this.computeLayoutRadius() * this._innerRadius,
          cornerRadius: () => this.computeLayoutRadius() * this._cornerRadius,
          startAngle: field(ARC_START_ANGLE).bind(this),
          endAngle: field(ARC_END_ANGLE).bind(this),
          padAngle: this._padAngle,
          centerOffset: this._centerOffset
        },
        'normal',
        AttributeLevel.Series
      );

      // radius 配置需要额外处理比例值
      const pieSpec = this.getSpec()[pieMark.name];
      if (pieSpec) {
        // pieMark.setStyle(pieSpec.style, 'normal', AttributeLevel.User_Mark);
        for (const state in pieSpec.state || {}) {
          this.setMarkStyle(pieMark, this.generateRadiusStyle(pieSpec.state[state]), state, AttributeLevel.User_Mark);
        }
      }

      this._trigger.registerMark(pieMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(pieMark);
    }

    const labelMark = this._labelMark;
    const spec = this.getSpec();
    const params3d: {
      beta?: number;
      anchor3d?: (datum: Datum) => any;
    } = {};
    if (spec?.label?.support3d) {
      params3d.beta = -Math.PI / 3;
      params3d.anchor3d = (datum: Datum) => {
        const anchor = [
          (this._center?.x ?? this._region.getLayoutRect().width / 2) - field(DEFAULT_LABEL_X).bind(this)(datum),
          (this._center?.y ?? this._region.getLayoutRect().height / 2) - field(DEFAULT_LABEL_Y).bind(this)(datum)
        ];
        return anchor;
      };
    }
    if (labelMark) {
      this.setMarkStyle(
        labelMark,
        {
          visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
          x: field(DEFAULT_LABEL_X).bind(this),
          y: field(DEFAULT_LABEL_Y).bind(this),
          text: field(DEFAULT_LABEL_TEXT).bind(this),
          fill: this._spec.label?.style?.fill || this.getColorAttribute(),
          textAlign: field(DEFAULT_LABEL_ALIGN).bind(this),
          textBaseline: this._spec.label?.position === 'inside' ? 'middle' : 'top',
          angle: (datum: Datum) => {
            const angle = datum[ARC_MIDDLE_ANGLE];
            return this._spec.label?.position === 'inside' ? degrees(angle) : 0;
          },
          limit: field(DEFAULT_LABEL_LIMIT).bind(this),
          ...params3d
        },
        undefined,
        // 标签属性基于用户配置生成，样式优先级应当为用户级
        AttributeLevel.User_Mark
      );

      this._trigger.registerMark(labelMark);
    }

    const labelLineMark = this._labelLineMark;
    if (labelLineMark) {
      this.setMarkStyle(labelLineMark, {
        visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
        stroke: (this._spec.label?.line?.style?.stroke as any) || this.getColorAttribute(),
        lineWidth: 1,
        ...this.generateLinePath('normal'),
        ...params3d,
        anchor3d: () => {
          return [
            this._center?.x ?? this._region.getLayoutRect().width / 2,
            this._center?.y ?? this._region.getLayoutRect().height / 2
          ];
        }
      });
      this.setMarkStyle(labelLineMark, this.generateLinePath('hover'), 'hover');
      this.setMarkStyle(labelLineMark, this.generateLinePath('selected'), 'selected');

      this._trigger.registerMark(labelLineMark);
    }
  }
}
