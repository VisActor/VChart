import { isArray, isValid, isValidNumber, lowerCamelCaseToMiddle, normalizePadding } from '@visactor/vutils';
import type { ITooltipSpec, ITooltipTextTheme, ITooltipTheme } from '../../../../component/tooltip';
import type { ITheme } from '../../../../theme';
import { token } from '../../../../theme/token';

const DEFAULT_SHAPE_SPACING = 8;
const DEFAULT_KEY_SPACING = 26;
const DEFAULT_VALUE_SPACING = 0;

export const getPixelPropertyStr = (num?: number | number[], defaultStr?: string) => {
  if (isValid(num)) {
    if (isArray(num)) {
      return num.map(n => `${n}px`).join(' ');
    }
    return `${num}px`;
  }
  return defaultStr ?? 'initial';
};

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
  const contentStyle: Partial<CSSStyleDeclaration> = {};

  panelStyle.pointerEvents = enterable ? 'auto' : 'none';
  if (transitionDuration) {
    panelStyle.transitionDuration = transitionDuration ? `${transitionDuration}ms` : 'initial';
    panelStyle.transitionProperty = transitionDuration ? 'transform' : 'initial';
    panelStyle.transitionTimingFunction = transitionDuration ? 'ease-out' : 'initial';
  }
  panelStyle.fontFamily = (globalTheme?.fontFamily ?? token.fontFamily) as string;

  if (isValidNumber(commonSpaceRow)) {
    rowStyle.marginBottom = `${commonSpaceRow}px`;
  }
  if (isValidNumber(maxContentHeight)) {
    contentStyle.maxHeight = `${maxContentHeight}px`;
    contentStyle.overflowY = 'auto';
    // todo 让内容宽度往外阔一点，给滚动条留出位置
    contentStyle.width = `calc(100% + ${panelStyle.padding ? panelStyle.padding.split(' ')[1] : '10px'})`;
  }

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
    panelStyle.direction = 'rtl';
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
    content: contentStyle,
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
    panelStyle.padding = getPixelPropertyStr(normalizePadding(padding));
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
