import { PolarSeries } from '../polar/polar';
import { ICorrelationSeriesSpec } from './interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { SeriesMarkMap } from '../interface';
import { correlationSeriesMark } from './constant';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import { correlation } from '../../data/transforms/correlation';
import type { IBounds, IBoundsLike } from '@visactor/vutils';
import { isValidNumber, Bounds, Matrix, mixin } from '@visactor/vutils';

export class CorrelationSeries<T extends ICorrelationSeriesSpec = ICorrelationSeriesSpec> extends PolarSeries<T> {
  static readonly type: string = SeriesTypeEnum.correlation;
  type = SeriesTypeEnum.correlation;

  static readonly mark: SeriesMarkMap = correlationSeriesMark;

  private _pointMark: ISymbolMark;
  private _centerPointMark: ISymbolMark;
  private _centerLabelMark: ITextMark;

  private _sizeField: ICorrelationSeriesSpec['sizeField'];
  private _sizeRange: ICorrelationSeriesSpec['sizeRange'];

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

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);
    this.setSeriesField(this._spec.seriesField ?? this._spec.categoryField);

    this._sizeField = this._spec.sizeField;
    this._sizeRange = this._spec.sizeRange;
  }

  initData() {
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
}
