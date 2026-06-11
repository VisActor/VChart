import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  DEFAULT_BLOCK_HEIGHT,
  buildRichContent,
  getLayout,
  getThemeColor,
  omitImageLayoutSpec,
  resolveBlockWidth,
  withAlpha
} from './common';

// portrait 布局：中轴 rect + 左右交替的 image + image 下方 title/content
const PORTRAIT_AXIS_WIDTH = 64;
const PORTRAIT_AXIS_PADDING = 50; // 中轴上下两端的留白
const PORTRAIT_IMAGE_WIDTH = 180;
const PORTRAIT_IMAGE_HEIGHT = 110;
const PORTRAIT_IMAGE_GAP_FROM_AXIS = 24; // image 与中轴之间的水平间距
const PORTRAIT_SHADOW_OFFSET_X = 36;
const PORTRAIT_SHADOW_OFFSET_Y = 20;
const PORTRAIT_SHADOW_SCALE = 1.12;
const PORTRAIT_TEXT_GAP_FROM_IMAGE = 8;
const PORTRAIT_CONTENT_LINES = 3;
const PORTRAIT_TITLE_LINE_HEIGHT = 19;
const PORTRAIT_CONTENT_LINE_HEIGHT = 18;
const PORTRAIT_CONTENT_FONT_SIZE = 12;
const PORTRAIT_TITLE_TO_CONTENT_GAP = 4;

/**
 * 获取 portrait 布局的中轴 rect 尺寸：宽度固定，高度贯穿首/尾 block 中心。
 */
const getPortraitAxisRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const blocks = getLayout(spec, ctx).blocks;
  if (!blocks.length) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const firstCy = blocks[0].center.y;
  const lastCy = blocks[blocks.length - 1].center.y;
  const top = Math.min(firstCy, lastCy);
  const bottom = Math.max(firstCy, lastCy);
  const cx = blocks[0].center.x;
  return {
    x: cx - PORTRAIT_AXIS_WIDTH / 2,
    y: top - PORTRAIT_AXIS_PADDING,
    width: PORTRAIT_AXIS_WIDTH,
    height: bottom - top + PORTRAIT_AXIS_PADDING * 2
  };
};

export const buildPortraitAxisMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec => {
  const themeColor = getThemeColor(spec);
  const lineStyle = spec.line?.style ?? {};
  const defaultFill = {
    gradient: 'linear',
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 1,
    stops: [
      { offset: 0, color: withAlpha(themeColor, 0.2) },
      { offset: 1, color: withAlpha(themeColor, 1) }
    ]
  };
  return {
    type: 'group' as any,
    name: 'storyline-portrait-axis',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'rect',
        name: 'storyline-portrait-axis-rect',
        interactive: false,
        style: {
          fill: (lineStyle as any).fill ?? defaultFill,
          stroke: (lineStyle as any).stroke ?? false,
          lineWidth: (lineStyle as any).lineWidth ?? 0,
          cornerRadius: (lineStyle as any).cornerRadius ?? 0,
          x: (_d: unknown, ctx: LayoutContext) => getPortraitAxisRect(spec, ctx).x,
          y: (_d: unknown, ctx: LayoutContext) => getPortraitAxisRect(spec, ctx).y,
          width: (_d: unknown, ctx: LayoutContext) => getPortraitAxisRect(spec, ctx).width,
          height: (_d: unknown, ctx: LayoutContext) => getPortraitAxisRect(spec, ctx).height
        }
      } as ICustomMarkSpec<'rect'>
    ]
  };
};

