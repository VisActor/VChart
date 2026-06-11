import type { IStorylineBlock, IStorylineLayoutOptions, StorylineLayoutType } from './interface';

export interface StorylineSize {
  width: number;
  height: number;
}

export interface StorylinePadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface StorylinePoint {
  x: number;
  y: number;
}

export interface StorylineBlockPosition extends StorylinePoint, StorylineSize {
  id: string | number;
  index: number;
  datum: IStorylineBlock;
  center: StorylinePoint;
}

export interface StorylineLinkPosition {
  from: StorylineBlockPosition;
  to: StorylineBlockPosition;
  start: StorylinePoint;
  end: StorylinePoint;
  points: StorylinePoint[];
}

export interface StorylineCircleGuide {
  center: StorylinePoint;
  radius: number;
}

export interface StorylineLayoutResult {
  blocks: StorylineBlockPosition[];
  links: StorylineLinkPosition[];
  circleGuide?: StorylineCircleGuide;
}

export interface StorylineComputeOptions {
  layout: StorylineLayoutType | IStorylineLayoutOptions | undefined;
  viewBox: StorylineSize;
  block: StorylineSize;
  gap?: number;
  padding?: number | [number, number, number, number];
  lineDistance?: number;
}

const DEFAULT_LAYOUT: StorylineLayoutType = 'landscape';
const DEFAULT_PADDING = 24;

export const normalizePadding = (padding?: number | [number, number, number, number]): StorylinePadding => {
  if (Array.isArray(padding)) {
    return {
      top: padding[0] ?? 0,
      right: padding[1] ?? 0,
      bottom: padding[2] ?? 0,
      left: padding[3] ?? 0
    };
  }
  const value = padding ?? DEFAULT_PADDING;
  return { top: value, right: value, bottom: value, left: value };
};

export const normalizeLayout = (layout?: StorylineLayoutType | IStorylineLayoutOptions): IStorylineLayoutOptions => {
  if (!layout) {
    return { type: DEFAULT_LAYOUT };
  }
  if (typeof layout === 'string') {
    return { type: layout };
  }
  return layout;
};

export const computeStorylineLayout = (
  data: IStorylineBlock[],
  options: StorylineComputeOptions
): StorylineLayoutResult => {
  const layout = normalizeLayout(options.layout);
  const padding = normalizePadding(layout.padding ?? options.padding);
  const gap = options.gap ?? 40;
  const lineDistance = options.lineDistance ?? 8;
  const blocks = computeBlockPositions(data, layout, options.viewBox, options.block, padding, gap);
  const circleGuide =
    layout.type === 'clock' ? computeClockCircleGuide(options.viewBox, options.block, padding, layout) : undefined;
  return {
    blocks,
    links: computeLinks(blocks, lineDistance),
    circleGuide
  };
};

const computeBlockPositions = (
  data: IStorylineBlock[],
  layout: IStorylineLayoutOptions,
  viewBox: StorylineSize,
  block: StorylineSize,
  padding: StorylinePadding,
  gap: number
): StorylineBlockPosition[] => {
  const count = data.length;
  if (!count) {
    return [];
  }

  const inner = {
    x: padding.left,
    y: padding.top,
    width: Math.max(viewBox.width - padding.left - padding.right, block.width),
    height: Math.max(viewBox.height - padding.top - padding.bottom, block.height)
  };
  const center = {
    x: inner.x + inner.width / 2,
    y: inner.y + inner.height / 2
  };

  let centers: StorylinePoint[];
  switch (layout.type) {
    case 'portrait':
      centers = lineCenters(
        count,
        center.x,
        inner.y + block.height / 2,
        center.x,
        inner.y + inner.height - block.height / 2
      );
      break;
    case 'up-ladder':
      centers = lineCenters(
        count,
        inner.x + block.width / 2,
        inner.y + inner.height - block.height / 2,
        inner.x + inner.width - block.width / 2,
        inner.y + block.height / 2
      );
      break;
    case 'down-ladder':
      centers = lineCenters(
        count,
        inner.x + block.width / 2,
        inner.y + block.height / 2,
        inner.x + inner.width - block.width / 2,
        inner.y + inner.height - block.height / 2
      );
      break;
    case 'pulse':
      centers = alternatingHorizontalCenters(count, inner, block, gap);
      break;
    case 'spiral':
      centers = alternatingVerticalCenters(count, inner, block, gap);
      break;
    case 'clock':
      centers = circularCenters(count, viewBox, block, padding, layout);
      break;
    case 'bowl':
      centers = arcCenters(count, inner, block, layout, 200, 340);
      break;
    case 'dome':
      centers = arcCenters(count, inner, block, layout, 160, 20);
      break;
    case 'left-wing':
      centers = arcCenters(count, inner, block, layout, 250, 110);
      break;
    case 'right-wing':
      centers = arcCenters(count, inner, block, layout, -70, 70);
      break;
    case 'landscape':
    default:
      centers = lineCenters(
        count,
        inner.x + block.width / 2,
        center.y,
        inner.x + inner.width - block.width / 2,
        center.y
      );
      break;
  }

  return centers.map((point, index) => ({
    id: data[index]?.id ?? index,
    index,
    datum: data[index],
    width: block.width,
    height: block.height,
    x: point.x - block.width / 2,
    y: point.y - block.height / 2,
    center: point
  }));
};

const lineCenters = (count: number, x0: number, y0: number, x1: number, y1: number): StorylinePoint[] => {
  if (count === 1) {
    return [{ x: (x0 + x1) / 2, y: (y0 + y1) / 2 }];
  }
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    return {
      x: x0 + (x1 - x0) * t,
      y: y0 + (y1 - y0) * t
    };
  });
};

