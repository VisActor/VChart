import { LayoutZIndex, type IExtensionGroupMarkSpec } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  DEFAULT_BLOCK_HEIGHT,
  DEFAULT_IMAGE_GAP,
  BLOCK_TITLE_MAX_LINES,
  buildPlainContent,
  getBlockTitleHeight,
  getImageBackgroundStyle,
  getImageBox,
  getLayout,
  getRegionGeometry,
  getTextBox,
  getThemeColor,
  normalizeLayout,
  normalizePadding,
  omitImageLayoutSpec,
  resolveAdaptiveLineHeight,
  resolveBlockWidth,
  resolveTitleFontSize,
  shouldShowImageBackground,
  withAlpha
} from './common';

/**
 * ladder 布局：参考 Bauhaus 信息图。
 *
 * 视觉结构（direction='up'）：
 * ┌─────────────────────────────────────────────────┐
 * │                              [block 2]          │
 * │              ╲╲╲                                │
 * │           ╲╲╲ headline 大字 ╲╲╲                 │
 * │       ╲╲╲                                       │
 * │   [block 1]                                     │
 * └─────────────────────────────────────────────────┘
 *
 * - direction='up'（默认）：对角线左下 → 右上
 * - direction='down'：对角线左上 → 右下
 * - headline 大字沿对角线方向旋转，叠加在对角线上
 * - 每个 block 在对角线上取一个 anchor 点，沿对角线法向左偏 / 右偏交替放置
 *   layout.ts 中 'ladder' 分支已经给出 block 中心点位置，本文件只关心
 *   "对角线本身" 与 "headline 文本" 这两个装饰图元，以及 block 的左右镜像排版。
 */

// headline 字号占可用高度的比例，自适应于不同画布
const LADDER_HEADLINE_FONT_RATIO = 0.42;
const LADDER_HEADLINE_FONT_MIN = 80;
const LADDER_HEADLINE_FONT_MAX = 240;
const LADDER_DIAGONAL_LINE_WIDTH = 2;
const LADDER_DIAGONAL_DASH = [12, 8];

// ladder 中 block 的默认视觉参数（比通用默认值更大，符合 Bauhaus 信息图风格）
const LADDER_BLOCK_IMAGE_SIZE = 100;
const LADDER_TITLE_FONT_SIZE = 28;
const LADDER_TITLE_LINE_HEIGHT = 26;
const LADDER_CONTENT_FONT_SIZE = 16;
const LADDER_CONTENT_LINE_HEIGHT = 23;

const isDownLadder = (spec: IStorylineSpec) => normalizeLayout(spec.layout).direction === 'down';

/**
 * 计算对角线两个端点（与 layout.ts 中 ladder 的 anchors 起止点保持一致）。
 * - direction='up'（默认）：左下 → 右上
 * - direction='down'：左上 → 右下
 */
const getLadderDiagonalGeometry = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const innerX = startX + padding.left;
  const innerY = startY + padding.top;
  const innerW = Math.max(width - padding.left - padding.right, 1);
  const innerH = Math.max(height - padding.top - padding.bottom, 1);
  const isDown = isDownLadder(spec);
  const x0 = innerX;
  const x1 = innerX + innerW;
  const y0 = isDown ? innerY : innerY + innerH;
  const y1 = isDown ? innerY + innerH : innerY;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  // 对角线方向角度（度，画布坐标系：顺时针为正）。
  // up 时 dy<0 → 负角度（向上倾）；down 时 dy>0 → 正角度（向下倾）。
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angleRad = (Math.atan2(dy, dx) / Math.PI) * 180;
  const fontSize = Math.max(
    LADDER_HEADLINE_FONT_MIN,
    Math.min(LADDER_HEADLINE_FONT_MAX, Math.round(innerH * LADDER_HEADLINE_FONT_RATIO))
  );
  return { x0, y0, x1, y1, cx, cy, angleRad, fontSize };
};

const getLadderHeadlineText = (spec: IStorylineSpec) => {
  const layoutOpt = normalizeLayout(spec.layout);
  if (typeof layoutOpt.headline === 'string' && layoutOpt.headline.length > 0) {
    return layoutOpt.headline;
  }
  // 回退：使用 spec.title 文本，再退化为占位
  const title = (spec.title?.style as { text?: string } | undefined)?.text;
  if (typeof title === 'string' && title.length > 0) {
    return title;
  }
  return 'storyline';
};