const getPortraitMetrics = (spec: IStorylineSpec, blockWidth: number, _blockHeight: number, index: number) => {
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 14);
  const titleLineHeight = Number(
    (spec.title?.style as any)?.lineHeight ?? Math.max(PORTRAIT_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.35))
  );
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? PORTRAIT_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? PORTRAIT_CONTENT_LINE_HEIGHT);
  const contentHeight = PORTRAIT_CONTENT_LINES * contentLineHeight;
  const titleToContentGap = PORTRAIT_TITLE_TO_CONTENT_GAP;
  const textHeight = titleLineHeight + titleToContentGap + contentHeight;

  const imageWidth = spec.image?.width ?? PORTRAIT_IMAGE_WIDTH;
  const imageHeight = spec.image?.height ?? PORTRAIT_IMAGE_HEIGHT;

  const onLeft = index % 2 === 0;

  const axisHalf = PORTRAIT_AXIS_WIDTH / 2;
  const imageX = onLeft
    ? -axisHalf - PORTRAIT_IMAGE_GAP_FROM_AXIS - imageWidth
    : axisHalf + PORTRAIT_IMAGE_GAP_FROM_AXIS;
  const imageY = -imageHeight / 2;

  const textX = imageX;
  const textY = imageY + imageHeight + PORTRAIT_TEXT_GAP_FROM_IMAGE;
  const textWidth = imageWidth;

  const contentBox = {
    x: textX,
    y: textY + titleLineHeight + titleToContentGap,
    width: textWidth,
    height: contentHeight
  };

  const shadowOffsetX = PORTRAIT_SHADOW_OFFSET_X;
  const shadowOffsetY = PORTRAIT_SHADOW_OFFSET_Y;
  const shadowWidth = imageWidth * PORTRAIT_SHADOW_SCALE;
  const shadowHeight = imageHeight * PORTRAIT_SHADOW_SCALE;
  const baseShadowX = imageX - (shadowWidth - imageWidth) / 2;
  const baseShadowY = imageY - (shadowHeight - imageHeight) / 2;
  const shadowBox = {
    x: baseShadowX + (onLeft ? -shadowOffsetX : shadowOffsetX),
    y: baseShadowY + shadowOffsetY,
    width: shadowWidth,
    height: shadowHeight
  };

  return {
    onLeft,
    titleFontSize,
    titleLineHeight,
    contentFontSize,
    contentLineHeight,
    blockWidth,
    imageBox: { x: imageX, y: imageY, width: imageWidth, height: imageHeight },
    shadowBox,
    textBox: { x: textX, y: textY, width: textWidth, height: textHeight },
    contentBox
  };
};

export const buildPortraitBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 14);
  const titleLineHeight = Number(
    (spec.title?.style as any)?.lineHeight ?? Math.max(PORTRAIT_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.35))
  );

  const getMetrics = (ctx: LayoutContext) => {
    const lb = getLayout(spec, ctx).blocks[index];
    const w = lb?.width ?? resolveBlockWidth(spec, 0);
    const h = lb?.height ?? spec.block?.height ?? DEFAULT_BLOCK_HEIGHT;
    return getPortraitMetrics(spec, w, h, index);
  };
  const themeColor = getThemeColor(spec);
  const blockStyle = spec.block?.style ?? {};

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => {
        const lb = getLayout(spec, ctx).blocks[index];
        return lb?.center?.x ?? 0;
      },
      y: (_d: unknown, ctx: LayoutContext) => {
        const lb = getLayout(spec, ctx).blocks[index];
        return lb?.center?.y ?? 0;
      }
    },
    children: [
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-shadow-image-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.height,
              image: block.image,
              cornerRadius: 8,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center'
            }
          } as ICustomMarkSpec<'image'>)
        : null,
      hasImage
        ? ({
            type: 'rect',
            name: `storyline-block-shadow-mask-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.height,
              cornerRadius: 8,
              stroke: false,
              lineWidth: 0,
              fill: {
                gradient: 'linear',
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 1,
                stops: [
                  { offset: 0, color: withAlpha(themeColor, 0.2) },
                  { offset: 1, color: withAlpha(themeColor, 1) }
                ]
              }
            }
          } as ICustomMarkSpec<'rect'>)
        : null,
      {
        type: 'rect',
        name: `storyline-block-image-bg-${index}`,
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.x,
          y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.y,
          width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.width,
          height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.height,
          cornerRadius: 8,
          fill: '#ffffff',
          stroke: themeColor,
          lineWidth: 2,
          ...blockStyle
        }
      } as ICustomMarkSpec<'rect'>,
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-image-${index}`,
            interactive: false,
            ...omitImageLayoutSpec(spec.image),
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.height,
              image: block.image,
              cornerRadius: 8,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              ...spec.image?.style
            }
          } as ICustomMarkSpec<'image'>)
        : null,
      block.title
        ? ({
            type: 'text',
            name: `storyline-block-title-${index}`,
            interactive: false,
            ...spec.title,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).textBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).textBox.y,
              text: block.title,
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).textBox.width,
              fontSize: titleFontSize,
              lineHeight: titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              textAlign: 'left',
              textBaseline: 'top',
              ...spec.title?.style
            }
          } as ICustomMarkSpec<'text'>)
        : null,
      contentText.length
        ? ({
            type: 'text',
            name: `storyline-block-content-${index}`,
            interactive: false,
            ...spec.content,
            textType: 'rich',
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.height,
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.width,
              heightLimit: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.height,
              text: buildRichContent(contentText, spec),
              fontSize: PORTRAIT_CONTENT_FONT_SIZE,
              lineHeight: PORTRAIT_CONTENT_LINE_HEIGHT,
              textAlign: 'left',
              textBaseline: 'top',
              wordBreak: 'break-word',
              ellipsis: '...',
              fill: '#596173',
              ...spec.content?.style
            }
          } as ICustomMarkSpec<'text'>)
        : null
    ].filter(Boolean) as ICustomMarkSpec<any>[]
  };
};
