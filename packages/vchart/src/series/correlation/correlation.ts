import { PolarSeries } from '../polar/polar';
import type { ICorrelationSeriesSpec } from './interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { SeriesMarkMap } from '../interface';
import { correlationSeriesMark } from './constant';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import { correlation } from '../../data/transforms/correlation';
import { correlationCenter } from '../../data/transforms/correlation-center';
import type { ICorrelationOpt } from '../../data/transforms/correlation';
import type { IBounds } from '@visactor/vutils';
import { Bounds, isValid } from '@visactor/vutils';
import { VChart } from '../../core/vchart';
import { SymbolMark } from '../../mark/symbol';
import { TextMark } from '../../mark/text';
import { SeriesData } from '../base/series-data';
import type { Maybe, Datum, ISymbolMarkSpec, IRippleMarkSpec, ITextMarkSpec } from '../../typings';
import { ICorrelationSeriesTheme } from './interface';
import { AttributeLevel, DEFAULT_DATA_INDEX, LayoutZIndex } from '../../constant';
import { DataView, DataSet, dataViewParser } from '@visactor/vdataset';
import { mergeSpec } from '../../util';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { IRippleMark, RippleMark } from '../../mark/ripple';
import type { ILabelMark } from '../../mark/label';
import { CORRELATION_X, CORRELATION_Y, CORRELATION_SIZE } from '../../constant';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';

VChart.useMark([SymbolMark, TextMark, RippleMark]);

export class CorrelationSeries extends PolarSeries<any> {
  static readonly type: string = SeriesTypeEnum.correlation;
  type = SeriesTypeEnum.correlation;

  static readonly mark: SeriesMarkMap = correlationSeriesMark;

  protected declare _theme: Maybe<ICorrelationSeriesTheme>;

  protected _centerSeriesData: SeriesData;

  private _nodePointMark: ISymbolMark;
  private _ripplePointMark: IRippleMark;
  private _centerPointMark: ISymbolMark;
  private _centerLabelMark: ITextMark;

  private _viewBox: IBounds = new Bounds();

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

  protected _seriesField?: string;
  getSeriesField() {
    return this._seriesField;
  }
  setSeriesField(field: string) {
    if (isValid(field)) {
      this._seriesField = field;
    }
  }

  protected _sizeField?: ICorrelationSeriesSpec['sizeField'];
  getSizeField() {
    return this._sizeField;
  }
  setSizeField(field: string) {
    if (isValid(field)) {
      this._sizeField = field;
    }
  }

  protected _sizeRange?: ICorrelationSeriesSpec['sizeRange'];
  getSizeRange() {
    return this._sizeRange;
  }
  setSizeRange(range: number[]) {
    if (isValid(range)) {
      this._sizeRange = range;
    }
  }

  protected _viewDataTransform!: SeriesData;

  setAttrFromSpec() {
    super.setAttrFromSpec();

    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);