/**
 * 对角线 mark：贯穿 inner 矩形。
 */
export const buildLadderDiagonalMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec => {
  const themeColor = getThemeColor(spec);
  return {
    type: 'group' as any,
    name: 'storyline-ladder-diagonal',
    // 对角线在最底层
    zIndex: LayoutZIndex.Mark - 1,
    children: [
      {
        type: 'path',
        name: 'storyline-ladder-diagonal-line',
        interactive: false,
        style: {
          path: (_d: unknown, ctx: LayoutContext) => {
            const g = getLadderDiagonalGeometry(spec, ctx);
            return `M ${g.x0} ${g.y0} L ${g.x1} ${g.y1}`;
          },
          stroke: withAlpha(themeColor, 0.85),
          lineWidth: LADDER_DIAGONAL_LINE_WIDTH,
          lineDash: LADDER_DIAGONAL_DASH,
          fill: 'transparent'
        }
      } as ICustomMarkSpec<'path'>
    ]
  };
};

/**
 * 倾斜的大字 headline mark，方向与对角线完全一致。
 * 整个 group 围绕对角线中点 (cx, cy) 旋转 angle，文本本身做水平/垂直居中。
 */
export const buildLadderHeadlineMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  const text = getLadderHeadlineText(spec);
  if (!text) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  return {
    type: 'group' as any,
    name: 'storyline-ladder-headline',
    // headline 在对角线之上、block 之下
    zIndex: LayoutZIndex.Mark,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getLadderDiagonalGeometry(spec, ctx).cx,
      y: (_d: unknown, ctx: LayoutContext) => getLadderDiagonalGeometry(spec, ctx).cy,
      angle: (_d: unknown, ctx: LayoutContext) => getLadderDiagonalGeometry(spec, ctx).angleRad
    },
    children: [
      {
        type: 'text',
        name: 'storyline-ladder-headline-text',
        interactive: false,
        style: {
          // 相对 group 局部坐标，(0, 0) 即旋转中心
          x: 0,
          y: 0,
          text,
          fontSize: (_d: unknown, ctx: LayoutContext) => getLadderDiagonalGeometry(spec, ctx).fontSize,
          fontWeight: 900,
          fontFamily: 'Impact, "Arial Black", sans-serif',
          fill: withAlpha(themeColor, 0.92),
          textAlign: 'center',
          textBaseline: 'middle'
        }
      } as ICustomMarkSpec<'text'>
    ]
  };
};

// ===== block mark =====

/**
 * ladder 中"对角线左侧 block"的判定：
 * layout.ts 中的法向 (nx, ny) = (-dy/len, dx/len)。
 * - direction='up'：dy<0 → ny<0，sign=+1 → ny*sign<0 → 上方；可推得 偶数 index 在右上侧、奇数在左下侧。
 *   "对角线左侧" = 奇数 index。
 * - direction='down'：dy>0 → ny>0，sign=+1 → ny*sign>0 → 下方；偶数 index 在右下侧、奇数在左上侧。
 *   "对角线左侧" = 奇数 index。
 * 因此两种 direction 下"对角线左侧"的判定一致。
 */
const isOnLeft = (index: number) => index % 2 === 1;

const getLadderBlockMetrics = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
  const block = getLayout(spec, ctx).blocks[index];
  const padding = normalizePadding(spec.block?.padding ?? 12);
  // 左侧 block：image 放右；右侧 block：image 放左
  const imagePosition = isOnLeft(index) ? ('right' as const) : ('left' as const);
  const imageWidth = spec.image?.width ?? LADDER_BLOCK_IMAGE_SIZE;
  const imageHeight = spec.image?.height ?? LADDER_BLOCK_IMAGE_SIZE;
  const imageGap = spec.image?.gap ?? DEFAULT_IMAGE_GAP;
  const hasImage = !!spec.data?.[index]?.image;
  const blockWidth = block?.width ?? resolveBlockWidth(spec, 0);
  const blockHeight = block?.height ?? spec.block?.height ?? DEFAULT_BLOCK_HEIGHT;
  const imageBox = getImageBox(
    imagePosition,
    blockWidth,
    blockHeight,
    padding,
    imageWidth,
    imageHeight,
    imageGap,
    hasImage
  );
  const textBox = getTextBox(
    imagePosition,
    blockWidth,
    blockHeight,
    padding,
    imageWidth,
    imageHeight,
    imageGap,
    hasImage
  );
  const titleFontSize = resolveTitleFontSize(
    spec,
    ctx,
    spec.data?.[index]?.title,
    textBox.width,
    LADDER_TITLE_FONT_SIZE,
    [8, 34]
  );
  const titleLineHeight = resolveAdaptiveLineHeight(
    titleFontSize,
    spec.title?.style as any,
    LADDER_TITLE_LINE_HEIGHT,
    LADDER_TITLE_LINE_HEIGHT / LADDER_TITLE_FONT_SIZE
  );
  const titleHeight = getBlockTitleHeight(titleLineHeight, spec.data?.[index]?.title, textBox.width, titleFontSize);
  const contentGap = spec.data?.[index]?.title ? 8 : 0;
  return {
    block: { width: blockWidth, height: blockHeight },
    titleFontSize,
    titleLineHeight,
    titleHeight,
    imageBox,
    textBox,
    contentBox: {
      y: textBox.y + titleHeight + contentGap,
      height: Math.max(0, textBox.height - titleHeight - contentGap)
    }
  };
};

