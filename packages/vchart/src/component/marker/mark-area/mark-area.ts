import { DataView } from '@visactor/vdataset';
import type { IMarkArea, IMarkAreaSpec, IMarkAreaTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IOptionAggr } from '../../../data/transforms/aggregation';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { computeClipRange, coordinateLayout, positionLayout, xyLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import type { IGroup } from '@visactor/vrender-core';
import { Factory } from '../../../core/factory';
import type { IPoint } from '../../../typings';
import type { IModelSpecInfo } from '../../../model/interface';

export class MarkArea extends BaseMarker<IMarkAreaSpec> implements IMarkArea {
  static type = ComponentTypeEnum.markArea;
  type = ComponentTypeEnum.markArea;
  name: string = ComponentTypeEnum.markArea;

  static specKey = 'markArea';
  specKey = 'markArea';

  layoutZIndex: number = LayoutZIndex.MarkArea;

  // markArea组件
  protected declare _markerComponent: MarkAreaComponent;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const markAreaSpec = chartSpec[this.specKey];
    if (isEmpty(markAreaSpec)) {
      return undefined;
    }
    if (!isArray(markAreaSpec) && markAreaSpec.visible !== false) {
      return [
        {
          spec: markAreaSpec,
          specPath: [this.specKey],
          type: ComponentTypeEnum.markArea
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    markAreaSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        specInfos.push({
          spec: m,
          specIndex: i,
          specPath: [this.specKey, i],
          type: ComponentTypeEnum.markArea
        });
      }
    });
    return specInfos;
  }

  protected _createMarkerComponent() {
    const label = this._spec.label ?? {};
    const { labelBackground = {} } = label;

    const markArea = new MarkAreaComponent({
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      points: [
        {
          x: 0,
          y: 0
        }
      ],
      areaStyle: transformToGraphic(this._spec.area?.style),
      label: {
        ...label,
        padding: labelBackground.padding,
        shape: {
          ...transformToGraphic(label.shape),
          visible: label.shape?.visible ?? false
        },
        panel: {
          ...transformToGraphic(labelBackground.style),
          visible: labelBackground.visible ?? true
        },
        textStyle: transformToGraphic(label.style)
      },
      clipInRange: this._spec.clip ?? false
    });
    return markArea as unknown as IGroup;
  }

  protected _markerLayout() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const isXLayout = isValid(spec.x) && isValid(spec.x1);
    const isYLayout = isValid(spec.y) && isValid(spec.y1);
    const isXYLayout = isXLayout && isYLayout;
    const isCoordinateLayout = isValid(spec.coordinates);
    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    let points: IPoint[] = [];
    let lines: IPoint[][] = [];
    if (isXYLayout) {
      lines = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      // 格式为 [[{x, y}], [{x, y}]]
      // 顺序为左小角开始逆时针绘制
      points = [
        {
          x: lines[0][0].x,
          y: lines[1][0].y
        },
        lines[0][0],
        {
          x: lines[1][0].x,
          y: lines[0][0].y
        },
        lines[1][0]
      ];
    } else if (isXLayout || isYLayout) {
      lines = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      points = [...lines[0], lines[1][1], lines[1][0]];
    } else if (isCoordinateLayout) {
      points = coordinateLayout(data, relativeSeries, autoRange, spec.coordinatesOffset);
    } else if (isPositionLayout) {
      points = positionLayout(spec.positions, relativeSeries, spec.regionRelative);
    }

    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints = data
      ? data.latestData[0].latestData
        ? data.latestData[0].latestData
        : data.latestData
      : seriesData;

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

    if (this._markerComponent) {
      this._markerComponent.setAttributes({
        points: points,
        label: {
          ...this._markerComponent.attribute?.label,
          text: this._spec.label.formatMethod
            ? this._spec.label.formatMethod(dataPoints, seriesData)
            : this._markerComponent.attribute?.label?.text
        },
        limitRect,
        dx: this._layoutOffsetX,
        dy: this._layoutOffsetY
      });
    }
  }

  protected _initDataView(): void {
    const spec = this._spec as any;
    const relativeSeries = this._relativeSeries;
    const isXProcess = isValid(spec.x) && isValid(spec.x1);
    const isYProcess = isValid(spec.y) && isValid(spec.y1);
    const isXYProcess = isXProcess && isYProcess;
    const isCoordinateProcess = isValid(spec.coordinates);
    if (!isXProcess && !isYProcess && !isCoordinateProcess) {
      return null;
    }
    let options: IOptionAggr[];
    if (isXYProcess) {
      options = [this._processSpecXY(spec.x, spec.y), this._processSpecXY(spec.x1, spec.y1)];
    } else if (isXProcess) {
      options = [this._processSpecX(spec.x), this._processSpecX(spec.x1)];
    } else if (isYProcess) {
      options = [this._processSpecY(spec.y), this._processSpecY(spec.y1)];
    } else if (isCoordinateProcess) {
      options = this._processSpecCoo(spec);
    }

    const seriesData = relativeSeries.getViewData();
    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    const data = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    data.parse([seriesData], {
      type: 'dataview'
    });
    data.transform({
      type: 'markerAggregation',
      options
    });

    data.target.on('change', () => {
      this._markerLayout();
    });
    this._markerData = data;
  }
}

export const registerMarkArea = () => {
  Factory.registerComponent(MarkArea.type, MarkArea);
};
