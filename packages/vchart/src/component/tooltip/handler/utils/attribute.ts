import type {
  IContainerSize,
  TooltipAttributes,
  TooltipRowAttrs,
  TooltipSymbolAttrs
} from '@visactor/vrender-components';
import type { IToolTipActual, MaybeArray } from '../../../../typings';
import type { ITooltipStyle, ITooltipTextStyle } from '../interface';
import { isValid } from '@visactor/vutils';
import { initTextMeasure, mergeSpec } from '../../../../util';
import type { IRichTextParagraphCharacter } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { builtinSymbolsMap, getRichTextBounds } from '@visactor/vrender';
import { getTextAttributes } from './style';

export const getTooltipAttributes = (
  actualTooltip: IToolTipActual,
  style: Partial<ITooltipStyle>
): TooltipAttributes => {
  const {
    spaceRow: commonSpaceRow,
    padding,
    title: titleStyle,
    shape: shapeStyle,
    key: keyStyle,
    value: valueStyle
  } = style;

  const attribute: TooltipAttributes = {
    ...style,

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
    valueWidth: 0
  };
  (['key', 'value', 'shape'] as (keyof ITooltipStyle)[]).forEach(key => {
    delete attribute[key];
  });

  const { title = {}, content = [] } = actualTooltip;

  let containerWidth = padding.left + padding.right;
  let containerHeight = padding.top + padding.bottom;

  // calculate content
  let hasContent = false;
  let contentMaxWidth = 0;
  if (content.length) {
    // filter content
    const filteredContent = content.filter(item => {
      return (item.key || item.value) && item.visible !== false;
    });
    if (filteredContent.length) {
      hasContent = true;
      const keyWidths: number[] = [];
      const adaptiveKeyWidths: number[] = [];
      const valueWidths: number[] = [];
      const shapeWidths: number[] = [];

      attribute.content = filteredContent.map((item, i) => {
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
          const itemKeyStyle = mergeSpec({}, keyStyle, getTextAttributes(actualKeyStyle, undefined, {}));
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
          const itemValueStyle = mergeSpec({}, valueStyle, getTextAttributes(actualValueStyle, undefined, {}));
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

      const maxKeyWidth = keyWidths.length ? Math.max(...keyWidths) : 0; // name 需要对齐
      const maxAdaptiveKeyWidth = adaptiveKeyWidths.length ? Math.max(...adaptiveKeyWidths) : 0;
      const maxValueWidth = valueWidths.length ? Math.max(...valueWidths) : 0; // value 需要对齐
      const shapeWidth = shapeWidths.length ? Math.max(...shapeWidths) + shapeStyle.spacing : 0; // shape 列宽度
      contentMaxWidth = Math.max(
        shapeWidth + maxKeyWidth + keyStyle.spacing + maxValueWidth + valueStyle.spacing,
        shapeWidth + maxAdaptiveKeyWidth,
        contentMaxWidth
      );
      attribute.hasContentShape = !!shapeWidths.length;
      attribute.keyWidth = maxKeyWidth;
      attribute.valueWidth = maxValueWidth;
    }
  }

  // calculate title
  let titleMaxWidth = 0;
  let titleMaxHeight = 0;
  const {
    visible: actualTitleVisible = true,
    value: actualTitleValue = '',
    valueStyle: actualTitleValueStyle,
    hasShape: actualTitleHasShape,
    shapeType: actualTitleShapeType = '',
    spaceRow: actualTitleSpaceRow,
    // 弃用的属性，做下兼容
    shapeHollow: actualTitleShapeHollow,
    shapeColor: actualTitleShapeColor
  } = title;
  attribute.title.visible = actualTitleVisible;
  attribute.title.spaceRow = actualTitleSpaceRow ?? commonSpaceRow;
  if (actualTitleVisible) {
    const titleValueStyle = mergeSpec(
      {
        multiLine: true, // 标题默认支持多行显示
        maxWidth: hasContent ? Math.ceil(contentMaxWidth) : undefined
      } as ITooltipTextStyle,
      titleStyle,
      getTextAttributes(actualTitleValueStyle, undefined, {})
    );
    const { text, width, height } = measureTooltipText(actualTitleValue, titleValueStyle);
    attribute.title.value = {
      width,
      height,
      ...titleValueStyle,
      text
    };
    titleMaxWidth = width;
    titleMaxHeight = height;

    if (actualTitleHasShape && builtinSymbolsMap[actualTitleShapeType]) {
      const titleShapeAttrs: TooltipSymbolAttrs = {
        symbolType: actualTitleShapeType
      };
      if (actualTitleShapeHollow) {
        titleShapeAttrs.stroke = actualTitleShapeColor;
      } else {
        titleShapeAttrs.fill = actualTitleShapeColor;
      }
      attribute.title.shape = titleShapeAttrs;
      titleMaxWidth += shapeStyle.size + shapeStyle.spacing;
      titleMaxHeight = Math.max(shapeStyle.size, titleMaxHeight);
    }

    attribute.title.width = titleMaxWidth;
    attribute.title.height = titleMaxHeight;

    containerHeight += titleMaxHeight;
    if (hasContent) {
      containerHeight += attribute.title.spaceRow; // title 与 content 之前的间隔
    }
  }

  containerWidth += contentMaxWidth ? contentMaxWidth : titleMaxWidth;
  const containerSize: IContainerSize = {
    width: containerWidth,
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
  text = (text ?? '').toString();
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
      wordBreak: style.wordBreak ?? 'break-word',
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
