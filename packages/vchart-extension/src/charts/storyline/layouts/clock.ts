import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  buildRichContent,
  getRegionGeometry,
  getThemeColor,
  normalizePadding,
  withAlpha
} from './common';

/**
 * clock 布局：环绕式时间线（orbit timeline）
 *
 * 视觉结构（参考报刊版式）：
 *
 *                      ┌──────── 外侧文字段（title + content）─────────┐
 *                      │                                                 │
 *           ●●●        │           ┌───── 虚线轨道圆环 ─────┐            │
 *      圆形 dot ──────引线──────┤                          │
 *                      │           │     ◎ centerImage     │
 *                      │           │     （大圆人像）      │
 *                      │           └───────────────────────┘
 *                      └─────────────────────────────────────────────┘
 *
 * - centerImage：圆形大图，位于版面中心
 * - 虚线轨道：紧贴 centerImage 外侧的圆环，提供时间线的视觉骨架
 * - 每个 block 由 1 个圆形小图（dot）压在轨道上，外加一段从 dot 引出的 title + content 文字
 * - block 沿轨道环绕分布（默认 360°）；左半圆 block 文字 right-align，右半圆 block 文字 left-align
 */

// ===== 半径配置（按可用半径的比例划分各圈层）=====
const CLOCK_CENTER_RADIUS_RATIO = 0.5; // 中心圆半径
const CLOCK_CENTER_IMAGE_INSET_RATIO = 0.86; // centerImage 相对中心圆的尺寸比例（留出环形空隙）
const CLOCK_ORBIT_RATIO = 0.58; // 虚线轨道半径
const CLOCK_DOT_RATIO = 0.58; // 圆形小图（dot）中心所在半径（与轨道重合）
const CLOCK_TEXT_INNER_RATIO = 0.7; // block 文字段起始半径
const CLOCK_TEXT_MAX_WIDTH = 200; // 文字段最大宽度，避免靠近正上/正下的 block 占满整个画布半宽

// ===== 元素尺寸 =====
const CLOCK_DOT_DIAMETER_RATIO = 0.24; // dot 直径相对 R
const CLOCK_LEAD_LINE_GAP = 6; // dot 到引线起点的间距 px
const CLOCK_TEXT_GAP_FROM_LEAD = 8; // 引线到文字的间距 px
const CLOCK_ORBIT_DASH = [4, 4];

// ===== 文字 =====
const CLOCK_TITLE_FONT_SIZE = 13;
const CLOCK_TITLE_LINE_HEIGHT = 18;
const CLOCK_CONTENT_FONT_SIZE = 11;
const CLOCK_CONTENT_LINE_HEIGHT = 15;

// ===== 几何 =====

type ClockGeometry = {
  cx: number;
  cy: number;
  R: number; // 整盘外半径
  count: number;
  step: number;
};

const getClockGeometry = (spec: IStorylineSpec, ctx: LayoutContext): ClockGeometry => {
  const { width, height, startX, startY } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const cx = startX + padding.left + innerWidth / 2;
  const cy = startY + padding.top + innerHeight / 2;
  const R = Math.max(Math.min(innerWidth, innerHeight) / 2, 1);
  const count = spec.data?.length ?? 0;
  const step = count > 0 ? (Math.PI * 2) / count : 0;
  return { cx, cy, R, count, step };
};

/**
 * 第 index 个 block 在轨道上的角度。
 * - 0° = 正上方（12 点钟）
 * - 顺时针递增
 */
const getClockBlockAngle = (geom: ClockGeometry, index: number) => -Math.PI / 2 + geom.step * (index + 0.5);

const polar = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + Math.cos(angle) * r,
  y: cy + Math.sin(angle) * r
});

/**
 * 判断 block 在版面左半边还是右半边。
 * 用于决定 block 文字的对齐方向（左半边 right-align，右半边 left-align）。
 */
const isOnLeftHalf = (angle: number) => Math.cos(angle) < 0;

// ===== 中心圆 =====

