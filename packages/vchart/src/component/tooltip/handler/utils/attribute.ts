import type {
  IContainerSize,
  TooltipAttributes,
  TooltipRowAttrs,
  TooltipSymbolAttrs
} from '@visactor/vrender-components';
import type { IToolTipActual, MaybeArray } from '../../../../typings';
import type { ITooltipStyle, ITooltipTextStyle } from '../interface';
import { isValid } from '@visactor/vutils';
import { getRichTextBounds, initTextMeasure } from '../../../../util';
import type { IRichTextParagraphCharacter } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { builtinSymbolsMap } from '@visactor/vrender';

export const getTooltipAttributes = (actualTooltip: IToolTipActual, style: ITooltipStyle): TooltipAttributes => {
  const { spaceRow, padding, title: titleStyle, shape: shapeStyle, key: keyStyle, value: valueStyle } = style;

  const attribute: TooltipAttributes = {
    ...style,

    title: {},
    content: [],

    titleStyle: {
      value: titleStyle,
      spaceRow
    },
    contentStyle: {
      shape: shapeStyle,
      key: keyStyle,
      value: valueStyle,
      spaceRow
    },

    hasContentShape: false,
    keyWidth: 0,
    valueWidth: 0
  };
  (['key', 'value', 'shape'] as (keyof ITooltipStyle)[]).forEach(key => {
    delete attribute[key];
  });

  const { title = {}, content = [] } = actualTooltip;

  let maxWidth = 0;
  let containerHeight = padding.top + padding.bottom;

  // calculate title
  let titleMaxHeight = 0;
  const {
    visible: titleVisible = true,
    value: titleValue = '',
    hasShape: titleHasShape,
    shapeType: titleShapeType = '',
    shapeHollow: titleShapeHollow,
    shapeColor: titleShapeColor
  } = title;
  attribute.title.visible = titleVisible;
  if (titleVisible) {
    const { text, width, height } = measureTooltipText(titleValue, titleStyle);
    // FIXME: vrender 发版后去掉 any
    attribute.title.value = {
      width,
      height,
      text,
      multiLine: titleStyle.multiLine,
      wordBreak: titleStyle.wordBreak
    } as any;
    maxWidth = width;
    titleMaxHeight = height;

    if (titleHasShape && builtinSymbolsMap[titleShapeType]) {
      const titleShapeAttrs: TooltipSymbolAttrs = {
        symbolType: titleShapeType
      };
      if (titleShapeHollow) {
        titleShapeAttrs.stroke = titleShapeColor;
      } else {
        titleShapeAttrs.fill = titleShapeColor;
      }
      attribute.title.shape = titleShapeAttrs;
      maxWidth += shapeStyle.size + shapeStyle.spacing;
      titleMaxHeight = Math.max(shapeStyle.size, titleMaxHeight);
    }

    attribute.title.width = maxWidth;
    attribute.title.height = titleMaxHeight;

    containerHeight += titleMaxHeight;
  }

  // calculate content
  if (content.length) {
    // filter content
    const filteredContent = content.filter(item => {
      return (item.key || item.value) && item.visible !== false;
    });
    if (filteredContent.length) {
      if (titleVisible) {
        containerHeight += spaceRow; // title 与 content 之前的间隔
      }

      let hasContentShape = false;
      const keyWidths: number[] = [];
      const adaptiveKeyWidths: number[] = [];
      const valueWidths: number[] = [];

      attribute.content = filteredContent.map((item, i) => {
        const itemAttrs: TooltipRowAttrs = { height: 0, spaceRow };
        let itemHeight = 0;
        const { hasShape, key, shapeColor, shapeHollow, shapeType = '', value, isKeyAdaptive } = item;
        if (isValid(key)) {
          const { width, height, text } = measureTooltipText(key, keyStyle);
          // FIXME: vrender 发版后去掉 any
          itemAttrs.key = {
            width,
            height,
            text,
            multiLine: keyStyle.multiLine,
            wordBreak: titleStyle.wordBreak
          } as any;
          if (!isKeyAdaptive) {
            keyWidths.push(width);
          } else {
            adaptiveKeyWidths.push(width);
          }
          itemHeight = Math.max(itemHeight, height);
        }
        if (isValid(value)) {
          const { width, height, text } = measureTooltipText(value, valueStyle);
          // FIXME: vrender 发版后去掉 any
          itemAttrs.value = {
            width,
            height,
            text,
            multiLine: valueStyle.multiLine,
            wordBreak: titleStyle.wordBreak
          } as any;
          valueWidths.push(width);
          itemHeight = Math.max(itemHeight, height);
        }
        if (hasShape && builtinSymbolsMap[shapeType]) {
          hasContentShape = true;
          const shape: TooltipSymbolAttrs = {
            visible: true,
            symbolType: shapeType
          };
          if (shapeHollow) {
            shape.stroke = shapeColor;
          } else {
            shape.fill = shapeColor;
          }
          itemHeight = Math.max(shapeStyle.size, itemHeight);
          itemAttrs.shape = shape;
        } else {
          itemAttrs.shape = { visible: false };
        }

        itemAttrs.height = itemHeight;
        containerHeight += itemHeight;
        if (i < filteredContent.length - 1) {
          containerHeight += spaceRow;
        }

        return itemAttrs;
      });

      const maxKeyWidth = keyWidths.length ? Math.max(...keyWidths) : 0; // name 需要对齐
      const maxAdaptiveKeyWidth = adaptiveKeyWidths.length ? Math.max(...adaptiveKeyWidths) : 0;
      const maxValueWidth = valueWidths.length ? Math.max(...valueWidths) : 0; // value 需要对齐
      const shapeWidth = hasContentShape ? shapeStyle.size + shapeStyle.spacing : 0; // shape 列宽度
      maxWidth = Math.max(
        maxKeyWidth + maxValueWidth + keyStyle.spacing + valueStyle.spacing + shapeWidth,
        maxAdaptiveKeyWidth + shapeWidth,
        maxWidth
      );
      attribute.hasContentShape = hasContentShape;
      attribute.keyWidth = maxKeyWidth;
      attribute.valueWidth = maxValueWidth;
    }
  }

  const containerSize: IContainerSize = {
    width: maxWidth + padding.left + padding.right,
    height: containerHeight
  };

  attribute.panel.width = containerSize.width;
  attribute.panel.height = containerSize.height;
  return attribute;
};

interface ITooltipTextInfo {
  width: number;
  height: number;
  text: MaybeArray<number> | MaybeArray<string>;
}

export const measureTooltipText = (text: string, style: ITooltipTextStyle): ITooltipTextInfo => {
  const measure = initTextMeasure(style as any);
  if (!style.multiLine) {
    // 单行文本
    const { width, height } = measure.fullMeasure(text);
    return {
      width,
      height,
      text
    };
  }
  // 多行文本
  let textLines = text.split('\n');
  textLines = textLines.map((line, i) => (i < textLines.length - 1 ? line + '\n' : line));
  const { width, height } = measure.fullMeasure(textLines);

  if (style.maxWidth && style.maxWidth <= width) {
    // 允许自动换行的情况，改用 richText 测量
    const bound = getRichTextBounds({
      wordBreak: style.wordBreak,
      maxWidth: style.maxWidth,
      width: 0,
      height: 0,
      textConfig: textLines.map(
        (line, i) =>
          ({
            ...style,
            text: line
          } as unknown as IRichTextParagraphCharacter)
      )
    });
    return {
      width: bound.width(),
      height: bound.height(),
      text: textLines
    };
  }

  return {
    width,
    height,
    text: textLines
  };
};
