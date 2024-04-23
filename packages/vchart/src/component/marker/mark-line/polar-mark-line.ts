import { DataView } from '@visactor/vdataset';
import type {
  IMarkLineAngRadRad1Spec,
  IMarkLineAngRadSpec,
  IMarkLineAngleSpec,
  IMarkLineRadAngAng1Spec,
  IMarkLineRadiusSpec
} from './interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IOptionAggr } from '../../../data/transforms/aggregation';
import { polarLayout, getMarkLineProcessInfo, polarCoordinateLayout } from '../utils';
import type { MarkArcLineAttrs, MarkLineAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import {
  MarkArcLine as MarkArcLineComponent,
  MarkLine as MarkLineComponent,
  registerMarkArcLineAnimate,
  registerMarkLineAnimate
} from '@visactor/vrender-components';
import type { IOptionRegr } from '../../../data/transforms/regression';
import { Factory } from '../../../core/factory';
import type { IPoint, IPolarPoint } from '../../../typings';
import type { IPolarSeries } from 'src/series';
import { BaseMarkLine } from './base-mark-line';

export class PolarMarkLine extends BaseMarkLine {
  static type = ComponentTypeEnum.polarMarkLine;
  type = ComponentTypeEnum.polarMarkLine;
  name: string = ComponentTypeEnum.polarMarkLine;
  static coordinateType = 'polar';
  coordinateType = 'polar';

  protected declare _markerComponent: MarkArcLineComponent;

  protected _newMarkLineComponent(attr: MarkArcLineAttrs | MarkLineAttrs): MarkArcLineComponent | MarkLineComponent {
    const { doRadiusProcess, doRadAngAng1Process } = getMarkLineProcessInfo(this._spec as any);
    const isArcLine = doRadiusProcess || doRadAngAng1Process;
    return isArcLine
      ? new MarkArcLineComponent(attr as MarkArcLineAttrs)
      : new MarkLineComponent(attr as MarkLineAttrs);
  }

  protected _computePointsAttr() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;
    const autoRange = spec.autoRange ?? false;

    const {
      doAngleProcess,
      doRadiusProcess,
      doAngRadRad1Process,
      doRadAngAng1Process,
      doRadAngProcess,
      doCoordinatesProcess
    } = getMarkLineProcessInfo(spec);

    let points: IPolarPoint[] = [];
    let pointsAttr: {
      points?: IPoint[];
      radius?: number;
      startAngle?: number;
      endAngle?: number;
      center?: IPoint;
    } = {};

    const center = {
      x:
        this._relativeSeries.getRegion().getLayoutStartPoint().x +
        (this._relativeSeries as IPolarSeries).angleAxisHelper.center().x,
      y:
        this._relativeSeries.getRegion().getLayoutStartPoint().y +
        (this._relativeSeries as IPolarSeries).angleAxisHelper.center().y
    };

    if (doAngleProcess || doRadiusProcess || doAngRadRad1Process || doRadAngAng1Process || doRadAngProcess) {
      const polarPoints = polarLayout(
        data,
        startRelativeSeries as IPolarSeries,
        endRelativeSeries as IPolarSeries,
        relativeSeries as IPolarSeries,
        autoRange
      );

      points = (polarPoints.length === 1 ? polarPoints[0] : polarPoints.map(point => point[0])) as IPolarPoint[];

      if (points[0].radius === points[1].radius) {
        pointsAttr = {
          radius: points[0].radius,
          startAngle: points[0].angle,
          endAngle: points[1].angle,
          center
        };
      } else {
        pointsAttr = {
          points: points.map(point => {
            return {
              x: center.x + point.radius * Math.cos(point.angle),
              y: center.y + point.radius * Math.sin(point.angle)
            };
          })
        };
      }
    } else if (doCoordinatesProcess) {
      points = polarCoordinateLayout(data, relativeSeries, autoRange);
      pointsAttr = {
        points: points.map(point => {
          return {
            x: center.x + point.radius * Math.cos(point.angle),
            y: center.y + point.radius * Math.sin(point.angle)
          };
        })
      };
    }
    return pointsAttr;
  }

  protected _computeOptions(): any {
    const spec = this._spec;
    const {
      doAngleProcess,
      doRadiusProcess,
      doAngRadRad1Process,
      doRadAngAng1Process,
      doRadAngProcess,
      doCoordinatesProcess
    } = getMarkLineProcessInfo(spec);

    let options: IOptionAggr[] | IOptionRegr;
    const processData: DataView = this._getRelativeDataView();
    const needAggr: boolean = true;
    const needRegr: boolean = false;

    if (doRadAngProcess) {
      const { angle, angle1, radius, radius1 } = spec as IMarkLineAngRadSpec;
      options = [this._processSpecAngRad(angle, radius), this._processSpecAngRad(angle1, radius1)];
    } else if (doAngleProcess) {
      const { angle } = spec as IMarkLineAngleSpec;
      options = [this._processSpecAngle(angle)];
    } else if (doRadiusProcess) {
      const { radius } = spec as IMarkLineRadiusSpec;
      options = [this._processSpecRadius(radius)];
    } else if (doAngRadRad1Process) {
      const { angle, radius, radius1 } = spec as IMarkLineAngRadRad1Spec;
      options = [this._processSpecAngRad(angle, radius), this._processSpecAngRad(angle, radius1)];
    } else if (doRadAngAng1Process) {
      const { angle, angle1, radius } = spec as IMarkLineRadAngAng1Spec;
      options = [this._processSpecAngRad(angle, radius), this._processSpecAngRad(angle1, radius)];
    } else if (doCoordinatesProcess) {
      options = this._processSpecCoo(spec);
    }

    return { options, needAggr, needRegr, processData };
  }
}

export const registerPolarMarkLine = () => {
  Factory.registerComponent(PolarMarkLine.type, PolarMarkLine);
  registerMarkArcLineAnimate();
  registerMarkLineAnimate();
};
