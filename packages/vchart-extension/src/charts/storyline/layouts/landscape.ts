import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  type StorylinePoint,
  DEFAULT_BLOCK_HEIGHT,
  BLOCK_TITLE_MAX_LINES,
  buildPlainContent,
  buildSmoothCurvePath,
  getBlockTitleHeight,
  getImageBackgroundStyle,
  getLayout,
  getRegionGeometry,
  getThemeColor,
  normalizePadding,
  omitImageLayoutSpec,
  resolveAdaptiveLineHeight,
  resolveBlockWidth,
  resolveTitleFontSize,
  shouldShowImageBackground
} from './common';

// landscape 布局下，image rect 与 text rect 分离展示
const LANDSCAPE_IMAGE_HEIGHT_RATIO = 0.42;
const LANDSCAPE_CONNECTOR_GAP = 8;
const LANDSCAPE_CONNECTOR_ARROW_SIZE = 9;
const LANDSCAPE_CONNECTOR_X_RATIO = 0.2; // 引导线 x 位于 image 左侧 20% 处
const LANDSCAPE_TEXT_GAP_FROM_CONNECTOR = 12; // 文字距离引导线的水平间距
const LANDSCAPE_TITLE_LINE_HEIGHT = 34;
const LANDSCAPE_CONTENT_LINE_HEIGHT = 23;
const LANDSCAPE_CONTENT_FONT_SIZE = 16;
const LANDSCAPE_TITLE_TO_CONTENT_GAP = 4;
const LANDSCAPE_BODY_MARGIN = 8;
const LANDSCAPE_IMAGE_BAND_RATIO = 0.28;
const LANDSCAPE_IMAGE_BAND_MAX_RATIO = 0.42;

/**
 * 计算第 index 个 block 在 landscape 布局下的 image 中心点（含 stagger 错落偏移）。
 */
const getLandscapeImageCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint | null => {
  const lb = getLayout(spec, ctx).blocks[index];
  if (!lb) {
    return null;
  }
  const m = getLandscapeMetrics(spec, lb.width, lb.height, index, ctx);
  return {
    x: lb.x + m.imageBox.x + m.imageBox.width / 2,
    y: m.bodyOriginY + m.imageBox.y + m.imageBox.height / 2
  };
};

/**
 * landscape 下绘制一条贯穿所有 image 中心的平滑虚线曲线，并在每个节点位置画 symbol，
 * 颜色跟随主题色。
 */
export const buildLandscapeConnectingCurve = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  const themeColor = getThemeColor(spec);
  const lineStyle = spec.line?.style ?? {};
  const count = spec.data?.length ?? 0;
  const symbolSize = 14;
  const symbolChildren: ICustomMarkSpec<'symbol'>[] = [];
  for (let i = 0; i < count; i++) {
    const idx = i;
    symbolChildren.push({
      type: 'symbol',
      name: `storyline-landscape-curve-symbol-${idx}`,
      interactive: false,
      style: {
        symbolType: 'circle',
        size: symbolSize,
        fill: themeColor,
        x: (_d: unknown, ctx: LayoutContext) => getLandscapeImageCenter(spec, ctx, idx)?.x ?? 0,
        y: (_d: unknown, ctx: LayoutContext) => getLandscapeImageCenter(spec, ctx, idx)?.y ?? 0
      }
    } as ICustomMarkSpec<'symbol'>);
  }
  return {
    type: 'group' as any,
    name: 'storyline-landscape-curve',
    zIndex: LayoutZIndex.Mark + 2,
    children: [
      {
        type: 'path',
        name: 'storyline-landscape-curve-path',
        interactive: false,
        style: {
          stroke: (lineStyle as any).stroke ?? themeColor,
          lineWidth: (lineStyle as any).lineWidth ?? 4,
          lineDash: (lineStyle as any).lineDash ?? [6, 5],
          lineCap: 'round',
          fill: 'transparent',
          fillOpacity: 0,
          path: (_d: unknown, ctx: LayoutContext) => {
            const points: StorylinePoint[] = [];
            for (let i = 0; i < count; i++) {
              const center = getLandscapeImageCenter(spec, ctx, i);
              if (center) {
                points.push(center);
              }
            }
            return buildSmoothCurvePath(points);
          }
        }
      } as ICustomMarkSpec<'path'>,
      ...symbolChildren
    ]
  };
};

