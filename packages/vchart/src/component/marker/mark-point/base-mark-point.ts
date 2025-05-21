import type { IMarkPoint, IMarkPointSpec } from './interface';
import {
  computeClipRange,
  computeOffsetFromRegion,
  getMarkPointProcessInfo,
  transformLabelAttributes,
  transformOffset,
  transformState,
  transformStyle
} from '../utils';
import type { MarkPointAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import { isValid } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant/layout';
import type { IGroup, IRichTextAttribute } from '@visactor/vrender-core';
import type { IMapLabelSpec } from '../../map-label';

export abstract class BaseMarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
  static specKey = 'markPoint';
  specKey = 'markPoint';

  layoutZIndex: number = LayoutZIndex.MarkPoint;
  declare protected _markerComponent: MarkPointComponent;

  protected abstract _computePointsAttr(): any;

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
    const { itemContent = {}, itemLine = {}, targetSymbol = {} } = this._spec;
    const {
      type = 'text',

      // 老写法
      text: label,
      symbol,
      image,
      richText,
      customMark,
      textStyle,
      symbolStyle,
      imageStyle,
      richTextStyle,
      customMarkStyle,

      // 新写法
      style = {},
      state = {},

      ...restItemContent
    } = itemContent;

    let itemContentState = null;
    let itemContentStyle = null;

    if (type === 'text') {
      itemContentState = label?.state ?? state;
      itemContentStyle = transformLabelAttributes(
        label ?? textStyle ?? (style as IMapLabelSpec),
        this._markerData,
        this._markAttributeContext
      );
    } else if ((type as any) === 'richText') {
      itemContentState = richText?.state ?? state;
      const richLabel = {
        type: 'rich',
        text: ((richText.style ?? richTextStyle ?? style) as IRichTextAttribute)?.textConfig ?? [],
        textStyle: richText.style ?? style
      } as unknown as IMapLabelSpec;
      itemContentStyle = transformLabelAttributes(
        richLabel ?? (style as IMapLabelSpec),
        this._markerData,
        this._markAttributeContext
      );
    } else if (type === 'symbol') {
      itemContentState = symbol?.state ?? state;
      itemContentStyle = transformToGraphic(
        transformStyle(symbol?.style ?? symbolStyle ?? style, this._markerData, this._markAttributeContext)
      );
    } else if (type === 'image') {
      itemContentState = image?.state ?? state;
      itemContentStyle = transformStyle(
        image?.style ?? imageStyle ?? style,
        this._markerData,
        this._markAttributeContext
      );
    } else if (type === 'custom') {
      itemContentState = customMark?.state ?? state;
      itemContentStyle = transformStyle(
        customMark?.style ?? customMarkStyle ?? style,
        this._markerData,
        this._markAttributeContext
      );
    }
    const markPointAttrs: MarkPointAttrs = {
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? true,
      hover: this._spec.interactive ?? true,
      select: this._spec.interactive ?? true,
      position: { x: 0, y: 0 },
      clipInRange: this._spec.clip ?? false,
      itemContent: {
        type: type === 'richText' ? 'text' : type,
        offsetX: transformOffset(itemContent.offsetX, this._relativeSeries.getRegion()),
        offsetY: transformOffset(itemContent.offsetX, this._relativeSeries.getRegion()),
        ...restItemContent, // Tips: 因为网站 demo 上已经透出了 imageStyle richTextStyle 的写法，为了兼容所以这个需要在后面覆盖
        style: transformStyle(itemContentStyle, this._markerData, this._markAttributeContext)
      },
      targetSymbol: {
        offset: targetSymbol.offset ?? 0,
        visible: targetSymbol.visible ?? false,
        size: targetSymbol.size ?? 20,
        style: transformStyle(targetSymbol.style, this._markerData, this._markAttributeContext)
      },
      state: {
        line: transformState(this._spec.itemLine.line?.state ?? {}, this._markerData, this._markAttributeContext),
        lineStartSymbol: transformState(
          this._spec.itemLine.startSymbol?.state ?? {},
          this._markerData,
          this._markAttributeContext
        ),
        lineEndSymbol: transformState(
          this._spec.itemLine.endSymbol?.state ?? {},
          this._markerData,
          this._markAttributeContext
        ),
        itemContent: transformState(itemContentState, this._markerData, this._markAttributeContext),
        textBackground: transformState(
          this._spec.itemContent.text?.labelBackground?.state,
          this._markerData,
          this._markAttributeContext
        ),
        targetItem: transformState(this._spec.targetSymbol?.state ?? {}, this._markerData, this._markAttributeContext)
      },
      animation: this._spec.animation ?? false,
      animationEnter: this._spec.animationEnter,
      animationExit: this._spec.animationExit,
      animationUpdate: this._spec.animationUpdate
    };

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

    this._initCommonDataView();
  }
}
