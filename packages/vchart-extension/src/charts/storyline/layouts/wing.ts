import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec, StorylineWingDirection } from '../interface';
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
  withAlpha
} from './common';

// wing 布局：参考残奥时间线信息图
// - 主脉络为椭圆弧的「翅膀」造型，可通过 direction 配置左右朝向
//   - direction: 'left'  → 圆心锚在画布左侧，弧凸向右展开（默认）
//   - direction: 'right' → 圆心锚在画布右侧，弧凸向左展开
// - 圆形 image 嵌在弧线上（中心位于弧线）
// - title（年份感大字 + 主题色） + content 在 image 一侧水平展开
// - 左右交替（弧线左侧 / 右侧）让节点错落
const WING_BLOCK_IMAGE_SIZE = 96;
const WING_TEXT_GAP_FROM_IMAGE = 14;
const WING_TITLE_LINE_HEIGHT = 26;
const WING_TITLE_FONT_SIZE = 20;
const WING_CONTENT_LINE_HEIGHT = 17;
const WING_CONTENT_FONT_SIZE = 12;
// title + content 区域宽度
const WING_TEXT_BOX_WIDTH = 240;
// title + content 区域总高度
const WING_TEXT_BOX_HEIGHT = 110;
const WING_TITLE_TO_CONTENT_GAP = 4;

const getWingDirection = (spec: IStorylineSpec): StorylineWingDirection => {
  return normalizeLayout(spec.layout).direction ?? 'left';
};

/**
 * 计算 wing 弧线的几何参数：
 * - direction='left'：圆心位于 inner 左侧，采样区间 -70°→70°（cos>0），弧线点位于圆心右侧；
 * - direction='right'：圆心位于 inner 右侧，采样区间 110°→250°（cos<0），弧线点位于圆心左侧。
 */
const getWingArcGeometry = (spec: IStorylineSpec, ctx: LayoutContext) => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const layoutOpt = normalizeLayout(spec.layout);
  const direction = getWingDirection(spec);
  const defaultStart = direction === 'right' ? 110 : -70;
  const defaultEnd = direction === 'right' ? 250 : 70;
  const startAngle = layoutOpt.startAngle ?? defaultStart;
  const endAngle = layoutOpt.endAngle ?? defaultEnd;
  const ratio = layoutOpt.radiusRatio ?? 0.92;
  const ry = (innerHeight / 2) * ratio;
  const rx = innerWidth * 0.6 * ratio;
  // 左翅膀锚画布左侧，右翅膀锚画布右侧
  const cx = direction === 'right' ? startX + padding.left + innerWidth - rx * 0.1 : startX + padding.left + rx * 0.1;
  const cy = startY + padding.top + innerHeight / 2;
  return { cx, cy, rx, ry, startAngle, endAngle };
};

/**
 * 沿弧采样 block 中心 —— image 的圆心直接在弧线上，与时间线视觉对齐。
 */
const getWingBlockCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number): StorylinePoint => {
  const arc = getWingArcGeometry(spec, ctx);
  const count = spec.data?.length ?? 0;
  if (count <= 0) {
    return { x: arc.cx, y: arc.cy };
  }
  const t = count === 1 ? 0.5 : index / (count - 1);
  const angle = ((arc.startAngle + (arc.endAngle - arc.startAngle) * t) / 180) * Math.PI;
  return {
    x: arc.cx + Math.cos(angle) * arc.rx,
    y: arc.cy + Math.sin(angle) * arc.ry
  };
};

/**
 * 节点文字侧向：
 * - 左翅膀（弧凸向右）：偶数节点的文字排在弧线左侧；
 * - 右翅膀（弧凸向左）：偶数节点的文字排在弧线右侧（即镜像）。
 */
const isTextOnLeft = (spec: IStorylineSpec, index: number) => {
  const direction = getWingDirection(spec);
  return direction === 'right' ? index % 2 === 1 : index % 2 === 0;
};

/**
 * 主脉络曲线 mark：贯穿所有 block 的椭圆弧。
 * 用变宽的 filled path 模拟"丝带"——起点窄、终点宽，与信息图视觉一致。
 * 默认展示；用户可通过 spec.line.visible = false 关闭。
 */
export const buildWingArcMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible === false) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  const lineStyle = (spec.line?.style ?? {}) as Record<string, unknown>;
  const startWidth = Math.max(Number(lineStyle.startWidth ?? 2), 0.5);
  const endWidth = Math.max(Number(lineStyle.endWidth ?? lineStyle.lineWidth ?? 18), startWidth);
  return {
    type: 'group' as any,
    name: 'storyline-wing-arc',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'path',
        name: 'storyline-wing-arc-path',
        interactive: false,
        style: {
          stroke: false,
          lineWidth: 0,
          fill: (lineStyle.fill as string) ?? (lineStyle.stroke as string) ?? themeColor,
          opacity: 0.95,
          path: (_d: unknown, ctx: LayoutContext) => {
            const arc = getWingArcGeometry(spec, ctx);
            const span = arc.endAngle - arc.startAngle;
            const samples = 96;
            const pts: { x: number; y: number; nx: number; ny: number; w: number }[] = [];
            for (let i = 0; i <= samples; i++) {
              const t = i / samples;
              const angle = ((arc.startAngle + span * t) / 180) * Math.PI;
              const cx = arc.cx + Math.cos(angle) * arc.rx;
              const cy = arc.cy + Math.sin(angle) * arc.ry;
              const nxRaw = Math.cos(angle) / arc.rx;
              const nyRaw = Math.sin(angle) / arc.ry;
              const nLen = Math.hypot(nxRaw, nyRaw) || 1;
              pts.push({
                x: cx,
                y: cy,
                nx: nxRaw / nLen,
                ny: nyRaw / nLen,
                w: startWidth + (endWidth - startWidth) * t
              });
            }
            const segments: string[] = [];
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              const x = p.x + p.nx * (p.w / 2);
              const y = p.y + p.ny * (p.w / 2);
              segments.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            for (let i = pts.length - 1; i >= 0; i--) {
              const p = pts[i];
              const x = p.x - p.nx * (p.w / 2);
              const y = p.y - p.ny * (p.w / 2);
              segments.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            segments.push('Z');
            return segments.join(' ');
          }
        }
      } as ICustomMarkSpec<'path'>
    ]
  };
};

