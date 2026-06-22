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
  omitImageLayoutSpec,
  shouldShowImageBackground,
  withAlpha
} from './common';

// wing 布局：参考残奥时间线信息图
// - 主脉络为椭圆弧的「翅膀」造型，可通过 direction 配置左右朝向
//   - direction: 'left'  → 圆心锚在画布左侧，弧凸向右展开（默认）
//   - direction: 'right' → 圆心锚在画布右侧，弧凸向左展开
// - 圆形 image 嵌在弧线上（中心位于弧线）
// - title（年份感大字 + 主题色） + content 在 image 一侧水平展开
// - 左右交替（弧线左侧 / 右侧）让节点错落
const WING_BLOCK_IMAGE_SIZE = 160;
const WING_TEXT_GAP_FROM_IMAGE = 14;
const WING_TITLE_LINE_HEIGHT = 30;
const WING_TITLE_FONT_SIZE = 22;
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
  // width/height 已经是 VChart 减去 spec.padding 后的 region 大小
  // 不要再重复减去 padding，直接用 region 几何信息定位弧线
  const innerWidth = Math.max(width, 1);
  const innerHeight = Math.max(height, 1);
  const layoutOpt = normalizeLayout(spec.layout);
  const direction = getWingDirection(spec);
  const defaultStart = direction === 'right' ? 110 : -70;
  const defaultEnd = direction === 'right' ? 250 : 70;
  const startAngle = layoutOpt.startAngle ?? defaultStart;
  const endAngle = layoutOpt.endAngle ?? defaultEnd;
  const ratio = layoutOpt.radiusRatio ?? 0.92;
  const ry = (innerHeight / 2) * ratio;
  const rx = innerWidth * 0.6 * ratio;
  // direction='right'：圆心锚在 region 右侧，弧线点在左侧；direction='left'：圆心锚在左侧
  const cx = direction === 'right' ? startX + innerWidth - rx * 0.1 : startX + rx * 0.1;
  const cy = startY + innerHeight / 2;
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
  const startWidth = Math.max(Number(lineStyle.startWidth ?? 50), 0.5);
  const endWidth = Math.max(Number(lineStyle.endWidth ?? lineStyle.lineWidth ?? 350), startWidth);
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

// text box 与 image 的水平间距（image 左边缘到 text box 右边缘的距离）
const WING_TEXT_IMAGE_GAP = 120;

