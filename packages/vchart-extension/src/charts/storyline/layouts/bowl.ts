import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  type StorylinePoint,
  buildRichContent,
  getRegionGeometry,
  getThemeColor,
  normalizeLayout,
  normalizePadding,
  omitImageLayoutSpec,
  resolveBlockWidth,
  withAlpha
} from './common';

// bowl 布局：dome 的上下镜像
// - centerImage 贴顶（dome 是贴底）
// - 弧线在 centerImage 下方（dome 在上方）
// - block 沿弧线分布、image + title/content 位于弧线外侧（弧线下方）
// - title/content 位于 image 下方（dome 是上方）
// image 默认为圆形，BOWL_BLOCK_IMAGE_SIZE 即圆的直径
const BOWL_BLOCK_IMAGE_SIZE = 140;
const BOWL_TEXT_GAP_FROM_IMAGE = 10;
const BOWL_TITLE_LINE_HEIGHT = 19;
const BOWL_CONTENT_LINE_HEIGHT = 17;
const BOWL_CONTENT_FONT_SIZE = 12;
// title + content 区域总高度（默认 300px，溢出由富文本 heightLimit + ellipsis 自动截断）
const BOWL_TEXT_BOX_HEIGHT = 300;
const BOWL_TITLE_TO_CONTENT_GAP = 4;
// 引导线与 title/content 之间的水平间距
const BOWL_TEXT_LEFT_PADDING = 20;
const BOWL_CENTER_IMAGE_WIDTH_RATIO = 0.32;
const BOWL_CENTER_IMAGE_HEIGHT_RATIO = 0.32;
// 弧线最低点（视觉上的底点）距离 centerImage 底部的距离
const BOWL_ARC_BOTTOM_GAP_FROM_CENTER_IMAGE = 300;

/**
 * 计算 bowl 布局 centerImage 的 box：水平居中、垂直贴顶（位于 inner 区域顶部）。
 */
const getBowlCenterImageRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const w = Math.max(spec.centerImage?.width ?? innerWidth * BOWL_CENTER_IMAGE_WIDTH_RATIO, 80);
  const h = Math.max(spec.centerImage?.height ?? innerHeight * BOWL_CENTER_IMAGE_HEIGHT_RATIO, 60);
  const cx = startX + padding.left + innerWidth / 2;
  // 紧贴顶部，仅保留 spec.block.padding.top 的留白
  const top = startY + padding.top;
  return { x: cx - w / 2, y: top, width: w, height: h };
};

/**
 * 计算 bowl 弧线的几何参数：
 * - cx / rx / startAngle / endAngle 与 layout.ts 中 arcCenters 一致；
 * - cy 与 ry 由两条对齐约束反推：
 *   1) 弧线起/终点 y == centerImage 顶部
 *   2) 弧线最低点 y == centerImage 底部 + BOWL_ARC_BOTTOM_GAP_FROM_CENTER_IMAGE
 *
 * bowl 的 startAngle = 20°、endAngle = 160°（弧线在 centerImage 下方）。
 * 解方程：
 *   cy + ry * sin(startAngle) = centerImageTop
 *   cy + ry                   = centerImageBottom + GAP
 * → ry = (GAP + centerImageHeight) / (1 - sin(startAngle))
 *   cy = centerImageTop - ry * sin(startAngle)
 */
const getBowlArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, startX } = getRegionGeometry(ctx);
  const blockPadding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - blockPadding.left - blockPadding.right, 1);
  const blockWidth = resolveBlockWidth(spec, width);
  const layoutOpt = normalizeLayout(spec.layout);
  // bowl 默认弧线起止角与 layout.ts 中一致
  const startAngle = layoutOpt.startAngle ?? 20;
  const endAngle = layoutOpt.endAngle ?? 160;
  const ratio = layoutOpt.radiusRatio ?? 0.88;
  const rx = Math.max((innerWidth - blockWidth) / 2, 1) * ratio;
  const centerRect = getBowlCenterImageRect(spec, ctx);
  const centerTop = centerRect.y;
  const centerBottom = centerRect.y + centerRect.height;
  const sinStart = Math.sin((startAngle / 180) * Math.PI);
  // sinStart 接近 1 时 ry → ∞；这里限制下界以防 startAngle 配置异常
  const denom = Math.max(1 - sinStart, 0.05);
  const ry = (centerRect.height + BOWL_ARC_BOTTOM_GAP_FROM_CENTER_IMAGE) / denom;
  const cy = centerTop - ry * sinStart;
  return {
    cx: startX + blockPadding.left + innerWidth / 2,
    cy,
    rx,
    ry,
    startAngle,
    endAngle,
    centerTop,
    centerBottom
  };
};

