import { LayoutZIndex, type ICustomMarkSpec } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec, StorylineImagePosition } from '../interface';
import {
  computeStorylineLayout,
  normalizeLayout,
  normalizePadding,
  type StorylineLayoutResult,
  type StorylinePoint
} from '../layout';

// ===== 布局通用类型 =====

export type LayoutContext = {
  chart?: {
    getAllRegions?: () => {
      getLayoutRect?: () => { width?: number; height?: number };
      getLayoutStartPoint?: () => { x?: number; y?: number };
    }[];
    getLayoutRect?: () => { width?: number; height?: number };
  };
  getLayoutBounds?: () => { width?: () => number; height?: () => number };
};

// ===== 通用默认值 =====

export const DEFAULT_BLOCK_WIDTH = 180;
export const DEFAULT_BLOCK_HEIGHT = 400;
export const DEFAULT_BLOCK_WIDTH_RATIO = 0.24;
export const DEFAULT_BLOCK_GAP = 36;
export const DEFAULT_IMAGE_WIDTH = 48;
export const DEFAULT_IMAGE_HEIGHT = 48;
export const DEFAULT_IMAGE_GAP = 10;
export const DEFAULT_THEME_COLOR = '#e8543d';
const DEFAULT_TITLE_IMAGE_WIDTH_RATIO = 0.52;
const DEFAULT_TITLE_IMAGE_MAX_WIDTH = 720;
const DEFAULT_TITLE_IMAGE_HEIGHT_RATIO = 0.36;
const DEFAULT_TITLE_IMAGE_TOP = 12;
const DEFAULT_TITLE_IMAGE_BOTTOM = 24;

// ===== 布局判定 =====

export const isLandscape = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'landscape';
export const isPortrait = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'portrait';
export const isClock = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'clock';
export const isArc = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'arc';
export const isWing = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'wing';
export const isLadder = (spec: IStorylineSpec) => normalizeLayout(spec.layout).type === 'ladder';

export const getThemeColor = (spec: IStorylineSpec) => spec.themeColor ?? DEFAULT_THEME_COLOR;

export const shouldShowImageBackground = (spec: IStorylineSpec) =>
  spec.image?.showBackground ?? !(isPortrait(spec) || isLandscape(spec));

// ===== 默认样式工具 =====

const TITLE_FONT_SCALE_ID = 'storylineTitleFontSize';
const MARKER_FONT_SCALE_ID = 'storylineMarkerFontSize';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getTextWeight = (text?: string) => {
  if (!text) {
    return 4;
  }
  return Math.max(
    Array.from(text).reduce((sum, char) => {
      if (char.trim().length === 0) {
        return sum + 0.32;
      }
      return sum + (char.charCodeAt(0) > 255 ? 1.05 : 0.62);
    }, 0),
    1
  );
};

const getScaleRange = (spec: IStorylineSpec, scaleId: string, fallback: [number, number]) => {
  const scales = (spec as { scales?: { id?: string; type?: string; range?: unknown }[] }).scales;
  const range = scales?.find(scale => scale.id === scaleId || scale.type === scaleId)?.range;
  if (Array.isArray(range) && range.length >= 2 && typeof range[0] === 'number' && typeof range[1] === 'number') {
    return [Math.min(range[0], range[1]), Math.max(range[0], range[1])] as [number, number];
  }
  return fallback;
};

const getSpecGeometry = (spec: IStorylineSpec, ctx?: LayoutContext) => {
  if (ctx) {
    return getRegionGeometry(ctx, spec);
  }
  return {
    width: Math.max(Number(spec.width ?? 0), 1),
    height: Math.max(Number(spec.height ?? 0), 1),
    startX: 0,
    startY: 0
  };
};

