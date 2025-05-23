/* eslint-disable no-duplicate-imports */
import { AttributeLevel } from '../../../constant/attribute';
import { MarkTypeEnum } from '../../../mark/interface/type';
import type { SeriesMarkMap } from '../../interface';
import { SeriesTypeEnum, SeriesMarkNameEnum } from '../../interface/type';
import { FunnelSeries } from '../funnel';
import type { IFunnel3dSeriesSpec } from '../interface';
import { registerPyramid3dMark } from '../../../mark/polygon/pyramid-3d';
import { registerTextMark } from '../../../mark/text';
import { registerRuleMark } from '../../../mark/rule';
import type { AdaptiveSpec } from '../../../typings';
import { funnel3dSeriesMark } from '../constant';
import { Factory } from '../../../core/factory';
import { Funnel3dSeriesSpecTransformer } from './funnel-3d-transformer';
import type { ILabelMark, IPyramid3dMark, IRuleMark, ITextMark } from '../../../mark/interface';

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
  static readonly transformerConstructor = Funnel3dSeriesSpecTransformer as any;
  readonly transformerConstructor = Funnel3dSeriesSpecTransformer as any;

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
      },
      {
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
  registerPyramid3dMark();
  registerTextMark();
  registerRuleMark();
  Factory.registerSeries(Funnel3dSeries.type, Funnel3dSeries);
};