const alternatingHorizontalCenters = (
  count: number,
  inner: { x: number; y: number; width: number; height: number },
  block: StorylineSize,
  gap: number
) => {
  const baseY = inner.y + inner.height / 2;
  const offset = Math.min(Math.max(block.height * 0.65 + gap / 2, 0), Math.max((inner.height - block.height) / 2, 0));
  const points = lineCenters(count, inner.x + block.width / 2, baseY, inner.x + inner.width - block.width / 2, baseY);
  return points.map((point, index) => ({
    x: point.x,
    y: point.y + (index % 2 === 0 ? -offset : offset)
  }));
};

const alternatingVerticalCenters = (
  count: number,
  inner: { x: number; y: number; width: number; height: number },
  block: StorylineSize,
  gap: number
) => {
  const baseX = inner.x + inner.width / 2;
  const offset = Math.min(Math.max(block.width * 0.65 + gap / 2, 0), Math.max((inner.width - block.width) / 2, 0));
  const points = lineCenters(
    count,
    baseX,
    inner.y + block.height / 2,
    baseX,
    inner.y + inner.height - block.height / 2
  );
  return points.map((point, index) => ({
    x: point.x + (index % 2 === 0 ? -offset : offset),
    y: point.y
  }));
};

const circularCenters = (
  count: number,
  viewBox: StorylineSize,
  block: StorylineSize,
  padding: StorylinePadding,
  layout: IStorylineLayoutOptions
) => {
  const guide = computeClockCircleGuide(viewBox, block, padding, layout);
  const startAngle = layout.startAngle ?? -90;
  const delta = 360;

  if (count === 1) {
    const angle = degreeToRadian(startAngle);
    return [
      {
        x: guide.center.x + Math.cos(angle) * guide.radius,
        y: guide.center.y + Math.sin(angle) * guide.radius
      }
    ];
  }

  return Array.from({ length: count }, (_, index) => {
    const angle = degreeToRadian(startAngle + (delta * index) / count);
    return {
      x: guide.center.x + Math.cos(angle) * guide.radius,
      y: guide.center.y + Math.sin(angle) * guide.radius
    };
  });
};

const computeClockCircleGuide = (
  viewBox: StorylineSize,
  block: StorylineSize,
  padding: StorylinePadding,
  layout: IStorylineLayoutOptions
): StorylineCircleGuide => {
  const innerWidth = Math.max(viewBox.width - padding.left - padding.right, 1);
  const innerHeight = Math.max(viewBox.height - padding.top - padding.bottom, 1);
  const center = {
    x: padding.left + innerWidth / 2,
    y: padding.top + innerHeight / 2
  };
  const ratio = layout.radiusRatio ?? 0.7;
  const maxRadius = Math.max(Math.min(innerWidth - block.width, innerHeight - block.height) / 2, 1);

  return {
    center,
    radius: Math.max(1, maxRadius * ratio)
  };
};

const arcCenters = (
  count: number,
  inner: { x: number; y: number; width: number; height: number },
  block: StorylineSize,
  layout: IStorylineLayoutOptions,
  fallbackStartAngle?: number,
  fallbackEndAngle?: number,
  defaultRatio = 0.88
) => {
  const startAngle = layout.startAngle ?? fallbackStartAngle ?? -90;
  const endAngle = layout.endAngle ?? fallbackEndAngle ?? 270;
  const ratio = layout.radiusRatio ?? defaultRatio;
  const rx = Math.max((inner.width - block.width) / 2, 1) * ratio;
  const ry = Math.max((inner.height - block.height) / 2, 1) * ratio;
  const center = {
    x: inner.x + inner.width / 2,
    y: inner.y + inner.height / 2
  };

  if (count === 1) {
    const angle = degreeToRadian((startAngle + endAngle) / 2);
    return [{ x: center.x + Math.cos(angle) * rx, y: center.y + Math.sin(angle) * ry }];
  }

  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const angle = degreeToRadian(startAngle + angleDelta(startAngle, endAngle) * t);
    return {
      x: center.x + Math.cos(angle) * rx,
      y: center.y + Math.sin(angle) * ry
    };
  });
};

const angleDelta = (startAngle: number, endAngle: number) => {
  const delta = endAngle - startAngle;
  return Math.abs(delta) >= 360 ? 360 : delta;
};

const degreeToRadian = (degree: number) => (degree / 180) * Math.PI;

const computeLinks = (blocks: StorylineBlockPosition[], distance: number): StorylineLinkPosition[] => {
  const links: StorylineLinkPosition[] = [];
  for (let i = 0; i < blocks.length - 1; i++) {
    const from = blocks[i];
    const to = blocks[i + 1];
    const start = pointOnBlockEdge(from, to.center, distance);
    const end = pointOnBlockEdge(to, from.center, distance);
    links.push({
      from,
      to,
      start,
      end,
      points: [start, end]
    });
  }
  return links;
};

const pointOnBlockEdge = (block: StorylineBlockPosition, toward: StorylinePoint, distance: number): StorylinePoint => {
  const dx = toward.x - block.center.x;
  const dy = toward.y - block.center.y;
  if (dx === 0 && dy === 0) {
    return { x: block.center.x, y: block.center.y };
  }
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : block.width / 2 / Math.abs(dx);
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : block.height / 2 / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: block.center.x + dx * scale + (dx / length) * distance,
    y: block.center.y + dy * scale + (dy / length) * distance
  };
};