const resolveAdaptiveFontSize = (
  spec: IStorylineSpec,
  ctx: LayoutContext | undefined,
  text: string | undefined,
  options: {
    style?: Record<string, unknown>;
    scaleId: string;
    fallback: number;
    range: [number, number];
    canvasRatio: number;
    boxWidth?: number;
    boxHeight?: number;
  }
) => {
  const configuredFontSize = options.style?.fontSize;
  if (configuredFontSize != null) {
    return Number(configuredFontSize);
  }
  const [minFontSize, maxFontSize] = getScaleRange(spec, options.scaleId, options.range);
  const { width, height } = getSpecGeometry(spec, ctx);
  const textWeight = getTextWeight(text);
  const canvasSize = Math.sqrt(width * height) * options.canvasRatio;
  const lengthFactor = Math.sqrt(8 / Math.max(textWeight, 4));
  const adaptiveSize = width <= 1 && height <= 1 ? options.fallback : canvasSize * lengthFactor;
  const boxWidthLimit =
    options.boxWidth && options.boxWidth > 0 ? (options.boxWidth / textWeight) * 0.96 : Number.POSITIVE_INFINITY;
  const boxHeightLimit =
    options.boxHeight && options.boxHeight > 0 ? options.boxHeight / Math.max(textWeight, 1) : Number.POSITIVE_INFINITY;
  return Math.floor(clamp(Math.min(adaptiveSize, boxWidthLimit, boxHeightLimit), minFontSize, maxFontSize));
};

export const resolveAdaptiveLineHeight = (
  fontSize: number,
  style: Record<string, unknown> | undefined,
  fallback: number,
  ratio = 1.35
) => Number(style?.lineHeight ?? Math.round((Number.isFinite(fontSize) ? fontSize : fallback) * ratio));

export const resolveTitleFontSize = (
  spec: IStorylineSpec,
  ctx: LayoutContext | undefined,
  title: string | undefined,
  boxWidth: number | undefined,
  fallback: number,
  range: [number, number] = [16, 34]
) =>
  resolveAdaptiveFontSize(spec, ctx, title, {
    style: spec.title?.style as Record<string, unknown> | undefined,
    scaleId: TITLE_FONT_SCALE_ID,
    fallback,
    range,
    canvasRatio: 0.038,
    boxWidth
  });

export const resolveMarkerFontSize = (
  spec: IStorylineSpec,
  ctx: LayoutContext,
  marker: string | undefined,
  boxHeight: number | undefined,
  fallback: number,
  range: [number, number] = [18, 46]
) =>
  resolveAdaptiveFontSize(spec, ctx, marker, {
    style: spec.marker?.style as Record<string, unknown> | undefined,
    scaleId: MARKER_FONT_SCALE_ID,
    fallback,
    range,
    canvasRatio: 0.052,
    boxHeight
  });

export const getImageBackgroundStyle = (spec: IStorylineSpec) => {
  const themeColor = getThemeColor(spec);
  return {
    fill: {
      gradient: 'linear',
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      stops: [
        { offset: 0, color: '#ffffff' },
        { offset: 0.58, color: withAlpha(themeColor, 0.12) },
        { offset: 1, color: withAlpha(themeColor, 0.32) }
      ]
    },
    stroke: withAlpha(themeColor, 0.78),
    lineWidth: 2,
    shadowColor: withAlpha(themeColor, 0.18),
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4
  };
};

export const getTitleImageSize = (
  spec: IStorylineSpec,
  width: number,
  height: number,
  options?: { widthRatio?: number; maxWidth?: number; heightRatio?: number }
) => {
  const defaultWidth = Math.min(
    Math.max(width * (options?.widthRatio ?? DEFAULT_TITLE_IMAGE_WIDTH_RATIO), 1),
    options?.maxWidth ?? DEFAULT_TITLE_IMAGE_MAX_WIDTH
  );
  const imageWidth = Math.max(Number(spec.titleImage?.width ?? defaultWidth), 1);
  const imageHeight = Math.max(
    Number(
      spec.titleImage?.height ??
        Math.min(height, imageWidth * (options?.heightRatio ?? DEFAULT_TITLE_IMAGE_HEIGHT_RATIO))
    ),
    1
  );
  return { width: imageWidth, height: imageHeight };
};

