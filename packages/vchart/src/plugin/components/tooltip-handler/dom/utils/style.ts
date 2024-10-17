import { isValid, isValidNumber, lowerCamelCaseToMiddle, normalizePadding, type Maybe } from '@visactor/vutils';
import type { FontWeight, ITooltipActual, TextAlign } from '../../../../../typings';
import { mergeSpec } from '@visactor/vutils-extension';
import { normalizeLayoutPaddingSpec } from '../../../../../util/space';
import type { ITooltipAttributes, ITooltipTextStyle } from '../../interface';
import type { ILabelStyle, IShapeStyle, IDomTooltipStyle } from '../interface';
import { calculateLineHeight } from '@visactor/vrender-core';
import type { ITooltipSpec, ITooltipTextTheme, ITooltipTheme } from '../../../../../component/tooltip';
import { getPixelPropertyStr } from './common';
import type { ITheme } from '../../../../../theme';
import { token } from '../../../../../theme/token';

const DEFAULT_SHAPE_SPACING = 8;
const DEFAULT_KEY_SPACING = 26;
const DEFAULT_VALUE_SPACING = 0;

// export function getDomStylesBack(attributes?: Maybe<ITooltipAttributes>): IDomTooltipStyle {
//   const {
//     panel = {},
//     title: titleAttribute,
//     content: contentAttribute,
//     titleStyle = {},
//     contentStyle = {},
//     padding,
//     keyWidth,
//     valueWidth,
//     enterable,
//     transitionDuration,
//     panelDomHeight = 0,
//     align = 'left'
//   } = attributes ?? {};

//   const {
//     fill: backgroundColor,
//     shadow,
//     shadowBlur,
//     shadowColor,
//     shadowOffsetX,
//     shadowOffsetY,
//     shadowSpread,
//     cornerRadius,
//     stroke: strokeColor,
//     lineWidth = 0,
//     width = 0
//   } = panel;

//   const { value: title = {} } = titleStyle;
//   const { shape = {}, key = {}, value = {} } = contentStyle;

//   const shapeStyle = getShapeStyle(shape);
//   const keyStyle = getLabelStyle(key);
//   const valueStyle = getLabelStyle(value);
//   const { bottom, left, right, top } = normalizeLayoutPaddingSpec(padding);
//   const marginKey = align === 'right' ? 'marginLeft' : 'marginRight';

//   const styles: IDomTooltipStyle = {
//     align,
//     panel: {
//       width: getPixelPropertyStr(width + lineWidth * 2),
//       minHeight: getPixelPropertyStr(panelDomHeight + lineWidth * 2),
//       paddingBottom: getPixelPropertyStr(bottom as number),
//       paddingLeft: getPixelPropertyStr(left as number),
//       paddingRight: getPixelPropertyStr(right as number),
//       paddingTop: getPixelPropertyStr(top as number),
//       borderColor: strokeColor as string,
//       borderWidth: getPixelPropertyStr(lineWidth),
//       borderRadius: getPixelPropertyStr(cornerRadius),
//       backgroundColor: backgroundColor ? `${backgroundColor}` : 'transparent',
//       boxShadow: shadow
//         ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
//         : 'initial',
//       pointerEvents: enterable ? 'auto' : 'none',
//       transitionDuration: transitionDuration ? `${transitionDuration}ms` : 'initial',
//       transitionProperty: transitionDuration ? 'transform' : 'initial',
//       transitionTimingFunction: transitionDuration ? 'ease-out' : 'initial'
//     },
//     title: {
//       marginTop: '0px',
//       marginBottom: contentAttribute?.length ? getPixelPropertyStr(titleAttribute?.spaceRow) : '0px',
//       ...getLabelStyle(mergeSpec({}, title, titleAttribute?.value))
//     },
//     content: {},
//     shapeColumn: {
//       common: shapeStyle,
//       items: contentAttribute?.map(
//         ({ spaceRow }, i) =>
//           ({
//             marginTop: '0px',
//             marginBottom: i < contentAttribute.length - 1 ? getPixelPropertyStr(spaceRow) : '0px'
//           } as IShapeStyle)
//       ),
//       width: getPixelPropertyStr(shape.size),
//       [marginKey]: getPixelPropertyStr(shape.spacing ?? DEFAULT_SHAPE_SPACING)
//     },
//     keyColumn: {
//       common: keyStyle,
//       items: contentAttribute?.map(
//         ({ key, spaceRow }, i) =>
//           ({
//             marginTop: '0px',
//             marginBottom: i < contentAttribute.length - 1 ? getPixelPropertyStr(spaceRow) : '0px',
//             ...keyStyle,
//             ...getLabelStyle(key as ITooltipTextStyle),
//             ...(key?.multiLine ? { width: getPixelPropertyStr(Math.ceil(key.width)) } : undefined) // 对多行文本使用定宽
//           } as ILabelStyle)
//       ),
//       width: getPixelPropertyStr(keyWidth),
//       [marginKey]: getPixelPropertyStr(key.spacing ?? DEFAULT_KEY_SPACING)
//     },
//     valueColumn: {
//       common: valueStyle,
//       items: contentAttribute?.map(
//         ({ value, spaceRow }, i) =>
//           ({
//             marginTop: '0px',
//             marginBottom: i < contentAttribute.length - 1 ? getPixelPropertyStr(spaceRow) : '0px',
//             ...valueStyle,
//             ...getLabelStyle(value as ITooltipTextStyle),
//             ...(value?.multiLine ? { width: getPixelPropertyStr(Math.ceil(value.width)) } : undefined) // 对多行文本使用定宽
//           } as ILabelStyle)
//       ),
//       width: getPixelPropertyStr(valueWidth),
//       [marginKey]: getPixelPropertyStr(value.spacing ?? DEFAULT_VALUE_SPACING)
//     }
//   };
//   return styles;
// }

