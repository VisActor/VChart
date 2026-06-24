import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  DEFAULT_BLOCK_HEIGHT,
  BLOCK_TITLE_MAX_LINES,
  buildPlainContent,
  getBlockTitleHeight,
  getImageBackgroundStyle,
  getLayout,
  omitImageLayoutSpec,
  resolveAdaptiveLineHeight,
  resolveMarkerFontSize,
  resolveBlockWidth,
  resolveTitleFontSize,
  shouldShowImageBackground,
  withAlpha
} from './common';

// portrait 布局：中轴 rect + 左右交替的 image + image 下方 title/content
// 中轴默认加宽，便于在轴上叠放 block.marker 时间节点文字（纵向逐字排列）
const PORTRAIT_AXIS_WIDTH = 96;
const PORTRAIT_AXIS_PADDING = 120; // 中轴上下两端的留白
// marker 时间节点文字的默认样式（fontSize 30、白色字、贴轴对应一侧边缘）
const PORTRAIT_MARKER_FONT_SIZE = 34;
const PORTRAIT_MARKER_LINE_HEIGHT = 24;
const PORTRAIT_MARKER_AXIS_PADDING = 6; // marker 距离轴边缘的水平内边距
// image 默认尺寸的占比规则（基于 region 平均槽位）：
// - image 高度  = slotHeight * 0.6
// - content 高度 = slotHeight * (0.6 + 0.4)
// 其中 slotHeight = regionHeight / (blockCount + 1)，由 getLayout 计算。
export const PORTRAIT_IMAGE_HEIGHT_RATIO = 0.6;
export const PORTRAIT_CONTENT_HEIGHT_RATIO = 1.25;
const PORTRAIT_IMAGE_GAP_FROM_AXIS = 24; // image 与中轴之间的水平间距
const PORTRAIT_SHADOW_OFFSET_X = 24; // subImage 相对主 image 的水平错位量
const PORTRAIT_SHADOW_OFFSET_Y = 16; // subImage 相对主 image 的垂直错位量
const PORTRAIT_SHADOW_SCALE = 1; // subImage 与主 image 同尺寸，仅做错位偏移
export const PORTRAIT_TEXT_GAP_FROM_IMAGE = 8;
export const PORTRAIT_CONTENT_LINES = 3;
export const PORTRAIT_TITLE_LINE_HEIGHT = 34;
export const PORTRAIT_CONTENT_LINE_HEIGHT = 23;
const PORTRAIT_CONTENT_FONT_SIZE = 16;
export const PORTRAIT_TITLE_TO_CONTENT_GAP = 4;

export const buildPortraitAxisMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec => {
  const themeColor = spec.themeColor ?? '#e8543d';
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
  // marker 时间节点文字：垂直方向逐字排列（每字符换行）
  const markerVisible = spec.marker?.visible !== false;

  const markerMarks = markerVisible
    ? (spec.data ?? [])
        .map((block, index) => {
          if (!block.marker) {
            return null;
          }
          // image 在 block 左侧时（index 偶数），marker 贴轴左边缘 + 左对齐；
          // image 在 block 右侧时（index 奇数），marker 贴轴右边缘 + 右对齐。
          const onLeft = index % 2 === 0;
          const axisHalf = PORTRAIT_AXIS_WIDTH / 2;
          const markerOffsetX = onLeft
            ? -axisHalf + PORTRAIT_MARKER_AXIS_PADDING
            : axisHalf - PORTRAIT_MARKER_AXIS_PADDING;
          const markerTextAlign: 'left' | 'right' = onLeft ? 'left' : 'right';
          return {
            type: 'text',
            textType: 'rich',
            name: `storyline-portrait-marker-${index}`,
            interactive: false,
            ...spec.marker,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => {
                const lb = getLayout(spec, ctx).blocks[index];
                return (lb?.center?.x ?? 0) + markerOffsetX;
              },
              y: (_d: unknown, ctx: LayoutContext) => {
                const lb = getLayout(spec, ctx).blocks[index];
                return lb?.center?.y ?? 0;
              },
              text: (_d: unknown, ctx: LayoutContext) => {
                const axis = getPortraitAxisRect(spec, ctx);
                const markerFontSize = resolveMarkerFontSize(
                  spec,
                  ctx,
                  block.marker,
                  axis.height / Math.max(spec.data?.length ?? 1, 1),
                  PORTRAIT_MARKER_FONT_SIZE,
                  [16, 38]
                );
                const markerLineHeight = resolveAdaptiveLineHeight(
                  markerFontSize,
                  spec.marker?.style as any,
                  PORTRAIT_MARKER_LINE_HEIGHT,
                  0.9
                );
                return {
                  type: 'rich',
                  text: block.marker.split('').map((char, i, arr) => ({
                    text: char + (i < arr.length - 1 ? '\n' : ''),
                    fontSize: markerFontSize,
                    lineHeight: markerLineHeight,
                    fill: '#fff',
                    align: markerTextAlign
                  }))
                };
              },
              fontWeight: 'bold',
              lineJoin: 'round',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 5,
              textAlign: markerTextAlign,
              textBaseline: 'middle',
              ...(spec.marker?.style as any)
            }
          } as ICustomMarkSpec<'text'>;
        })
        .filter(Boolean)
    : [];

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
      } as ICustomMarkSpec<'rect'>,
      ...(markerMarks as ICustomMarkSpec<any>[])
    ]
  };
};