/**
 * 在 bowl 弧线上按 index 采样 block 中心，与 arc 完全同步。
 * 同时让 block 沿弧线径向向外偏移 imageHeight/2，
 * 使 image 内边贴在弧线上，image + text 整体位于弧线外侧（下方）。
 */
const getBowlBlockCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint => {
  const arc = getBowlArcGeometry(spec, ctx);
  const count = spec.data?.length ?? 0;
  if (count <= 0) {
    return { x: arc.cx, y: arc.cy };
  }
  const t = count === 1 ? 0.5 : index / (count - 1);
  const angle = ((arc.startAngle + (arc.endAngle - arc.startAngle) * t) / 180) * Math.PI;
  const px = arc.cx + Math.cos(angle) * arc.rx;
  const py = arc.cy + Math.sin(angle) * arc.ry;
  // 椭圆在 (px,py) 处的外法向量 ∝ (cos(angle)/rx, sin(angle)/ry)
  const nxRaw = Math.cos(angle) / arc.rx;
  const nyRaw = Math.sin(angle) / arc.ry;
  const nLen = Math.hypot(nxRaw, nyRaw) || 1;
  const nx = nxRaw / nLen;
  const ny = nyRaw / nLen;
  const imageHeight = spec.image?.height ?? BOWL_BLOCK_IMAGE_SIZE;
  const offset = imageHeight / 2;
  return { x: px + nx * offset, y: py + ny * offset };
};

/**
 * 贯穿所有 block 的弧线 mark（path 通过沿椭圆采样实现）
 * 默认不展示，仅当用户在 spec.line.visible 显式置为 true 时才渲染。
 */
export const buildBowlArcMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible !== true) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  return {
    type: 'group' as any,
    name: 'storyline-bowl-arc',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'path',
        name: 'storyline-bowl-arc-path',
        interactive: false,
        style: {
          stroke: themeColor,
          lineWidth: 2,
          lineCap: 'round',
          fill: 'transparent',
          fillOpacity: 0,
          path: (_d: unknown, ctx: LayoutContext) => {
            const arc = getBowlArcGeometry(spec, ctx);
            const span = arc.endAngle - arc.startAngle;
            const samples = 64;
            const segments: string[] = [];
            for (let i = 0; i <= samples; i++) {
              const t = i / samples;
              const angle = ((arc.startAngle + span * t) / 180) * Math.PI;
              const x = arc.cx + Math.cos(angle) * arc.rx;
              const y = arc.cy + Math.sin(angle) * arc.ry;
              segments.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            return segments.join(' ');
          }
        }
      } as ICustomMarkSpec<'path'>
    ]
  };
};

export const buildBowlCenterImageMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  const visible = spec.centerImage?.visible !== false;
  if (!visible) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  const hasImage = !!spec.centerImage?.image;
  // 主题色生成的线性渐变（顶部偏淡 → 底部主题色），作为 centerImage 位置的 symbol 填充
  const symbolGradient = {
    gradient: 'linear',
    x0: 0.5,
    y0: 0,
    x1: 0.5,
    y1: 1,
    stops: [
      { offset: 0, color: withAlpha(themeColor, 0.15) },
      { offset: 1, color: themeColor }
    ]
  };
  return {
    type: 'group' as any,
    name: 'storyline-bowl-center',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'symbol',
        name: 'storyline-bowl-center-symbol',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => {
            const r = getBowlCenterImageRect(spec, ctx);
            return r.x + r.width / 2;
          },
          y: (_d: unknown, ctx: LayoutContext) => {
            const r = getBowlCenterImageRect(spec, ctx);
            return r.y + r.height / 2;
          },
          size: (_d: unknown, ctx: LayoutContext) => {
            const r = getBowlCenterImageRect(spec, ctx);
            return Math.max(r.width, r.height) * 1.1;
          },
          symbolType: 'circle',
          fill: symbolGradient,
          stroke: themeColor,
          lineWidth: 2
        }
      } as ICustomMarkSpec<'symbol'>,
      {
        type: 'rect',
        name: 'storyline-bowl-center-rect',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).x,
          y: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).y,
          width: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).width,
          height: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).height,
          cornerRadius: 12,
          fill: '#ffffff',
          stroke: themeColor,
          lineWidth: 2
        }
      } as ICustomMarkSpec<'rect'>,
      hasImage
        ? ({
            type: 'image',
            name: 'storyline-bowl-center-image',
            interactive: false,
            ...spec.centerImage,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).x,
              y: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).y,
              width: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).width,
              height: (_d: unknown, ctx: LayoutContext) => getBowlCenterImageRect(spec, ctx).height,
              image: spec.centerImage?.image,
              cornerRadius: 12,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              ...spec.centerImage?.style
            }
          } as ICustomMarkSpec<'image'>)
        : null
    ].filter(Boolean) as ICustomMarkSpec<any>[]
  };
};