/**
 * landscape 布局下，每个 block 拆分为 image rect 与 text rect 两个独立卡片，
 * 中间用主题色虚线箭头连接；title+content 在 image 上方/下方交替错落摆放。
 */
const getLandscapeMetrics = (
  spec: IStorylineSpec,
  blockWidth: number,
  blockHeight: number,
  index: number,
  ctx: LayoutContext
) => {
  const padding = normalizePadding(spec.block?.padding ?? 12);
  const titleFontSize = resolveTitleFontSize(spec, ctx, spec.data?.[index]?.title, blockWidth, 26, [8, 34]);
  const titleLineHeight = resolveAdaptiveLineHeight(
    titleFontSize,
    spec.title?.style as any,
    LANDSCAPE_TITLE_LINE_HEIGHT
  );
  const contentFontSize = Number((spec.content?.style as any)?.fontSize ?? LANDSCAPE_CONTENT_FONT_SIZE);
  const contentLineHeight = Number((spec.content?.style as any)?.lineHeight ?? LANDSCAPE_CONTENT_LINE_HEIGHT);
  const { width: regionWidth } = getRegionGeometry(ctx, spec);
  const blockCount = Math.max(spec.data?.length ?? 1, 1);
  const textWidth = Math.max(regionWidth / blockCount, 1);
  const titleHeight = getBlockTitleHeight(titleLineHeight, spec.data?.[index]?.title, textWidth, titleFontSize);

  const rawImageHeight = Math.max(
    spec.image?.height ?? Math.round(blockHeight * LANDSCAPE_IMAGE_HEIGHT_RATIO),
    titleLineHeight + padding.top + padding.bottom
  );
  const titleToContentGap = LANDSCAPE_TITLE_TO_CONTENT_GAP;
  const minTextBandHeight = titleHeight + titleToContentGap + contentLineHeight * 2;
  const body = getLandscapeBodyGeometry(ctx, spec, rawImageHeight, blockHeight, minTextBandHeight);
  const imageHeight = body.imageHeight;
  const textBandHeight = body.textBandHeight;
  const contentHeight = Math.max(0, textBandHeight - titleHeight - titleToContentGap);
  const textHeight = titleHeight + titleToContentGap + contentHeight;

  const textOnTop = index % 2 === 0;

  let textBox: { x: number; y: number; width: number; height: number };
  let contentBox: { x: number; y: number; width: number; height: number };
  let imageBox: { x: number; y: number; width: number; height: number };
  let connector: { x1: number; y1: number; x2: number; y2: number };
  let groupTop: number;
  let groupHeight: number;

  const imageX = 0;
  const connectorX = imageX + blockWidth * LANDSCAPE_CONNECTOR_X_RATIO;
  const textX = connectorX + LANDSCAPE_TEXT_GAP_FROM_CONNECTOR;
  const waveOffset = (textOnTop ? -1 : 1) * body.waveAmplitude;
  const imageY = body.imageBandTop + body.imageBandHeight / 2 + waveOffset - imageHeight / 2;

  if (textOnTop) {
    const textY = body.upperTextTop;
    const connectorY1 = Math.max(imageY - LANDSCAPE_CONNECTOR_GAP, body.upperTextTop);
    const connectorY2 = textY + Math.max(titleHeight, titleLineHeight) / 2;

    imageBox = { x: imageX, y: imageY, width: blockWidth, height: imageHeight };
    textBox = { x: textX, y: textY, width: textWidth, height: textHeight };
    contentBox = {
      x: textX,
      y: textY + titleHeight + titleToContentGap,
      width: textWidth,
      height: contentHeight
    };
    connector = { x1: connectorX, y1: connectorY1, x2: connectorX, y2: connectorY2 };
    groupTop = 0;
    groupHeight = body.height;
  } else {
    const textY = body.lowerTextTop;
    const connectorY1 = Math.min(imageY + imageHeight + LANDSCAPE_CONNECTOR_GAP, body.height);
    const connectorY2 = textY + textHeight;

    imageBox = { x: imageX, y: imageY, width: blockWidth, height: imageHeight };
    textBox = { x: textX, y: textY, width: textWidth, height: textHeight };
    contentBox = {
      x: textX,
      y: textY + titleHeight + titleToContentGap,
      width: textWidth,
      height: contentHeight
    };
    connector = { x1: connectorX, y1: connectorY1, x2: connectorX, y2: connectorY2 };
    groupTop = 0;
    groupHeight = body.height;
  }

  return {
    padding,
    titleFontSize,
    titleLineHeight,
    titleHeight,
    contentFontSize,
    contentLineHeight,
    contentHeight,
    minTextBandHeight,
    bodyOriginY: body.originY,
    blockWidth: Math.max(blockWidth, textX + textWidth),
    imageBox,
    textBox,
    contentBox,
    connector,
    textOnTop,
    groupTop,
    groupHeight
  };
};

