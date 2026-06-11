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

// dome 布局：弧形排列 + 底部 centerImage
// image 默认为圆形，DOME_BLOCK_IMAGE_SIZE 即圆的直径
const DOME_BLOCK_IMAGE_SIZE = 140;
const DOME_TEXT_GAP_FROM_IMAGE = 10;
const DOME_TITLE_LINE_HEIGHT = 19;
const DOME_CONTENT_LINE_HEIGHT = 17;
const DOME_CONTENT_FONT_SIZE = 12;
// title + content 区域总高度（默认 400px，溢出由富文本 heightLimit + ellipsis 自动截断）
const DOME_TEXT_BOX_HEIGHT = 300;
const DOME_TITLE_TO_CONTENT_GAP = 4;
// 引导线与 title/content 之间的水平间距
const DOME_TEXT_LEFT_PADDING = 20;
const DOME_CENTER_IMAGE_WIDTH_RATIO = 0.32;
const DOME_CENTER_IMAGE_HEIGHT_RATIO = 0.32;
// 弧线最高点（视觉上的顶点）距离 centerImage 顶部的距离
const DOME_ARC_TOP_GAP_FROM_CENTER_IMAGE = 300;

/**
 * 计算 dome 布局 centerImage 的 box：水平居中、垂直贴底（位于 inner 区域底部）。
 */
const getDomeCenterImageRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const w = Math.max(spec.centerImage?.width ?? innerWidth * DOME_CENTER_IMAGE_WIDTH_RATIO, 80);
  const h = Math.max(spec.centerImage?.height ?? innerHeight * DOME_CENTER_IMAGE_HEIGHT_RATIO, 60);
  const cx = startX + padding.left + innerWidth / 2;
  // 紧贴底部，仅保留 spec.block.padding.bottom 的留白
  const top = startY + padding.top + innerHeight - h;
  return { x: cx - w / 2, y: top, width: w, height: h };
};

/**
 * 计算 dome 弧线的几何参数：
 * - cx / rx / startAngle / endAngle 与 layout.ts 中 arcCenters 一致；
 * - cy 与 ry 由两条对齐约束反推：
 *   1) 弧线起/终点 y == centerImage 底部
 *   2) 弧线最高点 y == centerImage 顶部 - DOME_ARC_TOP_GAP_FROM_CENTER_IMAGE
 *
 * 解方程：
 *   cy + ry * sin(startAngle) = centerImageBottom
 *   cy - ry                   = centerImageTop - GAP
 * → ry = (centerImageHeight + GAP) / (1 + sin(startAngle))
 *   cy = centerImageBottom - ry * sin(startAngle)
 *
 * 仅当 sin(startAngle) ∈ [-1, 0) 时（即 startAngle 在 (180°, 360°) 区间，碗形），
 * 该方程组有合理正解。
 */
const getDomeArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, startX } = getRegionGeometry(ctx);
  const blockPadding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - blockPadding.left - blockPadding.right, 1);
  const blockWidth = resolveBlockWidth(spec, width);
  const layoutOpt = normalizeLayout(spec.layout);
  const startAngle = layoutOpt.startAngle ?? 200;
  const endAngle = layoutOpt.endAngle ?? 340;
  const ratio = layoutOpt.radiusRatio ?? 0.88;
  const rx = Math.max((innerWidth - blockWidth) / 2, 1) * ratio;
  const centerRect = getDomeCenterImageRect(spec, ctx);
  const centerTop = centerRect.y;
  const centerBottom = centerRect.y + centerRect.height;
  const sinStart = Math.sin((startAngle / 180) * Math.PI);
  // sinStart 接近 -1 时 ry → ∞；这里限制下界以防 startAngle 配置异常
  const denom = Math.max(1 + sinStart, 0.05);
  const ry = (centerRect.height + DOME_ARC_TOP_GAP_FROM_CENTER_IMAGE) / denom;
  const cy = centerBottom - ry * sinStart;
  return {
    cx: startX + blockPadding.left + innerWidth / 2,
    cy,
    rx,
    ry,
    startAngle,
    endAngle,
    // 调试/对齐用：上下两个对齐参考点
    centerTop,
    centerBottom
  };
};

/**
 * 在 do me 新弧线上按 index 采样 block 中心，与 arc 完全同步。
 * 同时让 block 沿弧线径向向外偏移 imageHeight/2，
 * 使 image 内边贴在弧线上，image + text 整体位于弧线外侧。
 */
const getDomeBlockCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint => {
  const arc = getDomeArcGeometry(spec, ctx);
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
  const imageHeight = spec.image?.height ?? DOME_BLOCK_IMAGE_SIZE;
  const offset = imageHeight / 2;
  return { x: px + nx * offset, y: py + ny * offset };
};

/**
 * 贯穿所有 block 的半圆弧线 mark（path 通过沿椭圆采样实现，
 * 与 dome block 的弧形布局完全重合）
 *
 * 默认不展示，仅当用户在 spec.line.visible 显式置为 true 时才渲染。
 */
export const buildDomeArcMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible !== true) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  return {
    type: 'group' as any,
    name: 'storyline-dome-arc',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'path',
        name: 'storyline-dome-arc-path',
        interactive: false,
        style: {
          stroke: themeColor,
          lineWidth: 2,
          lineCap: 'round',
          fill: 'transparent',
          fillOpacity: 0,
          path: (_d: unknown, ctx: LayoutContext) => {
            const arc = getDomeArcGeometry(spec, ctx);
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

export const buildDomeCenterImageMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
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
    name: 'storyline-dome-center',
    zIndex: LayoutZIndex.Mark,
    children: [
      // 默认 symbol：位于 centerImage 的位置，外径略大于 centerImage（填充渐变作为视觉底盘）
      {
        type: 'symbol',
        name: 'storyline-dome-center-symbol',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => {
            const r = getDomeCenterImageRect(spec, ctx);
            return r.x + r.width / 2;
          },
          y: (_d: unknown, ctx: LayoutContext) => {
            const r = getDomeCenterImageRect(spec, ctx);
            return r.y + r.height / 2;
          },
          size: (_d: unknown, ctx: LayoutContext) => {
            const r = getDomeCenterImageRect(spec, ctx);
            // symbol 直径略大于 centerImage 较短边，形成"圆形底盘"
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
        name: 'storyline-dome-center-rect',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).x,
          y: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).y,
          width: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).width,
          height: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).height,
          cornerRadius: 12,
          fill: '#ffffff',
          stroke: themeColor,
          lineWidth: 2
        }
      } as ICustomMarkSpec<'rect'>,
      hasImage
        ? ({
            type: 'image',
            name: 'storyline-dome-center-image',
            interactive: false,
            ...spec.centerImage,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).x,
              y: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).y,
              width: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).width,
              height: (_d: unknown, ctx: LayoutContext) => getDomeCenterImageRect(spec, ctx).height,
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

const getDomeBlockMetrics = (spec: IStorylineSpec) => {
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 14);
  const titleLineHeight = Number(
    (spec.title?.style as any)?.lineHeight ?? Math.max(DOME_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.35))
  );
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? DOME_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? DOME_CONTENT_LINE_HEIGHT);
  const titleToContentGap = DOME_TITLE_TO_CONTENT_GAP;
  // text 区域总高度固定为 DOME_TEXT_BOX_HEIGHT，content 占除 title 与间距外的全部高度
  const textHeight = DOME_TEXT_BOX_HEIGHT;
  const contentHeight = Math.max(textHeight - titleLineHeight - titleToContentGap, contentLineHeight);

  const imageWidth = spec.image?.width ?? DOME_BLOCK_IMAGE_SIZE;
  const imageHeight = spec.image?.height ?? DOME_BLOCK_IMAGE_SIZE;

  // image 位于 block 中心下半部分，title/content 在 image 上方
  const imageBox = {
    x: -imageWidth / 2,
    y: -imageHeight / 2,
    width: imageWidth,
    height: imageHeight
  };
  const textBox = {
    x: -imageWidth / 2 + DOME_TEXT_LEFT_PADDING,
    y: imageBox.y - DOME_TEXT_GAP_FROM_IMAGE - textHeight,
    width: imageWidth - DOME_TEXT_LEFT_PADDING,
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

export const buildDomeBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const themeColor = getThemeColor(spec);
  const metrics = getDomeBlockMetrics(spec);

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getDomeBlockCenter(spec, ctx, index).x,
      y: (_d: unknown, ctx: LayoutContext) => getDomeBlockCenter(spec, ctx, index).y
    },
    children: [
      // title / content 左侧的垂直引导线（贯穿 text + image 顶部，与文字保持 padding）
      {
        type: 'rect',
        name: `storyline-block-connector-${index}`,
        interactive: false,
        style: {
          x: metrics.imageBox.x,
          y: metrics.textBox.y,
          width: 2,
          height: Math.max(metrics.imageBox.y - metrics.textBox.y, 0),
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
              fontSize: DOME_CONTENT_FONT_SIZE,
              lineHeight: DOME_CONTENT_LINE_HEIGHT,
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
