import { DataView } from '@visactor/vdataset';
import type { IMarkLine, IMarkLineSpec, IMarkLineTheme, IStepMarkLineSpec } from './interface';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IOptionAggr } from '../../../data/transforms/aggregation';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { coordinateLayout, xyLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import type { INode } from '@visactor/vrender-core';
import type { IDataPos } from '../interface';
import type { IOptionRegr } from '../../../data/transforms/regression';
// eslint-disable-next-line no-duplicate-imports
import { markerRegression } from '../../../data/transforms/regression';
import { LayoutZIndex } from '../../../constant';
import { getInsertPoints, getTextOffset } from './util';
import { Factory } from '../../../core/factory';
import { isPercent } from '../../../util';
import type { IPoint } from '../../../typings';

export class MarkLine extends BaseMarker<IMarkLineSpec & IMarkLineTheme> implements IMarkLine {
  static type = ComponentTypeEnum.markLine;
  type = ComponentTypeEnum.markLine;
  name: string = ComponentTypeEnum.markLine;

  layoutZIndex: number = LayoutZIndex.MarkLine;

  protected declare _theme: IMarkLineTheme;

  protected declare _markerComponent: MarkLineComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const markLineSpec = spec.markLine;
    if (isEmpty(markLineSpec)) {
      return undefined;
    }
    if (!isArray(markLineSpec) && markLineSpec.visible !== false) {
      return new MarkLine(markLineSpec, { ...options });
    }
    const markLines: MarkLine[] = [];
    markLineSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        markLines.push(new MarkLine(m, { ...options, specIndex: i }));
      }
    });
    return markLines;
  }

  protected _createMarkerComponent() {
    const markLine = new MarkLineComponent({
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      points: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ],
      lineStyle: this._spec?.line.style as unknown as any,
      startSymbol: {
        ...this._spec?.startSymbol,
        visible: this._spec.startSymbol?.visible,
        style: transformToGraphic(this._spec.startSymbol?.style)
      },
      endSymbol: {
        ...this._spec?.endSymbol,
        visible: this._spec.endSymbol?.visible,
        style: transformToGraphic(this._spec.endSymbol?.style)
      },
      label: {
        ...this._spec.label,
        padding: this._spec.label?.labelBackground?.padding,
        shape: {
          ...transformToGraphic(this._spec.label?.shape),
          visible: this._spec.label?.shape?.visible ?? false
        },
        panel: {
          ...transformToGraphic(this._spec.label?.labelBackground.style),
          visible: this._spec.label?.labelBackground?.visible ?? true
        },
        textStyle: transformToGraphic(this._spec.label?.style)
      },
      clipInRange: this._spec.clip ?? false
    });
    this._markerComponent = markLine;
    this._markerComponent.name = this._spec.name ?? this.type;
    this._markerComponent.id = this._spec.id ?? `${this.type}-${this.id}`;
    this.getContainer().add(this._markerComponent as unknown as INode);
  }

  protected _markerLayout() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    // eslint-disable-next-line max-len
    const isXLayout =
      isValid(spec.x) || (isValid(spec.coordinates) && isValid(spec.process) && isValid(spec.process.x));
    // eslint-disable-next-line max-len
    const isYLayout =
      isValid(spec.y) || (isValid(spec.coordinates) && isValid(spec.process) && isValid(spec.process.y));
    const isCoordinateLayout =
      isValid(spec.coordinates) && (!isValid(spec.process) || ('process' in spec && 'xy' in spec.process));
    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    let points: IPoint[] = [];
    if (isXLayout) {
      points = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange)[0];
    } else if (isYLayout) {
      points = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange)[0];
    } else if (isCoordinateLayout) {
      points = coordinateLayout(data, relativeSeries, autoRange);
    } else if (isPositionLayout) {
      if (spec.regionRelative) {
        const region = relativeSeries.getRegion();
        const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
        points = spec.positions.map((point: IPoint) => {
          return {
            x: point.x + regionStartX,
            y: point.y + regionStartY
          };
        });
      } else {
        points = spec.positions;
      }
    }
    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints = data
      ? data.latestData[0].latestData
        ? data.latestData[0].latestData
        : data.latestData
      : seriesData;

    let limitRect;
    if (spec.clip || spec.label?.confine) {
      const { minX, maxX, minY, maxY } = this._computeClipRange([
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

    const labelAttrs = {
      ...this._markerComponent?.attribute?.label,
      text: this._spec.label.formatMethod
        ? this._spec.label.formatMethod(dataPoints, seriesData)
        : this._markerComponent?.attribute?.label?.text
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
            ...this._markerComponent?.attribute?.label.textStyle,
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
    const isCoordinateProcess = 'coordinates' in spec;

    if (!isXProcess && !isYProcess && !isCoordinateProcess) {
      return;
    }

    let options: IOptionAggr[] | IOptionRegr;
    let processData: DataView;
    let needAgggr: boolean = false;
    let needRegr: boolean = false;

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    // eslint-disable-next-line no-undef
    registerDataSetInstanceTransform(this._option.dataSet, 'markerRegression', markerRegression);

    if (isXProcess) {
      options = [this._processSpecX(spec.x as unknown as IDataPos)] as unknown as any;
      processData = relativeSeries.getViewData();
      needAgggr = true;
    } else if (isYProcess) {
      options = [this._processSpecY(spec.y as unknown as IDataPos)] as unknown as any;
      processData = relativeSeries.getViewData();
      needAgggr = true;
    } else if (isCoordinateProcess) {
      options = this._processSpecCoo(spec);

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
        needAgggr = true;
      }
      if (spec.process && 'y' in spec.process) {
        options = [this._processSpecY(spec.process.y as unknown as IDataPos)] as unknown as any;
        needAgggr = true;
      }
      if (spec.process && 'xy' in spec.process) {
        const { xField, yField } = relativeSeries.getSpec();
        options = {
          fieldX: xField,
          fieldY: yField
        };
        needRegr = true;
      }
    }

    const data = new DataView(this._option.dataSet);
    data.parse([processData], {
      type: 'dataview'
    });
    if (needAgggr) {
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
