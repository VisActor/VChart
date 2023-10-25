import { DataView } from '@visactor/vdataset';
import type { IMarkPoint, IMarkPointSpec, IMarkPointTheme } from './interface';
import { isArray } from '../../../util';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { coordinateLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import type { LayoutItem } from '../../../model/layout-item';
import { Factory } from '../../../core/factory';
import type { INode } from '@visactor/vrender-core';

export class MarkPoint extends BaseMarker<IMarkPointSpec & IMarkPointTheme> implements IMarkPoint {
  static type = ComponentTypeEnum.markPoint;
  type = ComponentTypeEnum.markPoint;
  name: string = ComponentTypeEnum.markPoint;

  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.MarkPoint;

  static speckey = 'markPoint';

  protected declare _theme: IMarkPointTheme;

  // markPoint组件
  protected declare _markerComponent: MarkPointComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const markPointSpec = spec.markPoint || options.defaultSpec;
    if (isEmpty(markPointSpec)) {
      return undefined;
    }
    if (!isArray(markPointSpec) && markPointSpec.visible !== false) {
      return new MarkPoint(markPointSpec, { ...options, specKey: MarkPoint.speckey });
    }
    const markPoints: MarkPoint[] = [];
    markPointSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        markPoints.push(new MarkPoint(m, { ...options, specIndex: i, specKey: MarkPoint.speckey }));
      }
    });
    return markPoints;
  }

  protected _createMarkerComponent() {
    const markPoint = new MarkPointComponent({
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      position: { x: 0, y: 0 },
      itemLine: {
        lineStyle: transformToGraphic(this._spec.itemLine?.line?.style),
        ...this._spec.itemLine
      },
      itemContent: {
        symbolStyle: transformToGraphic(this._spec.itemContent?.symbol?.style),
        imageStyle: this._spec.itemContent?.image?.style,
        textStyle: {
          ...this._spec.itemContent?.text,
          padding: this._spec.itemContent?.text?.labelBackground?.padding,
          shape: {
            ...transformToGraphic(this._spec.itemContent?.text?.shape),
            visible: this._spec.itemContent?.text?.shape?.visible ?? false
          },
          panel: {
            ...transformToGraphic(this._spec.itemContent?.text?.labelBackground?.style),
            visible: this._spec.itemContent?.text?.labelBackground?.visible ?? true
          },
          textStyle: transformToGraphic(this._spec.itemContent?.text?.style)
        },
        richTextStyle: this._spec.itemContent?.richText?.style,
        ...this._spec.itemContent
      },
      clipInRange: this._spec.clip ?? false
    });
    this._markerComponent = markPoint;
    this._markerComponent.name = 'markPoint';
    this._markerComponent.id = this._spec.id ?? `markPoint-${this.id}`;
    this.getContainer().add(this._markerComponent as unknown as INode);
  }

  protected _markerLayout() {
    const spec = this._spec;
    const data = this._markerData;
    const relativeSeries = this._relativeSeries;
    const isCoordinateLayout = 'coordinate' in spec;
    const isPositionLayout = 'position' in spec;
    const autoRange = spec?.autoRange ?? false;

    let point: IPointLike;
    if (isCoordinateLayout) {
      point = coordinateLayout(data, relativeSeries, autoRange)[0];
    } else if (isPositionLayout) {
      point = spec.position;
    }

    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints = data
      ? data.latestData[0].latestData
        ? data.latestData[0].latestData
        : data.latestData
      : seriesData;

    let limitRect;
    if (spec.clip) {
      const { minX, maxX, minY, maxY } = this._computeClipRange([relativeSeries.getRegion()]);
      limitRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    this._markerComponent?.setAttributes({
      position: point,
      itemContent: {
        ...this._markerComponent?.attribute?.itemContent,
        textStyle: {
          ...this._markerComponent?.attribute?.itemContent?.textStyle,
          text: this._spec.itemContent.text?.formatMethod
            ? this._spec.itemContent.text.formatMethod(dataPoints, seriesData)
            : this._markerComponent?.attribute?.itemContent?.textStyle?.text
        }
      },
      limitRect,
      dx: this.layoutOffsetX,
      dy: this.layoutOffsetY
    });
  }

  protected _initDataView(): void {
    const spec = this._spec as any;
    const relativeSeries = this._relativeSeries;
    const isCoordinateProcess = isValid(spec.coordinate);
    if (!isCoordinateProcess) {
      return;
    }

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);

    const options = this._processSpecCoo(spec);

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

export const registerMarkPoint = () => {
  Factory.registerComponent(MarkPoint.type, MarkPoint);
};
