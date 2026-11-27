import type { IItemContent, IMarkPoint, IMarkPointSpec } from './interface';
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
import { array, isValid, merge } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { queryColorFromColorScheme } from '../../../theme/color-scheme/util';
import { BaseMarker } from '../base-marker';
import { LayoutZIndex } from '../../../constant/layout';
import { STATE_VALUE_ENUM } from '../../../compile/mark/interface';
import { DimensionEventEnum, type DimensionEventParams } from '../../../event/events/dimension/interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import type { IMarkerLabelSpec } from '../interface';

const getTextLabelStyle = (
  label: IMarkerLabelSpec & { textStyle?: IMarkerLabelSpec['style'] },
  textStyle: IMarkerLabelSpec['style'],
  style: IItemContent['style']
) => label?.style ?? label?.textStyle ?? textStyle ?? style;

const isRichTextStyle = (style: any) => style?.type === 'rich';

const normalizeRichTextStyle = (style: any) => {
  if (!style) {
    return style;
  }
  const { type: _type, text, textConfig, ...restStyle } = style;
  const normalizedStyle = {
    ...restStyle
  };
  const richTextConfig = isValid(textConfig) ? textConfig : text;
  if (isValid(richTextConfig)) {
    (normalizedStyle as any).textConfig = richTextConfig;
  }
  return normalizedStyle;
};