export const getTitleImageReservedHeight = (
  spec: IStorylineSpec,
  width: number,
  height: number,
  options?: { y?: number; widthRatio?: number; maxWidth?: number; heightRatio?: number; bottom?: number }
) => {
  if (!spec.titleImage?.image || spec.titleImage.visible === false) {
    return 0;
  }
  const size = getTitleImageSize(spec, width, height, options);
  return Math.ceil(
    (options?.y ?? DEFAULT_TITLE_IMAGE_TOP) + size.height + (options?.bottom ?? DEFAULT_TITLE_IMAGE_BOTTOM)
  );
};

export const getChartGeometry = (ctx: LayoutContext, spec?: { width?: number; height?: number }) => {
  const chartRect = ctx.chart?.getLayoutRect?.();
  const bounds = ctx.getLayoutBounds?.();
  const width = Math.max(chartRect?.width ?? bounds?.width?.() ?? spec?.width ?? 0, 1);
  const height = Math.max(chartRect?.height ?? bounds?.height?.() ?? spec?.height ?? 0, 1);
  return { width, height, startX: 0, startY: 0 };
};

export const buildTopTitleImageMark = (
  spec: IStorylineSpec,
  options?: { y?: number; widthRatio?: number; maxWidth?: number; heightRatio?: number }
): ICustomMarkSpec<'image'> | null => {
  if (!spec.titleImage?.image || spec.titleImage.visible === false) {
    return null;
  }
  return {
    type: 'image',
    name: 'storyline-title-image',
    interactive: false,
    zIndex: LayoutZIndex.Mark + 8,
    ...spec.titleImage,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => {
        const { width, height, startX } = getChartGeometry(ctx, spec);
        const size = getTitleImageSize(spec, width, height, options);
        return startX + (width - size.width) / 2;
      },
      y: (_d: unknown, ctx: LayoutContext) =>
        getChartGeometry(ctx, spec).startY + (options?.y ?? DEFAULT_TITLE_IMAGE_TOP),
      width: (_d: unknown, ctx: LayoutContext) => {
        const { width, height } = getChartGeometry(ctx, spec);
        return getTitleImageSize(spec, width, height, options).width;
      },
      height: (_d: unknown, ctx: LayoutContext) => {
        const { width, height } = getChartGeometry(ctx, spec);
        return getTitleImageSize(spec, width, height, options).height;
      },
      image: spec.titleImage.image,
      repeatX: 'no-repeat',
      repeatY: 'no-repeat',
      imageMode: 'contain',
      imagePosition: 'center',
      ...spec.titleImage.style
    }
  } as ICustomMarkSpec<'image'>;
};

// ===== 颜色工具 =====

/**
 * 给颜色（#hex / rgb / rgba / hsl / 颜色关键字）追加/替换 alpha 通道，返回 rgba(...) 字符串
 */
