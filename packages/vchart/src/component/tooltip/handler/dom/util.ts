import type { Maybe } from '@visactor/vutils';
import type { FontWeight, TextAlign } from '../../../../typings';
import { mergeSpec } from '../../../../util/spec/merge-spec';
import { normalizeLayoutPaddingSpec } from '../../../../util/space';
import { isValid, isArray } from '@visactor/vutils';
import type { ITooltipTheme } from '../../interface';
import type { ITooltipTextStyle } from '../interface';
import type { ILabelStyle, IShapeStyle, IDomTooltipStyle } from './interface';
import type { TooltipAttributes } from '@visactor/vrender-components';

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

export const pixelPropertyStrToNumber = (str: string): number | number[] => {
  const strArr = str.split(' ');
  const numArr = strArr.map(n => {
    if (!Number.isNaN(n)) {
      return Number.parseFloat(n);
    }
    return Number.parseFloat(n.substring(0, n.length - 2));
  });
  if (numArr.length === 1) {
    return numArr[0];
  }
  return numArr;
};

export function getDomStyles(attributes?: Maybe<TooltipAttributes>): IDomTooltipStyle {
  const {
    panel = {},
    title: titleAttribute,
    content: contentAttribute,
    titleStyle = {},
    contentStyle = {},
    padding,
    keyWidth,
    valueWidth,
    enterable,
    transitionDuration
  } = attributes ?? {};

  const {
    fill: backgroundColor,
    shadow,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    shadowSpread,
    cornerRadius,
    stroke: strokeColor,
    lineWidth = 0,
    width = 0,
    height = 0
  } = panel;

  const { value: title = {} } = titleStyle;
  const { shape = {}, key = {}, value = {} } = contentStyle;

  const shapeStyle = getShapeStyle(shape);
  const keyStyle = getLabelStyle(key);
  const valueStyle = getLabelStyle(value);
  const { bottom, left, right, top } = normalizeLayoutPaddingSpec(padding);

  const styles: IDomTooltipStyle = {
    panel: {
      width: getPixelPropertyStr(width + lineWidth * 2),
      minHeight: getPixelPropertyStr(height + lineWidth * 2),
      paddingBottom: getPixelPropertyStr(bottom as number),
      paddingLeft: getPixelPropertyStr(left as number),
      paddingRight: getPixelPropertyStr(right as number),
      paddingTop: getPixelPropertyStr(top as number),
      borderColor: strokeColor as string,
      borderWidth: getPixelPropertyStr(lineWidth),
      borderRadius: getPixelPropertyStr(cornerRadius),
      backgroundColor: backgroundColor ? `${backgroundColor}` : 'transparent',
      boxShadow: shadow
        ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
        : 'initial',
      pointerEvents: enterable ? 'auto' : 'none',
      transitionDuration: transitionDuration ? `${transitionDuration}ms` : 'initial',
      transitionProperty: transitionDuration ? 'transform' : 'initial',
      transitionTimingFunction: transitionDuration ? 'ease-out' : 'initial'
    },
    title: {
      marginTop: '0px',
      marginBottom: contentAttribute?.length ? getPixelPropertyStr(titleAttribute?.spaceRow) : '0px',
      ...getLabelStyle(mergeSpec({}, title, titleAttribute?.value))
    },
    content: {},
    shapeColumn: {
      common: shapeStyle,
      items: [],
      width: getPixelPropertyStr(shape.size),
      marginRight: getPixelPropertyStr(shape.spacing ?? DEFAULT_SHAPE_SPACING),
      marginBottom: getPixelPropertyStr(-(contentAttribute?.[contentAttribute?.length - 1]?.spaceRow ?? 0))
    },
    keyColumn: {
      common: keyStyle,
      items: contentAttribute?.map(
        ({ key, spaceRow }, i) =>
          ({
            marginTop: '0px',
            marginBottom: i < contentAttribute.length - 1 ? getPixelPropertyStr(spaceRow) : '0px',
            ...keyStyle,
            ...getLabelStyle(key as ITooltipTextStyle),
            ...(key?.multiLine ? { width: getPixelPropertyStr(Math.ceil(key.width)) } : undefined) // 对多行文本使用定宽
          } as ILabelStyle)
      ),
      width: getPixelPropertyStr(keyWidth),
      marginRight: getPixelPropertyStr(key.spacing ?? DEFAULT_KEY_SPACING)
    },
    valueColumn: {
      common: valueStyle,
      items: contentAttribute?.map(
        ({ value, spaceRow }, i) =>
          ({
            marginTop: '0px',
            marginBottom: i < contentAttribute.length - 1 ? getPixelPropertyStr(spaceRow) : '0px',
            ...valueStyle,
            ...getLabelStyle(value as ITooltipTextStyle),
            ...(value?.multiLine ? { width: getPixelPropertyStr(Math.ceil(value.width)) } : undefined) // 对多行文本使用定宽
          } as ILabelStyle)
      ),
      width: getPixelPropertyStr(valueWidth),
      marginRight: getPixelPropertyStr(value.spacing ?? DEFAULT_VALUE_SPACING)
    }
  };
  return styles;
}

function getLabelStyle(
  labelStyle?: ITooltipTextStyle,
  defaultStyle?: Partial<ITooltipTextStyle>
): ILabelStyle | undefined {
  if (!labelStyle) {
    return undefined;
  }
  const {
    fontFamily: labelFont,
    fontSize: labelFontSize,
    fill: labelColor,
    textAlign,
    lineHeight,
    fontWeight,
    multiLine,
    wordBreak,
    maxWidth
  } = mergeSpec({}, defaultStyle, labelStyle) as ITooltipTextStyle;
  const styleObj: ILabelStyle = {};

  styleObj.fontFamily = labelFont;
  styleObj.fontSize = getPixelPropertyStr(labelFontSize);
  styleObj.color = labelColor as string;
  styleObj.textAlign = textAlign as TextAlign;
  styleObj.lineHeight = getPixelPropertyStr(lineHeight as number);
  styleObj.fontWeight = fontWeight as FontWeight;
  styleObj.whiteSpace = multiLine ? 'initial' : 'nowrap';
  styleObj.wordBreak = multiLine ? wordBreak ?? 'break-word' : 'normal';
  styleObj.maxWidth = getPixelPropertyStr(maxWidth);
  return styleObj;
}

function getShapeStyle(
  shapeStyle?: ITooltipTheme['shape'],
  defaultStyle?: Partial<ITooltipTheme['shape']>
): IShapeStyle | undefined {
  if (!shapeStyle) {
    return undefined;
  }
  const { size } = mergeSpec({}, defaultStyle, shapeStyle);
  const styleObj: IShapeStyle = {};

  styleObj.width = getPixelPropertyStr(size);
  return styleObj;
}
