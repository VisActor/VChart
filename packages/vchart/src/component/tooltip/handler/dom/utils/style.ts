import type { FontWeight, TextAlign } from '../../../../../typings';
import { isValid, merge, isArray } from '../../../../../util';
import type { ITooltipTheme } from '../../../interface';
import type { ITextStyle, ITooltipStyle } from '../../interface';
import type { ILabelStyle, IMargin, IShapeStyle, IDomTooltipStyle } from '../interface';

const STYLE_SYMBOL_SIZE = 8;

const getPixelPropertyStr = (num?: number | number[], defaultStr?: string) => {
  if (isValid(num)) {
    if (isArray(num)) {
      return num.map(n => `${n}px`).join(' ');
    }
    return `${num}px`;
  }
  return defaultStr ?? 'initial';
};

export function getDomStyles(style: ITooltipStyle): IDomTooltipStyle {
  const {
    panel: {
      fill,
      fillColor,
      shadow,
      shadowBlur,
      shadowColor,
      shadowOffsetX,
      shadowOffsetY,
      shadowSpread,
      borderRadius,
      strokeColor,
      lineWidth
    },
    padding,
    key: name,
    value,
    title,
    shape,
    maxWidth,
    minWidth,
    enterable,
    spaceRow,
    transitionDuration
  } = style;

  const backgroundColor = fillColor as string;

  const styles = {
    panel: {
      paddingBottom: getPixelPropertyStr(padding.bottom),
      paddingLeft: getPixelPropertyStr(padding.left),
      paddingRight: getPixelPropertyStr(padding.right),
      paddingTop: getPixelPropertyStr(padding.top),
      borderColor: strokeColor,
      borderWidth: getPixelPropertyStr(lineWidth),
      borderRadius: getPixelPropertyStr(borderRadius),
      backgroundColor: fill && backgroundColor ? `${backgroundColor}` : 'transparent',
      boxShadow: shadow
        ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
        : 'initial',
      maxWidth: getPixelPropertyStr(maxWidth),
      minWidth: getPixelPropertyStr(minWidth),
      pointerEvents: enterable ? 'auto' : 'none',
      transitionDuration: transitionDuration ? `${transitionDuration}ms` : 'initial',
      transitionProperty: transitionDuration ? 'transform' : 'initial',
      transitionTimingFunction: transitionDuration ? 'ease-out' : 'initial'
    },
    title: getLabelStyle(title),
    content: {
      key: getLabelStyle(name, { spacing: 26 }),
      value: getLabelStyle(value),
      shape: getShapeStyle(shape)
    }
  } as IDomTooltipStyle;

  if (isValid(spaceRow)) {
    const gapUnit = spaceRow / 2;
    ([styles.content.shape, styles.content.key, styles.content.value] as IMargin[]).forEach(obj => {
      obj.marginTop = getPixelPropertyStr(gapUnit);
      obj.marginBottom = obj.marginTop;
    });
    styles.content.marginTop = getPixelPropertyStr(-gapUnit);
    styles.content.marginBottom = styles.content.marginTop;
  } else {
    ([styles.content, styles.content.shape, styles.content.key, styles.content.value] as IMargin[]).forEach(obj => {
      obj.marginTop = 'initial';
      obj.marginBottom = 'initial';
    });
  }
  return styles;
}

function getLabelStyle(labelStyle?: ITextStyle, defaultStyle?: Partial<ITextStyle>): ILabelStyle | undefined {
  if (!labelStyle) {
    return undefined;
  }
  const {
    fontFamily: labelFont,
    fontSize: labelFontSize,
    fillColor: labelColor,
    textAlign,
    lineHeight,
    fontWeight,
    spacing
  } = merge({}, defaultStyle, labelStyle) as ITextStyle;
  const styleObj: ILabelStyle = {};

  styleObj.fontFamily = labelFont;
  styleObj.fontSize = getPixelPropertyStr(labelFontSize);
  styleObj.color = labelColor as string;
  styleObj.textAlign = textAlign as TextAlign;
  styleObj.lineHeight = getPixelPropertyStr(lineHeight);
  styleObj.fontWeight = fontWeight as FontWeight;
  styleObj.marginRight = getPixelPropertyStr(spacing);
  return styleObj;
}

function getShapeStyle(
  shapeStyle?: ITooltipTheme['shape'],
  defaultStyle?: Partial<ITooltipTheme['shape']>
): IShapeStyle | undefined {
  if (!shapeStyle) {
    return undefined;
  }
  const { spacing, size } = merge({}, defaultStyle, shapeStyle);
  const styleObj: IShapeStyle = {};

  styleObj.marginRight = getPixelPropertyStr(spacing, `${STYLE_SYMBOL_SIZE}px`);
  styleObj.width = getPixelPropertyStr(size);
  styleObj.height = styleObj.width;
  return styleObj;
}
