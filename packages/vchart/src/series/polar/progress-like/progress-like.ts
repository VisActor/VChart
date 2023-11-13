import type { Datum } from '@visactor/vgrammar-core';
import { degreeToRadian, isNil, isValid, isValidNumber } from '@visactor/vutils';
import {
  AttributeLevel,
  POLAR_END_RADIAN,
  POLAR_START_RADIAN,
  SEGMENT_FIELD_START,
  STACK_FIELD_END,
  STACK_FIELD_START
} from '../../../constant';
import type { IMarkStyle } from '../../../mark/interface';
import type { ConvertToMarkStyleSpec, ICommonSpec } from '../../../typings';
import { valueInScaleRange } from '../../../util/scale';
// import { preprocessSpecOrTheme } from '../../../util/spec/preprocess';
import { PolarSeries } from '../polar';
import type { IContinuousTickData, IProgressLikeSeriesSpec } from './interface';
import type { IPolarAxis, IPolarAxisSpec } from '../../../component/axis';
import type { IGroupMark } from '../../../mark/group';
import { createArc, createRect } from '@visactor/vrender-core';
import type { SeriesMarkMap } from '../../interface';
import { progressLikeSeriesMark } from './constant';
import { binaryFuzzySearch } from '@visactor/vutils-extension';

export abstract class ProgressLikeSeries<T extends IProgressLikeSeriesSpec> extends PolarSeries<T> {
  static readonly mark: SeriesMarkMap = progressLikeSeriesMark;

  protected _supportStack: boolean = true;

  protected _startAngle: number;
  protected _endAngle: number;

  protected _arcGroupMark: IGroupMark | null = null;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    const chartSpec = this._option.globalInstance.getChart()?.getSpec() as any;
    const startAngle = this._spec.startAngle ?? chartSpec?.startAngle;
    this._startAngle = isValid(startAngle) ? degreeToRadian(startAngle) : POLAR_START_RADIAN;
    const endAngle = this._spec.endAngle ?? chartSpec?.endAngle;
    this._endAngle = isValid(endAngle) ? degreeToRadian(endAngle) : POLAR_END_RADIAN;

