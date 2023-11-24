/* eslint-disable no-duplicate-imports */
import type { IArcMark } from '../../mark/arc';
import type { Maybe, Datum } from '../../typings';
import { valueInScaleRange } from '../../util/scale';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { registerRoseAnimation, type IRoseAnimationParams, type RoseAppearPreset } from './animation';
import type { IRoseSeriesSpec, IRoseSeriesTheme } from './interface';
import { RoseLikeSeries } from '../polar/rose-like';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { ITextMark } from '../../mark/text';
import { ArcMark } from '../../mark/arc';
import { roseSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import type { ILabelMark } from '../../mark/label';

export const DefaultBandWidth = 0.5;

export class RoseSeries<T extends IRoseSeriesSpec = IRoseSeriesSpec> extends RoseLikeSeries<T> {
  static readonly type: string = SeriesTypeEnum.rose;
  type = SeriesTypeEnum.rose;

  static readonly mark: SeriesMarkMap = roseSeriesMark;

  protected declare _theme: Maybe<IRoseSeriesTheme>;

  protected _supportStack: boolean = true;

  private _roseMark: IArcMark | null = null;
  protected _labelMark: ITextMark | null = null;

  initMark(): void {
    this.initRoseMark();
  }

  initMarkStyle(): void {
    this.initRoseMarkStyle();
  }

  private initRoseMark() {
    this._roseMark = this._createMark(RoseSeries.mark.rose, {
      morph: shouldMarkDoMorph(this._spec, RoseSeries.mark.rose.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: true,
      label: this._preprocessLabelSpec(this._spec.label),
      customShape: this._spec.rose?.customShape
    }) as IArcMark;
  }

  private getRoseAngle() {
    const angleBandWidth =
      this.angleAxisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    return angleBandWidth;
  }

  private initRoseMarkStyle() {
    const roseMark = this._roseMark;
    if (roseMark) {
      this.setMarkStyle(roseMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: (datum: Datum) =>
          this.angleAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) -
          this.angleAxisHelper.getBandwidth(this.getGroupFields().length - 1) * 0.5,
        endAngle: (datum: Datum) =>
          this.angleAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) +
          this.getRoseAngle() -
          this.angleAxisHelper.getBandwidth(this.getGroupFields().length - 1) * 0.5,
        fill: this.getColorAttribute(),
        outerRadius: (datum: Datum) =>
          valueInScaleRange(
            this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]),
            this.radiusAxisHelper.getScale(0)
          ),
        innerRadius: (datum: Datum) => {
          if (!this._stack) {
            return 0;
          }
          const stackStart = valueInScaleRange(
            this.radiusAxisHelper.dataToPosition([datum[this._innerRadiusField[0]]]),
            this.radiusAxisHelper.getScale(0)
          );
          return stackStart <= Number.MIN_VALUE
            ? this._computeLayoutRadius() * (this._spec.innerRadius ?? 0)
            : stackStart;
        }
      });
      this._trigger.registerMark(roseMark);
    }
  }

  protected initTooltip() {
    super.initTooltip();

    this._roseMark && this._tooltipHelper.activeTriggerSet.mark.add(this._roseMark);
  }

  initLabelMarkStyle(textMark: ILabelMark) {
    if (!textMark) {
      return;
    }
    this.setMarkStyle(textMark, {
      visible: this._spec?.label?.visible,
      text: (datum: Datum) => {
        return datum[this.getDimensionField()[0]];
      },
      fill: this._spec.label?.style?.fill || this.getColorAttribute(),
      angle: this._spec.label?.style?.angle,
      limit: this._spec.label?.style?.limit,
      z: 0
    });
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<RoseAppearPreset>)?.preset;

    if (this._roseMark) {
      const animationParams: IRoseAnimationParams = {
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0)
      };
      this._roseMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('rose')?.(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.rose, this._spec, this._markAttributeContext)
        )
      );
    }
  }

  getDefaultShapeType() {
    return 'circle';
  }

  getActiveMarks(): IMark[] {
    return [this._roseMark];
  }
}

export const registerRoseSeries = () => {
  Factory.registerMark(ArcMark.type, ArcMark);
  Factory.registerSeries(RoseSeries.type, RoseSeries);
  registerRoseAnimation();
};