const getLandscapeBodyGeometry = (
  ctx: LayoutContext,
  spec: IStorylineSpec,
  rawImageHeight: number,
  blockHeight: number,
  minTextBandHeight: number
) => {
  const region = getRegionGeometry(ctx, spec);
  const margin = Math.min(LANDSCAPE_BODY_MARGIN, Math.max(region.height * 0.04, 0));
  const height = Math.max(region.height - margin * 2, 1);
  const textBandReserve = Math.min(minTextBandHeight, Math.max((height - 48) / 2, 0));
  const maxImageBandHeight = Math.max(height - textBandReserve * 2, height * 0.18);
  const imageBandHeight = Math.min(
    Math.max(rawImageHeight + 24, height * LANDSCAPE_IMAGE_BAND_RATIO),
    Math.max(1, Math.min(maxImageBandHeight, height * LANDSCAPE_IMAGE_BAND_MAX_RATIO))
  );
  const imageHeight = Math.min(rawImageHeight, Math.max(imageBandHeight - 16, 1));
  const textBandHeight = Math.max((height - imageBandHeight) / 2, 1);
  const imageBandTop = textBandHeight;

  return {
    originY: region.startY + margin,
    height,
    textBandHeight,
    imageBandTop,
    imageBandHeight,
    imageHeight,
    upperTextTop: 0,
    lowerTextTop: imageBandTop + imageBandHeight,
    waveAmplitude: Math.min(imageBandHeight * 0.18, blockHeight * 0.1)
  };
};

export const buildLandscapeBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];

  const getMetrics = (ctx: LayoutContext) => {
    const layoutBlock = getLayout(spec, ctx).blocks[index];
    const w = layoutBlock?.width ?? resolveBlockWidth(spec, 0);
    const h = layoutBlock?.height ?? spec.block?.height ?? DEFAULT_BLOCK_HEIGHT;
    return getLandscapeMetrics(spec, w, h, index, ctx);
  };

  const blockStyle = spec.block?.style ?? {};
  const lineStyle = spec.line?.style ?? {};
  const themeColor = getThemeColor(spec);
  const connectorStroke = (lineStyle as any).stroke ?? themeColor;
  const connectorLineWidth = (lineStyle as any).lineWidth ?? 2;
  const connectorDash = (lineStyle as any).lineDash ?? [4, 4];

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => {
        const lb = getLayout(spec, ctx).blocks[index];
        return lb?.x ?? 0;
      },
      y: (_d: unknown, ctx: LayoutContext) => {
        const m = getMetrics(ctx);
        return m.bodyOriginY;
      },
      width: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).blockWidth,
      height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).groupHeight
    },
    children: [
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
      {
        type: 'path',
        name: `storyline-block-connector-${index}`,
        interactive: false,
        style: {
          stroke: connectorStroke,
          lineWidth: connectorLineWidth,
          lineDash: connectorDash,
          fill: connectorStroke,
          path: (_d: unknown, ctx: LayoutContext) => {
            const m = getMetrics(ctx);
            const tipSize = LANDSCAPE_CONNECTOR_ARROW_SIZE;
            const x = m.connector.x1;
            const y0 = m.connector.y1;
            const y1 = m.connector.y2;
            const tipDir = y1 < y0 ? -1 : 1;
            const baseY = y1 - tipDir * tipSize;
            const dashLine = `M ${x} ${y0} L ${x} ${baseY}`;
            const triangle = `M ${x - tipSize / 2} ${baseY} L ${x + tipSize / 2} ${baseY} L ${x} ${y1} Z`;
            return `${dashLine} ${triangle}`;
          }
        }
      } as ICustomMarkSpec<'path'>,
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
              height: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).titleHeight,
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
              fontSize: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentFontSize,
              lineHeight: (_d: unknown, ctx: LayoutContext) => getMetrics(ctx).contentLineHeight,
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
