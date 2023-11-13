import type {
  TooltipAttributes,
  TooltipPanelAttrs,
  TooltipRowAttrs,
  TooltipRowStyleAttrs,
  TooltipSymbolAttrs,
  TooltipTextAttrs
} from '@visactor/vrender-components';
import type { IPadding, IToolTipActual } from '../../../../typings';
import type { ITooltipTextStyle } from '../interface';
import { isValid, normalizePadding } from '@visactor/vutils';
import { mergeSpec } from '../../../../util/spec/merge-spec';
import { normalizeLayoutPaddingSpec } from '../../../../util/space';
import type { ITooltipSpec } from '../../interface/spec';
import type { ITooltipTextTheme, ITooltipTheme } from '../../interface/theme';
import { THEME_CONSTANTS } from '../../../../theme/builtin/common/constants';
import { measureTooltipText } from './common';
import type { ITheme } from '../../../../theme';

const DEFAULT_TEXT_ATTRIBUTES: Partial<ITooltipTextStyle> = {
  fontFamily: THEME_CONSTANTS.defaultFontFamily,
  spacing: 10,
  wordBreak: 'break-word'
};

export function getTextAttributes(
  style: ITooltipTextTheme = {},
  globalTheme?: ITheme,
  defaultAttributes?: Partial<ITooltipTextStyle>
): ITooltipTextStyle {
  const attrs: ITooltipTextStyle = {
    ...(defaultAttributes ?? DEFAULT_TEXT_ATTRIBUTES),
    fill: (style.fill ?? style.fontColor) as string,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily ?? globalTheme?.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight as any, // FIXME: vrender 支持行高字符串后删除 any
    spacing: style.spacing,
    multiLine: style.multiLine,
    maxWidth: style.maxWidth,
    wordBreak: style.wordBreak,
    autoWidth: style.autoWidth
  };
  return attrs;
}

export const getPanelAttributes = (style: ITooltipTheme['panel']): TooltipPanelAttrs => {
  const { backgroundColor, border, shadow } = style;
  const panelAttrs: TooltipPanelAttrs = {
    lineWidth: border?.width ?? 0,
    shadow: !!shadow
  };
  if (border?.color) {
    panelAttrs.stroke = border.color as string;
  }
  if (backgroundColor) {
    panelAttrs.fill = backgroundColor as string;
  }
  if (shadow) {
    panelAttrs.shadowColor = shadow.color as string;
    panelAttrs.shadowBlur = shadow.blur;
    panelAttrs.shadowOffsetX = shadow.x;
    panelAttrs.shadowOffsetY = shadow.y;
    panelAttrs.shadowSpread = shadow.spread;
  }
  const { radius } = border ?? {};
  if (isValid(radius)) {
    panelAttrs.cornerRadius = [radius, radius, radius, radius];
  }
  return panelAttrs;
};

