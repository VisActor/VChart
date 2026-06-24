import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  type StorylinePoint,
  BLOCK_TITLE_MAX_LINES,
  buildPlainContent,
  getBlockTitleHeight,
  getImageBackgroundStyle,
  getRegionGeometry,
  getThemeColor,
  normalizeLayout,
  omitImageLayoutSpec,
  resolveAdaptiveLineHeight,
  resolveBlockWidth,
  resolveTitleFontSize,
  shouldShowImageBackground,
  withAlpha
} from './common';

// arc 布局：弧形排列 + titleImage（穹顶 / 碗形二合一）
// - direction = 'up'（默认）：穹顶 —— titleImage 贴底，弧线在 titleImage 上方
// - direction = 'down'：碗形 —— titleImage 贴顶，弧线在 titleImage 下方
// image 默认为圆形，ARC_BLOCK_IMAGE_SIZE 即圆的直径
const ARC_BLOCK_IMAGE_SIZE = 240;
// 圆形 image 的边框环厚度（圆形描边宽度）
const ARC_BLOCK_IMAGE_BORDER = 3;
// 圆形 image 背景环相对 image 的外扩量（始终渲染一个比 image 略大的圆形 symbol 作为背景环）
const ARC_BLOCK_IMAGE_HALO_PADDING = 6;
const ARC_TEXT_GAP_FROM_IMAGE = 10;
const ARC_TITLE_FONT_SIZE = 32;
const ARC_TITLE_LINE_HEIGHT = 34;
const ARC_CONTENT_LINE_HEIGHT = 24;
const ARC_CONTENT_FONT_SIZE = 18;
// title + content 区域总高度（默认 240px，溢出由 heightLimit + ellipsis 自动截断）
const ARC_TEXT_BOX_HEIGHT = 240;
const ARC_TITLE_TO_CONTENT_GAP = 4;
// 引导线与 title/content 之间的水平间距
const ARC_TEXT_PADDING = 20;
// title/content 区域的最小宽度，确保文字有足够展示空间，不受 image 宽度限制
const ARC_TEXT_BOX_MIN_WIDTH = 240;
// titleImage 默认尺寸
const ARC_TITLE_IMAGE_WIDTH_RATIO = 0.68;
const ARC_TITLE_IMAGE_MAX_WIDTH = 900;
const ARC_TITLE_IMAGE_HEIGHT_RATIO = 0.34;
// 弧线最高/最低点距离 titleImage 顶部/底部的距离
const ARC_GAP_FROM_TITLE_IMAGE = 200;
const ARC_FIT_MARGIN = 8;

const isDownArc = (spec: IStorylineSpec) => normalizeLayout(spec.layout).direction === 'down';

type ArcGeometry = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startAngle: number;
  endAngle: number;
  centerTop: number;
  centerBottom: number;
};

/**
 * 计算 arc 布局 titleImage 的 box：水平居中。
 * - up（dome）：垂直贴底（位于 inner 区域底部）
 * - down（bowl）：垂直贴顶（位于 inner 区域顶部）
 */
const getArcTitleImageRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const innerWidth = Math.max(width, 1);
  const innerHeight = Math.max(height, 1);
  const baseWidth = Math.min(innerWidth * ARC_TITLE_IMAGE_WIDTH_RATIO, ARC_TITLE_IMAGE_MAX_WIDTH);
  const w = Math.max(spec.titleImage?.width ?? baseWidth, 80);
  const h = Math.max(spec.titleImage?.height ?? w * ARC_TITLE_IMAGE_HEIGHT_RATIO, 40);
  const cx = startX + innerWidth / 2;
  const isDown = isDownArc(spec);
  const top = isDown ? startY : startY + innerHeight - h;
  return { x: cx - w / 2, y: top, width: w, height: h };
};

