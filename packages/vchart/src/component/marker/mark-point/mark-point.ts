import { DataView } from '@visactor/vdataset';
import type { IMarkPoint, IMarkPointCoordinateSpec, IMarkPointSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import { markerAggregation } from '../../../data/transforms/aggregation';
import { computeClipRange, coordinateLayout, positionLayout, transformLabelAttributes, xyLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import type { MarkPointAttrs } from '@visactor/vrender-components';
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isValid, isArray } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import { Factory } from '../../../core/factory';
import type { IGroup } from '@visactor/vrender-core';
import type { IPoint } from '../../../typings';
import type { IModelSpecInfo } from '../../../model/interface';

export class MarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
  static type = ComponentTypeEnum.markPoint;
  type = ComponentTypeEnum.markPoint;
  name: string = ComponentTypeEnum.markPoint;

  static specKey = 'markPoint';
  specKey = 'markPoint';

  layoutZIndex: number = LayoutZIndex.MarkPoint;

  // markPoint组件
  protected declare _markerComponent: MarkPointComponent;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const markPointSpec = chartSpec[this.specKey];
    if (isEmpty(markPointSpec)) {
      return undefined;
    }
    if (!isArray(markPointSpec) && markPointSpec.visible !== false) {
      return [
        {
          spec: markPointSpec,
          specPath: [this.specKey],
          type: ComponentTypeEnum.markPoint
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    markPointSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        specInfos.push({
          spec: m,
          specIndex: i,
          specPath: [this.specKey, i],
          type: ComponentTypeEnum.markPoint
        });
      }
    });
    return specInfos;
  }

  protected _createMarkerComponent() {
    const { itemContent = {}, itemLine = {} } = this._spec;
    const { text: label = {}, symbol, image, richText, ...restItemContent } = itemContent;

    const markPointAttrs: MarkPointAttrs = {
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      position: { x: 0, y: 0 },
      clipInRange: this._spec.clip ?? false,
      itemContent: {
        symbolStyle: transformToGraphic(symbol?.style),
        imageStyle: image?.style,
        textStyle: transformLabelAttributes(label),
        richTextStyle: richText?.style,
        ...restItemContent // Tips: 因为网站 demo 上已经透出了 imageStyle richTextStyle 的写法，为了兼容所以这个需要在后面覆盖
      }
    };

    const { visible, line = {}, ...restItemLine } = itemLine;
    if (visible !== false) {
      markPointAttrs.itemLine = {
        ...restItemLine,
        visible: true,
        lineStyle: transformToGraphic(line.style)
      };
    } else {
      markPointAttrs.itemLine = {
        visible: false
      };
    }

    const markPoint = new MarkPointComponent(markPointAttrs);
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
    if (spec.clip || spec.itemContent?.confine) {
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