/**
 * ladder 的 block mark：
 * - 对角线左侧 block：image 在右，title / content textAlign='right'
 * - 对角线右侧 block：image 在左，title / content textAlign='left'
 */
export const buildLadderBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const onLeft = isOnLeft(index);
  const align = onLeft ? 'right' : 'left';
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const showBackground = spec.block?.showBackground === true;
  const showImageBackground = shouldShowImageBackground(spec);

  // textAlign='right' 时 x 锚点取 textBox 右端，否则取左端
  const getTitleX = (ctx: LayoutContext) => {
    const m = getLadderBlockMetrics(spec, ctx, index);
    return align === 'right' ? m.textBox.x + m.textBox.width : m.textBox.x;
  };

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getLayout(spec, ctx).blocks[index]?.x ?? 0,
      y: (_d: unknown, ctx: LayoutContext) => getLayout(spec, ctx).blocks[index]?.y ?? 0,
      width: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).block.width,
      height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).block.height
    },
    children: [
      showBackground
        ? ({
            type: 'rect',
            name: `storyline-block-bg-${index}`,
            interactive: false,
            style: {
              x: 0,
              y: 0,
              width: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).block.width,
              height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).block.height,
              cornerRadius: 8,
              fill: '#ffffff',
              stroke: '#d7dce5',
              lineWidth: 1,
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.08)',
              ...spec.block?.style
            }
          } as ICustomMarkSpec<'rect'>)
        : null,
      showImageBackground
        ? ({
            type: 'rect',
            name: `storyline-block-image-bg-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.height,
              cornerRadius: 8,
              ...getImageBackgroundStyle(spec),
              ...spec.block?.style
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
              x: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).imageBox.height,
              image: block.image,
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
              x: (_d: unknown, ctx: LayoutContext) => getTitleX(ctx),
              y: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).textBox.y,
              text: block.title,
              height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).titleHeight,
              heightLimit: (_d: unknown, ctx: LayoutContext) =>
                getLadderBlockMetrics(spec, ctx, index).titleLineHeight * BLOCK_TITLE_MAX_LINES,
              lineClamp: BLOCK_TITLE_MAX_LINES,
              fontSize: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).titleFontSize,
              lineHeight: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
              textBaseline: 'top',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              ellipsis: '...',
              ...spec.title?.style,
              // 由于 ladder 强制按对角线左右镜像，textAlign 不允许被外层 spec.title.style 覆盖
              textAlign: align
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
              x: (_d: unknown, ctx: LayoutContext) => getTitleX(ctx),
              y: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).contentBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).textBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).contentBox.height,
              text: buildPlainContent(contentText),
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getLadderBlockMetrics(spec, ctx, index).textBox.width,
              heightLimit: (_d: unknown, ctx: LayoutContext) =>
                getLadderBlockMetrics(spec, ctx, index).contentBox.height,
              fontSize: LADDER_CONTENT_FONT_SIZE,
              lineHeight: LADDER_CONTENT_LINE_HEIGHT,
              textBaseline: 'top',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              ellipsis: '...',
              fill: '#596173',
              ...spec.content?.style,
              textAlign: align
            }
          } as ICustomMarkSpec<'text'>)
        : null
    ].filter(Boolean) as ICustomMarkSpec<'rect' | 'image' | 'text'>[]
  };
};