export const getTextStyle = (style: ITooltipTextTheme = {}) => {
  const textStyle: Partial<CSSStyleDeclaration> = {
    color: style.fill ?? style.fontColor,
    fontFamily: style.fontFamily,
    fontSize: getPixelPropertyStr(style.fontSize as number),
    fontWeight: style.fontWeight as string,
    textAlign: style.textAlign,
    maxWidth: getPixelPropertyStr(style.maxWidth),
    whiteSpace: style.multiLine ? 'initial' : 'nowrap',
    wordBreak: style.multiLine ? style.wordBreak ?? 'break-word' : 'normal'
  };

  return textStyle;
};

export const getDomStyle = (spec: ITooltipSpec = {}, globalTheme: ITheme) => {
  const { style = {}, enterable, transitionDuration } = spec;
  const {
    panel = {},
    titleLabel,
    shape,
    keyLabel,
    valueLabel,
    spaceRow: commonSpaceRow,
    maxContentHeight,
    align
  } = style;
  const panelStyle = getPanelStyle(panel);
  const rowStyle: Partial<CSSStyleDeclaration> = {
    marginTop: '0px',
    marginBottom: '0px'
  };

  if (isValidNumber(maxContentHeight)) {
    panelStyle.maxHeight = `${maxContentHeight}px`;
  }
  panelStyle.pointerEvents = enterable ? 'auto' : 'none';
  if (transitionDuration) {
    panelStyle.transitionDuration = transitionDuration ? `${transitionDuration}ms` : 'initial';
    panelStyle.transitionProperty = transitionDuration ? 'transform' : 'initial';
    panelStyle.transitionTimingFunction = transitionDuration ? 'ease-out' : 'initial';
  }
  if (isValidNumber(commonSpaceRow)) {
    rowStyle.marginBottom = `${commonSpaceRow}px`;
  }
  panelStyle.fontFamily = (globalTheme?.fontFamily ?? token.fontFamily) as string;

  const shapeStyle: Partial<CSSStyleDeclaration> = {
    // TODO 默认值优化
    width: getPixelPropertyStr(shape?.size ?? 8)
  };
  const titleStyle = getTextStyle(titleLabel);
  const keyStyle = getTextStyle(keyLabel);
  const valueStyle = getTextStyle(valueLabel);
  const marginKey = align === 'right' ? 'marginLeft' : 'marginRight';

  if (align === 'right') {
    // rtl
    titleStyle.textAlign = 'right';
    keyStyle.textAlign = 'right';
    valueStyle.textAlign = 'left';
  } else {
    titleStyle.textAlign = 'left';
    keyStyle.textAlign = 'left';
    valueStyle.textAlign = 'right';
  }
  shapeStyle[marginKey] = getPixelPropertyStr(shape.spacing ?? DEFAULT_SHAPE_SPACING);
  keyStyle[marginKey] = getPixelPropertyStr(keyLabel.spacing ?? DEFAULT_KEY_SPACING);
  valueStyle[marginKey] = getPixelPropertyStr(valueLabel.spacing ?? DEFAULT_VALUE_SPACING);

  const lineHeight = keyStyle.lineHeight ?? valueStyle.lineHeight;

  if (isValid(lineHeight)) {
    rowStyle.lineHeight = /^[0-9]*$/.test(`${lineHeight}`) ? `${lineHeight}px` : `${lineHeight}`;
  }

  return {
    row: rowStyle,
    panel: panelStyle,
    title: titleStyle,
    shape: shapeStyle,
    key: keyStyle,
    value: valueStyle
  };
};

export const getPanelStyle = (style: ITooltipTheme['panel']): Partial<CSSStyleDeclaration> => {
  const { backgroundColor, border, shadow, padding } = style;
  const panelStyle: Partial<CSSStyleDeclaration> = {
    borderWidth: `${border?.width ?? 0}px`
  };

  if (border?.color) {
    panelStyle.borderColor = border.color as string;
  }
  if (backgroundColor) {
    panelStyle.backgroundColor = backgroundColor as string;
  }
  panelStyle.boxShadow = shadow
    ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
    : 'initial';
  const { radius } = border ?? {};

  if (isValid(radius)) {
    panelStyle.borderRadius = isValidNumber(radius) ? `${radius}px` : `${radius}`;
  }

  if (padding) {
    panelStyle.padding = normalizePadding(padding)
      .map(p => `${p}px`)
      .join(' ');
  }

  return panelStyle;
};

export function setStyleToDom(dom: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  if (!dom || !dom.style || !style) {
    return;
  }

  Object.keys(style).forEach(key => {
    (dom.style as any)[key] = (style as any)[key];
  });
}

export function cssToStyleString(style: Partial<CSSStyleDeclaration>) {
  let str = '';

  style &&
    Object.keys(style).forEach(k => {
      if (isValid((style as any)[k])) {
        str += `${lowerCamelCaseToMiddle(k)}:${(style as any)[k]};`;
      }
    });

  return str;
}
