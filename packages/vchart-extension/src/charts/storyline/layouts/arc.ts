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
  omitImageLayoutSpec,
  resolveBlockWidth,
  shouldShowImageBackground,
  withAlpha
} from './common';

// arc 布局：弧形排列 + centerImage（穹顶 / 碗形二合一）
// - direction = 'up'（默认）：穹顶 —— centerImage 贴底，弧线在 centerImage 上方
// - direction = 'down'：碗形 —— centerImage 贴顶，弧线在 centerImage 下方
// image 默认为圆形，ARC_BLOCK_IMAGE_SIZE 即圆的直径
const ARC_BLOCK_IMAGE_SIZE = 240;
// 圆形 image 的边框环厚度（圆形描边宽度）
const ARC_BLOCK_IMAGE_BORDER = 3;
// 圆形 image 背景环相对 image 的外扩量（始终渲染一个比 image 略大的圆形 symbol 作为背景环）
const ARC_BLOCK_IMAGE_HALO_PADDING = 6;
const ARC_TEXT_GAP_FROM_IMAGE = 10;
const ARC_TITLE_FONT_SIZE = 32;
const ARC_TITLE_LINE_HEIGHT = 34;
const ARC_CONTENT_LINE_HEIGHT = 26;
const ARC_CONTENT_FONT_SIZE = 20;
// title + content 区域总高度（默认 240px，溢出由富文本 heightLimit + ellipsis 自动截断）
const ARC_TEXT_BOX_HEIGHT = 240;
const ARC_TITLE_TO_CONTENT_GAP = 4;
// 引导线与 title/content 之间的水平间距
const ARC_TEXT_PADDING = 20;
// title/content 区域的最小宽度，确保文字有足够展示空间，不受 image 宽度限制
const ARC_TEXT_BOX_MIN_WIDTH = 240;
// centerImage 边长相对 inner 短边的比例（强制正方形，避免 cover 模式裁切图片）
const ARC_CENTER_IMAGE_SIZE_RATIO = 0.55;
// centerImage 相对 centerSymbol 的比例：image 直径 = symbol 直径 * 这个值（0.8 让 image 略小于 symbol，露出环形背景）
const ARC_CENTER_IMAGE_TO_SYMBOL_RATIO = 0.8;
// 弧线最高/最低点距离 centerImage 顶部/底部的距离
const ARC_GAP_FROM_CENTER_IMAGE = 200;

const isDownArc = (spec: IStorylineSpec) => normalizeLayout(spec.layout).direction === 'down';

/**
 * 计算 arc 布局 centerImage 的 box：水平居中。
 * - up（dome）：垂直贴底（位于 inner 区域底部）
 * - down（bowl）：垂直贴顶（位于 inner 区域顶部）
 */
const getArcCenterImageRect = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  // width/height 已经是 VChart 减去 spec.padding 后的 region 大小
  // 不要再重复减去 padding，直接用 region 几何信息定位
  const innerWidth = Math.max(width, 1);
  const innerHeight = Math.max(height, 1);
  // 取 inner 短边作为基准，使 rect 始终为正方形
  const baseSize = Math.min(innerWidth, innerHeight) * ARC_CENTER_IMAGE_SIZE_RATIO;
  const w = Math.max(spec.centerImage?.width ?? baseSize, 80);
  const h = Math.max(spec.centerImage?.height ?? baseSize, 80);
  const cx = startX + innerWidth / 2;
  const isDown = isDownArc(spec);
  const top = isDown ? startY : startY + innerHeight - h;
  return { x: cx - w / 2, y: top, width: w, height: h };
};

/**
 * 计算 arc 弧线的几何参数：
 * - cx / rx / startAngle / endAngle 与 layout.ts 中 arcCenters 一致；
 * - cy 与 ry 由两条对齐约束反推，使弧线起/终点 y 与 centerImage 端面对齐，
 *   弧线极值点（顶点 / 底点）距离 centerImage 远端 ARC_GAP_FROM_CENTER_IMAGE。
 *
 * up（dome）：startAngle = 200°、endAngle = 340°（弧线在 centerImage 上方）
 *   cy + ry * sin(startAngle) = centerImageBottom
 *   cy - ry                   = centerImageTop - GAP
 * → ry = (centerImageHeight + GAP) / (1 + sin(startAngle))
 *   cy = centerImageBottom - ry * sin(startAngle)
 *
 * down（bowl）：startAngle = 20°、endAngle = 160°（弧线在 centerImage 下方）
 *   cy + ry * sin(startAngle) = centerImageTop
 *   cy + ry                   = centerImageBottom + GAP
 * → ry = (GAP + centerImageHeight) / (1 - sin(startAngle))
 *   cy = centerImageTop - ry * sin(startAngle)
 */
const getArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext) => {
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
  const centerRect = getArcCenterImageRect(spec, ctx);
  const centerTop = centerRect.y;
  const centerBottom = centerRect.y + centerRect.height;
  const sinStart = Math.sin((startAngle / 180) * Math.PI);
  let cy: number;
  let ry: number;
  if (isDown) {
    // bowl：sinStart 接近 1 时 ry → ∞；这里限制下界以防 startAngle 配置异常
    const denom = Math.max(1 - sinStart, 0.05);
    ry = (centerRect.height + ARC_GAP_FROM_CENTER_IMAGE) / denom;
    cy = centerTop - ry * sinStart;
  } else {
    // dome：sinStart 接近 -1 时 ry → ∞
    const denom = Math.max(1 + sinStart, 0.05);
    ry = (centerRect.height + ARC_GAP_FROM_CENTER_IMAGE) / denom;
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
const getArcBlockCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint => {
  const arc = getArcGeometry(spec, ctx);
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

export const buildArcCenterImageMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
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
    name: 'storyline-arc-center',
    zIndex: LayoutZIndex.Mark,
    children: [
      // centerImage 底层：圆形 symbol（直径 = imageRect 的边长，保证视觉上是真正的圆）
      // - 有图时：浅色渐变底，仅作细微的底色衬托
      // - 无图时：纯白色圆形占位，保持视觉上的圆形轮廓
      {
        type: 'symbol',
        name: 'storyline-arc-center-symbol',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => {
            const r = getArcCenterImageRect(spec, ctx);
            return r.x + r.width / 2;
          },
          y: (_d: unknown, ctx: LayoutContext) => {
            const r = getArcCenterImageRect(spec, ctx);
            return r.y + r.height / 2;
          },
          size: (_d: unknown, ctx: LayoutContext) => {
            const r = getArcCenterImageRect(spec, ctx);
            return Math.max(r.width, r.height);
          },
          symbolType: 'circle',
          fill: hasImage ? symbolGradient : '#ffffff',
          stroke: themeColor,
          lineWidth: 2
        }
      } as ICustomMarkSpec<'symbol'>,
      hasImage
        ? ({
            type: 'image',
            name: 'storyline-arc-center-image',
            interactive: false,
            ...spec.centerImage,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                const userWidth = (spec.centerImage?.style as { width?: number } | undefined)?.width;
                const w =
                  typeof userWidth === 'number'
                    ? userWidth
                    : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
                return r.x + (r.width - w) / 2;
              },
              y: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                const userHeight = (spec.centerImage?.style as { height?: number } | undefined)?.height;
                const h =
                  typeof userHeight === 'number'
                    ? userHeight
                    : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
                return r.y + (r.height - h) / 2;
              },
              width: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                const userWidth = (spec.centerImage?.style as { width?: number } | undefined)?.width;
                return typeof userWidth === 'number'
                  ? userWidth
                  : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
              },
              height: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                const userHeight = (spec.centerImage?.style as { height?: number } | undefined)?.height;
                return typeof userHeight === 'number'
                  ? userHeight
                  : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
              },
              cornerRadius: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                const userWidth = (spec.centerImage?.style as { width?: number } | undefined)?.width;
                const userHeight = (spec.centerImage?.style as { height?: number } | undefined)?.height;
                const w =
                  typeof userWidth === 'number'
                    ? userWidth
                    : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
                const h =
                  typeof userHeight === 'number'
                    ? userHeight
                    : Math.max(r.width, r.height) * ARC_CENTER_IMAGE_TO_SYMBOL_RATIO;
                return Math.max(w, h) / 2;
              },
              image: spec.centerImage?.image,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              // 默认锚点设为 image 中心，让 scaleX/scaleY 从中心缩放
              anchor: (_d: unknown, ctx: LayoutContext) => {
                const r = getArcCenterImageRect(spec, ctx);
                return [r.x + r.width / 2, r.y + r.height / 2];
              },
              ...spec.centerImage?.style
            }
          } as ICustomMarkSpec<'image'>)
        : null
    ].filter(Boolean) as ICustomMarkSpec<any>[]
  };
};

const getArcBlockMetrics = (spec: IStorylineSpec, index: number = 0) => {
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? ARC_TITLE_FONT_SIZE);
  const titleLineHeight = Number(
    (spec.title?.style as any)?.lineHeight ?? Math.max(ARC_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.35))
  );
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? ARC_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? ARC_CONTENT_LINE_HEIGHT);
  const titleToContentGap = ARC_TITLE_TO_CONTENT_GAP;
  // text 区域总高度固定为 ARC_TEXT_BOX_HEIGHT，content 占除 title 与间距外的全部高度
  const textHeight = ARC_TEXT_BOX_HEIGHT;
  const contentHeight = Math.max(textHeight - titleLineHeight - titleToContentGap, contentLineHeight);

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
              imageMode: 'cover',
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
              fill: '#ffffff',
              stroke: themeColor,
              lineWidth: 2
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
              stroke: themeColor,
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
              fontSize: metrics.titleFontSize,
              lineHeight: metrics.titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
              textAlign: metrics.textAlign,
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
            zIndex: LayoutZIndex.Mark + 4,
            ...spec.content,
            textType: 'rich',
            style: {
              x: metrics.contentBox.x,
              y: metrics.contentBox.y,
              width: metrics.contentBox.width,
              height: metrics.contentBox.height,
              maxLineWidth: metrics.contentBox.width,
              heightLimit: metrics.contentBox.height,
              text: buildRichContent(contentText, spec, {
                fontSize: metrics.contentFontSize,
                lineHeight: metrics.contentLineHeight,
                fill: '#596173',
                align: metrics.textAlign
              }),
              textAlign: metrics.textAlign,
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
