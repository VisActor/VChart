import { DataView } from '@visactor/vdataset';
import type {
  IMarkLine,
  IMarkLineSpec,
  IMarkLineXYSpec,
  IMarkLineXYY1Spec,
  IMarkLineYXX1Spec,
  IStepMarkLineSpec
} from './interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IOptionAggr } from '../../../data/transforms/aggregation';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { computeClipRange, coordinateLayout, positionLayout, transformLabelAttributes, xyLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import type { MarkLineAttrs } from '@visactor/vrender-components';
import { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import type { IGroup } from '@visactor/vrender-core';
import type { IDataPos, IMarkerSymbol } from '../interface';
import type { IOptionRegr } from '../../../data/transforms/regression';
// eslint-disable-next-line no-duplicate-imports
import { markerRegression } from '../../../data/transforms/regression';
import { LayoutZIndex } from '../../../constant';
import { getInsertPoints, getTextOffset } from './util';
import { Factory } from '../../../core/factory';
import { isPercent } from '../../../util';
import type { IPoint } from '../../../typings';
import type { IModelSpecInfo } from '../../../model/interface';

export class MarkLine extends BaseMarker<IMarkLineSpec> implements IMarkLine {
  static type = ComponentTypeEnum.markLine;
  type = ComponentTypeEnum.markLine;
  name: string = ComponentTypeEnum.markLine;

  static specKey = 'markLine';
  specKey = 'markLine';

  layoutZIndex: number = LayoutZIndex.MarkLine;

  protected declare _markerComponent: MarkLineComponent;

  private _isXYLayout: boolean;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const markLineSpec = chartSpec[this.specKey];
    if (isEmpty(markLineSpec)) {
      return undefined;
    }
    if (!isArray(markLineSpec) && markLineSpec.visible !== false) {
      return [
        {
          spec: markLineSpec,
          specPath: [this.specKey],
          specInfoPath: ['component', this.specKey, 0],
          type: ComponentTypeEnum.markLine
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    markLineSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        specInfos.push({
          spec: m,
          specPath: [this.specKey, i],
          specInfoPath: ['component', this.specKey, i],
          type: ComponentTypeEnum.markLine
        });
      }
    });
    return specInfos;
  }

  protected _createMarkerComponent() {
    const {
      label = {},
      startSymbol = {} as IMarkerSymbol,
      endSymbol = {} as IMarkerSymbol
    } = this._spec as IMarkLineSpec;

    const markLineAttrs: MarkLineAttrs = {
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ],
      lineStyle: this._spec.line?.style as unknown as any,
      clipInRange: this._spec.clip ?? false,
      label: transformLabelAttributes(label)
    };

    if (startSymbol.visible) {
      markLineAttrs.startSymbol = {
        ...startSymbol,
        visible: true,
        style: transformToGraphic(startSymbol.style)
      };
    } else {
      markLineAttrs.startSymbol = {
        visible: false
      };
    }

    if (endSymbol.visible) {
      markLineAttrs.endSymbol = {
        ...endSymbol,
        visible: true,
        style: transformToGraphic(endSymbol.style)
      };
    } else {
      markLineAttrs.endSymbol = {
        visible: false
      };
    }

    const markLine = new MarkLineComponent(markLineAttrs);
    return markLine as unknown as IGroup;
  }

  protected _markerLayout() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const isValidCoordinates = isValid(spec.coordinates);
    const isValidProcess = isValid(spec.process);
    const isValidProcessX = isValidProcess && isValid(spec.process.x);
    const isValidProcessY = isValidProcess && isValid(spec.process.y);
    const isCoordinateLayout = isValidCoordinates && (!isValidProcess || ('process' in spec && 'xy' in spec.process));
    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    let points: IPoint[] = [];
    if (this._isXYLayout || (isValidCoordinates && isValidProcessX) || (isValidCoordinates && isValidProcessY)) {
      const xyPoints = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      // 这里不同的场景返回的值不同，如果同时声明了 x x1 y y1，会返回两个数值的数组（如 [[{}], [{}]]），所以需要分别处理下
      points = (xyPoints.length === 1 ? xyPoints[0] : xyPoints.map(point => point[0])) as IPoint[];
    } else if (isCoordinateLayout) {
      points = coordinateLayout(data, relativeSeries, autoRange, spec.coordinatesOffset);
    } else if (isPositionLayout) {
      points = positionLayout(spec.positions, relativeSeries, spec.regionRelative);
    }

    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints = data.latestData[0].latestData || data.latestData;

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
        const regionStartLayoutStartPoint = regionStart.getLayoutPositionExcludeIndent();
        const regionEnd = endRelativeSeries.getRegion();
        const regionEndLayoutStartPoint = regionEnd.getLayoutPositionExcludeIndent();

        if (connectDirection === 'bottom' || connectDirection === 'top') {
          const regionHeight = Math.abs(
            Math.min(regionStartLayoutStartPoint.y, regionEndLayoutStartPoint.y) -
              Math.max(
                regionStartLayoutStartPoint.y + regionStart.getLayoutRectExcludeIndent().height,
                regionEndLayoutStartPoint.y + regionEnd.getLayoutRectExcludeIndent().height
              )
          );
          expandDistanceValue = (Number(expandDistance.substring(0, expandDistance.length - 1)) * regionHeight) / 100;
        } else {
          const regionWidth = Math.abs(
            Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x) -
              Math.max(
                regionStartLayoutStartPoint.x + regionStart.getLayoutRectExcludeIndent().width,
                regionEndLayoutStartPoint.x + regionEnd.getLayoutRectExcludeIndent().width
              )
          );
          expandDistanceValue = (Number(expandDistance.substring(0, expandDistance.length - 1)) * regionWidth) / 100;
        }
      } else {
        expandDistanceValue = expandDistance as number;
      }

      const joinPoints = getInsertPoints(points[0], points[1], connectDirection, expandDistanceValue);

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
          ...getTextOffset(points[0], points[1], connectDirection, expandDistanceValue),
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
      });
    } else {
      this._markerComponent?.setAttributes({
        points: points,
        label: labelAttrs,
        limitRect,
        dx: this._layoutOffsetX,
        dy: this._layoutOffsetY
      });
    }
  }

  protected _initDataView(): void {
    const spec = this._spec;
    const relativeSeries = this._relativeSeries;
    const isXProcess = 'x' in spec;
    const isYProcess = 'y' in spec;
    const isX1Process = 'x1' in spec;
    const isY1Process = 'y1' in spec;
    const isCoordinateProcess = 'coordinates' in spec;

    const doXProcess = isXProcess && !isYProcess && !isY1Process;
    const doXYY1Process = isXProcess && isYProcess && isY1Process;
    const doYProcess = isYProcess && !isXProcess && !isX1Process;
    const doYXX1Process = isYProcess && isXProcess && isX1Process;
    const doXYProcess = isXProcess && isYProcess && isX1Process && isY1Process;

    this._markerData = relativeSeries.getViewData();

    if (!doXProcess && !doYProcess && !doXYY1Process && !doYXX1Process && !doXYProcess && !isCoordinateProcess) {
      return;
    }

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    registerDataSetInstanceTransform(this._option.dataSet, 'markerRegression', markerRegression);

    this._isXYLayout = doXProcess || doXYY1Process || doYProcess || doYXX1Process || doXYProcess;

    let options: IOptionAggr[] | IOptionRegr;
    let processData: DataView = relativeSeries.getViewData();
    let needAggr: boolean = true;
    let needRegr: boolean = false;

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
    } else if (isCoordinateProcess) {
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

    const data = new DataView(this._option.dataSet);
    data.parse([processData], {
      type: 'dataview'
    });
    if (needAggr) {
      data.transform({
        type: 'markerAggregation',
        options
      });
    }
    if (needRegr) {
      data.transform({
        type: 'markerRegression',
        options
      });
    }

    data.target.on('change', () => {
      this._markerLayout();
    });
    this._markerData = data;
  }
}

export const registerMarkLine = () => {
  Factory.registerComponent(MarkLine.type, MarkLine);
};