export const getTooltipAttributes = (
  actualTooltip: IToolTipActual,
  spec: ITooltipSpec,
  globalTheme: ITheme
): TooltipAttributes => {
  const { style = {}, enterable, transitionDuration } = spec;
  const { panel = {}, titleLabel, shape, keyLabel, valueLabel, spaceRow: commonSpaceRow } = style;
  const padding = normalizePadding(panel.padding);
  const paddingSpec = normalizeLayoutPaddingSpec(panel.padding) as IPadding;

  const titleStyle = getTextAttributes(titleLabel, globalTheme);
  const keyStyle = getTextAttributes(keyLabel, globalTheme);
  const valueStyle = getTextAttributes(valueLabel, globalTheme);
  const shapeStyle: TooltipRowStyleAttrs['shape'] = {
    fill: true,
    size: shape?.size ?? 8,
    spacing: shape?.spacing ?? 6
  };

  const attributes: TooltipAttributes = {
    panel: getPanelAttributes(panel),
    padding,

    title: {},
    content: [],

    titleStyle: {
      value: titleStyle,
      spaceRow: commonSpaceRow
    },
    contentStyle: {
      shape: shapeStyle,
      key: keyStyle,
      value: valueStyle,
      spaceRow: commonSpaceRow
    },
    hasContentShape: false,
    keyWidth: 0,
    valueWidth: 0,

    enterable,
    transitionDuration
  };

  const { title = {}, content = [] } = actualTooltip;

  let containerWidth = paddingSpec.left + paddingSpec.right;
  let containerHeight = paddingSpec.top + paddingSpec.bottom;

  // calculate content
  let contentMaxWidth = 0;
  // filter content
  const filteredContent = content.filter(item => {
    return (item.key || item.value) && item.visible !== false;
  });
  const hasContent = !!filteredContent.length;
  let maxKeyWidth = 0;
  let maxAdaptiveKeyWidth = 0;
  let maxValueWidth = 0;
  let maxShapeWidth = 0;

  if (hasContent) {
    const keyWidths: number[] = [];
    const adaptiveKeyWidths: number[] = [];
    const valueWidths: number[] = [];
    const shapeWidths: number[] = [];

    attributes.content = filteredContent.map((item, i) => {
      let itemHeight = 0;
      const {
        hasShape: actualHasShape,
        key: actualKey,
        shapeType: actualShapeType = '',
        shapeFill: actualShapeFill,
        shapeStroke: actualShapeStroke,
        shapeLineWidth: actualShapeLineWidth,
        shapeSize: actualShapeSize,
        value: actualValue,
        isKeyAdaptive: actualIsKeyAdaptive,
        spaceRow: actualSpaceRow,
        keyStyle: actualKeyStyle,
        valueStyle: actualValueStyle,
        // 弃用的属性，做下兼容
        shapeColor: actualShapeColor,
        shapeHollow: actualShapeHollow
      } = item;
      const itemAttrs: TooltipRowAttrs = { height: 0, spaceRow: actualSpaceRow ?? commonSpaceRow };
      if (isValid(actualKey)) {
        const itemKeyStyle: ITooltipTextStyle = mergeSpec(
          {},
          keyStyle,
          getTextAttributes(actualKeyStyle, undefined, {})
        );
        const { width, height, text } = measureTooltipText(actualKey, itemKeyStyle);
        itemAttrs.key = {
          width,
          height,
          ...itemKeyStyle,
          text
        };
        if (!actualIsKeyAdaptive) {
          keyWidths.push(width);
        } else {
          adaptiveKeyWidths.push(width);
        }
        itemHeight = Math.max(itemHeight, height);
      }
      if (isValid(actualValue)) {
        const itemValueStyle: ITooltipTextStyle = mergeSpec(
          {},
          valueStyle,
          getTextAttributes(actualValueStyle, undefined, {})
        );
        const { width, height, text } = measureTooltipText(actualValue, itemValueStyle);
        itemAttrs.value = {
          width,
          height,
          ...itemValueStyle,
          text
        };
        valueWidths.push(width);
        itemHeight = Math.max(itemHeight, height);
      }
      if (actualHasShape) {
        const shape: TooltipSymbolAttrs = {
          visible: true,
          symbolType: actualShapeType
        };
        const adaptiveShapeFill = actualShapeFill ?? actualShapeColor;
        if (actualShapeHollow) {
          shape.stroke = adaptiveShapeFill;
        } else {
          shape.fill = adaptiveShapeFill;
        }
        shape.stroke = actualShapeStroke ?? adaptiveShapeFill;
        shape.lineWidth = actualShapeLineWidth;
        itemAttrs.shape = shape;

        const shapeWidth = actualShapeSize ?? shapeStyle.size;
        itemHeight = Math.max(shapeWidth, itemHeight);
        shapeWidths.push(shapeWidth);
      } else {
        itemAttrs.shape = { visible: false };
      }

      itemAttrs.height = itemHeight;
      containerHeight += itemHeight;
      if (i < filteredContent.length - 1) {
        containerHeight += itemAttrs.spaceRow;
      }

      return itemAttrs;
    });

    maxKeyWidth = keyWidths.length ? Math.max(...keyWidths) : 0; // name 需要对齐
    maxAdaptiveKeyWidth = adaptiveKeyWidths.length ? Math.max(...adaptiveKeyWidths) : 0;
    maxValueWidth = valueWidths.length ? Math.max(...valueWidths) : 0; // value 需要对齐
    maxShapeWidth = shapeWidths.length ? Math.max(...shapeWidths) + shapeStyle.spacing : 0; // shape 列宽度
    contentMaxWidth = Math.max(
      maxShapeWidth + maxKeyWidth + keyStyle.spacing + maxValueWidth + valueStyle.spacing,
      maxShapeWidth + maxAdaptiveKeyWidth,
      contentMaxWidth
    );
    attributes.hasContentShape = !!shapeWidths.length;
    attributes.keyWidth = maxKeyWidth;
    attributes.valueWidth = maxValueWidth;
  }

  // calculate title
  let titleMaxWidth = 0;
  let titleMaxHeight = 0;
  const {
    visible: actualTitleVisible = true,
    value: actualTitleValue = '',
    valueStyle: actualTitleValueStyle,
    spaceRow: actualTitleSpaceRow
  } = title;
  attributes.title.visible = actualTitleVisible;
  attributes.title.spaceRow = actualTitleSpaceRow ?? commonSpaceRow;

  let titleValueStyle: ITooltipTextStyle = {};
  // 当前是否处于自适应宽度模式
  const isAutoWidthMode = () => titleValueStyle.autoWidth && titleValueStyle.multiLine !== false;
  if (actualTitleVisible) {
    titleValueStyle = mergeSpec({}, titleStyle, getTextAttributes(actualTitleValueStyle, undefined, {}));
    // 标题默认优化策略：如果 autoWidth 为 true，则宽度默认跟随 content 宽度并开启自动换行
    if (isAutoWidthMode()) {
      titleValueStyle.multiLine = titleValueStyle.multiLine ?? true;
      titleValueStyle.maxWidth = titleValueStyle.maxWidth ?? (hasContent ? Math.ceil(contentMaxWidth) : undefined);
    }

    const { text, width, height } = measureTooltipText(actualTitleValue, titleValueStyle);
    attributes.title.value = {
      width: isAutoWidthMode() ? Math.min(width, titleValueStyle.maxWidth ?? Number.MAX_VALUE) : width,
      height,
      ...titleValueStyle,
      text
    };
    titleMaxWidth = attributes.title.value.width;
    titleMaxHeight = attributes.title.value.height;

    containerHeight += titleMaxHeight + (hasContent ? attributes.title.spaceRow : 0);
  }
  attributes.title.width = titleMaxWidth;
  attributes.title.height = titleMaxHeight;

  if (isAutoWidthMode()) {
    containerWidth += contentMaxWidth ? contentMaxWidth : titleMaxWidth;
  } else {
    containerWidth += Math.max(titleMaxWidth, contentMaxWidth);
  }

  // 处理 content 的自动宽度模式
  if (hasContent) {
    attributes.content.forEach(item => {
      const value = item.value as ITooltipTextStyle & TooltipTextAttrs;
      // 最后一列默认自适应宽度
      if (value && (value.autoWidth ?? true)) {
        value.width =
          containerWidth -
          paddingSpec.left -
          paddingSpec.right -
          maxShapeWidth -
          maxKeyWidth -
          keyStyle.spacing -
          valueStyle.spacing;
        //value.multiLine = true;  multiLine 需要用户手动开启，不会自动开启
        if (!value.maxWidth) {
          value.maxWidth = Math.ceil(value.width);
        }
        attributes.valueWidth = Math.max(attributes.valueWidth, value.width);
      }
    });
  }

  attributes.panel.width = containerWidth;
  attributes.panel.height = containerHeight;

  return attributes;
};