/**
 * 计算 arc 弧线的几何参数：
 * - cx / rx / startAngle / endAngle 与 layout.ts 中 arcCenters 一致；
 * - cy 与 ry 由两条对齐约束反推，使弧线起/终点 y 与 titleImage 端面对齐，
 *   弧线极值点（顶点 / 底点）距离 titleImage 远端 ARC_GAP_FROM_TITLE_IMAGE。
 *
 * up（dome）：startAngle = 200°、endAngle = 340°（弧线在 titleImage 上方）
 *   cy + ry * sin(startAngle) = titleImageBottom
 *   cy - ry                   = titleImageTop - GAP
 * → ry = (titleImageHeight + GAP) / (1 + sin(startAngle))
 *   cy = titleImageBottom - ry * sin(startAngle)
 *
 * down（bowl）：startAngle = 20°、endAngle = 160°（弧线在 titleImage 下方）
 *   cy + ry * sin(startAngle) = titleImageTop
 *   cy + ry                   = titleImageBottom + GAP
 * → ry = (GAP + titleImageHeight) / (1 - sin(startAngle))
 *   cy = titleImageTop - ry * sin(startAngle)
 */
const getBaseArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext): ArcGeometry => {
  const { width, startX } = getRegionGeometry(ctx);
  // width 已经是 VChart 减去 spec.padding 后的 region 宽度
  const innerWidth = Math.max(width, 1);
  const blockWidth = resolveBlockWidth(spec, width);
  const layoutOpt = normalizeLayout(spec.layout);
  const isDown = layoutOpt.direction === 'down';
  // 默认弧线起止角与 layout.ts 中一致
  const startAngle = layoutOpt.startAngle ?? (isDown ? 20 : 200);
  const endAngle = layoutOpt.endAngle ?? (isDown ? 160 : 340);
  const ratio = layoutOpt.radiusRatio ?? 0.88;
  const rx = Math.max((innerWidth - blockWidth) / 2, 1) * ratio;
  const titleImageRect = getArcTitleImageRect(spec, ctx);
  const centerTop = titleImageRect.y;
  const centerBottom = titleImageRect.y + titleImageRect.height;
  const sinStart = Math.sin((startAngle / 180) * Math.PI);
  let cy: number;
  let ry: number;
  if (isDown) {
    // bowl：sinStart 接近 1 时 ry → ∞；这里限制下界以防 startAngle 配置异常
    const denom = Math.max(1 - sinStart, 0.05);
    ry = (titleImageRect.height + ARC_GAP_FROM_TITLE_IMAGE) / denom;
    cy = centerTop - ry * sinStart;
  } else {
    // dome：sinStart 接近 -1 时 ry → ∞
    const denom = Math.max(1 + sinStart, 0.05);
    ry = (titleImageRect.height + ARC_GAP_FROM_TITLE_IMAGE) / denom;
    cy = centerBottom - ry * sinStart;
  }
  return {
    cx: startX + innerWidth / 2,
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
 * 在 arc 弧线上按 index 采样 block 中心，与 arc 完全同步。
 * 同时让 block 沿弧线径向向外偏移 imageHeight/2，
 * 使 image 内边贴在弧线上，image + text 整体位于弧线外侧。
 */
const getArcBlockCenterByGeometry = (spec: IStorylineSpec, arc: ArcGeometry, index: number): StorylinePoint => {
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
  const imageHeight = spec.image?.height ?? ARC_BLOCK_IMAGE_SIZE;
  const offset = imageHeight / 2;
  return { x: px + nx * offset, y: py + ny * offset };
};

const getArcBlockBounds = (spec: IStorylineSpec, arc: ArcGeometry, index: number) => {
  const center = getArcBlockCenterByGeometry(spec, arc, index);
  const metrics = getArcBlockMetrics(spec, index);
  const halo = shouldShowImageBackground(spec) ? ARC_BLOCK_IMAGE_HALO_PADDING + ARC_BLOCK_IMAGE_BORDER : 0;
  const minX = Math.min(metrics.imageBox.x - halo, metrics.textBox.x, metrics.contentBox.x);
  const maxX = Math.max(
    metrics.imageBox.x + metrics.imageBox.width + halo,
    metrics.textBox.x + metrics.textBox.width,
    metrics.contentBox.x + metrics.contentBox.width
  );
  const minY = Math.min(metrics.imageBox.y - halo, metrics.textBox.y, metrics.contentBox.y);
  const maxY = Math.max(
    metrics.imageBox.y + metrics.imageBox.height + halo,
    metrics.textBox.y + metrics.textBox.height,
    metrics.contentBox.y + metrics.contentBox.height
  );
  return {
    left: center.x + minX,
    right: center.x + maxX,
    top: center.y + minY,
    bottom: center.y + maxY
  };
};

const getArcBlocksBounds = (spec: IStorylineSpec, arc: ArcGeometry) => {
  const count = spec.data?.length ?? 0;
  if (!count) {
    return { left: arc.cx, right: arc.cx, top: arc.cy, bottom: arc.cy };
  }
  return Array.from({ length: count }, (_, index) => getArcBlockBounds(spec, arc, index)).reduce(
    (bounds, blockBounds) => ({
      left: Math.min(bounds.left, blockBounds.left),
      right: Math.max(bounds.right, blockBounds.right),
      top: Math.min(bounds.top, blockBounds.top),
      bottom: Math.max(bounds.bottom, blockBounds.bottom)
    }),
    {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY
    }
  );
};

const getArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext): ArcGeometry => {
  const arc = getBaseArcGeometry(spec, ctx);
  const region = getRegionGeometry(ctx);
  const bounds = getArcBlocksBounds(spec, arc);
  const fit = {
    left: region.startX + ARC_FIT_MARGIN,
    right: region.startX + region.width - ARC_FIT_MARGIN,
    top: region.startY + ARC_FIT_MARGIN,
    bottom: region.startY + region.height - ARC_FIT_MARGIN
  };
  let shiftX = 0;
  let shiftY = 0;
  const boundsWidth = bounds.right - bounds.left;
  const boundsHeight = bounds.bottom - bounds.top;
  const fitWidth = fit.right - fit.left;
  const fitHeight = fit.bottom - fit.top;

  if (boundsWidth > fitWidth) {
    shiftX = (fit.left + fit.right - bounds.left - bounds.right) / 2;
  } else if (bounds.left < fit.left) {
    shiftX = fit.left - bounds.left;
  } else if (bounds.right > fit.right) {
    shiftX = fit.right - bounds.right;
  }

  if (boundsHeight > fitHeight) {
    shiftY = (fit.top + fit.bottom - bounds.top - bounds.bottom) / 2;
  } else if (bounds.top < fit.top) {
    shiftY = fit.top - bounds.top;
  } else if (bounds.bottom > fit.bottom) {
    shiftY = fit.bottom - bounds.bottom;
  }

  return shiftX || shiftY ? { ...arc, cx: arc.cx + shiftX, cy: arc.cy + shiftY } : arc;
};

const getArcBlockCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint =>
  getArcBlockCenterByGeometry(spec, getArcGeometry(spec, ctx), index);

/**
 * 贯穿所有 block 的弧线 mark（path 通过沿椭圆采样实现，与 arc block 的弧形布局完全重合）
 *
 * 默认不展示，仅当用户在 spec.line.visible 显式置为 true 时才渲染。
 */
export const buildArcMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible !== true) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  return {
    type: 'group' as any,
    name: 'storyline-arc',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'path',
        name: 'storyline-arc-path',
        interactive: false,
        style: {
          stroke: themeColor,
          lineWidth: 2,
          lineCap: 'round',
          fill: 'transparent',
          fillOpacity: 0,
          path: (_d: unknown, ctx: LayoutContext) => {
            const arc = getArcGeometry(spec, ctx);
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

export const buildArcTitleImageMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (!spec.titleImage?.image || spec.titleImage.visible === false) {
    return null;
  }
  return {
    type: 'group' as any,
    name: 'storyline-arc-title-image',
    zIndex: LayoutZIndex.Mark + 6,
    children: [
      {
        type: 'image',
        name: 'storyline-arc-title-image-node',
        interactive: false,
        ...spec.titleImage,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => {
            return getArcTitleImageRect(spec, ctx).x;
          },
          y: (_d: unknown, ctx: LayoutContext) => {
            return getArcTitleImageRect(spec, ctx).y;
          },
          width: (_d: unknown, ctx: LayoutContext) => {
            return getArcTitleImageRect(spec, ctx).width;
          },
          height: (_d: unknown, ctx: LayoutContext) => {
            return getArcTitleImageRect(spec, ctx).height;
          },
          image: spec.titleImage.image,
          repeatX: 'no-repeat',
          repeatY: 'no-repeat',
          imageMode: 'contain',
          imagePosition: 'center',
          ...spec.titleImage.style
        }
      } as ICustomMarkSpec<'image'>
    ]
  };
};

const getArcBlockMetrics = (spec: IStorylineSpec, index: number = 0) => {
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? ARC_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? ARC_CONTENT_LINE_HEIGHT);
  const titleToContentGap = ARC_TITLE_TO_CONTENT_GAP;

  // 强制 image 为正方形（直径），保证圆形裁切有效
  const imageDiameter = Math.max(spec.image?.width ?? ARC_BLOCK_IMAGE_SIZE, spec.image?.height ?? ARC_BLOCK_IMAGE_SIZE);
  const imageWidth = imageDiameter;
  const imageHeight = imageDiameter;

  const isDown = isDownArc(spec);

  // content 默认宽度 = 图表宽度 / （block 数量 + 1），让内容沿弧线均匀分布；
  // 用户可通过 spec.block?.width 覆盖；同时保留一个下限避免极端情况下不可见。
  const count = Math.max(spec.data?.length ?? 0, 1);
  const canvasWidth = Number((spec.width as number | undefined) ?? imageWidth * count);
  const defaultTextWidth = Math.round(canvasWidth / (count + 1));
  const textBoxWidth = Math.max(
    Number((spec.block as { width?: number } | undefined)?.width ?? defaultTextWidth),
    ARC_TEXT_BOX_MIN_WIDTH
  );
  const titleFontSize = resolveTitleFontSize(
    spec,
    undefined,
    spec.data?.[index]?.title,
    textBoxWidth,
    ARC_TITLE_FONT_SIZE,
    [8, 40]
  );
  const titleLineHeight = resolveAdaptiveLineHeight(titleFontSize, spec.title?.style as any, ARC_TITLE_LINE_HEIGHT);
  const titleHeight = getBlockTitleHeight(titleLineHeight, spec.data?.[index]?.title);
  // text 区域总高度固定为 ARC_TEXT_BOX_HEIGHT，content 占除 title 与间距外的全部高度
  const textHeight = ARC_TEXT_BOX_HEIGHT;
  const contentHeight = Math.max(textHeight - titleHeight - titleToContentGap, contentLineHeight);

  // 前 1/2 为左侧（奇数 count 时中间块也算左侧），右侧为后 1/2；
  // 左侧 title/content 右对齐（贴引导线），右侧 title/content 左对齐（贴引导线）
  const isLeftSide = index < count / 2;
  const textAlign: 'left' | 'right' = isLeftSide ? 'right' : 'left';

  // image 位于 block 中心（x=0）
  const imageBox = {
    x: -imageWidth / 2,
    y: -imageHeight / 2,
    width: imageWidth,
    height: imageHeight
  };
  // 左侧：text 右对齐，text 右边缘与引导线（x=0）保持 ARC_TEXT_PADDING 距离
  // 右侧：text 左对齐，text 左边缘与引导线（x=0）保持 ARC_TEXT_PADDING 距离
  // 引导线 rect 固定 center 在 x=0（[-1, 1]）
  const textBoxX = isLeftSide ? -ARC_TEXT_PADDING : ARC_TEXT_PADDING;
  const textBox = {
    x: textBoxX,
    y: isDown ? imageBox.y + imageHeight + ARC_TEXT_GAP_FROM_IMAGE : imageBox.y - ARC_TEXT_GAP_FROM_IMAGE - textHeight,
    width: textBoxWidth,
    height: textHeight
  };
  const contentBox = {
    x: textBox.x,
    y: textBox.y + titleHeight + titleToContentGap,
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
    contentBox,
    isDown,
    textAlign
  };
};

