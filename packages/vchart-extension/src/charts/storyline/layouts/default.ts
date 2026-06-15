import type { IExtensionGroupMarkSpec } from '@visactor/vchart';
import { LayoutZIndex } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec, StorylineLineType } from '../interface';
import {
  type ICustomMarkSpec,
  type LayoutContext,
  type StorylinePoint,
  DEFAULT_BLOCK_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_GAP,
  buildRichContent,
  getImageBox,
  getLayout,
  getTextBox,
  normalizePadding,
  omitImageLayoutSpec,
  resolveBlockWidth
} from './common';

/**
 * 默认布局：rect block（image + title + content） + 普通 link mark。
 */

export const buildDefaultLineMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible === false || (spec.data?.length ?? 0) <= 1) {
    return null;
  }

  return {
    type: 'group' as any,
    name: 'storyline-links',
    zIndex: LayoutZIndex.Mark,
    children: (spec.data ?? []).slice(1).map((_, index) => {
      const { style = {}, type = 'line', showArrow = false, arrowSize = 8, ...rest } = spec.line ?? {};
      return {
        type: 'path',
        name: `storyline-link-${index}`,
        interactive: false,
        ...rest,
        style: {
          stroke: '#8a94a6',
          lineWidth: 1.5,
          fill: 'transparent',
          fillOpacity: 0,
          ...style,
          path: (_datum: unknown, ctx: LayoutContext) => {
            const link = getLayout(spec, ctx).links[index];
            if (!link) {
              return '';
            }
            return buildLinkPath(link.points, type, showArrow, arrowSize);
          }
        }
      } as ICustomMarkSpec<'path'>;
    })
  };
};

const getDefaultBlockMetrics = (spec: IStorylineSpec, ctx: LayoutContext, index: number) => {
  const block = getLayout(spec, ctx).blocks[index];
  const padding = normalizePadding(spec.block?.padding ?? 12);
  const imagePosition = spec.image?.position ?? 'top';
  const imageWidth = spec.image?.width ?? DEFAULT_IMAGE_WIDTH;
  const imageHeight = spec.image?.height ?? DEFAULT_IMAGE_HEIGHT;
  const imageGap = spec.image?.gap ?? DEFAULT_IMAGE_GAP;
  const hasImage = !!spec.data?.[index]?.image;
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 18);
  const titleLineHeight = Number((spec.title?.style as any)?.lineHeight ?? Math.round(titleFontSize * 1.35));
  const titleHeight = spec.data?.[index]?.title ? titleLineHeight : 0;
  const blockWidth = block?.width ?? resolveBlockWidth(spec, 0);
  const blockHeight = block?.height ?? spec.block?.height ?? DEFAULT_BLOCK_HEIGHT;
  const imageBox = getImageBox(
    imagePosition,
    blockWidth,
    blockHeight,
    padding,
    imageWidth,
    imageHeight,
    imageGap,
    hasImage
  );
  const textBox = getTextBox(
    imagePosition,
    blockWidth,
    blockHeight,
    padding,
    imageWidth,
    imageHeight,
    imageGap,
    hasImage
  );
  const contentGap = spec.data?.[index]?.title ? 8 : 0;

  return {
    block: {
      width: blockWidth,
      height: blockHeight
    },
    imageBox,
    textBox,
    contentBox: {
      y: textBox.y + titleHeight + contentGap,
      height: Math.max(0, textBox.height - titleHeight - contentGap)
    }
  };
};