const getPortraitMetrics = (
  spec: IStorylineSpec,
  blockWidth: number,
  blockHeight: number,
  index: number,
  ctx: LayoutContext
) => {
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? PORTRAIT_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? PORTRAIT_CONTENT_LINE_HEIGHT);
  const titleToContentGap = PORTRAIT_TITLE_TO_CONTENT_GAP;

  // 默认 image 高度 = blockHeight * 0.4（blockHeight = regionHeight / count，由 getLayout 计算）；
  // 默认 image 宽度 = blockWidth，让 image 横向自适应单个 block 槽位宽度
  const imageWidth = spec.image?.width ?? Math.max(blockWidth, 80);
  const imageHeight = spec.image?.height ?? Math.round(blockHeight * PORTRAIT_IMAGE_HEIGHT_RATIO);
  const titleFontSize = resolveTitleFontSize(spec, ctx, spec.data?.[index]?.title, imageWidth, 26, [8, 34]);
  const titleLineHeight = resolveAdaptiveLineHeight(
    titleFontSize,
    spec.title?.style as any,
    PORTRAIT_TITLE_LINE_HEIGHT
  );
  const titleHeight = getBlockTitleHeight(titleLineHeight, spec.data?.[index]?.title);
  const minContentHeight = PORTRAIT_CONTENT_LINES * contentLineHeight;
  // 默认 content 高度 = blockHeight * 0.4
  const contentHeight = Math.max(minContentHeight, Math.round(blockHeight * PORTRAIT_CONTENT_HEIGHT_RATIO));

  const textHeight = titleHeight + titleToContentGap + contentHeight;

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
    y: textY + titleHeight + titleToContentGap,
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

/**
 * 获取 portrait 布局的中轴 rect 尺寸：宽度固定，高度覆盖首尾 block 的完整内容范围。
 */
const getPortraitAxisRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const blocks = getLayout(spec, ctx).blocks;
  if (!blocks.length) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  blocks.forEach((block, index) => {
    const metrics = getPortraitMetrics(spec, block.width, block.height, index, ctx);
    const localTop = Math.min(metrics.imageBox.y, metrics.shadowBox.y, metrics.textBox.y, metrics.contentBox.y);
    const localBottom = Math.max(
      metrics.imageBox.y + metrics.imageBox.height,
      metrics.shadowBox.y + metrics.shadowBox.height,
      metrics.textBox.y + metrics.textBox.height,
      metrics.contentBox.y + metrics.contentBox.height
    );
    top = Math.min(top, block.center.y + localTop);
    bottom = Math.max(bottom, block.center.y + localBottom);
  });
  const cx = blocks[0].center.x;
  return {
    x: cx - PORTRAIT_AXIS_WIDTH / 2,
    y: top - PORTRAIT_AXIS_PADDING,
    width: PORTRAIT_AXIS_WIDTH,
    height: bottom - top + PORTRAIT_AXIS_PADDING * 2
  };
};

export const buildPortraitBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const hasSubImage = !!block.subImage;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];

  const getMetrics = (ctx: LayoutContext) => {
    const lb = getLayout(spec, ctx).blocks[index];
    const w = lb?.width ?? resolveBlockWidth(spec, 0);
    const h = lb?.height ?? spec.block?.height ?? DEFAULT_BLOCK_HEIGHT;
    return getPortraitMetrics(spec, w, h, index, ctx);
  };
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
      hasSubImage
        ? ({
            type: 'image',
            name: `storyline-block-shadow-image-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).shadowBox.height,
              image: block.subImage,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'contain',
              imagePosition: 'center'
            }
          } as ICustomMarkSpec<'image'>)
        : null,
      shouldShowImageBackground(spec)
        ? ({
            type: 'rect',
            name: `storyline-block-image-bg-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).imageBox.height,
              cornerRadius: 8,
              ...getImageBackgroundStyle(spec),
              ...blockStyle
            }
          } as ICustomMarkSpec<'rect'>)
        : null,
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
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'contain',
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
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).titleLineHeight * BLOCK_TITLE_MAX_LINES,
              heightLimit: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).titleLineHeight * BLOCK_TITLE_MAX_LINES,
              lineClamp: BLOCK_TITLE_MAX_LINES,
              fontSize: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).titleFontSize,
              lineHeight: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
              textAlign: 'left',
              textBaseline: 'top',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              ellipsis: '...',
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
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.height,
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.width,
              heightLimit: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentBox.height,
              text: buildPlainContent(contentText),
              fontSize: PORTRAIT_CONTENT_FONT_SIZE,
              lineHeight: PORTRAIT_CONTENT_LINE_HEIGHT,
              textAlign: 'left',
              textBaseline: 'top',
              whiteSpace: 'normal',
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
