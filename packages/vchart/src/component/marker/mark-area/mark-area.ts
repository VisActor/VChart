import { DataView } from '@visactor/vdataset';
import type { IMarkArea, IMarkAreaSpec, IMarkAreaTheme } from './interface';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
import type { IOptionAggr } from '../../../data/transforms/aggregation';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { xLayout, yLayout, coordinateLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import type { LayoutItem } from '../../../model/layout-item';
import type { INode } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { markerRegression } from '../../../data/transforms/regression';
import { Factory } from '../../../core/factory';

export class MarkArea extends BaseMarker<IMarkAreaSpec & IMarkAreaTheme> implements IMarkArea {
  static type = ComponentTypeEnum.markArea;
  type = ComponentTypeEnum.markArea;
  name: string = ComponentTypeEnum.markArea;

  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.MarkArea;

  static speckey = 'markArea';

  protected declare _theme: IMarkAreaTheme;

  // markArea组件
  protected declare _markerComponent: MarkAreaComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const markAreaSpec = spec.markArea || options.defaultSpec;
    if (isEmpty(markAreaSpec)) {
      return undefined;
    }
    if (!isArray(markAreaSpec) && markAreaSpec.visible !== false) {
      return new MarkArea(markAreaSpec, { ...options, specKey: MarkArea.speckey });
    }
    const markAreas: MarkArea[] = [];
    markAreaSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        markAreas.push(new MarkArea(m, { ...options, specIndex: i, specKey: MarkArea.speckey }));
      }
    });
    return markAreas;
  }

  protected _createMarkerComponent() {
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
        ...this._spec.label,
        padding: this._spec.label?.labelBackground?.padding,
        shape: {
          ...transformToGraphic(this._spec.label?.shape),
          visible: this._spec.label?.shape?.visible ?? false
        },
        panel: {
          ...transformToGraphic(this._spec.label?.labelBackground?.style),
          visible: this._spec.label?.labelBackground?.visible ?? true
        },
        textStyle: transformToGraphic(this._spec.label?.style)
      },
      clipInRange: this._spec.clip ?? false
    });
    this._markerComponent = markArea;
    this._markerComponent.name = 'markArea';
    this._markerComponent.id = this._spec.id ?? `markArea-${this.id}`;
    this.getContainer().add(this._markerComponent as unknown as INode);
  }

  protected _markerLayout() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const isXLayout = isValid(spec.x) && isValid(spec.x1);
    const isYLayout = isValid(spec.y) && isValid(spec.y1);
    const isCoordinateLayout = isValid(spec.coordinates);
    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    let points: IPointLike[] = [];
    let lines: [IPointLike, IPointLike][] = [];
    if (isXLayout) {
      lines = xLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      points = [...lines[0], lines[1][1], lines[1][0]];
    } else if (isYLayout) {
      lines = yLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      points = [...lines[0], lines[1][1], lines[1][0]];
    } else if (isCoordinateLayout) {
      points = coordinateLayout(data, relativeSeries, autoRange);
    } else if (isPositionLayout) {
      points = spec.positions;
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

    this._markerComponent?.setAttributes({
      points: points,
      label: {
        ...this._markerComponent?.attribute?.label,
        text: this._spec.label.formatMethod
          ? this._spec.label.formatMethod(dataPoints, seriesData)
          : this._markerComponent?.attribute?.label?.text
      },
      limitRect,
      dx: this.layoutOffsetX,
      dy: this.layoutOffsetY
    });
  }

  protected _initDataView(): void {
    const spec = this._spec as any;
    const relativeSeries = this._relativeSeries;
    const isXProcess = isValid(spec.x) && isValid(spec.x1);
    const isYProcess = isValid(spec.y) && isValid(spec.y1);
    const isCoordinateProcess = isValid(spec.coordinates);
    if (!isXProcess && !isYProcess && !isCoordinateProcess) {
      return null;
    }

    let options: IOptionAggr[];

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    registerDataSetInstanceTransform(this._option.dataSet, 'markerRegression', markerRegression);

    if (isXProcess) {
      options = [this._processSpecX(spec.x), this._processSpecX(spec.x1)];
    } else if (isYProcess) {
      options = [this._processSpecY(spec.y), this._processSpecY(spec.y1)];
    } else if (isCoordinateProcess) {
      options = this._processSpecCoo(spec);
    }

    const data = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    data.parse([relativeSeries.getViewData()], {
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
