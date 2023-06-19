import { AreaSeries } from '../area/area';
import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../interface';
import type { IAreaMark } from '../../mark/area';
import { DEFAULT_SMOOTH_INTERPOLATE } from '../../typings/interpolate';
import { Direction } from '../../typings/space';
import type { Datum } from '../../typings';
import { couldBeValidNumber } from '../../util';
import { AttributeLevel } from '../../constant';
import { RangeAreaSeriesTooltipHelper } from './tooltip-helper';

export class RangeAreaSeries extends AreaSeries {
  static readonly type: string = SeriesTypeEnum.rangeArea;
  type = SeriesTypeEnum.rangeArea;

  static readonly mark: SeriesMarkMap = {
    ...AreaSeries.mark
  };

  initMark(): void {
    // area
    this._areaMark = this._createMark(RangeAreaSeries.mark.area, {
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as IAreaMark;
  }

  initMarkStyle(): void {
    const userCurveType = this.getSpec().area?.style?.curveType ?? this.getSpec().line?.style?.curveType;
    const curveType =
      userCurveType === DEFAULT_SMOOTH_INTERPOLATE
        ? this._direction === Direction.vertical
          ? 'monotoneX'
          : 'monotoneY'
        : userCurveType;

    // area
    const areaMark = this._areaMark;
    if (areaMark) {
      if (this._direction === Direction.vertical) {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            y1: (datum: Datum) => {
              if (!this._yAxisHelper) {
                return Number.NaN;
              }
              const { dataToPosition } = this._yAxisHelper;

              return dataToPosition(this.getDatumPositionValues(datum, this._spec.yField[1]), {
                bandPosition: this._bandPosition
              });
            },
            y: this.dataToPositionY.bind(this)
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            x1: (datum: Datum) => {
              if (!this._xAxisHelper) {
                return Number.NaN;
              }
              const { dataToPosition } = this._xAxisHelper;

              return dataToPosition(this.getDatumPositionValues(datum, this._spec.xField[1]), {
                bandPosition: this._bandPosition
              });
            },
            y: this.dataToPositionY.bind(this),
            orient: this._direction
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this.setMarkStyle(
        areaMark,
        {
          fill: this.getColorAttribute(),
          defined: (datum: Datum) => {
            if (this._invalidType === 'break') {
              return couldBeValidNumber(datum[this.getStackValueField()]);
            }
            return true;
          }
        },
        'normal',
        AttributeLevel.Series
      );
      this.setMarkStyle(
        areaMark,
        {
          curveType
        },
        'normal',
        AttributeLevel.Built_In
      );
      this._trigger.registerMark(areaMark);
      this._tooltipHelper.activeTriggerSet.dimension.add(areaMark);
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new RangeAreaSeriesTooltipHelper(this);
  }
}
