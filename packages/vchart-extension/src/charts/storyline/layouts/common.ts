import type { ICustomMarkSpec } from '@visactor/vchart';
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
      const padding = normalizePadding(spec.layout?.padding ?? spec.block?.padding);
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