export const buildClockCenterImageMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.centerImage?.visible === false) {
    return null;
  }
  const themeColor = getThemeColor(spec);
  const hasImage = !!spec.centerImage?.image;
  return {
    type: 'group' as any,
    name: 'storyline-clock-center',
    zIndex: LayoutZIndex.Mark + 2,
    children: [
      // centerImage 背后的高亮光晕（主题色透明色，营造"焦点"效果）
      {
        type: 'symbol',
        name: 'storyline-clock-center-halo',
        interactive: false,
        style: {
          x: (_d: unknown, ctx: LayoutContext) => getClockGeometry(spec, ctx).cx,
          y: (_d: unknown, ctx: LayoutContext) => getClockGeometry(spec, ctx).cy,
          size: (_d: unknown, ctx: LayoutContext) => {
            const g = getClockGeometry(spec, ctx);
            return g.R * CLOCK_CENTER_RADIUS_RATIO * 2.16;
          },
          symbolType: 'circle',
          fill: withAlpha(themeColor, 0.28),
          stroke: 'transparent'
        }
      } as ICustomMarkSpec<'symbol'>,
      hasImage
        ? ({
            type: 'image',
            name: 'storyline-clock-center-image',
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => {
                const g = getClockGeometry(spec, ctx);
                return g.cx - g.R * CLOCK_CENTER_RADIUS_RATIO * CLOCK_CENTER_IMAGE_INSET_RATIO;
              },
              y: (_d: unknown, ctx: LayoutContext) => {
                const g = getClockGeometry(spec, ctx);
                return g.cy - g.R * CLOCK_CENTER_RADIUS_RATIO * CLOCK_CENTER_IMAGE_INSET_RATIO;
              },
              width: (_d: unknown, ctx: LayoutContext) =>
                getClockGeometry(spec, ctx).R * CLOCK_CENTER_RADIUS_RATIO * CLOCK_CENTER_IMAGE_INSET_RATIO * 2,
              height: (_d: unknown, ctx: LayoutContext) =>
                getClockGeometry(spec, ctx).R * CLOCK_CENTER_RADIUS_RATIO * CLOCK_CENTER_IMAGE_INSET_RATIO * 2,
              image: spec.centerImage?.image,
              cornerRadius: (_d: unknown, ctx: LayoutContext) =>
                getClockGeometry(spec, ctx).R * CLOCK_CENTER_RADIUS_RATIO * CLOCK_CENTER_IMAGE_INSET_RATIO,
              repeatX: 'no-repeat',
              repeatY: 'no-repeat',
              imageMode: 'cover',
              imagePosition: 'center',
              ...spec.centerImage?.style
            }
          } as ICustomMarkSpec<'image'>)
        : ({
            type: 'symbol',
            name: 'storyline-clock-center-placeholder',
            interactive: false,
            style: {
              x: (_d: unknown, ctx: LayoutContext) => getClockGeometry(spec, ctx).cx,
              y: (_d: unknown, ctx: LayoutContext) => getClockGeometry(spec, ctx).cy,
              size: (_d: unknown, ctx: LayoutContext) => getClockGeometry(spec, ctx).R * CLOCK_CENTER_RADIUS_RATIO * 2,
              symbolType: 'circle',
              fill: '#ffffff',
              stroke: themeColor,
              lineWidth: 2
            }
          } as ICustomMarkSpec<'symbol'>)
    ].filter(Boolean) as ICustomMarkSpec<any>[]
  };
};

// ===== 虚线轨道 =====

/**
 * 紧贴 centerImage 外侧的虚线圆环轨道。
 */
export const buildClockArcMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  const themeColor = getThemeColor(spec);

  const orbitPath = (_d: unknown, ctx: LayoutContext) => {
    const g = getClockGeometry(spec, ctx);
    const r = g.R * CLOCK_ORBIT_RATIO;
    return [
      `M ${(g.cx + r).toFixed(2)} ${g.cy.toFixed(2)}`,
      `A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 1 ${(g.cx - r).toFixed(2)} ${g.cy.toFixed(2)}`,
      `A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 1 ${(g.cx + r).toFixed(2)} ${g.cy.toFixed(2)}`
    ].join(' ');
  };

  return {
    type: 'group' as any,
    name: 'storyline-clock-orbit',
    zIndex: LayoutZIndex.Mark,
    children: [
      {
        type: 'path',
        name: 'storyline-clock-orbit-path',
        interactive: false,
        style: {
          path: orbitPath,
          stroke: withAlpha(themeColor, 0.7),
          lineWidth: 1,
          lineDash: CLOCK_ORBIT_DASH,
          fill: 'transparent',
          fillOpacity: 0
        }
      } as ICustomMarkSpec<'path'>
    ]
  };
};

// ===== block：dot + 引线 + 文字段 =====

const getClockDotCenter = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
  const g = getClockGeometry(spec, ctx);
  const angle = getClockBlockAngle(g, index);
  const r = g.R * CLOCK_DOT_RATIO;
  return { ...polar(g.cx, g.cy, r, angle), diameter: g.R * CLOCK_DOT_DIAMETER_RATIO, angle };
};

/**
 * 引线（dot 外缘 → 文字段内边）的两个端点。
 */
const getClockLeadLine = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
  const g = getClockGeometry(spec, ctx);
  const angle = getClockBlockAngle(g, index);
  const dotR = (g.R * CLOCK_DOT_DIAMETER_RATIO) / 2;
  const start = polar(g.cx, g.cy, g.R * CLOCK_DOT_RATIO + dotR + CLOCK_LEAD_LINE_GAP, angle);
  const end = polar(g.cx, g.cy, g.R * CLOCK_TEXT_INNER_RATIO - CLOCK_TEXT_GAP_FROM_LEAD, angle);
  return { start, end };
};

/**
 * block 文字段的矩形（中心 + 宽高 + 对齐）。
 * 文字段沿水平方向从 dot 一侧外延：
 *   - 左半圆：文字右对齐，向左延伸至画布左边界（含 padding）
 *   - 右半圆：文字左对齐，向右延伸至画布右边界（含 padding）
 * 这样所有 block 的可用宽度都是一致的"画布半宽 - 中心圆半径"，避免出现窄文字。
 */