export abstract class BaseMarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
  static specKey = 'markPoint';
  specKey = 'markPoint';

  layoutZIndex: number = LayoutZIndex.MarkPoint;
  protected declare _markerComponent: MarkPointComponent;

  protected abstract _computePointsAttr(): any;

  protected initEvent() {
    super.initEvent();

    const targetSymbolState = this._spec.targetSymbol?.state;
    if (
      this.coordinateType === 'cartesian' &&
      (targetSymbolState?.dimension_hover || targetSymbolState?.dimension_hover_reverse)
    ) {
      this.event.on(DimensionEventEnum.dimensionHover, this._handleDimensionHover);
    }
  }

  protected _handleDimensionHover = (params: DimensionEventParams) => {
    const targetSymbol = this._getTargetSymbolGraphic();
    if (!targetSymbol) {
      return;
    }

    switch (params.action) {
      case 'enter': {
        targetSymbol.removeState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER);
        targetSymbol.removeState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE);

        if (this._isDimensionHoverTarget(params)) {
          targetSymbol.addState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER, true);
        } else if (this._spec.targetSymbol?.state?.dimension_hover_reverse) {
          targetSymbol.addState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE, true);
        }
        break;
      }
      case 'leave':
        targetSymbol.removeState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER);
        targetSymbol.removeState(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE);
        break;
      default:
        break;
    }
  };

  private _getTargetSymbolGraphic() {
    return this._markerComponent?.find(
      node => node.name === 'mark-point-targetItem',
      true
    ) as unknown as IGraphic | null;
  }

  private _isDimensionHoverTarget(params: DimensionEventParams) {
    const latestData = this._markerData?.latestData;
    const markerData = latestData?.[0]?.latestData ?? latestData;
    const markerXValues = array(markerData?.[0]?.x).filter(isValid);

    return markerXValues.some(value => params.dimensionInfo.some(dimension => dimension.value === value));
  }

  static _getMarkerCoordinateType(markerSpec: any): string {
    const { doPolarProcess, doGeoProcess } = getMarkPointProcessInfo(markerSpec);
    if (markerSpec.coordinateType === 'polar' || doPolarProcess) {
      return 'polar';
    } else if (markerSpec.coordinateType === 'geo' || doGeoProcess) {
      return 'geo';
    }
    return 'cartesian';
  }

  private _getTextLabelAttrs(label: IMarkerLabelSpec, style: ReturnType<typeof getTextLabelStyle>) {
    const attrs = transformLabelAttributes(
      { ...label, style: merge({ dx: 0, dy: 0 }, style) },
      this._markerData,
      this._markAttributeContext
    );
    if (attrs.textStyle && attrs.textStyle.fill === undefined) {
      const fill = queryColorFromColorScheme(this.getColorScheme(), {
        type: 'palette',
        key: 'primaryFontColor'
      });
      if (fill !== undefined) {
        attrs.textStyle.fill = fill;
      }
    }
    return attrs;
  }

  protected _createMarkerComponent() {
    const { itemContent = {}, itemLine = {}, targetSymbol = {} } = this._spec;
    const region = this._relativeSeries.getRegion();
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
    } = itemContent as any;

    let itemContentState = null;
    let itemContentStyle = null;
    let itemContentType = type;
    let defaultStyle = {};

    if (type === 'text') {
      itemContentState = label?.state ?? state;
      const labelStyle = getTextLabelStyle(label, textStyle, style);
      if (isRichTextStyle(labelStyle)) {
        itemContentType = 'richText';
        defaultStyle = {
          width: 100,
          height: 100
        };
        itemContentStyle = transformStyle(
          merge(defaultStyle, normalizeRichTextStyle(labelStyle)),
          this._markerData,
          this._markAttributeContext
        );
      } else {
        itemContentStyle = this._getTextLabelAttrs(label, labelStyle);
      }
    } else if ((type as any) === 'richText') {
      itemContentState = richText?.state ?? state;
      defaultStyle = {
        width: 100,
        height: 100
      };
      itemContentStyle = transformStyle(
        merge(defaultStyle, richText?.style ?? richTextStyle ?? style),
        this._markerData,
        this._markAttributeContext
      );
    } else if (type === 'symbol') {
      itemContentState = symbol?.state ?? state;
      defaultStyle = {
        symbolType: 'star',
        fill: 'rgb(48, 115, 242)',
        fillOpacity: 0.8,
        size: 20
      };
      itemContentStyle = transformToGraphic(
        transformStyle(
          merge(defaultStyle, symbol?.style ?? symbolStyle ?? style),
          this._markerData,
          this._markAttributeContext
        )
      );
    } else if (type === 'image') {
      itemContentState = image?.state ?? state;
      defaultStyle = {
        width: 80,
        height: 80
      };
      itemContentStyle = transformStyle(
        merge(defaultStyle, image?.style ?? imageStyle ?? style),
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
        type: itemContentType,
        offsetX: transformOffset(itemContent.offsetX, region),
        offsetY: transformOffset(itemContent.offsetY, region),
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
    const relativeSeries = this._relativeSeries;
    const { point } = this._computePointsAttr();
    const { itemLine = {}, itemContent = {} } = this._spec;
    const region = this._relativeSeries.getRegion();
    const { visible: itemLineVisible, line = {}, ...restItemLine } = itemLine;
    const itemLineAttrs =
      itemLineVisible !== false
        ? ({
            ...restItemLine,
            visible: true,
            lineStyle: transformToGraphic(line.style)
          } as any)
        : {
            visible: false
          };
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
      const contentAttrs = {
        ...this._markerComponent.attribute.itemContent,
        offsetX: computeOffsetFromRegion(point, transformOffset(itemContent.offsetX, region), region),
        offsetY: computeOffsetFromRegion(point, transformOffset(itemContent.offsetY, region), region)
      };
      if (contentAttrs.type === 'text') {
        const {
          text: label,
          textStyle,
          style: itemStyle
        } = itemContent as IItemContent & {
          textStyle?: IMarkerLabelSpec['style'];
        };
        const style = this._getTextLabelAttrs(label, getTextLabelStyle(label, textStyle, itemStyle));
        if (label?.formatMethod) {
          const seriesData = this._getRelativeDataView().latestData;
          const markerData = this._markerData?.latestData;
          const dataPoints = markerData?.[0]?.latestData ?? markerData ?? seriesData;
          style.text = label.formatMethod(dataPoints, seriesData);
        }
        contentAttrs.style = style;
      }
      this._markerComponent.setAttributes({
        position: point === undefined ? { x: null, y: null } : point, // setAttrs时merge时undefined会被忽略, 所以这里做转换
        itemContent: contentAttrs,
        itemLine: itemLineAttrs,
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
