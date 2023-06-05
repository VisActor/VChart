import type { IArcMark } from '../../mark/arc';
import { MarkTypeEnum } from '../../mark/interface';
import type { Maybe, Datum } from '../../typings';
import { valueInScaleRange, degrees } from '../../util';
import { SeriesTypeEnum } from '../interface';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { IRoseAnimationParams, RoseAppearPreset } from './animation';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IRoseSeriesSpec, IRoseSeriesTheme } from './interface';
import { RoseLikeSeries } from '../polar/rose-like';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { ITextMark } from '../../mark/text';
import { AttributeLevel } from '../../constant';

export const DefaultBandWidth = 0.5;

export class RoseSeries extends RoseLikeSeries<IRoseSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.rose;
  type = SeriesTypeEnum.rose;

  protected declare _theme: Maybe<IRoseSeriesTheme>;
  protected _stack: boolean = true;

  private _roseMark: IArcMark | null = null;
  protected _labelMark: ITextMark | null = null;

  initMark(): void {
    this.initRoseMark();
    this.initLabelMark();
  }

  initMarkStyle(): void {
    this.initRoseMarkStyle();
    this.initLabelMarkStyle();
  }

  // getStackValueField() {
  //   return array(this._spec.valueField)[0] || array(this._spec.radiusField)[0];
  // }

  private initRoseMark() {
    this._roseMark = this._createMark(MarkTypeEnum.arc, 'rose', {
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as IArcMark;
  }

  private initLabelMark() {
    if (this._spec?.label?.visible) {
      this._labelMark = this._createMark(MarkTypeEnum.text, 'label', {
        themeSpec: this._theme?.label,
        markSpec: {
          visible: true,
          ...this.getSpec()?.label
        }
      }) as ITextMark;
    }
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
          this.angleAxisHelper.getBandwidth(0) * 0.5,
        endAngle: (datum: Datum) =>
          this.angleAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) +
          this.getRoseAngle() -
          this.angleAxisHelper.getBandwidth(0) * 0.5,
        fill: this.getColorAttribute(),
        fillOpacity: 1,
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
      this._tooltipHelper?.activeTriggerSet.mark.add(roseMark);
    }
  }

  initLabelMarkStyle() {
    const labelMark = this._labelMark;
    if (labelMark) {
      let angle: number = 0;
      let radius: number = 0;
      this.setMarkStyle(
        labelMark,
        {
          visible: true,
          x: (datum: Datum) => {
            const baseAngle = this.angleAxisHelper.dataToPosition(
              this.getDatumPositionValues(datum, this.getGroupFields())
            );
            const bandAngle = this.angleAxisHelper.getBandwidth(0) * 0.5;
            const startAngle = baseAngle - bandAngle;
            const endAngle = baseAngle + this.getRoseAngle() - bandAngle;
            angle = (startAngle + endAngle) / 2;
            radius =
              valueInScaleRange(
                this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]),
                this.radiusAxisHelper.getScale(0)
              ) -
              (this._spec.label?.style?.size || 10) / 2;
            return this.angleAxisHelper.center().x + radius * Math.cos(angle);
          },
          y: () => this.angleAxisHelper.center().y + radius * Math.sin(angle),
          text: (datum: Datum) => {
            return datum[this._radiusField[0]];
          },
          fill: this._spec.label?.style?.fill || 'white',
          stroke: this._spec.label?.style?.stroke || this.getColorAttribute(),
          textAlign: 'center',
          textBaseline: 'middle',
          angle: () => (this._spec.label?.style?.angle || (degrees(angle) ?? 0) + 90) as number,
          fontSize: this._spec.label?.style?.fontSize || 10
        },
        undefined,
        // 标签属性基于用户配置生成，样式优先级应当为用户级
        AttributeLevel.User_Mark
      );

      this._trigger.registerMark(labelMark);
    }
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<RoseAppearPreset>)?.preset;

    if (this._roseMark) {
      const animationParams: IRoseAnimationParams = {
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0)
      };
      this._roseMark.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.rose(animationParams, appearPreset),
          userAnimationConfig(this._roseMark.name, this._spec)
        )
      );
    }
  }
}
