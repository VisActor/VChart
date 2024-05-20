import { DataView } from '@visactor/vdataset';
import type { IMarkPoint, IMarkPointSpec } from './interface';
import { markerAggregation } from '../../../data/transforms/aggregation';
import {
  computeClipRange,
  computeOffsetFromRegion,
  getMarkPointProcessInfo,
  transformLabelAttributes,
  transformOffset,
  transformState,
  transformStyle
} from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import type { MarkPointAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import { isValid } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant';
import type { IGroup } from '@visactor/vrender-core';
import { markerFilter } from '../../../data/transforms/marker-filter';
import type { IMarkProcessOptions } from '../interface';

export abstract class BaseMarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
  static specKey = 'markPoint';
  specKey = 'markPoint';

  layoutZIndex: number = LayoutZIndex.MarkPoint;
  protected declare _markerComponent: MarkPointComponent;

  protected abstract _computePointsAttr(): any;
  protected abstract _computeOptions(): IMarkProcessOptions;

  static _getMarkerCoordinateType(markerSpec: any): string {
    const { doPolarProcess, doGeoProcess } = getMarkPointProcessInfo(markerSpec);
    if (markerSpec.coordinateType === 'polar' || doPolarProcess) {
      return 'polar';
    } else if (markerSpec.coordinateType === 'geo' || doGeoProcess) {
      return 'geo';
    }
    return 'cartesian';
  }

  protected _createMarkerComponent() {
    const { itemContent = {}, itemLine = {}, targetSymbol } = this._spec;
    const { text: label = {}, symbol, image, richText, ...restItemContent } = itemContent;

    const markPointAttrs: MarkPointAttrs = {
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? true,
      hover: this._spec.interactive ?? true,
      select: this._spec.interactive ?? true,
      position: { x: 0, y: 0 },
      clipInRange: this._spec.clip ?? false,
      itemContent: {
        offsetX: transformOffset(itemContent.offsetX, this._relativeSeries.getRegion()),
        offsetY: transformOffset(itemContent.offsetX, this._relativeSeries.getRegion()),
        ...restItemContent // Tips: 因为网站 demo 上已经透出了 imageStyle richTextStyle 的写法，为了兼容所以这个需要在后面覆盖
      },
      targetSymbol: {
        offset: targetSymbol.offset ?? 0,
        visible: targetSymbol.visible ?? false,
        size: targetSymbol.size ?? 20,
        style: transformStyle(targetSymbol.style, this._markerData)
      },
      state: {
        line: transformState(this._spec.itemLine.line?.state ?? {}, this._markerData),
        lineStartSymbol: transformState(this._spec.itemLine.startSymbol?.state ?? {}, this._markerData),
        lineEndSymbol: transformState(this._spec.itemLine.endSymbol?.state ?? {}, this._markerData),
        symbol: transformState(this._spec.itemContent.symbol?.state ?? {}, this._markerData),
        image: transformState(this._spec.itemContent.image?.state ?? {}, this._markerData),
        text: transformState(this._spec.itemContent.text?.state ?? {}, this._markerData),
        textBackground: transformState(this._spec.itemContent.text?.labelBackground?.state, this._markerData),
        richText: transformState(this._spec.itemContent.richText?.state ?? {}, this._markerData),
        customMark: transformState(this._spec.itemContent.customMark?.state ?? {}, this._markerData),
        targetItem: transformState(this._spec.targetSymbol?.state ?? {}, this._markerData)
      },
      animation: this._spec.animation ?? false,
      animationEnter: this._spec.animationEnter,
      animationExit: this._spec.animationExit,
      animationUpdate: this._spec.animationUpdate
    };

    if (symbol.style) {
      markPointAttrs.itemContent.symbolStyle = transformToGraphic(transformStyle(symbol.style, this._markerData));
    }
    if (image.style) {
      markPointAttrs.itemContent.imageStyle = transformStyle(image.style, this._markerData);
    }
    if (label) {
      markPointAttrs.itemContent.imageStyle = transformLabelAttributes(label, this._markerData);
    }
    if (richText.style) {
      markPointAttrs.itemContent.imageStyle = transformStyle(richText.style, this._markerData);
    }

    const { visible, line = {}, ...restItemLine } = itemLine;
    if (visible !== false) {
      markPointAttrs.itemLine = {
        ...restItemLine,
        visible: true,
        lineStyle: transformToGraphic(line.style)
      } as any;
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

    const { point } = this._computePointsAttr();

    const seriesData = this._getRelativeDataView().latestData;
    const dataPoints = data
      ? data.latestData[0] && data.latestData[0].latestData
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
        position: point === undefined ? { x: null, y: null } : point, // setAttrs时merge时undefined会被忽略, 所以这里做转换
        itemContent: {
          ...attribute.itemContent,
          textStyle: {
            ...textStyle,
            text: this._spec.itemContent.text?.formatMethod
              ? // type error here will be fixed in components
                (this._spec.itemContent.text.formatMethod(dataPoints, seriesData) as any)
              : textStyle.text
          },
          offsetX: computeOffsetFromRegion(point, attribute.itemContent.offsetX, this._relativeSeries.getRegion()),
          offsetY: computeOffsetFromRegion(point, attribute.itemContent.offsetY, this._relativeSeries.getRegion())
        },
        limitRect,
        dx: this._layoutOffsetX,
        dy: this._layoutOffsetY
      });
    }
  }

  protected _initDataView(): void {
    const spec = this._spec as any;
    const { doXYProcess, doPolarProcess, doGeoProcess } = getMarkPointProcessInfo(spec);
    const isCoordinateProcess = isValid(spec.coordinate);
    if (!isCoordinateProcess && !doXYProcess && !doPolarProcess && !doGeoProcess) {
      return;
    }

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    registerDataSetInstanceTransform(this._option.dataSet, 'markerFilter', markerFilter);

    const { options } = this._computeOptions();

    const data = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    data.parse([this._getRelativeDataView()], {
      type: 'dataview'
    });
    data.transform({
      type: 'markerAggregation',
      options
    });

    data.transform({
      type: 'markerFilter',
      options: this._getAllRelativeSeries()
    });
    data.target.on('change', () => {
      this._markerLayout();
    });
    this._markerData = data;
  }
}