const getBowlBlockMetrics = (spec: IStorylineSpec) => {
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 14);
  const titleLineHeight = Number(
    (spec.title?.style as any)?.lineHeight ?? Math.max(BOWL_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.35))
  );
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? BOWL_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? BOWL_CONTENT_LINE_HEIGHT);
  const titleToContentGap = BOWL_TITLE_TO_CONTENT_GAP;
  const textHeight = BOWL_TEXT_BOX_HEIGHT;
  const contentHeight = Math.max(textHeight - titleLineHeight - titleToContentGap, contentLineHeight);

  const imageWidth = spec.image?.width ?? BOWL_BLOCK_IMAGE_SIZE;
  const imageHeight = spec.image?.height ?? BOWL_BLOCK_IMAGE_SIZE;

  // image 位于 block 中心，title/content 在 image 下方（与 dome 上下对称）
  const imageBox = {
    x: -imageWidth / 2,
    y: -imageHeight / 2,
    width: imageWidth,
    height: imageHeight
  };
  const textBox = {
    x: -imageWidth / 2 + BOWL_TEXT_LEFT_PADDING,
    y: imageBox.y + imageHeight + BOWL_TEXT_GAP_FROM_IMAGE,
    width: imageWidth - BOWL_TEXT_LEFT_PADDING,
    height: textHeight
  };
  const contentBox = {
    x: textBox.x,
    y: textBox.y + titleLineHeight + titleToContentGap,
    width: textBox.width,
    height: contentHeight
  };
  return {
    titleFontSize,
    titleLineHeight,
    contentFontSize,
    contentLineHeight,
    imageBox,
    textBox,
    contentBox
  };
};

export const buildBowlBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const themeColor = getThemeColor(spec);
  const metrics = getBowlBlockMetrics(spec);

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getBowlBlockCenter(spec, ctx, index).x,
      y: (_d: unknown, ctx: LayoutContext) => getBowlBlockCenter(spec, ctx, index).y
    },
    children: [
      // title / content 左侧的垂直引导线（贯穿 image 底部 → text 底部，与文字保持 padding）
      {
        type: 'rect',
        name: `storyline-block-connector-${index}`,
        interactive: false,
        style: {
          x: metrics.imageBox.x,
          y: metrics.imageBox.y + metrics.imageBox.height,
          width: 2,
          height: Math.max(
            metrics.textBox.y + metrics.textBox.height - (metrics.imageBox.y + metrics.imageBox.height),
            0
          ),
          fill: themeColor,
          fillOpacity: 0.6
        }
      } as ICustomMarkSpec<'rect'>,
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-image-${index}`,
            interactive: false,
            ...omitImageLayoutSpec(spec.image),
            style: {
              x: metrics.imageBox.x,
              y: metrics.imageBox.y,
              width: metrics.imageBox.width,
              height: metrics.imageBox.height,
              image: block.image,
              // 圆形裁剪：cornerRadius = min(w,h) / 2
              cornerRadius: Math.min(metrics.imageBox.width, metrics.imageBox.height) / 2,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              stroke: themeColor,
              lineWidth: 2,
              ...spec.image?.style
            }
          } as ICustomMarkSpec<'image'>)
        : ({
            type: 'rect',
            name: `storyline-block-image-bg-${index}`,
            interactive: false,
            style: {
              x: metrics.imageBox.x,
              y: metrics.imageBox.y,
              width: metrics.imageBox.width,
              height: metrics.imageBox.height,
              cornerRadius: Math.min(metrics.imageBox.width, metrics.imageBox.height) / 2,
              fill: '#ffffff',
              stroke: themeColor,
              lineWidth: 2
            }
          } as ICustomMarkSpec<'rect'>),
      block.title
        ? ({
            type: 'text',
            name: `storyline-block-title-${index}`,
            interactive: false,
            ...spec.title,
            style: {
              x: metrics.textBox.x,
              y: metrics.textBox.y,
              text: block.title,
              maxLineWidth: metrics.textBox.width,
              fontSize: metrics.titleFontSize,
              lineHeight: metrics.titleLineHeight,
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
              x: metrics.contentBox.x,
              y: metrics.contentBox.y,
              width: metrics.contentBox.width,
              height: metrics.contentBox.height,
              maxLineWidth: metrics.contentBox.width,
              heightLimit: metrics.contentBox.height,
              text: buildRichContent(contentText, spec),
              fontSize: BOWL_CONTENT_FONT_SIZE,
              lineHeight: BOWL_CONTENT_LINE_HEIGHT,
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
