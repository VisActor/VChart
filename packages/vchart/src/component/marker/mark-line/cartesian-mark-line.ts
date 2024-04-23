import { DataView } from '@visactor/vdataset';
import type { IMarkLineXYSpec, IMarkLineXYY1Spec, IMarkLineYXX1Spec, IStepMarkLineSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IOptionAggr } from '../../../data/transforms/aggregation';
import {
  computeClipRange,
  cartesianCoordinateLayout,
  positionLayout,
  xyLayout,
  getMarkLineProcessInfo
} from '../utils';
import {
  type MarkLineAttrs,
  MarkLine as MarkLineComponent,
  registerMarkLineAnimate
} from '@visactor/vrender-components';
import { isValid } from '@visactor/vutils';
import type { IDataPos, IMarkProcessOptions } from '../interface';
import type { IOptionRegr } from '../../../data/transforms/regression';
import { getInsertPoints, getTextOffset } from './util';
import { Factory } from '../../../core/factory';
import { isPercent } from '../../../util';
import type { IPoint } from '../../../typings';
import { BaseMarkLine } from './base-mark-line';

export class CartesianMarkLine extends BaseMarkLine {
  static type = ComponentTypeEnum.cartesianMarkLine;
  type = ComponentTypeEnum.cartesianMarkLine;
  name: string = ComponentTypeEnum.cartesianMarkLine;
  static coordinateType = 'cartesian';
  coordinateType = 'cartesian';

  protected declare _markerComponent: MarkLineComponent;

  protected _newMarkLineComponent(attr: MarkLineAttrs): MarkLineComponent {
    return new MarkLineComponent(attr);
  }
  protected _computePointsAttr() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const isValidCoordinates = isValid(spec.coordinates);
    const isValidProcess = isValid(spec.process);
    const isValidProcessX = isValidProcess && isValid(spec.process.x);
    const isValidProcessY = isValidProcess && isValid(spec.process.y);
    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    const { doXProcess, doYProcess, doXYY1Process, doYXX1Process, doXYProcess, doCoordinatesProcess } =
      getMarkLineProcessInfo(spec);

