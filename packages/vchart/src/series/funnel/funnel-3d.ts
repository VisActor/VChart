/* eslint-disable no-duplicate-imports */
import type { Maybe } from '@visactor/vutils';
import { AttributeLevel } from '../../constant';
import { MarkTypeEnum } from '../../mark/interface';
import type { IPyramid3dMark } from '../../mark/polygon/pyramid-3d';
import type { IRuleMark } from '../../mark/rule';
import type { ITextMark } from '../../mark/text';
import { BaseSeries } from '../base/base-series';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum, SeriesMarkNameEnum } from '../interface';
import { FunnelSeries } from './funnel';
import type { IFunnel3dSeriesSpec, IFunnel3dSeriesTheme } from './interface';
import { VChart } from '../../core/vchart';
import { Pyramid3dMark } from '../../mark/polygon/pyramid-3d';
import { TextMark } from '../../mark/text';
import { RuleMark } from '../../mark/rule';
import type { AdaptiveSpec } from '../../typings';

VChart.useMark([Pyramid3dMark, TextMark, RuleMark]);

export class Funnel3dSeries<T extends IFunnel3dSeriesSpec = IFunnel3dSeriesSpec> extends FunnelSeries<
  AdaptiveSpec<T, 'type'>
> {
  static readonly type: string = SeriesTypeEnum.funnel3d;
  type = SeriesTypeEnum.funnel3d;
  protected _funnelMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.funnel3d;
  protected _funnelMarkType: MarkTypeEnum = MarkTypeEnum.pyramid3d;
  protected _transformMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.transform3d;
  protected _transformMarkType: MarkTypeEnum = MarkTypeEnum.pyramid3d;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.funnel3d]: { name: SeriesMarkNameEnum.funnel3d, type: MarkTypeEnum.pyramid3d },
    [SeriesMarkNameEnum.transform3d]: { name: SeriesMarkNameEnum.transform3d, type: MarkTypeEnum.pyramid3d },
    [SeriesMarkNameEnum.transformLabel]: { name: SeriesMarkNameEnum.transformLabel, type: MarkTypeEnum.text },
    [SeriesMarkNameEnum.outerLabel]: { name: SeriesMarkNameEnum.outerLabel, type: MarkTypeEnum.text },
    [SeriesMarkNameEnum.outerLabelLine]: { name: SeriesMarkNameEnum.outerLabelLine, type: MarkTypeEnum.rule }
  };

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
        isSeriesMark: true
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
    if (this._spec?.label?.visible) {
      this._labelMark = this._createMark(Funnel3dSeries.mark.label, {
        themeSpec: this._theme?.label,
        key: this._seriesField,
        support3d: this._spec.label.support3d
      });
    }
    if (this._spec?.transformLabel?.visible) {
      this._transformLabelMark = this._createMark(Funnel3dSeries.mark.transformLabel, {
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

      this._funnelOuterLabelMark.label = this._createMark(Funnel3dSeries.mark.outerLabel, {
        themeSpec: this._theme?.outerLabel,
        key: this._seriesField,
        markSpec: this._spec.outerLabel,
        depend: this._labelMark
      }) as ITextMark;

      this._funnelOuterLabelMark.line = this._createMark(Funnel3dSeries.mark.outerLabelLine, {
        themeSpec: lineTheme,
        key: this._seriesField,
        markSpec: line,
        depend: [this._funnelOuterLabelMark.label, this._labelMark]
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

    const labelMark = this._labelMark;
    if (labelMark) {
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
    }
  }
}
