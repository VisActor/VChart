import { AttributeLevel } from '../../../constant/attribute';
import { MarkTypeEnum } from '../../../mark/interface/type';
import type { IArcSeries, SeriesMarkMap } from '../../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IPie3dSeriesSpec } from '../interface';
import { registerArc3dMark } from '../../../mark/arc-3d';
import { BasePieSeries } from '../pie';
import { pie3dSeriesMark } from '../constant';
import { Factory } from '../../../core/factory';
import { registerPie3dAnimation } from '../animation/animation';
import { Pie3dSeriesSpecTransformer } from './pie-3d-transformer';
import type { ITextMark } from '../../../mark/interface';

export class Pie3dSeries<T extends IPie3dSeriesSpec = IPie3dSeriesSpec> extends BasePieSeries<T> implements IArcSeries {
  static readonly type: string = SeriesTypeEnum.pie3d;
  type = SeriesTypeEnum.pie3d;
  protected _pieMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.pie3d;
  protected _pieMarkType: MarkTypeEnum = MarkTypeEnum.arc3d;

  static readonly mark: SeriesMarkMap = pie3dSeriesMark;
  static readonly transformerConstructor = Pie3dSeriesSpecTransformer as any;
  readonly transformerConstructor = Pie3dSeriesSpecTransformer as any;

  protected _angle3d: number;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._angle3d = this._spec?.angle3d ?? -Math.PI / 3;
  }

  initMarkStyle(): void {
    super.initMarkStyle();
    const pieMark = this._pieMark;
    if (pieMark) {
      this.setMarkStyle(
        pieMark,
        {
          beta: () => this._angle3d
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initLabelMarkStyle(textMark: ITextMark, spec: any = {}): void {
    if (!textMark) {
      return;
    }
    super.initLabelMarkStyle(textMark);
    this.setMarkStyle(textMark, { support3d: true }, undefined, AttributeLevel.Mark);
  }
}

export const registerPie3dSeries = () => {
  registerPie3dAnimation();
  registerArc3dMark();
  Factory.registerSeries(Pie3dSeries.type, Pie3dSeries);
};