    // 值信息给角度
    this.setAngleField(this._spec.valueField || this._spec.angleField);
    // 分类信息给半径
    this.setRadiusField(this._spec.categoryField || this._spec.radiusField);
  }

  getStackGroupFields(): string[] {
    return this._radiusField;
  }

  getStackValueField() {
    return this._angleField?.[0];
  }

  getGroupFields() {
    return this._angleField;
  }

  /** 重载 mark style 赋值前转换逻辑 */
  protected _convertMarkStyle<T extends ICommonSpec = ICommonSpec>(
    style: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>
  ): Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>> {
    const newStyle = super._convertMarkStyle(style) as unknown as any;

    const fillKey = 'fill';
    if (newStyle[fillKey]) {
      const value = style[fillKey] as unknown as any;
      // 为环形渐变色自动加 startAngle 和 endAngle
      if (value?.gradient === 'conical' && !isValid(value?.startAngle) && !isValid(value?.endAngle)) {
        newStyle[fillKey] = {
          ...value,
          startAngle: this._startAngle,
          endAngle: this._endAngle
        };
      }
    }

    return newStyle;
  }

  protected _getAngleValueStart = (datum: Datum) => {
    const axis = this._getAngleAxis();
    const { tickMask } = this._spec;

    if (tickMask?.forceAlign && this._isTickMaskVisible(axis)) {
      const field = this._stack ? STACK_FIELD_START : SEGMENT_FIELD_START;
      const originValue = datum[field];
      const subTickData = this._getAngleAxisSubTickData(axis);
      const step = subTickData[1].value - subTickData[0].value;
      const offsetAngle = degreeToRadian(tickMask.offsetAngle);

      let pos: number | undefined;
      if (isValid(originValue)) {
        // 找到第一个大于等于数据值的 tick
        const index = binaryFuzzySearch(subTickData, tick => tick.value - originValue);
        // 对齐
        const targetIndex =
          originValue > subTickData[index].value - step / 2
            ? Math.min(index, subTickData.length - 1)
            : index > 0
            ? index - 1
            : undefined;
        if (targetIndex !== undefined) {
          pos = this.angleAxisHelper.dataToPosition([
            subTickData[targetIndex].value - step / 2 // 确保占满整个 tick mask
          ]);
        }
      }
      if (isNil(pos)) {
        pos = this.angleAxisHelper.dataToPosition(
          [subTickData[0].value - step / 2] // 确保空出整个 tick mask
        );
      }
      return pos + offsetAngle;
    }
    return this._getAngleValueStartWithoutMask(datum);
  };

  protected _getAngleValueEnd = (datum: Datum) => {
    const axis = this._getAngleAxis();
    const { tickMask } = this._spec;

    if (tickMask?.forceAlign && this._isTickMaskVisible(axis)) {
      const field = this._stack ? STACK_FIELD_END : this._angleField[0];
      const originValue = datum[field];
      const subTickData = this._getAngleAxisSubTickData(axis);
      const step = subTickData[1].value - subTickData[0].value;
      const offsetAngle = degreeToRadian(tickMask.offsetAngle);

      // 找到第一个大于等于数据值的 tick
      const index = binaryFuzzySearch(subTickData, tick => tick.value - originValue);
      // 对齐
      const targetIndex =
        originValue > subTickData[index].value - step / 2
          ? Math.min(index, subTickData.length - 1)
          : index > 0
          ? index - 1
          : undefined;
      let pos: number;
      if (targetIndex !== undefined) {
        pos = this.angleAxisHelper.dataToPosition([
          subTickData[targetIndex].value + step / 2 // 确保占满整个 tick mask
        ]);
      } else {
        pos = this.angleAxisHelper.dataToPosition([
          subTickData[0].value - step / 2 // 确保空出整个 tick mask
        ]);
      }
      return pos + offsetAngle;
    }
    return this._getAngleValueEndWithoutMask(datum);
  };

  protected _getAngleValueStartWithoutMask(datum: Datum) {
    if (this._stack) {
      const value = valueInScaleRange(
        this.angleAxisHelper.dataToPosition([datum[STACK_FIELD_START]]),
        this.angleAxisHelper.getScale(0)
      );
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this._startAngle;
  }

  protected _getAngleValueEndWithoutMask(datum: Datum) {
    if (this._stack) {
      const value = valueInScaleRange(
        this.angleAxisHelper.dataToPosition([datum[STACK_FIELD_END]]),
        this.angleAxisHelper.getScale(0)
      );
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this.angleAxisHelper.dataToPosition([datum[this._angleField[0]]]);
  }

  getDimensionField(): string[] {
    return this._radiusField;
  }

  getMeasureField(): string[] {
    return this._angleField;
  }

  initMark(): void {
    this._initArcGroupMark();
  }

  initMarkStyle(): void {
    this._initArcGroupMarkStyle();
  }

  protected _initArcGroupMark() {
    // FIXME: disable group mark layout to prevent reevaluate after layout end
    this._arcGroupMark = this._createMark(ProgressLikeSeries.mark.group, {
      skipBeforeLayouted: false
    }) as IGroupMark;
    return this._arcGroupMark;
  }

  protected _initArcGroupMarkStyle() {
    const groupMark = this._arcGroupMark;
    groupMark.setZIndex(this.layoutZIndex);
    groupMark.created();
    this.setMarkStyle(
      groupMark,
      {
        clip: true,
        x: 0,
        y: 0,
        path: () => {
          const axis = this._getAngleAxis();
          if (this._isTickMaskVisible(axis)) {
            const { tickMask } = this._spec;
            const { angle, offsetAngle, style = {} } = tickMask;
            const subTickData = this._getAngleAxisSubTickData(axis);
            const { x, y } = this.angleAxisHelper.center();
            const radius = this._computeLayoutRadius();
            // const markStyle = preprocessSpecOrTheme('mark-spec', style, this.getColorScheme(), this._spec);
            // TODO: 类型定义
            const markStyle = style as any;
            return subTickData.map(({ value }) => {
              const pos = this.angleAxisHelper.dataToPosition([value]) + degreeToRadian(offsetAngle);
              const angleUnit = degreeToRadian(angle) / 2;
              return createArc({
                ...markStyle,
                x,
                y,
                startAngle: pos - angleUnit,
                endAngle: pos + angleUnit,
                innerRadius: radius * this._innerRadius,
                outerRadius: radius * this._outerRadius,
                fill: true
              });
            });
          }
          const { width, height } = this.getLayoutRect();
          return [
            createRect({
              width,
              height,
              fill: true
            })
          ];
        }
      },
      'normal',
      AttributeLevel.Series
    );
    this._arcGroupMark.setInteractive(false);
  }

  protected _getAngleAxis() {
    if (!this.angleAxisHelper) {
      return undefined;
    }
    const angleAxisId = this.angleAxisHelper.getAxisId();
    const angleAxis = this._option
      .getChart()
      .getAllComponents()
      .find(component => component.id === angleAxisId) as IPolarAxis;
    return angleAxis;
  }

  protected _getAngleAxisTickData(angleAxis?: IPolarAxis): IContinuousTickData[] {
    const tickData = angleAxis?.getTickData()?.getLatestData();
    return tickData;
  }

  protected _isTickMaskVisible(angleAxis?: IPolarAxis) {
    const tickData = this._getAngleAxisTickData(angleAxis);
    const { tickMask } = this._spec;
    return tickMask && tickMask.visible !== false && tickData?.length > 1;
  }

  protected _getAngleAxisSubTickData(angleAxis: IPolarAxis) {
    const tickData = this._getAngleAxisTickData(angleAxis);
    // TODO: 这块照搬了 vrender-components 的计算方法，需要抽出这块的公用逻辑
    const subTickData: IContinuousTickData[] = [];
    const { subTick = {}, tick = {} } = (angleAxis?.getSpec() ?? {}) as IPolarAxisSpec;
    const { tickCount: subTickCount = 4 } = subTick;
    const { alignWithLabel } = tick;
    // 刻度线的数量大于 2 时，才绘制子刻度
    if (tickData?.length >= 2) {
      const tickSegment = tickData[1].value - tickData[0].value;
      for (let i = 0; i < tickData.length - 1; i++) {
        const pre = tickData[i];
        const next = tickData[i + 1];
        subTickData.push(pre);
        for (let j = 0; j < subTickCount; j++) {
          const percent = (j + 1) / (subTickCount + 1);
          const value =
            (1 - percent) * pre.value + percent * (next ? next.value : alignWithLabel ? 1 : pre.value + tickSegment);
          subTickData.push({
            value
          });
        }
      }
      subTickData.push(tickData[tickData.length - 1]);
      return subTickData;
    }
    return tickData;
  }
}