    this.setSeriesField(this._spec.seriesField);
    this.setSizeField(this._spec.sizeField);
    this.setSizeRange(this._spec.sizeRange);
  }

  protected initData() {
    super.initData();

    if (!this._data) {
      return;
    }

    registerDataSetInstanceTransform(this._dataSet, 'correlation', correlation);

    const centerDataSet = new DataSet();
    registerDataSetInstanceParser(centerDataSet, 'dataview', dataViewParser);
    registerDataSetInstanceTransform(centerDataSet, 'correlationCenter', correlationCenter);
    const centerDataView = new DataView(centerDataSet);
    centerDataView.parse([this.getViewData()], {
      type: 'dataview'
    });
    centerDataView.transform({
      type: 'correlationCenter',
      options: {
        keyword: this._spec?.centerLabel?.style?.text ?? '关键词',
        categoryField: this._spec.categoryField
      }
    });

    this._centerSeriesData = new SeriesData(this._option, centerDataView);
  }

  protected _statisticViewData(): void {
    super._statisticViewData();
    this._data.getDataView().transform({
      type: 'correlation',
      options: {
        view: () => {
          return {
            x0: this._viewBox.x1,
            x1: this._viewBox.x2,
            y0: this._viewBox.y1,
            y1: this._viewBox.y2
          };
        },
        field: this._spec.valueField,
        radiusRange: this._spec.sizeRange,
        radiusField: this._spec.sizeField,
        center: [this._spec.centerX, this._spec.centerY],
        innerRadius: this._spec.innerRadius,
        outerRadius: this._spec.outerRadius,
        startAngle: this._spec.startAngle,
        endAngle: this._spec.endAngle
      } as ICorrelationOpt
    });
  }

  initMark(): void {
    const nodePointMark = this._createMark(CorrelationSeries.mark.nodePoint, {
      groupKey: this._seriesField,
      label: mergeSpec({ animation: this._spec.animation }, this._spec.label),
      isSeriesMark: true,
      key: DEFAULT_DATA_INDEX
    }) as ISymbolMark;
    if (nodePointMark) {
      nodePointMark.setZIndex(LayoutZIndex.Node);
      this._nodePointMark = nodePointMark;
    }

    const ripplePointMark = this._createMark(CorrelationSeries.mark.ripplePoint, {
      key: DEFAULT_DATA_INDEX,
      dataView: this._centerSeriesData.getDataView(),
      dataProductId: this._centerSeriesData.getProductId()
    }) as IRippleMark;
    if (ripplePointMark) {
      this._ripplePointMark = ripplePointMark;
    }

    const centerPointMark = this._createMark(CorrelationSeries.mark.centerPoint, {
      key: DEFAULT_DATA_INDEX,
      dataView: this._centerSeriesData.getDataView(),
      dataProductId: this._centerSeriesData.getProductId()
    }) as ISymbolMark;
    if (centerPointMark) {
      centerPointMark.setZIndex(LayoutZIndex.Node);
      this._centerPointMark = centerPointMark;
    }

    const centerLabelMark = this._createMark(CorrelationSeries.mark.centerLabel, {
      key: DEFAULT_DATA_INDEX,
      dataView: this._centerSeriesData.getDataView(),
      dataProductId: this._centerSeriesData.getProductId()
    }) as ITextMark;
    if (centerLabelMark) {
      centerLabelMark.setZIndex(LayoutZIndex.Label);
      this._centerLabelMark = centerLabelMark;
    }
  }

  initMarkStyle(): void {
    this._initNodePointMarkStyle();
    this._initRipplePointMarkStyle();
    this._initCenterPointMarkStyle();
    this._initCenterLabelMarkStyle();
  }

  protected _initNodePointMarkStyle() {
    const nodePointMark = this._nodePointMark;
    if (!nodePointMark) {
      return;
    }

    this.setMarkStyle<ISymbolMarkSpec>(
      nodePointMark,
      {
        x: (datum: Datum) => datum[CORRELATION_X],
        y: (datum: Datum) => datum[CORRELATION_Y],
        size: (datum: Datum) => datum[CORRELATION_SIZE],
        fill: this._spec?.nodePoint?.style?.fill ?? this.getColorAttribute(),
        fillOpacity: this._spec?.nodePoint?.style?.fillOpacity ?? 1,
        lineWidth: 0
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );

    this._trigger.registerMark(nodePointMark);

    this._tooltipHelper?.activeTriggerSet.mark.add(nodePointMark);
  }

  protected _initRipplePointMarkStyle() {
    const ripplePointMark = this._ripplePointMark;
    if (!ripplePointMark) {
      return;
    }

    this.setMarkStyle<IRippleMarkSpec>(
      ripplePointMark,
      {
        x: () => {
          return (this._viewBox.x1 + this._viewBox.x2) / 2;
        },
        y: () => {
          return (this._viewBox.y1 + this._viewBox.y2) / 2;
        },
        size: () => {
          return Math.max(this._viewBox.x2 - this._viewBox.x1, this._viewBox.y2 - this._viewBox.y1) / 2;
        },
        fill: this._spec?.ripplePoint?.style?.fill ?? this.getColorAttribute(),
        opacity: this._spec?.ripplePoint?.style?.fillOpacity ?? 0.2,
        ripple: this._spec?.ripplePoint?.style?.ripple ?? 0
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  protected _initCenterPointMarkStyle() {
    const centerPointMark = this._centerPointMark;
    if (!centerPointMark) {
      return;
    }

    this.setMarkStyle<ISymbolMarkSpec>(
      centerPointMark,
      {
        x: () => {
          return (this._viewBox.x1 + this._viewBox.x2) / 2;
        },
        y: () => {
          return (this._viewBox.y1 + this._viewBox.y2) / 2;
        },
        size: () => {
          return (0.2 * Math.max(this._viewBox.x2 - this._viewBox.x1, this._viewBox.y2 - this._viewBox.y1)) / 2;
        },
        fill: this._spec?.centerPoint?.style?.fill ?? this.getColorAttribute(),
        fillOpacity: this._spec?.centerPoint?.style?.fillOpacity ?? 1
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );

    this._trigger.registerMark(centerPointMark);

    this._tooltipHelper?.activeTriggerSet.mark.add(centerPointMark);
  }

  protected _initCenterLabelMarkStyle() {
    const centerLabelMark = this._centerLabelMark;
    if (!centerLabelMark) {
      return;
    }

    this.setMarkStyle<ITextMarkSpec>(
      centerLabelMark,
      {
        x: () => {
          return (this._viewBox.x1 + this._viewBox.x2) / 2;
        },
        y: () => {
          return (this._viewBox.y1 + this._viewBox.y2) / 2;
        },

        fill: this._spec?.centerLabel?.style?.fill ?? '#fff',
        fontSize: this._spec?.centerLabel?.style?.fontSize ?? 20,
        textAlign: this._spec?.centerLabel?.style?.textAlign ?? 'center',
        textBaseline: this._spec?.centerLabel?.style?.textBaseline ?? 'middle',
        text: this._spec?.centerLabel?.style?.text ?? '关键词'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  initLabelMarkStyle(labelMark?: ILabelMark): void {
    if (!labelMark) {
      return;
    }
    this.setMarkStyle(
      labelMark,
      {
        fill: this._spec?.label?.style?.fill ?? this.getColorAttribute(),
        text: (datum: Datum) => {
          return datum[this._categoryField];
        },
        z: this.dataToPositionZ.bind(this)
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  initAnimation() {
    if (this._nodePointMark) {
      this._nodePointMark.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.correlation(),
          userAnimationConfig(SeriesMarkNameEnum.nodePoint, this._spec)
        )
      );
    }
  }

  getGroupFields(): string[] {
    return [];
  }
  getStackGroupFields(): string[] {
    return [];
  }
  getStackValueField(): string {
    return '';
  }
  setValueFieldToStack(): void {
    return;
  }
  setValueFieldToPercent(): void {
    return;
  }

  /** 获取维度field */
  getDimensionField(): string[] {
    return [this._categoryField];
  }
  /** 获取指标field */
  getMeasureField(): string[] {
    return [this._valueField];
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._viewBox.set(0, 0, this._region.getLayoutRect().width, this._region.getLayoutRect().height);
    this._rawData.reRunAllTransform();
    this.getViewData().reRunAllTransform();
  }
}