const getWingBlockMetrics = (spec: IStorylineSpec, index: number) => {
  const titleFontSize = Number((spec.title?.style as Record<string, unknown>)?.fontSize ?? WING_TITLE_FONT_SIZE);
  const titleLineHeight = Number(
    (spec.title?.style as Record<string, unknown>)?.lineHeight ??
      Math.max(WING_TITLE_LINE_HEIGHT, Math.round(titleFontSize * 1.3))
  );
  const contentFontSize = Number((spec.content?.style as Record<string, unknown>)?.fontSize ?? WING_CONTENT_FONT_SIZE);
  const contentLineHeight = Number(
    (spec.content?.style as Record<string, unknown>)?.lineHeight ?? WING_CONTENT_LINE_HEIGHT
  );
  const titleToContentGap = WING_TITLE_TO_CONTENT_GAP;
  const textHeight = WING_TEXT_BOX_HEIGHT;
  const contentHeight = Math.max(textHeight - titleLineHeight - titleToContentGap, contentLineHeight);

  const imageWidth = spec.image?.width ?? WING_BLOCK_IMAGE_SIZE;
  const imageHeight = spec.image?.height ?? WING_BLOCK_IMAGE_SIZE;
  const imageBox = {
    x: -imageWidth / 2,
    y: -imageHeight / 2,
    width: imageWidth,
    height: imageHeight
  };

  const onLeft = isTextOnLeft(spec, index);
  const textWidth = WING_TEXT_BOX_WIDTH;
  const textX = onLeft
    ? -imageWidth / 2 - WING_TEXT_GAP_FROM_IMAGE - textWidth
    : imageWidth / 2 + WING_TEXT_GAP_FROM_IMAGE;
  const textY = -textHeight / 2;
  const textBox = { x: textX, y: textY, width: textWidth, height: textHeight };
  const contentBox = {
    x: textX,
    y: textY + titleLineHeight + titleToContentGap,
    width: textWidth,
    height: contentHeight
  };
  return {
    onLeft,
    titleFontSize,
    titleLineHeight,
    contentFontSize,
    contentLineHeight,
    imageBox,
    textBox,
    contentBox
  };
};

export const buildWingBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const themeColor = getThemeColor(spec);
  const metrics = getWingBlockMetrics(spec, index);

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_d: unknown, ctx: LayoutContext) => getWingBlockCenter(spec, ctx, index).x,
      y: (_d: unknown, ctx: LayoutContext) => getWingBlockCenter(spec, ctx, index).y
    },
    children: [
      {
        type: 'symbol',
        name: `storyline-block-image-halo-${index}`,
        interactive: false,
        style: {
          x: 0,
          y: 0,
          size: Math.max(metrics.imageBox.width, metrics.imageBox.height) + 12,
          symbolType: 'circle',
          fill: withAlpha(themeColor, 0.18),
          stroke: themeColor,
          lineWidth: 1.5
        }
      } as ICustomMarkSpec<'symbol'>,
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
              cornerRadius: Math.min(metrics.imageBox.width, metrics.imageBox.height) / 2,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              stroke: '#ffffff',
              lineWidth: 3,
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
            zIndex: LayoutZIndex.Mark + 10,
            ...spec.title,
            style: {
              x: metrics.onLeft ? metrics.textBox.x + metrics.textBox.width : metrics.textBox.x,
              y: metrics.textBox.y,
              text: block.title,
              maxLineWidth: metrics.textBox.width,
              fontSize: metrics.titleFontSize,
              lineHeight: metrics.titleLineHeight,
              fontWeight: 'bold',
              fill: themeColor,
              textAlign: metrics.onLeft ? 'right' : 'left',
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
            zIndex: LayoutZIndex.Mark + 10,
            ...spec.content,
            textType: 'rich',
            style: {
              x: metrics.onLeft ? metrics.contentBox.x + metrics.contentBox.width : metrics.contentBox.x,
              y: metrics.contentBox.y,
              width: metrics.contentBox.width,
              height: metrics.contentBox.height,
              maxLineWidth: metrics.contentBox.width,
              heightLimit: metrics.contentBox.height,
              text: buildRichContent(contentText, spec),
              fontSize: WING_CONTENT_FONT_SIZE,
              lineHeight: WING_CONTENT_LINE_HEIGHT,
              textAlign: metrics.onLeft ? 'right' : 'left',
              textBaseline: 'top',
              wordBreak: 'break-word',
              ellipsis: '...',
              fill: '#1f2430',
              ...spec.content?.style
            }
          } as ICustomMarkSpec<'text'>)
        : null
    ].filter(Boolean) as ICustomMarkSpec<any>[]
  };
};
