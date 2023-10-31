/* eslint-disable no-duplicate-imports */
import type { Maybe } from '@visactor/vutils';
import { AttributeLevel } from '../../constant';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { IPyramid3dMark } from '../../mark/polygon/pyramid-3d';
import type { IRuleMark } from '../../mark/rule';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum, SeriesMarkNameEnum } from '../interface/type';
import { FunnelSeries } from './funnel';
import type { IFunnel3dSeriesSpec, IFunnel3dSeriesTheme } from './interface';
import { Pyramid3dMark } from '../../mark/polygon/pyramid-3d';
import { TextMark } from '../../mark/text';
import { RuleMark } from '../../mark/rule';
import type { AdaptiveSpec } from '../../typings';
import { funnel3dSeriesMark } from './constant';
import type { ILabelMark } from '../../mark/label';
import { Factory } from '../../core/factory';

export class Funnel3dSeries<T extends IFunnel3dSeriesSpec = IFunnel3dSeriesSpec> extends FunnelSeries<
  AdaptiveSpec<T, 'type'>
> {
  static readonly type: string = SeriesTypeEnum.funnel3d;
  type = SeriesTypeEnum.funnel3d;
  protected _funnelMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.funnel3d;
  protected _funnelMarkType: MarkTypeEnum = MarkTypeEnum.pyramid3d;
  protected _transformMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.transform3d;
  protected _transformMarkType: MarkTypeEnum = MarkTypeEnum.pyramid3d;

  static readonly mark: SeriesMarkMap = funnel3dSeriesMark;

  protected declare _theme: Maybe<IFunnel3dSeriesTheme>;

  initMark() {
    this._funnelMark = this._createMark(
      {
        ...Funnel3dSeries.mark.funnel3d,
        name: this._funnelMarkName,
        type: this._funnelMarkType
      },
      {
        themeSpec: this._theme?.funnel3d,
        key: this._seriesField,
        isSeriesMark: true,
        label: this._spec.label,
        support3d: true
      }
    ) as IPyramid3dMark;

    if (this._spec.isTransform) {
      this._funnelTransformMark = this._createMark(
        {
          ...Funnel3dSeries.mark.transform3d,
          name: this._transformMarkName,
          type: this._transformMarkType
        },
        {
          themeSpec: this._theme?.transform3d,
          key: this._seriesField,
          skipBeforeLayouted: false,
          dataView: this._viewDataTransform.getDataView(),
          dataProductId: this._viewDataTransform.getProductId()
        }
      );
    }

    if (this._spec?.outerLabel?.visible) {
      const { line } = this._spec.outerLabel ?? {};
      const { line: lineTheme } = this._theme?.outerLabel ?? {};

      this._funnelOuterLabelMark.label = this._createMark(Funnel3dSeries.mark.outerLabel, {
        themeSpec: this._theme?.outerLabel,
        key: this._seriesField,
        markSpec: this._spec.outerLabel
      }) as ITextMark;

      this._funnelOuterLabelMark.line = this._createMark(Funnel3dSeries.mark.outerLabelLine, {
        themeSpec: lineTheme,
        key: this._seriesField,
        markSpec: line,
        depend: [this._funnelOuterLabelMark.label]
      }) as IRuleMark;
    }
  }

  initMarkStyle() {
    super.initMarkStyle();
    const funnelMark = this._funnelMark;
    if (funnelMark) {
      this.setMarkStyle(
        funnelMark,
        {
          z: _ => {
            if (this._isHorizontal()) {
              return 0;
            }
            const points = this.getPoints(_);
            const width = Math.max(Math.abs(points[0].x - points[1].x), Math.abs(points[2].x - points[3].x));
            return (this._computeMaxSize() - width) / 2;
          }
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initLabelMarkStyle(labelMark?: ILabelMark) {
    super.initLabelMarkStyle(labelMark);

    this.setMarkStyle(
      labelMark,
      {
        z: _ => {
          if (this._isHorizontal()) {
            return 0;
          }
          const points = this.getPoints(_);
          const width = Math.max(Math.abs(points[0].x - points[1].x), Math.abs(points[2].x - points[3].x));
          return (this._computeMaxSize() - width) / 2;
        }
      },
      'normal',
      AttributeLevel.Series
    );

    this._labelMark = labelMark;

    if (this._funnelOuterLabelMark?.label) {
      this._funnelOuterLabelMark.label.setDepend(labelMark.getComponent());
    }

    if (this._funnelOuterLabelMark?.line) {
      this._funnelOuterLabelMark.line.setDepend(...this._funnelOuterLabelMark.line.getDepend());
    }
  }
}

export const registerFunnel3dSeries = () => {
  Factory.registerMark(Pyramid3dMark.type, Pyramid3dMark);
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerMark(RuleMark.type, RuleMark);
  Factory.registerSeries(Funnel3dSeries.type, Funnel3dSeries);
};