const getWingBlockMetrics = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
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
  const contentHeight = 100000;

  const imageWidth = Number(spec.image?.width ?? WING_BLOCK_IMAGE_SIZE);
  const imageHeight = Number(spec.image?.height ?? WING_BLOCK_IMAGE_SIZE);
  const imageBox = {
    x: -imageWidth / 2,
    y: -imageHeight / 2,
    width: imageWidth,
    height: imageHeight
  };

  const direction = getWingDirection(spec);
  const count = spec.data?.length ?? 0;

  // 特殊块的垂直布局：文字在 image 下方，水平居中
  // - direction='right' → 最后一个 block
  // - direction='left' → 第一个 block
  const isSpecialBelow =
    (direction === 'right' && count > 0 && index === count - 1) || (direction === 'left' && index === 0);
  const isVerticalLayout = isSpecialBelow;

  const textWidth = WING_TEXT_BOX_WIDTH;
  let textBox;
  let contentBox;
  let connectorBox;
  let onLeft;
  let verticalAlign; // 'below' | 'above' | null

  if (isVerticalLayout) {
    // 垂直布局：text 在 image 下方，水平居中
    const textX = -textWidth / 2;
    const textY = imageHeight / 2 + WING_TEXT_IMAGE_GAP;
    textBox = { x: textX, y: textY, width: textWidth, height: textHeight };
    contentBox = {
      x: textX,
      y: textY + titleLineHeight + titleToContentGap,
      width: textWidth,
      height: contentHeight
    };
    // 垂直引导线：从 image 底部到 text 顶部
    connectorBox = {
      x: -1,
      y: imageHeight / 2,
      width: 2,
      height: WING_TEXT_IMAGE_GAP
    };
    onLeft = false;
    verticalAlign = 'below';
  } else {
    // 水平布局（默认）：text 在 image 一侧
    const textOnLeft = direction === 'right';
    const textX = textOnLeft ? -imageWidth / 2 - WING_TEXT_IMAGE_GAP - textWidth : imageWidth / 2 + WING_TEXT_IMAGE_GAP;
    const textY = -textHeight / 2;
    textBox = { x: textX, y: textY, width: textWidth, height: textHeight };
    contentBox = {
      x: textX,
      y: textY + titleLineHeight + titleToContentGap,
      width: textWidth,
      height: contentHeight
    };
    // 水平引导线
    const imageEdgeX = textOnLeft ? -imageWidth / 2 : imageWidth / 2;
    const textEdgeX = textOnLeft ? textX + textWidth : textX;
    connectorBox = {
      x: Math.min(imageEdgeX, textEdgeX),
      y: 0,
      width: Math.abs(textEdgeX - imageEdgeX),
      height: 2
    };
    onLeft = textOnLeft;
    verticalAlign = null;
  }

  return {
    onLeft,
    verticalAlign,
    titleFontSize,
    titleLineHeight,
    contentFontSize,
    contentLineHeight,
    imageBox,
    textBox,
    contentBox,
    connectorBox
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
  // image 背后的装饰图元（halo）
  const showBackground = shouldShowImageBackground(spec);

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
      // 引导线：连接 image 和 text box
      {
        type: 'rect',
        name: `storyline-block-connector-${index}`,
        interactive: false,
        zIndex: LayoutZIndex.Mark + 2,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).connectorBox.x,
          y: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).connectorBox.y,
          width: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).connectorBox.width,
          height: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).connectorBox.height,
          fill: themeColor,
          opacity: 0.6
        }
      } as ICustomMarkSpec<'rect'>,
      showBackground
        ? ({
            type: 'symbol',
            name: `storyline-block-image-halo-${index}`,
            interactive: false,
            style: {
              x: 0,
              y: 0,
              size: (_d: unknown, ctx: LayoutContext) =>
                Math.max(
                  getWingBlockMetrics(spec, ctx, index).imageBox.width,
                  getWingBlockMetrics(spec, ctx, index).imageBox.height
                ) + 12,
              symbolType: 'circle',
              fill: withAlpha(themeColor, 0.18),
              stroke: themeColor,
              lineWidth: 1.5
            }
          } as ICustomMarkSpec<'symbol'>)
        : null,
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-image-${index}`,
            interactive: false,
            ...omitImageLayoutSpec(spec.image),
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.height,
              cornerRadius: (_d: unknown, ctx: LayoutContext) =>
                Math.min(
                  getWingBlockMetrics(spec, ctx, index).imageBox.width,
                  getWingBlockMetrics(spec, ctx, index).imageBox.height
                ) / 2,
              image: block.image,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              ...spec.image?.style
            }
          } as ICustomMarkSpec<'image'>)
        : ({
            type: 'rect',
            name: `storyline-block-image-bg-${index}`,
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.x,
              y: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).imageBox.height,
              cornerRadius: (_d: unknown, ctx: LayoutContext) =>
                Math.min(
                  getWingBlockMetrics(spec, ctx, index).imageBox.width,
                  getWingBlockMetrics(spec, ctx, index).imageBox.height
                ) / 2,
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
              x: (_d: unknown, ctx: LayoutContext) => {
                const m = getWingBlockMetrics(spec, ctx, index);
                if (m.verticalAlign) {
                  return m.textBox.x + m.textBox.width / 2;
                }
                return m.onLeft ? m.textBox.x + m.textBox.width : m.textBox.x;
              },
              y: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).textBox.y,
              text: block.title,
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).textBox.width,
              fontSize: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).titleFontSize,
              lineHeight: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).titleLineHeight,
              fontWeight: 'bold',
              fill: themeColor,
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
              textAlign: (_d: unknown, ctx: LayoutContext) => {
                const m = getWingBlockMetrics(spec, ctx, index);
                if (m.verticalAlign) {
                  return 'center';
                }
                return m.onLeft ? 'right' : 'left';
              },
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
              x: (_d: unknown, ctx: LayoutContext) => {
                const m = getWingBlockMetrics(spec, ctx, index);
                if (m.verticalAlign) {
                  return m.contentBox.x + m.contentBox.width / 2;
                }
                return m.onLeft ? m.contentBox.x + m.contentBox.width : m.contentBox.x;
              },
              y: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentBox.y,
              width: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentBox.width,
              height: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentBox.height,
              maxLineWidth: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentBox.width,
              heightLimit: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentBox.height,
              text: buildRichContent(contentText, spec),
              fontSize: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentFontSize,
              lineHeight: (_d: unknown, ctx: LayoutContext) => getWingBlockMetrics(spec, ctx, index).contentLineHeight,
              textAlign: (_d: unknown, ctx: LayoutContext) => {
                const m = getWingBlockMetrics(spec, ctx, index);
                if (m.verticalAlign) {
                  return 'center';
                }
                return m.onLeft ? 'right' : 'left';
              },
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