export const withAlpha = (color: string, alpha: number): string => {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  if (!color) {
    return `rgba(0, 0, 0, ${safeAlpha})`;
  }
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map(ch => ch + ch)
        .join('');
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
    }
  }
  const rgbMatch = trimmed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${safeAlpha})`;
  }
  return trimmed;
};

// ===== 块宽度解析 =====

export const resolveBlockWidth = (spec: IStorylineSpec, viewWidth: number) => {
  if (spec.block?.width) {
    return spec.block.width;
  }
  const ratio = spec.block?.widthRatio ?? DEFAULT_BLOCK_WIDTH_RATIO;
  const minWidth = spec.block?.minWidth ?? DEFAULT_BLOCK_WIDTH;
  const maxWidth = spec.block?.maxWidth ?? Math.max(minWidth, 320);
  return Math.max(minWidth, Math.min(maxWidth, Math.round(viewWidth * ratio)));
};

// ===== 容器几何信息（chart region rect）=====

export const getRegionGeometry = (ctx: LayoutContext, spec?: { width?: number; height?: number }) => {
  const region = ctx.chart?.getAllRegions?.()?.[0];
  const regionRect = region?.getLayoutRect?.();
  const regionStart = region?.getLayoutStartPoint?.();
  const chartRect = ctx.chart?.getLayoutRect?.();
  const bounds = ctx.getLayoutBounds?.();
  const width = Math.max(regionRect?.width ?? chartRect?.width ?? bounds?.width?.() ?? spec?.width ?? 0, 1);
  const height = Math.max(regionRect?.height ?? chartRect?.height ?? bounds?.height?.() ?? spec?.height ?? 0, 1);
  return {
    width,
    height,
    startX: regionStart?.x ?? 0,
    startY: regionStart?.y ?? 0
  };
};

// ===== 布局计算（layout.ts 的封装，附加 startX/startY 平移）=====

export const getLayout = (spec: IStorylineSpec, ctx: LayoutContext): StorylineLayoutResult => {
  const { width, height, startX, startY } = getRegionGeometry(ctx, spec);
  let blockWidth = resolveBlockWidth(spec, width);
  let blockHeight = spec.block?.height ?? (isLandscape(spec) ? 320 : DEFAULT_BLOCK_HEIGHT);
  // landscape：图片间距固定 40，根据 block 数量自适应单个 image 宽度
  if (isLandscape(spec) && !spec.block?.width) {
    const count = spec.data?.length ?? 0;
    if (count > 0) {
      const padding = normalizePadding(spec.block?.padding);
      const innerWidth = Math.max(width - padding.left - padding.right, 1);
      const LANDSCAPE_IMAGE_GAP = 40;
      const LANDSCAPE_IMAGE_MIN_WIDTH = 80;
      const totalGap = LANDSCAPE_IMAGE_GAP * Math.max(count - 1, 0);
      const adaptive = (innerWidth - totalGap) / count;
      blockWidth = Math.max(LANDSCAPE_IMAGE_MIN_WIDTH, Math.floor(adaptive));
    }
  }
  // portrait：每个 block 在垂直方向需要容纳 image + text，整体根据 region 高度均分
  // blockHeight = regionHeight / (count + 1)（即每个 block 的"槽位"高度），后续 portrait.ts 中：
  //   imageHeight  = blockHeight * 0.6
  //   contentHeight = blockHeight
  if (isPortrait(spec) && !spec.block?.height) {
    const count = spec.data?.length ?? 0;
    if (count > 0) {
      const layoutPadding = typeof spec.layout === 'object' ? spec.layout.padding : undefined;
      const padding = normalizePadding(layoutPadding ?? spec.block?.padding);
      const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
      blockHeight = Math.max(120, Math.floor(innerHeight / (count + 1)));
    }
  }
  const result = computeStorylineLayout(spec.data ?? [], {
    layout: spec.layout,
    viewBox: { width, height },
    block: {
      width: blockWidth,
      height: blockHeight
    },
    gap: spec.block?.gap ?? DEFAULT_BLOCK_GAP,
    padding: spec.block?.padding,
    lineDistance: spec.line?.distance
  });
  if (!startX && !startY) {
    return result;
  }
  return {
    ...result,
    blocks: result.blocks.map(block => ({
      ...block,
      x: block.x + startX,
      y: block.y + startY,
      center: {
        x: block.center.x + startX,
        y: block.center.y + startY
      }
    })),
    links: result.links.map(link => ({
      ...link,
      start: { x: link.start.x + startX, y: link.start.y + startY },
      end: { x: link.end.x + startX, y: link.end.y + startY },
      points: link.points.map(point => ({ x: point.x + startX, y: point.y + startY }))
    }))
  };
};

// ===== 文本 / 图像通用工具 =====

export const buildRichContent = (
  contentText: string[],
  spec: IStorylineSpec,
  overrides?: { fontSize?: number; lineHeight?: number; fill?: string; align?: 'left' | 'center' | 'right' }
) => {
  const fontSize = Number(overrides?.fontSize ?? (spec.content?.style as any)?.fontSize ?? 18);
  const lineHeight = Number(overrides?.lineHeight ?? (spec.content?.style as any)?.lineHeight ?? 26);
  const fill = overrides?.fill ?? (spec.content?.style as any)?.fill ?? '#596173';
  const align = overrides?.align ?? 'left';

  return {
    type: 'rich' as const,
    text: contentText.reduce<{ text: string; fontSize: number; lineHeight: number; fill: string; align: string }[]>(
      (result, paragraph, index) => {
        const suffix = index === contentText.length - 1 ? '' : '\n';
        result.push({
          text: `${paragraph}${suffix}`,
          fontSize,
          lineHeight,
          fill,
          align
        });
        return result;
      },
      []
    )
  };
};

export const omitImageLayoutSpec = (imageSpec: IStorylineSpec['image']) => {
  if (!imageSpec) {
    return {};
  }
  const { width: _width, height: _height, position: _position, gap: _gap, ...rest } = imageSpec;
  return rest;
};

// ===== 默认 image / text 盒计算（用于通用 block）=====

export const getImageBox = (
  position: StorylineImagePosition,
  blockWidth: number,
  blockHeight: number,
  padding: ReturnType<typeof normalizePadding>,
  width: number,
  height: number,
  _gap: number,
  visible: boolean
) => {
  if (!visible) {
    return { x: padding.left, y: padding.top, width: 0, height: 0 };
  }
  switch (position) {
    case 'left':
      return { x: padding.left, y: (blockHeight - height) / 2, width, height };
    case 'right':
      return { x: blockWidth - padding.right - width, y: (blockHeight - height) / 2, width, height };
    case 'bottom':
      return { x: (blockWidth - width) / 2, y: blockHeight - padding.bottom - height, width, height };
    case 'top':
    default:
      return { x: (blockWidth - width) / 2, y: padding.top, width, height };
  }
};

export const getTextBox = (
  position: StorylineImagePosition,
  blockWidth: number,
  blockHeight: number,
  padding: ReturnType<typeof normalizePadding>,
  imageWidth: number,
  imageHeight: number,
  imageGap: number,
  hasImage: boolean
) => {
  if (!hasImage) {
    return {
      x: padding.left,
      y: padding.top,
      width: blockWidth - padding.left - padding.right,
      height: blockHeight - padding.top - padding.bottom
    };
  }
  switch (position) {
    case 'left':
      return {
        x: padding.left + imageWidth + imageGap,
        y: padding.top,
        width: blockWidth - padding.left - padding.right - imageWidth - imageGap,
        height: blockHeight - padding.top - padding.bottom
      };
    case 'right':
      return {
        x: padding.left,
        y: padding.top,
        width: blockWidth - padding.left - padding.right - imageWidth - imageGap,
        height: blockHeight - padding.top - padding.bottom
      };
    case 'bottom':
      return {
        x: padding.left,
        y: padding.top,
        width: blockWidth - padding.left - padding.right,
        height: blockHeight - padding.top - padding.bottom - imageHeight - imageGap
      };
    case 'top':
    default:
      return {
        x: padding.left,
        y: padding.top + imageHeight + imageGap,
        width: blockWidth - padding.left - padding.right,
        height: blockHeight - padding.top - padding.bottom - imageHeight - imageGap
      };
  }
};

// ===== Catmull-Rom 平滑曲线 =====

/**
 * 用 Catmull-Rom 转 cubic Bezier 生成平滑曲线 path（贯穿所有点）。
 */
export const buildSmoothCurvePath = (points: StorylinePoint[]): string => {
  if (points.length < 2) {
    return '';
  }
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

// 重导出常用的 layout helper（避免外部再 import layout.ts）
export { normalizeLayout, normalizePadding };
export type { IStorylineBlock, ICustomMarkSpec, StorylinePoint };