export const buildDefaultBlockMark = (
  spec: IStorylineSpec,
  block: IStorylineBlock,
  index: number
): IExtensionGroupMarkSpec => {
  const hasImage = !!block.image;
  const contentText = Array.isArray(block.content) ? block.content : block.content ? [block.content] : [];
  const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 18);
  const titleLineHeight = Number((spec.title?.style as any)?.lineHeight ?? Math.round(titleFontSize * 1.35));

  return {
    type: 'group' as any,
    id: `storyline-block-${block.id ?? index}`,
    name: `storyline-block-${index}`,
    zIndex: LayoutZIndex.Mark + 1,
    style: {
      x: (_datum: unknown, ctx: LayoutContext) => getLayout(spec, ctx).blocks[index]?.x ?? 0,
      y: (_datum: unknown, ctx: LayoutContext) => getLayout(spec, ctx).blocks[index]?.y ?? 0,
      width: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).block.width,
      height: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).block.height
    },
    children: [
      {
        type: 'rect',
        name: `storyline-block-bg-${index}`,
        interactive: false,
        style: {
          x: 0,
          y: 0,
          width: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).block.width,
          height: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).block.height,
          cornerRadius: 8,
          fill: '#ffffff',
          stroke: '#d7dce5',
          lineWidth: 1,
          shadowBlur: 6,
          shadowColor: 'rgba(0, 0, 0, 0.08)',
          ...spec.block?.style
        }
      },
      hasImage
        ? ({
            type: 'image',
            name: `storyline-block-image-${index}`,
            interactive: false,
            ...omitImageLayoutSpec(spec.image),
            style: {
              x: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).imageBox.x,
              y: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).imageBox.y,
              width: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).imageBox.width,
              height: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).imageBox.height,
              image: block.image,
              ...spec.image?.style
            }
          } as ICustomMarkSpec<'image'>)
        : null,
      block.title
        ? ({
            type: 'text',
            name: `storyline-block-title-${index}`,
            interactive: false,
            ...spec.title,
            style: {
              x: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).textBox.x,
              y: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).textBox.y,
              text: block.title,
              maxLineWidth: (_datum: unknown, ctx: LayoutContext) =>
                getDefaultBlockMetrics(spec, ctx, index).textBox.width,
              fontSize: titleFontSize,
              lineHeight: titleLineHeight,
              fontWeight: 'bold',
              fill: '#1f2430',
              stroke: '#fff',
              lineWidth: 5,
              lineJoin: 'round',
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
              x: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).textBox.x,
              y: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).contentBox.y,
              width: (_datum: unknown, ctx: LayoutContext) => getDefaultBlockMetrics(spec, ctx, index).textBox.width,
              text: buildRichContent(contentText, spec),
              maxLineWidth: (_datum: unknown, ctx: LayoutContext) =>
                getDefaultBlockMetrics(spec, ctx, index).textBox.width,
              fontSize: 12,
              lineHeight: 18,
              heightLimit: (_datum: unknown, ctx: LayoutContext) =>
                getDefaultBlockMetrics(spec, ctx, index).contentBox.height,
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

const buildLinkPath = (
  points: StorylinePoint[],
  type: StorylineLineType,
  showArrow: boolean,
  arrowSize: number
): string => {
  const start = points[0];
  const end = points[points.length - 1];
  if (!start || !end) {
    return '';
  }
  let path: string;
  if (type === 'curve') {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const curve = Math.max(Math.min(Math.sqrt(dx * dx + dy * dy) * 0.22, 80), 24);
    path =
      `M ${start.x} ${start.y} ` +
      `C ${start.x + dx / 2} ${start.y - curve} ${end.x - dx / 2} ${end.y + curve} ${end.x} ${end.y}`;
  } else if (type === 'polyline') {
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    path = `M ${start.x} ${start.y} L ${mid.x} ${start.y} L ${mid.x} ${end.y} L ${end.x} ${end.y}`;
  } else {
    path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (!showArrow) {
    return path;
  }
  return `${path} ${buildArrowPath(start, end, arrowSize)}`;
};

const buildArrowPath = (start: StorylinePoint, end: StorylinePoint, size: number) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const left = {
    x: end.x - Math.cos(angle - Math.PI / 6) * size,
    y: end.y - Math.sin(angle - Math.PI / 6) * size
  };
  const right = {
    x: end.x - Math.cos(angle + Math.PI / 6) * size,
    y: end.y - Math.sin(angle + Math.PI / 6) * size
  };
  return `M ${left.x} ${left.y} L ${end.x} ${end.y} L ${right.x} ${right.y}`;
};
