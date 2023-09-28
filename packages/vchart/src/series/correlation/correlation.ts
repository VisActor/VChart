import { PolarSeries } from '../polar/polar';
import type { ICorrelationSeriesSpec } from './interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { SeriesMarkMap } from '../interface';
import { correlationSeriesMark } from './constant';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import { correlation } from '../../data/transforms/correlation';
import type { ICorrelationOpt } from '../../data/transforms/correlation';
import type { IBounds, IBoundsLike } from '@visactor/vutils';
import { isValidNumber, Bounds, Matrix, mixin, isValid } from '@visactor/vutils';
import { VChart } from '../../core/vchart';
import { SymbolMark } from '../../mark/symbol';
import { TextMark } from '../../mark/text';
import { SeriesData } from '../base/series-data';
import type {
  Maybe,
  IPoint,
  Datum,
  StateValueType,
  ISymbolMarkSpec,
  IRippleMarkSpec,
  ITextMarkSpec
} from '../../typings';
import { ICorrelationSeriesTheme } from './interface';
import { AttributeLevel, PREFIX, DEFAULT_DATA_INDEX } from '../../constant';
import { DataView, DataSet, dataViewParser } from '@visactor/vdataset';
import { addVChartProperty } from '../../data/transforms/add-property';
import { mergeSpec } from '../../util';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { IRippleMark, RippleMark } from '../../mark/ripple';

VChart.useMark([SymbolMark, TextMark, RippleMark]);

export class CorrelationSeries extends PolarSeries<any> {
  static readonly type: string = SeriesTypeEnum.correlation;
  type = SeriesTypeEnum.correlation;

  static readonly mark: SeriesMarkMap = correlationSeriesMark;

  protected declare _theme: Maybe<ICorrelationSeriesTheme>;

  protected _viewDataLabel!: SeriesData;

  private _pointMark: ISymbolMark;
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

  // protected _center!: IPoint | null;
  // public get center(): IPoint {
  //   return {
  //     x: this._spec?.centerX ?? this._region.getLayoutRect().width / 2,
  //     y: this._spec?.centerY ?? this._region.getLayoutRect().height / 2
  //   };
  // }

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

    const viewDataTransform = new DataView(this._dataSet);
    viewDataTransform.parse([this.getViewData()], {
      type: 'dataview'
    });
    viewDataTransform.name = `${PREFIX}_series_${this.id}_viewDataTransform`;

    this._viewDataTransform = new SeriesData(this._option, viewDataTransform);
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
        // innerRadius: this._spec.innerRadius ?? '20%',
        // outerRadius: this._spec.outerRadius ?? '200%',
        // startAngle: this._spec.startAngle ?? -Math.PI / 2,
        // endAngle: this._spec.endAngle ?? 0
      } as ICorrelationOpt
    });
  }

  initMark(): void {
    const pointMark = this._createMark(CorrelationSeries.mark.point, {
      groupKey: this._seriesField,
      label: mergeSpec({ animation: this._spec.animation }, this._spec.label),
      isSeriesMark: true
    }) as ISymbolMark;
    if (pointMark) {
      this._pointMark = pointMark;
    }

    const ripplePointMark = this._createMark(CorrelationSeries.mark.ripplePoint, {
      key: DEFAULT_DATA_INDEX
    }) as IRippleMark;
    if (ripplePointMark) {
      this._ripplePointMark = ripplePointMark;
    }

    const centerPointMark = this._createMark(CorrelationSeries.mark.centerPoint, {
      key: DEFAULT_DATA_INDEX
    }) as ISymbolMark;
    if (centerPointMark) {
      this._centerPointMark = centerPointMark;
    }

    const centerLabelMark = this._createMark(CorrelationSeries.mark.centerLabel, {
      key: DEFAULT_DATA_INDEX
    }) as ITextMark;
    if (centerLabelMark) {
      this._centerLabelMark = centerLabelMark;
    }
  }

  initMarkStyle(): void {
    this._initPointMarkStyle();
    this._initRipplePointMarkStyle();
    this._initCenterPointMarkStyle();
    this._initCenterLabelMarkStyle();
  }

  protected _initPointMarkStyle() {
    const pointMark = this._pointMark;
    if (!pointMark) {
      return;
    }

    this.setMarkStyle<ISymbolMarkSpec>(
      pointMark,
      {
        x: (datum: Datum) => {
          // console.log('datum-x', datum);
          return datum.x;
        },
        y: (datum: Datum) => datum.y,
        // size: 50,
        size: (datum: Datum) => {
          // console.log('datum-radius', datum);
          return datum.size;
        },
        fill: this.getColorAttribute(),
        shape: 'circle'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
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
        fill: this._spec?.ripplePoint?.style?.fill ?? '#6690F2',
        opacity: this._spec?.ripplePoint?.style?.fillOpacity ?? 0.01,
        ripple: this._spec?.ripplePoint?.style?.ripple ?? 0
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Chart
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
        fill: this._spec?.centerPoint?.style?.fill ?? '#6690F2',
        fillOpacity: this._spec?.centerPoint?.style?.fillOpacity ?? 1
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
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
        text: this._spec?.centerLabel?.style?.text ?? '输入法'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
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

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._viewBox.set(0, 0, this._region.getLayoutRect().width, this._region.getLayoutRect().height);
    this._rawData.reRunAllTransform();
    this.getViewData().reRunAllTransform();
  }
}