const getClockTextRect = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
  const g = getClockGeometry(spec, ctx);
  const { width: regionWidth, startX } = getRegionGeometry(ctx);
  const padding = normalizePadding(spec.block?.padding);
  const angle = getClockBlockAngle(g, index);
  const onLeft = isOnLeftHalf(angle);
  // 文字段从 dot 外侧的 inner ring 处开始水平延展
  const rInner = g.R * CLOCK_TEXT_INNER_RATIO;
  const innerPoint = polar(g.cx, g.cy, rInner, angle);
  // 画布水平边界（含 padding）
  const leftEdge = startX + padding.left;
  const rightEdge = startX + regionWidth - padding.right;
  const width = onLeft
    ? Math.min(Math.max(innerPoint.x - leftEdge, 80), CLOCK_TEXT_MAX_WIDTH)
    : Math.min(Math.max(rightEdge - innerPoint.x, 80), CLOCK_TEXT_MAX_WIDTH);
  return { x: innerPoint.x, y: innerPoint.y, width, onLeft, anchorY: innerPoint.y };
};

export const buildClockBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const themeColor = getThemeColor(spec);
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];

  const leadPath = (_d: unknown, ctx: LayoutContext) => {
    const { start, end } = getClockLeadLine(spec, ctx, index);
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  };

  const children: (ICustomMarkSpec<any> | null)[] = [
    // 引线：从 dot 外缘到文字段内边
    {
      type: 'path',
      name: `storyline-clock-lead-${index}`,
      interactive: false,
      style: {
        path: leadPath,
        stroke: withAlpha(themeColor, 0.7),
        lineWidth: 1,
        lineDash: [3, 3],
        fill: 'transparent',
        fillOpacity: 0
      }
    } as ICustomMarkSpec<'path'>,
    // 圆形小图（dot）：压在轨道上，作为时间锚点
    hasImage
      ? ({
          type: 'image',
          name: `storyline-clock-dot-${index}`,
          interactive: false,
          style: {
            x: (_d: unknown, ctx: LayoutContext) => {
              const dot = getClockDotCenter(spec, ctx, index);
              return dot.x - dot.diameter / 2;
            },
            y: (_d: unknown, ctx: LayoutContext) => {
              const dot = getClockDotCenter(spec, ctx, index);
              return dot.y - dot.diameter / 2;
            },
            width: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).diameter,
            height: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).diameter,
            image: block.image,
            cornerRadius: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).diameter / 2,
            repeatX: 'no-repeat',
            repeatY: 'no-repeat',
            imageMode: 'cover',
            imagePosition: 'center',
            stroke: themeColor,
            lineWidth: 2
          }
        } as ICustomMarkSpec<'image'>)
      : ({
          type: 'symbol',
          name: `storyline-clock-dot-${index}`,
          interactive: false,
          style: {
            x: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).x,
            y: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).y,
            size: (_d: unknown, ctx: LayoutContext) => getClockDotCenter(spec, ctx, index).diameter,
            symbolType: 'circle',
            fill: themeColor,
            stroke: '#ffffff',
            lineWidth: 1.5
          }
        } as ICustomMarkSpec<'symbol'>),
    // title：文字段的第一行
    block.title
      ? ({
          type: 'text',
          name: `storyline-clock-title-${index}`,
          interactive: false,
          ...spec.title,
          style: {
            x: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).x,
            y: (_d: unknown, ctx: LayoutContext) =>
              getClockTextRect(spec, ctx, index).anchorY - CLOCK_TITLE_LINE_HEIGHT,
            text: block.title,
            maxLineWidth: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).width,
            fontSize: CLOCK_TITLE_FONT_SIZE,
            lineHeight: CLOCK_TITLE_LINE_HEIGHT,
            fontWeight: 'bold',
            fill: themeColor,
            textAlign: (_d: unknown, ctx: LayoutContext) =>
              getClockTextRect(spec, ctx, index).onLeft ? 'right' : 'left',
            textBaseline: 'top',
            ...spec.title?.style
          }
        } as ICustomMarkSpec<'text'>)
      : null,
    // content：富文本，title 下方
    contentText.length
      ? ({
          type: 'text',
          name: `storyline-clock-content-${index}`,
          interactive: false,
          ...spec.content,
          textType: 'rich',
          style: {
            x: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).x,
            y: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).anchorY + 4,
            width: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).width,
            maxLineWidth: (_d: unknown, ctx: LayoutContext) => getClockTextRect(spec, ctx, index).width,
            text: buildRichContent(contentText, spec),
            fontSize: CLOCK_CONTENT_FONT_SIZE,
            lineHeight: CLOCK_CONTENT_LINE_HEIGHT,
            fill: '#3a3f4d',
            textAlign: (_d: unknown, ctx: LayoutContext) =>
              getClockTextRect(spec, ctx, index).onLeft ? 'right' : 'left',
            textBaseline: 'top',
            wordBreak: 'break-word',
            ...spec.content?.style
          }
        } as ICustomMarkSpec<'text'>)
      : null
  ];

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    children: children.filter(Boolean) as ICustomMarkSpec<any>[]
  };
};