    let points: IPoint[] = [];
    if (
      doXProcess ||
      doXYY1Process ||
      doYProcess ||
      doYXX1Process ||
      doXYProcess ||
      (isValidCoordinates && isValidProcessX) ||
      (isValidCoordinates && isValidProcessY)
    ) {
      const xyPoints = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      // 这里不同的场景返回的值不同，如果同时声明了 x x1 y y1，会返回两个数值的数组（如 [[{}], [{}]]），所以需要分别处理下
      points = (xyPoints.length === 1 ? xyPoints[0] : xyPoints.map(point => point[0])) as IPoint[];
    } else if (doCoordinatesProcess) {
      points = cartesianCoordinateLayout(data, relativeSeries, autoRange, spec.coordinatesOffset);
    } else if (isPositionLayout) {
      points = positionLayout(spec.positions, relativeSeries, spec.regionRelative);
    }
    return { points };
  }

  protected _markerLayout() {
    super._markerLayout();
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const { points } = this._computePointsAttr();

    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints =
      data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;

    let limitRect;
    if (spec.clip || spec.label?.confine) {
      const { minX, maxX, minY, maxY } = computeClipRange([
        startRelativeSeries.getRegion(),
        endRelativeSeries.getRegion(),
        relativeSeries.getRegion()
      ]);
      limitRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
    const markerComponentAttr = this._markerComponent?.attribute ?? {};
    const labelAttrs = {
      ...markerComponentAttr.label,
      text: this._spec.label.formatMethod
        ? this._spec.label.formatMethod(dataPoints, seriesData)
        : markerComponentAttr.label?.text
    };

    if ((this._spec as IStepMarkLineSpec).type === 'type-step') {
      const { multiSegment, mainSegmentIndex } = (this._spec as IStepMarkLineSpec).line || {};
      const { connectDirection, expandDistance = 0 } = this._spec as IStepMarkLineSpec;

      let expandDistanceValue: number;
      if (isPercent(expandDistance)) {
        const regionStart = startRelativeSeries.getRegion();
        const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
        const regionEnd = endRelativeSeries.getRegion();
        const regionEndLayoutStartPoint = regionEnd.getLayoutStartPoint();

        if (connectDirection === 'bottom' || connectDirection === 'top') {
          const regionHeight = Math.abs(
            Math.min(regionStartLayoutStartPoint.y, regionEndLayoutStartPoint.y) -
              Math.max(
                regionStartLayoutStartPoint.y + regionStart.getLayoutRect().height,
                regionEndLayoutStartPoint.y + regionEnd.getLayoutRect().height
              )
          );
          expandDistanceValue = (Number(expandDistance.substring(0, expandDistance.length - 1)) * regionHeight) / 100;
        } else {
          const regionWidth = Math.abs(
            Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x) -
              Math.max(
                regionStartLayoutStartPoint.x + regionStart.getLayoutRect().width,
                regionEndLayoutStartPoint.x + regionEnd.getLayoutRect().width
              )
          );
          expandDistanceValue = (Number(expandDistance.substring(0, expandDistance.length - 1)) * regionWidth) / 100;
        }
      } else {
        expandDistanceValue = expandDistance as number;
      }

      const joinPoints = getInsertPoints(
        (points as IPoint[])[0],
        (points as IPoint[])[1],
        connectDirection,
        expandDistanceValue
      );

      let labelPositionAttrs: any;
      if (multiSegment && isValid(mainSegmentIndex)) {
        // 如果用户配置了主线段，则不进行 label 的偏移处理，直接显示在主线段中间
        labelPositionAttrs = {
          position: 'middle',
          autoRotate: false,
          refX: 0,
          refY: 0
        };
      } else {
        labelPositionAttrs = {
          position: 'start',
          autoRotate: false,
          ...getTextOffset((points as IPoint[])[0], (points as IPoint[])[1], connectDirection, expandDistanceValue),
          refX: 0,
          refY: 0
        };
      }

      this._markerComponent?.setAttributes({
        points: multiSegment
          ? [
              [joinPoints[0], joinPoints[1]],
              [joinPoints[1], joinPoints[2]],
              [joinPoints[2], joinPoints[3]]
            ]
          : joinPoints,
        label: {
          ...labelAttrs,
          ...labelPositionAttrs,
          textStyle: {
            ...markerComponentAttr.label.textStyle,
            textAlign: 'center',
            textBaseline: 'middle'
          }
        },
        limitRect,
        multiSegment,
        mainSegmentIndex,
        dx: this._layoutOffsetX,
        dy: this._layoutOffsetY
      } as any);
    } else {
      this._markerComponent?.setAttributes({
        points,
        label: labelAttrs as MarkLineComponent['attribute']['label'],
        limitRect,
        dx: this._layoutOffsetX,
        dy: this._layoutOffsetY
      } as any);
    }
  }

  protected _computeOptions(): IMarkProcessOptions {
    let options: IOptionAggr[] | IOptionRegr;
    let processData: DataView = this._getRelativeDataView();
    let needAggr: boolean = true;
    let needRegr: boolean = false;
    const spec: any = this._spec;
    const relativeSeries = this._relativeSeries;

    const { doXProcess, doYProcess, doXYY1Process, doYXX1Process, doXYProcess, doCoordinatesProcess } =
      getMarkLineProcessInfo(spec);

    if (doXYProcess) {
      const { x, x1, y, y1 } = spec as IMarkLineXYSpec;
      options = [this._processSpecXY(x, y), this._processSpecXY(x1, y1)];
    } else if (doXProcess) {
      options = [this._processSpecX(spec.x)];
    } else if (doYProcess) {
      options = [this._processSpecY(spec.y)];
    } else if (doXYY1Process) {
      const { x, y, y1 } = spec as IMarkLineXYY1Spec;
      options = [this._processSpecXY(x, y), this._processSpecXY(x, y1)];
    } else if (doYXX1Process) {
      const { x, x1, y } = spec as IMarkLineYXX1Spec;
      options = [this._processSpecXY(x, y), this._processSpecXY(x1, y)];
    } else if (doCoordinatesProcess) {
      options = this._processSpecCoo(spec);
      needAggr = false;
      processData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` })
        .parse([relativeSeries.getViewData()], {
          type: 'dataview'
        })
        .transform({
          type: 'markerAggregation',
          options
        });
      if (spec.process && 'x' in spec.process) {
        options = [this._processSpecX(spec.process.x as unknown as IDataPos)] as unknown as any;
        needAggr = true;
      }
      if (spec.process && 'y' in spec.process) {
        options = [this._processSpecY(spec.process.y as unknown as IDataPos)] as unknown as any;
        needAggr = true;
      }
      if (spec.process && 'xy' in spec.process) {
        const { xField, yField } = relativeSeries.getSpec();
        options = {
          fieldX: xField,
          fieldY: yField
        };
        needRegr = true;
      }
    } else {
      needAggr = false;
    }
    return { options, needAggr, needRegr, processData };
  }
}

export const registerCartesianMarkLine = () => {
  Factory.registerComponent(CartesianMarkLine.type, CartesianMarkLine);
  registerMarkLineAnimate();
};
