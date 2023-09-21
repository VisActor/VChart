import { PolarSeries } from '../polar/polar';
import type { ICorrelationSeriesSpec } from './interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { SeriesMarkMap } from '../interface';
import { correlationSeriesMark } from './constant';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import { correlation } from '../../data/transforms/correlation';
import type { IBounds, IBoundsLike } from '@visactor/vutils';
import { isValidNumber, Bounds, Matrix, mixin, isValid } from '@visactor/vutils';
import { VChart } from '../../core/vchart';
import { SymbolMark } from '../../mark/symbol';
import { TextMark } from '../../mark/text';

VChart.useMark([SymbolMark, TextMark]);

export class CorrelationSeries extends PolarSeries<any> {
  static readonly type: string = SeriesTypeEnum.correlation;
  type = SeriesTypeEnum.correlation;

  static readonly mark: SeriesMarkMap = correlationSeriesMark;

  private _pointMark: ISymbolMark;
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

    // console.log('this._dataSet', this._dataSet);

    if (this._viewDataFilter) {
      registerDataSetInstanceTransform(this._dataSet, 'correlation', correlation);

      this.addViewDataFilter({
        type: 'circularRelation',
        options: {
          view: () => {
            return {
              x0: this._viewBox.x1,
              x1: this._viewBox.x2,
              y0: this._viewBox.y1,
              y1: this._viewBox.y2
            };
          },
          field: this._spec.categoryField,
          radiusRange: this._spec.sizeRange,
          radiusField: this._spec.sizeField,
          innerRadius: this._spec.innerRadius ?? '20%'
        }
      });

      //   console.log('this.getViewData()', this.getViewData());
    }
  }

  initMark(): void {
    const pointMark = this._createMark(CorrelationSeries.mark.point, {
      isSeriesMark: true
    }) as ISymbolMark;
    if (pointMark) {
      this._pointMark = pointMark;
    }
  }

  initMarkStyle(): void {
    const pointMark = this._pointMark;
    if (!pointMark) {
      return;
    }
    this.setMarkStyle(pointMark, {
      x: 0,
      y: 0,
      fill: 'red',
      size: 10
    });
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
}
