/* eslint-disable no-duplicate-imports */
import type { IFunnelSeries, SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface';
import type { IOrientType, IPoint, TextAlign, TextBaseLine, Maybe, Datum, StringOrNumber } from '../../typings';
import { SeriesTypeEnum } from '../interface';
import type { IPolygonMark } from '../../mark/polygon/polygon';
import { BaseSeries } from '../base/base-series';
import { AttributeLevel, PREFIX } from '../../constant';
import { registerDataSetInstanceTransform } from '../../data/register';
import { DataView } from '@visactor/vdataset';
import { MarkTypeEnum } from '../../mark/interface';
import type { IFunnelOpt } from '../../data/transforms/funnel';
import { funnel, funnelTransform } from '../../data/transforms/funnel';
import {
  FUNNEL_CURRENT_VALUE,
  FUNNEL_HEIGHT_RATIO,
  FUNNEL_LABEL_LINE_LENGTH,
  FUNNEL_LABEL_SPACE_WIDTH,
  FUNNEL_LAST_VALUE,
  FUNNEL_LAST_VALUE_RATIO,
  FUNNEL_MAX_SIZE,
  FUNNEL_MIN_SIZE,
  FUNNEL_NEXT_VALUE,
  FUNNEL_NEXT_VALUE_RATIO,
  FUNNEL_REACH_RATIO,
  FUNNEL_TRANSFORM_LEVEL,
  FUNNEL_TRANSFORM_RATIO,
  FUNNEL_VALUE_RATIO
} from '../../constant/funnel';
import type { ITextMark } from '../../mark/text';
import { field, calcLayoutNumber, isNumber } from '../../util';
import type { FunnelAppearPreset, IFunnelSeriesSpec, IFunnelSeriesTheme } from './interface';
import type { IRuleMark } from '../../mark/rule';
import { FunnelSeriesTooltipHelper } from './tooltip-helper';
import { isEqual, isValid } from '@visactor/vutils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import { SeriesData } from '../base/series-data';
import type { IStateAnimateSpec } from '../../animation/spec';
import { VChart } from '../../core/vchart';
import { PolygonMark } from '../../mark/polygon/polygon';
import { TextMark } from '../../mark/text';
import { RuleMark } from '../../mark/rule';

VChart.useMark([PolygonMark, TextMark, RuleMark]);

export class FunnelSeries extends BaseSeries<IFunnelSeriesSpec> implements IFunnelSeries {
  static readonly type: string = SeriesTypeEnum.funnel;
  type = SeriesTypeEnum.funnel;
  protected _funnelMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.funnel;
  protected _funnelMarkType: MarkTypeEnum = MarkTypeEnum.polygon;
  protected _transformMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.transform;
  protected _transformMarkType: MarkTypeEnum = MarkTypeEnum.polygon;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.funnel]: { name: SeriesMarkNameEnum.funnel, type: MarkTypeEnum.polygon },
    [SeriesMarkNameEnum.transform]: { name: SeriesMarkNameEnum.transform, type: MarkTypeEnum.polygon },
    [SeriesMarkNameEnum.transformLabel]: { name: SeriesMarkNameEnum.transformLabel, type: MarkTypeEnum.text },
    [SeriesMarkNameEnum.outerLabel]: { name: SeriesMarkNameEnum.outerLabel, type: MarkTypeEnum.text },
    [SeriesMarkNameEnum.outerLabelLine]: { name: SeriesMarkNameEnum.outerLabelLine, type: MarkTypeEnum.rule }
  };

  protected _categoryField!: string;
  getCategoryField() {
    return this._categoryField;
  }
  setCategoryField(f: string): string {
    this._categoryField = f;
    return this._categoryField;
  }

  protected _valueField!: string;
  getValueField() {
    return this._valueField;
  }
  setValueField(f: string): string {
    this._valueField = f;
    return this._valueField;
  }

  protected _viewDataTransform!: SeriesData;

  protected declare _theme: Maybe<IFunnelSeriesTheme>;

  protected _funnelAlign: 'left' | 'center' | 'right' | 'top' | 'bottom';
  protected _funnelOrient: IOrientType;
  protected _shape: 'rect' | 'trapezoid';

  protected _funnelMark: IPolygonMark | null = null;
  protected _funnelTransformMark: IPolygonMark | null = null;
  protected _labelMark: ITextMark | null = null;
  protected _transformLabelMark: ITextMark | null = null;
  protected _funnelOuterLabelMark: { label?: ITextMark; line?: IRuleMark } = {};

  setAttrFromSpec(): void {
    super.setAttrFromSpec();

    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);

    this._funnelOrient = this._spec.funnelOrient ?? 'top';
    this._shape = this._spec.shape ?? 'trapezoid';

    if (this._isHorizontal()) {
      this._funnelAlign = ['top', 'bottom'].includes(this._spec.funnelAlign) ? this._spec.funnelAlign : 'center';
    } else {
      this._funnelAlign = ['left', 'right'].includes(this._spec.funnelAlign) ? this._spec.funnelAlign : 'center';
    }

    if (this._spec.categoryField) {
      this.setSeriesField(this._spec.categoryField);
    }
  }

  initData() {
    super.initData();
    if (!this._data) {
      return;
    }

    registerDataSetInstanceTransform(this._dataSet, 'funnel', funnel);
    registerDataSetInstanceTransform(this._dataSet, 'funnelTransform', funnelTransform);

    const viewDataTransform = new DataView(this._dataSet);
    viewDataTransform.parse([this.getViewData()], {
      type: 'dataview'
    });
    viewDataTransform.name = `${PREFIX}_series_${this.id}_viewDataTransform`;

    this._viewDataTransform = new SeriesData(this._option, viewDataTransform);
  }

  getStatisticFields() {
    const fields: { key: string; operations: Array<'max' | 'min' | 'values'> }[] = [];
    fields.push({ key: this._categoryField, operations: ['values'] });
    fields.push({ key: this._valueField, operations: ['max', 'min'] });
    return fields;
  }

  protected _statisticViewData(): void {
    super._statisticViewData();
    this._data.getDataView().transform({
      type: 'funnel',
      options: {
        valueField: this.getValueField(),
        isCone: this._spec.isCone,
        // heightVisual: true,
        asCurrentValue: FUNNEL_CURRENT_VALUE,
        asTransformRatio: FUNNEL_TRANSFORM_RATIO,
        asReachRatio: FUNNEL_REACH_RATIO,
        asHeightRatio: FUNNEL_HEIGHT_RATIO,
        asValueRatio: FUNNEL_VALUE_RATIO,
        asNextValueRatio: FUNNEL_NEXT_VALUE_RATIO,
        asLastValueRatio: FUNNEL_LAST_VALUE_RATIO,
        asLastValue: FUNNEL_LAST_VALUE,
        asNextValue: FUNNEL_NEXT_VALUE,
        range: {
          min: this._spec.range?.min ?? this.getViewDataStatistics().latestData?.[this.getValueField()]?.min,
          max: this._spec.range?.max ?? this.getViewDataStatistics().latestData?.[this.getValueField()]?.max
        }
      } as IFunnelOpt
    });

    this._viewDataTransform.getDataView()?.transform({
      type: 'funnelTransform',
      options: { asIsTransformLevel: FUNNEL_TRANSFORM_LEVEL }
    });
  }

  initMark() {
    this._funnelMark = this._createMark(
      {
        ...FunnelSeries.mark.funnel,
        name: this._funnelMarkName,
        type: this._funnelMarkType
      },
      {
        themeSpec: this._theme?.funnel,
        morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig(this.type, this._spec)),
        defaultMorphElementKey: this._seriesField,
        key: this._seriesField,
        groupKey: this._seriesField,
        isSeriesMark: true
      }
    ) as IPolygonMark;

    if (this._spec.isTransform) {
      this._funnelTransformMark = this._createMark(
        {
          ...FunnelSeries.mark.transform,
          name: this._transformMarkName,
          type: this._transformMarkType
        },
        {
          themeSpec: this._theme?.transform,
          key: this._seriesField,
          skipBeforeLayouted: false,
          dataView: this._viewDataTransform.getDataView(),
          dataProductId: this._viewDataTransform.getProductId()
        }
      );
    }
    if (this._spec?.label?.visible) {
      this._labelMark = this._createMark(FunnelSeries.mark.label, {
        themeSpec: this._theme?.label,
        key: this._seriesField
      });
    }
    if (this._spec?.transformLabel?.visible) {
      this._transformLabelMark = this._createMark(FunnelSeries.mark.transformLabel, {
        themeSpec: this._theme?.transformLabel,
        key: this._seriesField,
        skipBeforeLayouted: false,
        dataView: this._viewDataTransform.getDataView(),
        dataProductId: this._viewDataTransform.getProductId()
      });
    }
    if (this._spec?.outerLabel?.visible) {
      const { line } = this._spec.outerLabel ?? {};
      const { line: lineTheme } = this._theme?.outerLabel ?? {};

      this._funnelOuterLabelMark.label = this._createMark(FunnelSeries.mark.outerLabel, {
        themeSpec: this._theme?.outerLabel,
        key: this._seriesField,
        markSpec: this._spec.outerLabel,
        depend: this._labelMark
      }) as ITextMark;

      this._funnelOuterLabelMark.line = this._createMark(FunnelSeries.mark.outerLabelLine, {
        themeSpec: lineTheme,
        key: this._seriesField,
        markSpec: line,
        depend: [this._funnelOuterLabelMark.label, this._labelMark]
      }) as IRuleMark;
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new FunnelSeriesTooltipHelper(this);
  }

  getDimensionField(): string[] {
    return this._seriesField ? [this._seriesField] : [];
  }
  getMeasureField(): string[] {
    return [this._valueField];
  }

  getGroupFields(): string[] {
    return null;
  }

  initMarkStyle() {
    const funnelMark = this._funnelMark;
    if (funnelMark) {
      this.setMarkStyle(
        funnelMark,
        {
          points: (datum: Datum) => this.getPoints(datum),
          visible: (datum: Datum) => isValid(datum[this._valueField]),
          fill: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(funnelMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(funnelMark);
    }

    const funnelTransformMark = this._funnelTransformMark;
    if (funnelTransformMark) {
      this.setMarkStyle(
        funnelTransformMark,
        { points: (datum: Datum) => this.getPoints(datum) },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(funnelTransformMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(funnelTransformMark);
    }

    const labelMark = this._labelMark;
    if (labelMark) {
      this.setMarkStyle(
        labelMark,
        {
          text: (datum: Datum) => `${datum[this.getCategoryField()]} ${datum[this.getValueField()]}`,
          x: (datum: Datum) => this._computeLabelPosition(datum).x,
          y: (datum: Datum) => this._computeLabelPosition(datum).y,
          limit: (datum: Datum) => this._computeLabelLimit(datum, this._spec.label),
          stroke: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(labelMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(labelMark);
    }

    const transformLabelMark = this._transformLabelMark;
    if (transformLabelMark) {
      this.setMarkStyle(
        transformLabelMark,
        {
          text: (datum: Datum) => {
            const ratio = field(FUNNEL_REACH_RATIO).bind(this)(datum) as number;
            return `${(ratio * 100).toFixed(1)}%`;
          },
          x: (datum: Datum) => this._computeLabelPosition(datum).x,
          y: (datum: Datum) => this._computeLabelPosition(datum).y,
          limit: (datum: Datum) => this._computeLabelLimit(datum, this._spec.transformLabel)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(transformLabelMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(transformLabelMark);
    }

    const outerLabelMark = this._funnelOuterLabelMark.label;
    if (outerLabelMark) {
      this.setMarkStyle(
        outerLabelMark,
        {
          text: (datum: Datum) => `${datum[this.getCategoryField()]}`,
          x: (datum: Datum) => this._computeOuterLabelPosition(datum).x,
          y: (datum: Datum) => this._computeOuterLabelPosition(datum).y,
          textAlign: (datum: Datum) => this._computeOuterLabelPosition(datum).align,
          textBaseline: (datum: Datum) => this._computeOuterLabelPosition(datum).textBaseline,
          limit: (datum: Datum) => this._computeOuterLabelLimit(datum)
        },
        'normal',
        AttributeLevel.Series
      );
    }
    const outerLabelLineMark = this._funnelOuterLabelMark.line;
    if (outerLabelLineMark && outerLabelMark) {
      this.setMarkStyle(
        outerLabelLineMark,
        {
          x: (datum: Datum) => this._computeOuterLabelLinePosition(datum).x1,
          y: (datum: Datum) => this._computeOuterLabelLinePosition(datum).y1,
          x1: (datum: Datum) => this._computeOuterLabelLinePosition(datum).x2,
          y1: (datum: Datum) => this._computeOuterLabelLinePosition(datum).y2
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<FunnelAppearPreset>)?.preset ?? 'clipIn';
    if (appearPreset === 'clipIn') {
      if (this._rootMark) {
        this._rootMark.setAnimationConfig(
          animationConfig(
            DEFAULT_MARK_ANIMATION.cartesianGroup(
              {
                direction: () => (this._isHorizontal() ? 'x' : 'y'),
                width: () => this.getLayoutRect().width,
                height: () => this.getLayoutRect().height,
                orient: () => (this._isReverse() ? 'negative' : 'positive')
              },
              appearPreset
            ),
            userAnimationConfig(SeriesMarkNameEnum.group, this._spec)
          )
        );
      }
    }
    [this._labelMark, this._funnelOuterLabelMark?.label, this._transformLabelMark].forEach(m => {
      if (m) {
        m.setAnimationConfig(animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(m.name, this._spec)));
      }
    });

    [this._funnelMark, this._funnelTransformMark].forEach(m => {
      if (m) {
        m.setAnimationConfig(
          animationConfig(DEFAULT_MARK_ANIMATION.funnel({}, appearPreset), userAnimationConfig(m.name, this._spec))
        );
      }
    });

    if (this._funnelOuterLabelMark?.line) {
      this._funnelOuterLabelMark.line.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.label(),
          userAnimationConfig(SeriesMarkNameEnum.outerLabelLine, this._spec)
        )
      );
    }
  }
  // hack group
  initGroups() {
    // do nothing
  }

  // handle stack
  getStackGroupFields(): string[] {
    return [];
  }

  getStackValueField(): string {
    // hack
    return null;
  }

  setValueFieldToStack(): void {
    // this.setRadiusField(STACK_FIELD_END);
  }

  setValueFieldToPercent(): void {
    //do nothing
  }

  /** event */
  protected initEvent() {
    super.initEvent();
    // 同步更新转化层数据
    this._viewDataTransform.getDataView()?.target.addListener('change', (d: DataView) => {
      this._viewDataTransform.updateData();
    });
  }

  /**
   *
   *   P0 ----------- P1       P2 ------ P3
   *      \         /           /        \
   *     P3 ------ P2        P1 ---------- P0
   *
   *         P1                     P0
   *           |\ P2           P3 /|
   *           | |               | |
   *           |/ P3           P2 \|
   *         P0                     P1
   */
  getPoints(datum: Datum) {
    // 对特殊数据层不进行绘制
    const isTransformLevel = this.isTransformLevel(datum);

    const heightHalf = this._getMainAxisLength(isTransformLevel) / 2;
    let upperLeft;
    let lowerLeft;
    if (isTransformLevel) {
      upperLeft =
        this._shape === 'rect'
          ? this._getSecondaryAxisLength(datum[FUNNEL_LAST_VALUE_RATIO]) / 2
          : this._getSecondaryAxisLength(datum[FUNNEL_VALUE_RATIO]) / 2;
      lowerLeft = this._getSecondaryAxisLength(datum[FUNNEL_VALUE_RATIO]) / 2;
    } else {
      upperLeft = this._getSecondaryAxisLength(datum[FUNNEL_VALUE_RATIO]) / 2;
      lowerLeft = this._shape === 'rect' ? upperLeft : this._getSecondaryAxisLength(datum[FUNNEL_NEXT_VALUE_RATIO]) / 2;
    }

    const { x, y } = this._getPositionByData(datum);

    const points = this._getPolygonPoints([x, y], upperLeft, lowerLeft, upperLeft, lowerLeft, heightHalf);

    if (this._funnelAlign !== 'center') {
      this._adjustPoints(points);
    }
    return points;
  }

  isTransformLevel(datum: Datum) {
    return !!datum?.[FUNNEL_TRANSFORM_LEVEL];
  }

  protected _buildMarkAttributeContext() {
    super._buildMarkAttributeContext();
    // position
    this._markAttributeContext.valueToPosition = this.valueToPosition.bind(this);
  }

  valueToPosition(category: StringOrNumber) {
    const innerDatum = this.getViewData()?.latestData?.find?.((d: Datum) => d[this._categoryField] === category);
    if (!isValid(innerDatum)) {
      return null;
    }
    return this._getPolygonCenter(this.getPoints(innerDatum));
  }

  dataToPosition(datum: any) {
    return this.valueToPosition(datum[this._categoryField]);
  }

  dataToPositionX(datum: any) {
    return this.dataToPosition(datum).x;
  }

  dataToPositionY(datum: any) {
    return this.dataToPosition(datum).y;
  }

  dataToPositionZ(datum: any) {
    return 0;
  }

  private _getMainAxisLength(isTransform = false) {
    const funnelCount = this.getViewDataStatistics().latestData[this.getCategoryField()].values.length;
    const viewHeight = this._isHorizontal() ? this.getLayoutRect().width : this.getLayoutRect().height;

    const hasTransform = !!this._spec.isTransform;
    const gap = hasTransform ? 0 : this._spec.gap ?? 0;
    const transformCount = hasTransform ? Math.max(0, funnelCount - 1) : 0;
    const funnelHeight = (viewHeight - gap * Math.max(0, funnelCount - 1)) / (funnelCount + 0.5 * transformCount);
    if (isTransform) {
      return hasTransform ? funnelHeight * 0.5 : 0;
    }
    return funnelHeight;
  }

  private _getSecondaryAxisLength(ratio: number) {
    const validRatio = Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
    const maxSize = this._computeMaxSize();
    const minSize = this._computeMinSize();
    return minSize + (maxSize - minSize) * validRatio;
  }

  /**
   * 根据数据计算主轴中心点
   * @param datum
   * @returns
   */
  private _getPositionByData(datum: Datum) {
    const index = this.getViewData().latestData?.findIndex(
      (d: Datum) => d[this._seriesField] === datum[this._seriesField]
    );
    if (!isValid(index) || index < 0) {
      return {};
    }
    const isTransform = this.isTransformLevel(datum);
    const isHorizontal = this._isHorizontal();
    const viewWidth = isHorizontal ? this.getLayoutRect().height : this.getLayoutRect().width;
    const viewHeight = isHorizontal ? this.getLayoutRect().width : this.getLayoutRect().height;
    const centerX = viewWidth / 2;

    let centerY = 0;
    const funnelHeight = this._getMainAxisLength();
    const transformHeight = this._getMainAxisLength(true);
    const offset = funnelHeight + transformHeight;

    centerY += index * offset;
    centerY += isTransform ? -transformHeight / 2 : funnelHeight / 2;
    if (!this._spec.isTransform && this._spec.gap) {
      centerY += this._spec.gap * index;
    }

    this._isReverse() && (centerY = viewHeight - centerY);

    return this._isHorizontal() ? { x: centerY, y: centerX } : { x: centerX, y: centerY };
  }

  private _getPolygonPoints(
    center: [number, number],
    upperLeft: number,
    lowerLeft: number,
    upperRight: number,
    lowerRight: number,
    heightHalf: number
  ) {
    const x = center[0];
    const y = center[1];
    switch (this._funnelOrient) {
      case 'left':
        return [
          { x: x - heightHalf, y: y + upperLeft },
          { x: x - heightHalf, y: y - upperRight },
          { x: x + heightHalf, y: y - lowerRight },
          { x: x + heightHalf, y: y + lowerLeft }
        ];
      case 'right':
        return [
          { x: x + heightHalf, y: y - upperRight },
          { x: x + heightHalf, y: y + upperRight },
          { x: x - heightHalf, y: y + lowerLeft },
          { x: x - heightHalf, y: y - lowerLeft }
        ];
      case 'bottom':
        return [
          { x: x + upperLeft, y: y + heightHalf },
          { x: x - upperRight, y: y + heightHalf },
          { x: x - lowerRight, y: y - heightHalf },
          { x: x + lowerLeft, y: y - heightHalf }
        ];
      default:
        // top
        return [
          { x: x - upperLeft, y: y - heightHalf },
          { x: x + upperRight, y: y - heightHalf },
          { x: x + lowerRight, y: y + heightHalf },
          { x: x - lowerLeft, y: y + heightHalf }
        ];
    }
  }

  /** 计算梯形中位线的中点
   * @param points
   * @returns
   */
  private _getPolygonCenter(points: IPoint[]) {
    if (this._isHorizontal()) {
      const p0_x = (points[0].x + points[3].x) / 2;
      const p0_y = (points[0].y + points[3].y) / 2;
      const p1_x = (points[1].x + points[2].x) / 2;
      const p1_y = (points[1].y + points[2].y) / 2;
      return {
        x: (p0_x + p1_x) / 2,
        y: (p0_y + p1_y) / 2
      };
    }

    // 梯形中位线坐标
    const p0_x = (points[0].x + points[3].x) / 2;
    const p0_y = (points[0].y + points[3].y) / 2;
    const p1_x = (points[1].x + points[2].x) / 2;
    const p1_y = (points[1].y + points[2].y) / 2;
    return {
      x: (p0_x + p1_x) / 2,
      y: (p0_y + p1_y) / 2
    };
  }

  /**
   * 调整点的偏移量，满足align效果
   * @param points
   * @returns
   */
  private _adjustPoints(points: IPoint[]) {
    let upperOffset;
    let lowerOffset;
    let dirKey;
    if (this._isHorizontal()) {
      dirKey = 'y';
      if (this._funnelOrient === 'left') {
        upperOffset = this._funnelAlign === 'bottom' ? -points[1].y : points[1].y;
        lowerOffset = this._funnelAlign === 'bottom' ? -points[2].y : points[2].y;
      } else {
        upperOffset = this._funnelAlign === 'bottom' ? -points[0].y : points[0].y;
        lowerOffset = this._funnelAlign === 'bottom' ? -points[3].y : points[3].y;
      }
    } else {
      dirKey = 'x';
      if (this._funnelOrient === 'top') {
        upperOffset = this._funnelAlign === 'left' ? points[0].x : -points[0].x;
        lowerOffset = this._funnelAlign === 'left' ? points[3].x : -points[3].x;
      } else {
        upperOffset = this._funnelAlign === 'left' ? points[1].x : -points[1].x;
        lowerOffset = this._funnelAlign === 'left' ? points[2].x : -points[2].x;
      }
    }
    (points[0][dirKey] -= upperOffset), (points[1][dirKey] -= upperOffset);
    (points[2][dirKey] -= lowerOffset), (points[3][dirKey] -= lowerOffset);
    return points;
  }

  private _computeLabelPosition(datum: Datum) {
    const points = this.getPoints(datum);
    return this._getPolygonCenter(points);
  }

  // label 相关
  private _computeLabelLimit(datum: Datum, labelSpec: IFunnelSeriesSpec['label']) {
    const limit = labelSpec?.limit;

    if (isNumber(limit)) {
      return limit;
    }

    const points = this.getPoints(datum);

    if (limit === 'shapeSize') {
      if (this._isHorizontal()) {
        return Math.abs(points[3].x - points[0].x);
      }

      return (Math.abs(points[0].x - points[1].x) + Math.abs(points[2].x - points[3].x)) / 2;
    }

    if (this._isHorizontal()) {
      return Math.abs(points[3].x - points[0].x);
    }

    return this._computeMaxSize();
  }

  private _computeOuterLabelPosition(datum: Datum) {
    let x;
    let y;
    let position: IOrientType = this._spec.outerLabel?.position;
    let textAlign: TextAlign = 'center';
    let textBaseline: TextBaseLine = 'middle';
    if (this._isHorizontal()) {
      position = ['top', 'bottom'].includes(position) ? position : this._funnelAlign === 'bottom' ? 'top' : 'bottom';
    } else {
      position = ['left', 'right'].includes(position) ? position : this._funnelAlign === 'left' ? 'right' : 'left';
    }

    if (this._spec.outerLabel?.alignLabel !== false) {
      ({ x, y } = this._getPositionByData(datum));
      if (position === 'left') {
        (x = 0), (textAlign = 'left');
      } else if (position === 'right') {
        (x = this.getLayoutRect().width), (textAlign = 'right');
      } else if (position === 'top') {
        (y = 0), (textBaseline = 'top');
      } else if (position === 'bottom') {
        (y = this.getLayoutRect().height), (textBaseline = 'bottom');
      }
    } else {
      const { x2, y2 } = this._computeOuterLabelLinePosition(datum);
      (x = x2), (y = y2);
      if (position === 'left') {
        (x -= FUNNEL_LABEL_SPACE_WIDTH), (textAlign = 'right');
      } else if (position === 'right') {
        (x += FUNNEL_LABEL_SPACE_WIDTH), (textAlign = 'left');
      } else if (position === 'top') {
        (y -= FUNNEL_LABEL_SPACE_WIDTH), (textBaseline = 'bottom');
      } else if (position === 'bottom') {
        (y += FUNNEL_LABEL_SPACE_WIDTH), (textBaseline = 'top');
      }
    }
    return { x, y, align: textAlign, textBaseline };
  }

  private _computeOuterLabelLimit(datum: Datum) {
    if (this._isHorizontal()) {
      return this._getMainAxisLength(this.isTransformLevel(datum));
    }

    // 垂直方向上的limit计算逻辑
    const points = this.getPoints(datum);
    const shapeMiddleWidth = (Math.abs(points[0].x - points[1].x) + Math.abs(points[2].x - points[3].x)) / 2;
    const funnelLabelBounds = this._labelMark
      ?.getProduct()
      ?.elements?.find((el: any) => el.data[0]?.[this.getCategoryField()] === datum[this.getCategoryField()])
      ?.getBounds();

    const funnelLabelWidth = funnelLabelBounds ? funnelLabelBounds.x2 - funnelLabelBounds.x1 : 0;
    return (
      this.getLayoutRect().width / 2 -
      Math.max(shapeMiddleWidth / 2, funnelLabelWidth / 2) -
      FUNNEL_LABEL_LINE_LENGTH -
      (this._spec.outerLabel?.spaceWidth ?? FUNNEL_LABEL_SPACE_WIDTH) * 2
    );
  }

  private _computeOuterLabelLinePosition(datum: Datum) {
    const categoryField = this.getCategoryField();
    const outerLabelMarkBounds = this._funnelOuterLabelMark?.label
      ?.getProduct()
      ?.elements?.find((el: any) => el.data[0]?.[categoryField] === datum[categoryField])
      ?.getBounds();
    const labelMarkBounds = this._labelMark
      ?.getProduct()
      ?.elements?.find((el: any) => el.data[0]?.[categoryField] === datum[categoryField])
      ?.getBounds();
    let x1;
    let x2;
    let y1;
    let y2;
    if (this._isHorizontal()) {
      const spaceWidth = this._spec.outerLabel?.spaceWidth ?? FUNNEL_LABEL_SPACE_WIDTH;
      const points = this.getPoints(datum);
      const shapeMiddleHeight = (Math.abs(points[0].y - points[1].y) + Math.abs(points[2].y - points[3].y)) / 2;
      if (this._spec.outerLabel.position === 'top' || this._funnelAlign === 'bottom') {
        y1 = this._getPolygonCenter(points).y - shapeMiddleHeight / 2 - spaceWidth;
        y2 = this._spec.outerLabel?.alignLabel !== false ? outerLabelMarkBounds?.y2 + spaceWidth : y1 - spaceWidth;
        x1 = this._getPolygonCenter(points).x;
        y1 - y2 < FUNNEL_LABEL_LINE_LENGTH && (y2 = y1 - FUNNEL_LABEL_LINE_LENGTH);
        x2 = x1;
      } else {
        y1 = this._getPolygonCenter(points).y + shapeMiddleHeight / 2 + spaceWidth;
        y2 = this._spec.outerLabel?.alignLabel !== false ? outerLabelMarkBounds?.y1 - spaceWidth : y1 + spaceWidth;
        x1 = this._getPolygonCenter(points).x;
        y2 - y1 < FUNNEL_LABEL_LINE_LENGTH && (y2 = y1 + FUNNEL_LABEL_LINE_LENGTH);
        x2 = x1;
      }
      return { x1, x2, y1, y2 };
    }
    const points = this.getPoints(datum);
    const shapeMiddleWidth = (Math.abs(points[0].x - points[1].x) + Math.abs(points[2].x - points[3].x)) / 2;
    const labelWidth = labelMarkBounds?.x2 - labelMarkBounds?.x1 || 0;

    const spaceWidth = this._spec.outerLabel?.spaceWidth ?? FUNNEL_LABEL_SPACE_WIDTH;
    if (this._spec.outerLabel.position === 'right' || this._funnelAlign === 'left') {
      x1 = this._getPolygonCenter(points).x + Math.max(labelWidth / 2, shapeMiddleWidth / 2) + spaceWidth;
      x2 = this._spec.outerLabel?.alignLabel !== false ? outerLabelMarkBounds?.x1 - spaceWidth : x1 + spaceWidth;
      y1 = this._getPolygonCenter(points).y;
      x2 - x1 < FUNNEL_LABEL_LINE_LENGTH && (x2 = x1 + FUNNEL_LABEL_LINE_LENGTH);
      y2 = y1;
    } else {
      x1 = this._getPolygonCenter(points).x - Math.max(labelWidth / 2, shapeMiddleWidth / 2) - spaceWidth;
      x2 = this._spec.outerLabel?.alignLabel !== false ? outerLabelMarkBounds?.x2 + spaceWidth : x1 - spaceWidth;
      y1 = this._getPolygonCenter(points).y;
      x1 - x2 < FUNNEL_LABEL_LINE_LENGTH && (x2 = x1 - FUNNEL_LABEL_LINE_LENGTH);
      y2 = y1;
    }
    return { x1, x2, y1, y2 };
  }

  protected _computeMaxSize() {
    const size = this._isHorizontal() ? this.getLayoutRect().height : this.getLayoutRect().width;
    const maxSize = this._spec.maxSize ?? FUNNEL_MAX_SIZE;
    return calcLayoutNumber(maxSize, size);
  }

  protected _computeMinSize() {
    const size = this._isHorizontal() ? this.getLayoutRect().height : this.getLayoutRect().width;
    const minSize = this._spec.minSize ?? FUNNEL_MIN_SIZE;
    return calcLayoutNumber(minSize, size);
  }

  protected _isHorizontal() {
    return this._funnelOrient === 'left' || this._funnelOrient === 'right';
  }

  private _isReverse() {
    return this._funnelOrient === 'bottom' || this._funnelOrient === 'right';
  }

  setValueFieldToStackOffsetSilhouette(): void {
    // do nothing
  }

  getDefaultShapeType(): string {
    return 'square';
  }

  updateSpec(spec: IFunnelSeriesSpec) {
    const originalSpec = this._originalSpec as IFunnelSeriesSpec;
    const { data: _originalData, ...checkOriginal } = originalSpec;
    const result = super.updateSpec(spec);
    const { data: _specData, ...checkSpec } = originalSpec;
    if (!isEqual(checkOriginal, checkSpec)) {
      result.reCompile = true;
      result.reMake = true;
      result.reRender = true;
      result.change = true;
    }
    return result;
  }
}