export const buildArcBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const themeColor = getThemeColor(spec);
  const metrics = getArcBlockMetrics(spec, index);

  // 引导线 rect：从 image 圆心（group x=0）垂直连接到 text 近端边缘
  // - up（dome）：从 image 顶部（imageBox.y）向上到 textBox 顶部（textBox.y）
  // - down（bowl）：从 image 底部（imageBox.y + imageBox.height）向下到 textBox 底部（textBox.y + textBox.height）
  const connectorY = metrics.isDown ? metrics.imageBox.y + metrics.imageBox.height : metrics.textBox.y;
  const connectorHeight = metrics.isDown
    ? Math.max(metrics.textBox.y + metrics.textBox.height - (metrics.imageBox.y + metrics.imageBox.height), 0)
    : Math.max(metrics.imageBox.y - metrics.textBox.y, 0);
  // 引导线宽度固定为 2，center 对齐 x=0
  const connectorX = -1;

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getArcBlockCenter(spec, ctx, index).x,
      y: (_d: unknown, ctx: LayoutContext) => getArcBlockCenter(spec, ctx, index).y
    },
    children: [
      // title / content 与 image 之间的垂直引导线（zIndex 最低，作为装饰）
      {
        type: 'rect',
        name: `storyline-block-connector-${index}`,
        interactive: false,
        zIndex: LayoutZIndex.Mark + 2,
        style: {
          x: connectorX,
          y: connectorY,
          width: 2,
          height: connectorHeight,
          fill: themeColor,
          fillOpacity: 0.6
        }
      } as ICustomMarkSpec<'rect'>,
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-image-${index}`,
            interactive: false,
            zIndex: LayoutZIndex.Mark + 3,
            ...omitImageLayoutSpec(spec.image),
            style: {
              x: metrics.imageBox.x,
              y: metrics.imageBox.y,
              width: metrics.imageBox.width,
              height: metrics.imageBox.height,
              cornerRadius: Math.min(metrics.imageBox.width, metrics.imageBox.height) / 2,
              image: block.image,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'contain',
              imagePosition: 'center',
              ...spec.image?.style
            }
          } as ICustomMarkSpec<'image'>)
        : ({
            type: 'symbol',
            name: `storyline-block-image-bg-${index}`,
            interactive: false,
            zIndex: LayoutZIndex.Mark + 3,
            style: {
              x: 0,
              y: 0,
              size: Math.min(metrics.imageBox.width, metrics.imageBox.height),
              symbolType: 'circle',
              ...getImageBackgroundStyle(spec)
            }
          } as ICustomMarkSpec<'symbol'>),
      // 圆形 image 的外层装饰环
      shouldShowImageBackground(spec)
        ? ({
            type: 'symbol',
            name: `storyline-block-image-halo-${index}`,
            interactive: false,
            zIndex: LayoutZIndex.Mark + 3,
            style: {
              x: 0,
              y: 0,
              size: Math.min(metrics.imageBox.width, metrics.imageBox.height) + ARC_BLOCK_IMAGE_HALO_PADDING * 2,
              symbolType: 'circle',
              fill: 'transparent',
              stroke: withAlpha(themeColor, 0.82),
              lineWidth: ARC_BLOCK_IMAGE_BORDER
            }
          } as ICustomMarkSpec<'symbol'>)
        : null,
      block.title
        ? ({
            type: 'text',
            name: `storyline-block-title-${index}`,
            interactive: false,
            zIndex: LayoutZIndex.Mark + 5,
            ...spec.title,
            style: {
              x: metrics.textBox.x,
              y: metrics.textBox.y,
              text: block.title,
              maxLineWidth: metrics.textBox.width,
              height: metrics.titleLineHeight * BLOCK_TITLE_MAX_LINES,
              heightLimit: metrics.titleLineHeight * BLOCK_TITLE_MAX_LINES,
              lineClamp: BLOCK_TITLE_MAX_LINES,
              fontSize: metrics.titleFontSize,
              lineHeight: metrics.titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
              textAlign: metrics.textAlign,
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
            zIndex: LayoutZIndex.Mark + 4,
            ...spec.content,
            style: {
              x: metrics.contentBox.x,
              y: metrics.contentBox.y,
              width: metrics.contentBox.width,
              height: metrics.contentBox.height,
              maxLineWidth: metrics.contentBox.width,
              heightLimit: metrics.contentBox.height,
              text: buildPlainContent(contentText),
              fontSize: metrics.contentFontSize,
              lineHeight: metrics.contentLineHeight,
              textAlign: metrics.textAlign,
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
