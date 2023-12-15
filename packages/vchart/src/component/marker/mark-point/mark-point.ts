import { DataView } from '@visactor/vdataset';
import type { IMarkPoint, IMarkPointCoordinateSpec, IMarkPointSpec, IMarkPointTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import { markerAggregation } from '../../../data/transforms/aggregation';
import { computeClipRange, coordinateLayout, positionLayout, xyLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import { Factory } from '../../../core/factory';
import type { IGroup } from '@visactor/vrender-core';
import type { IPoint } from '../../../typings';

export class MarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
  static type = ComponentTypeEnum.markPoint;
  type = ComponentTypeEnum.markPoint;
  name: string = ComponentTypeEnum.markPoint;

  layoutZIndex: number = LayoutZIndex.MarkPoint;

  protected declare _theme: IMarkPointTheme;

  // markPoint组件
  protected declare _markerComponent: MarkPointComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const markPointSpec = spec.markPoint;
    if (isEmpty(markPointSpec)) {
      return undefined;
    }
    if (!isArray(markPointSpec) && markPointSpec.visible !== false) {
      return new MarkPoint(markPointSpec, options);
    }
    const markPoints: MarkPoint[] = [];
    markPointSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        markPoints.push(new MarkPoint(m, { ...options, specIndex: i }));
      }
    });
    return markPoints;
  }

  protected _createMarkerComponent() {
    const itemContent = this._spec.itemContent ?? {};
    const itemContentText = itemContent.text ?? {};
    const labelBackground = itemContentText.labelBackground ?? {};

    const markPoint = new MarkPointComponent({
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      position: { x: 0, y: 0 },
      itemLine: {
        lineStyle: transformToGraphic(this._spec.itemLine?.line?.style),
        ...this._spec.itemLine
      },
      itemContent: {
        symbolStyle: transformToGraphic(itemContent.symbol?.style),
        imageStyle: itemContent.image?.style,
        textStyle: {
          ...itemContentText,
          padding: labelBackground.padding,
          shape: {
            ...transformToGraphic(itemContentText.shape),
            visible: itemContentText.shape?.visible ?? false
          },
          panel: {
            ...transformToGraphic(labelBackground.style),
            visible: labelBackground.visible ?? true
          },
          textStyle: transformToGraphic(itemContentText.style)
        },
        richTextStyle: itemContent.richText?.style,
        ...this._spec.itemContent
      },
      clipInRange: this._spec.clip ?? false
    });
    return markPoint as unknown as IGroup;
  }

  protected _markerLayout() {
    const spec = this._spec;
    const data = this._markerData;
    const relativeSeries = this._relativeSeries;
    const isXYLayout = 'x' in spec && 'y' in spec;
    const isCoordinateLayout = 'coordinate' in spec;
    const isPositionLayout = 'position' in spec;
    const autoRange = spec?.autoRange ?? false;

    let point: IPoint;
    if (isXYLayout) {
      point = xyLayout(data, relativeSeries, relativeSeries, relativeSeries, autoRange)[0][0];
    } else if (isCoordinateLayout) {
      point = coordinateLayout(
        data,
        relativeSeries,
        autoRange,
        (spec as IMarkPointCoordinateSpec).coordinatesOffset
      )[0];
    } else if (isPositionLayout) {
      point = positionLayout([spec.position], relativeSeries, spec.regionRelative)[0];
    }

    const seriesData = this._relativeSeries.getViewData().latestData;
    const dataPoints = data
      ? data.latestData[0].latestData
        ? data.latestData[0].latestData
        : data.latestData
      : seriesData;

    let limitRect;
    if (spec.clip) {
      const { minX, maxX, minY, maxY } = computeClipRange([relativeSeries.getRegion()]);
      limitRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
    if (this._markerComponent) {
      const attribute = this._markerComponent.attribute ?? {};
      const textStyle = attribute.itemContent?.textStyle ?? {};
      this._markerComponent.setAttributes({
        position: point,
        itemContent: {
          ...attribute.itemContent,
          textStyle: {
            ...textStyle,
            text: this._spec.itemContent.text?.formatMethod
              ? this._spec.itemContent.text.formatMethod(dataPoints, seriesData)
              : textStyle.text
          }
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
    const isXYProcess = isValid(spec.x) && isValid(spec.y);
    const isCoordinateProcess = isValid(spec.coordinate);
    if (!isCoordinateProcess && !isXYProcess) {
      return;
    }

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);

    let options;
    if (isXYProcess) {
      options = [this._processSpecXY(spec.x, spec.y)];
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

export const registerMarkPoint = () => {
  Factory.registerComponent(MarkPoint.type, MarkPoint);
};
