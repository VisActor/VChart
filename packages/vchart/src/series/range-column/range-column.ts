import { BarSeries } from '../bar/bar';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { Direction } from '../../typings/space';
import { RectMark, type IRectMark } from '../../mark/rect';
import { TextMark, type ITextMark } from '../../mark/text';
import { valueInScaleRange } from '../../util/scale';
import { mergeSpec } from '../../util/spec/merge-spec';
import { setRectLabelPos } from '../util/label-mark';
import { AttributeLevel } from '../../constant';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import { RangeColumnSeriesTooltipHelper } from './tooltip-helper';
import { registerFadeInOutAnimation } from '../../animation/config';
import type { Datum } from '../../typings';
import type { IRangeColumnSeriesSpec } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { PositionEnum } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import { registerRangeColumnAnimation, type RangeColumnAppearPreset } from './animation';
import { rangeColumnSeriesMark } from './constant';
import { Factory } from '../../core/factory';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class RangeColumnSeries<T extends IRangeColumnSeriesSpec = IRangeColumnSeriesSpec> extends BarSeries<any> {
  static readonly type: string = SeriesTypeEnum.rangeColumn;
  type = SeriesTypeEnum.rangeColumn;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;
  protected _barName: string = SeriesTypeEnum.bar;

  protected declare _spec: T;

  static readonly mark: SeriesMarkMap = rangeColumnSeriesMark;

  protected _stack: boolean = false;
  private _minLabelMark?: ITextMark;
  private _maxLabelMark?: ITextMark;
  private _labelMark?: ITextMark;

  initMark(): void {
    this._initBarBackgroundMark();

    const labelPosition = this._spec.label?.position;
    this._barMark = this._createMark(RangeColumnSeries.mark.bar, {
      morph: shouldMarkDoMorph(this._spec, RangeColumnSeries.mark.bar.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      label: labelPosition === PositionEnum.bothEnd ? undefined : this._preprocessLabelSpec(this._spec.label),
      isSeriesMark: true,
      customShape: this._spec.bar?.customShape
    }) as IRectMark;

    if (this._spec.label?.visible !== false && labelPosition === PositionEnum.bothEnd) {
      if (this._spec.label?.minLabel?.visible !== false) {
        this._minLabelMark = this._createMark(RangeColumnSeries.mark.minLabel, {
          markSpec: this._spec.label?.minLabel
        }) as ITextMark;
      }
      if (this._spec.label?.maxLabel?.visible !== false) {
        this._maxLabelMark = this._createMark(RangeColumnSeries.mark.maxLabel, {
          markSpec: this._spec.label?.maxLabel
        }) as ITextMark;
      }
    }
  }

  initMarkStyle(): void {
    super.initMarkStyle();

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
        (datum: Datum) => this._barMark.getAttribute('x', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._barMark.getAttribute('x', datum) as number) +
                (this._barMark.getAttribute('width', datum) as number)
            : (this._barMark.getAttribute('x1', datum) as number);
        },
        (datum: Datum) => this._barMark.getAttribute('y', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._barMark.getAttribute('y1', datum) as number)
            : (this._barMark.getAttribute('y', datum) as number) +
                (this._barMark.getAttribute('height', datum) as number);
        },
        () => this._direction
      );
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
        (datum: Datum) => this._barMark.getAttribute('x', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._barMark.getAttribute('x', datum) as number) +
                (this._barMark.getAttribute('width', datum) as number)
            : (this._barMark.getAttribute('x1', datum) as number);
        },
        (datum: Datum) => this._barMark.getAttribute('y', datum) as number,
        (datum: Datum) => {
          return this._direction === 'vertical'
            ? (this._barMark.getAttribute('y1', datum) as number)
            : (this._barMark.getAttribute('y', datum) as number) +
                (this._barMark.getAttribute('height', datum) as number);
        },
        () => this._direction
      );
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
      z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
    });
    this._labelMark = labelMark;
  }

  initBandRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);
    const { dataToPosition } = this.direction === Direction.horizontal ? this._xAxisHelper : this._yAxisHelper;
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._barMark,
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
          y: (datum: Datum) => this._getPosition(this.direction, datum),
          height: () => this._getBarWidth(this._yAxisHelper)
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._barMark,
        {
          x: (datum: Datum) => this._getPosition(this.direction, datum),
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
            return this._getBarWidth(this._xAxisHelper);
          }
        },
        'normal',
        AttributeLevel.Series
      );
    }
    this._initBarBackgroundMarkStyle();
  }

  initAnimation() {
    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: Datum) => {
      const xValue = datum?.[this._fieldX[0]];
      const xIndex = this.getViewDataStatistics()?.latestData?.[this._fieldX[0]]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };
    const dataCount = () => {
      return this.getViewDataStatistics()?.latestData?.[this._fieldX[0]]?.values?.length ?? 0;
    };

    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<RangeColumnAppearPreset>)?.preset;
    this._barMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('rangeColumn')?.({ direction: this.direction }, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.bar, this._spec, this._markAttributeContext),
        { dataIndex, dataCount }
      )
    );

    if (this._minLabelMark) {
      this._minLabelMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('fadeInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.label, this._spec, this._markAttributeContext),
          { dataIndex, dataCount }
        )
      );
    }

    if (this._maxLabelMark) {
      this._maxLabelMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('fadeInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.label, this._spec, this._markAttributeContext),
          { dataIndex, dataCount }
        )
      );
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new RangeColumnSeriesTooltipHelper(this);
    this._minLabelMark && this._tooltipHelper.ignoreTriggerSet.mark.add(this._minLabelMark);
    this._maxLabelMark && this._tooltipHelper.ignoreTriggerSet.mark.add(this._maxLabelMark);
    this._labelMark && this._tooltipHelper.ignoreTriggerSet.mark.add(this._labelMark);
  }
}

export const registerRangeColumnSeries = () => {
  Factory.registerMark(RectMark.type, RectMark);
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(RangeColumnSeries.type, RangeColumnSeries);
  registerRangeColumnAnimation();
  registerFadeInOutAnimation();
};
