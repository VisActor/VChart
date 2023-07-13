import { BarSeries } from '../bar/bar';
import { MarkTypeEnum } from '../../mark/interface';
import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import { Direction } from '../../typings/space';
import type { IRectMark } from '../../mark/rect';
import type { ITextMark } from '../../mark/text';
import { merge, valueInScaleRange } from '../../util';
import { setRectLabelPos } from '../util/label-mark';
import { AttributeLevel } from '../../constant';
import { isContinuous } from '@visactor/vscale';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import { RangeColumnSeriesTooltipHelper } from './tooltip-helper';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { Datum } from '../../typings';
import type { IRangeColumnSeriesSpec } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { PositionEnum } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { RangeColumnAppearPreset } from './animation';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class RangeColumnSeries extends BarSeries {
  static readonly type: string = SeriesTypeEnum.rangeColumn;
  type = SeriesTypeEnum.rangeColumn;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;
  protected _barName: string = SeriesTypeEnum.bar;

  static readonly mark: SeriesMarkMap = {
    ...BarSeries.mark,
    [SeriesMarkNameEnum.minLabel]: { name: SeriesMarkNameEnum.minLabel, type: MarkTypeEnum.text },
    [SeriesMarkNameEnum.maxLabel]: { name: SeriesMarkNameEnum.maxLabel, type: MarkTypeEnum.text }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  protected declare _spec: IRangeColumnSeriesSpec;

  protected _stack: boolean = false;
  private _minLabelMark?: ITextMark;
  private _maxLabelMark?: ITextMark;

  initMark(): void {
    const labelPosition = this._spec.label?.position;
    this._rectMark = this._createMark(RangeColumnSeries.mark.bar, {
      morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig('bar', this._spec)),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      label: labelPosition === PositionEnum.bothEnd ? undefined : merge({}, this._spec.label),
      isSeriesMark: true
    }) as IRectMark;

    if (labelPosition === PositionEnum.bothEnd) {
      if (this._spec.label?.visible !== false && this._spec.label?.minLabel?.visible !== false) {
        this._minLabelMark = this._createMark(RangeColumnSeries.mark.minLabel, {
          markSpec: this._spec.label?.minLabel
        }) as ITextMark;
      }
      if (this._spec.label?.visible !== false && this._spec.label?.maxLabel?.visible !== false) {
        this._maxLabelMark = this._createMark(RangeColumnSeries.mark.maxLabel, {
          markSpec: this._spec.label?.maxLabel
        }) as ITextMark;
      }
    }
  }

  initMarkStyle(): void {
    const rectMark = this._rectMark;
    if (rectMark) {
      this.setMarkStyle(
        rectMark,
        {
          fill: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );

      this._trigger.registerMark(rectMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(rectMark);
    }

    const minLabelMark = this._minLabelMark;
    const minLabelSpec = this._spec.label?.minLabel;
    if (minLabelMark) {
      this.setMarkStyle(minLabelMark, {
        fill: minLabelSpec?.style?.fill ?? this.getColorAttribute(),
        text: (datum: Datum) => {
          const min =
            this._spec.direction === Direction.horizontal ? datum[this._spec.xField[0]] : datum[this._spec.yField[0]];
          if (minLabelSpec?.formatMethod) {
            return minLabelSpec.formatMethod(min, datum);
          }
          return min;
        }
      });
      const position = minLabelSpec?.position ?? 'end';
      const offset = minLabelSpec?.offset ?? (this._direction === 'vertical' ? -20 : -25);
      setRectLabelPos(
        this,
        minLabelMark,
        position,
        offset,
        (datum: Datum) => this._rectMark.getAttribute('x', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._rectMark.getAttribute('x', datum) as number) +
                (this._rectMark.getAttribute('width', datum) as number)
            : (this._rectMark.getAttribute('x1', datum) as number);
        },
        (datum: Datum) => this._rectMark.getAttribute('y', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._rectMark.getAttribute('y1', datum) as number)
            : (this._rectMark.getAttribute('y', datum) as number) +
                (this._rectMark.getAttribute('height', datum) as number);
        },
        () => this._direction
      );
      this._tooltipHelper?.ignoreTriggerSet.mark.add(minLabelMark);
    }

    const maxLabelMark = this._maxLabelMark;
    const maxLabelSpec = this._spec.label?.maxLabel;
    if (maxLabelMark) {
      this.setMarkStyle(maxLabelMark, {
        fill: maxLabelSpec?.style?.fill ?? this.getColorAttribute(),
        text: (datum: Datum) => {
          const max =
            this._spec.direction === Direction.horizontal ? datum[this._spec.xField[1]] : datum[this._spec.yField[1]];
          if (maxLabelSpec?.formatMethod) {
            return maxLabelSpec.formatMethod(max, datum);
          }
          return max;
        }
      });
      const position = maxLabelSpec?.position ?? 'start';
      const offset = maxLabelSpec?.offset ?? (this._direction === 'vertical' ? -20 : -25);
      setRectLabelPos(
        this,
        maxLabelMark,
        position,
        offset,
        (datum: Datum) => this._rectMark.getAttribute('x', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._rectMark.getAttribute('x', datum) as number) +
                (this._rectMark.getAttribute('width', datum) as number)
            : (this._rectMark.getAttribute('x1', datum) as number);
        },
        (datum: Datum) => this._rectMark.getAttribute('y', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._rectMark.getAttribute('y1', datum) as number)
            : (this._rectMark.getAttribute('y', datum) as number) +
                (this._rectMark.getAttribute('height', datum) as number);
        },
        () => this._direction
      );
      this._tooltipHelper?.ignoreTriggerSet.mark.add(maxLabelMark);
    }
  }

  initLabelMarkStyle(labelMark: ITextMark): void {
    if (!labelMark) {
      return;
    }
    this.setMarkStyle(labelMark, {
      text: (datum: Datum) => {
        let min;
        let max;
        if (this._spec.direction === Direction.horizontal) {
          min = datum[this._spec.xField[0]];
          max = datum[this._spec.xField[1]];
        } else {
          min = datum[this._spec.yField[0]];
          max = datum[this._spec.yField[1]];
        }
        return min + '-' + max;
      },
      z: this.dataToPositionZ.bind(this)
    });
    this._tooltipHelper?.ignoreTriggerSet.mark.add(labelMark);
  }

  initBandRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);
    const { dataToPosition } = this.direction === Direction.horizontal ? this._xAxisHelper : this._yAxisHelper;
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._spec.xField[0]), {
                bandPosition: this._bandPosition
              }),
              xScale
            ),
          x1: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._spec.xField[1]), {
                bandPosition: this._bandPosition
              }),
              xScale
            ),
          y: (datum: Datum) => {
            const bandWidth =
              this.getYAxisHelper().getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ??
              DefaultBandWidth;
            const continuous = isContinuous(yScale.type || 'band');
            const pos = this.dataToPositionY(datum);
            const width = this._rectMark.getAttribute('height', datum) as number;
            return pos + (bandWidth - width) * 0.5 + (continuous ? -bandWidth / 2 : 0);
          },
          height: () => this.getBarWidth(this._yAxisHelper)
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => {
            const bandWidth =
              this.getXAxisHelper().getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ??
              DefaultBandWidth;
            const width = this._rectMark.getAttribute('width', datum) as number;
            const continuous = isContinuous(this.getXAxisHelper().getScale?.(0).type || 'band');
            const pos = this.dataToPositionX(datum);
            return pos + (bandWidth - width) / 2 + (continuous ? -bandWidth / 2 : 0);
          },
          y: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._spec.yField[0]), {
                bandPosition: this._bandPosition
              }),
              yScale
            ),
          y1: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._spec.yField[1]), {
                bandPosition: this._bandPosition
              }),
              yScale
            ),
          width: () => {
            return this.getBarWidth(this._xAxisHelper);
          }
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initAnimation() {
    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: Datum) => {
      const xValue = datum?.[this._fieldX[0]];
      const xIndex = this._viewDataStatistics?.latestData?.[this._fieldX[0]]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<RangeColumnAppearPreset>)?.preset;
    this._rectMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.rangeColumn({ direction: this.direction }, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.bar, this._spec),
        { dataIndex }
      )
    );

    if (this._minLabelMark) {
      this._minLabelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.label, this._spec), {
          dataIndex
        })
      );
    }

    if (this._maxLabelMark) {
      this._maxLabelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.label, this._spec), {
          dataIndex
        })
      );
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new RangeColumnSeriesTooltipHelper(this);
  }
}
