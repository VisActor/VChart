import { CommonChartSpecTransformer, type IExtensionGroupMarkSpec } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from './interface';
import {
  isArc,
  isClock,
  isLadder,
  isLandscape,
  isPortrait,
  isWing,
  normalizeLayout,
  resolveBlockWidth,
  DEFAULT_BLOCK_WIDTH,
  DEFAULT_IMAGE_GAP,
  buildTopTitleImageMark,
  getTitleImageReservedHeight
} from './layouts/common';
import { buildClockArcMark, buildClockBlockMark } from './layouts/clock';
import { buildDefaultBlockMark, buildDefaultLineMark } from './layouts/default';
import { buildLandscapeBlockMark, buildLandscapeConnectingCurve } from './layouts/landscape';
import {
  buildPortraitAxisMark,
  buildPortraitBlockMark,
  PORTRAIT_CONTENT_HEIGHT_RATIO,
  PORTRAIT_IMAGE_HEIGHT_RATIO
} from './layouts/portrait';
import { buildArcBlockMark, buildArcMark, buildArcTitleImageMark } from './layouts/arc';
import { buildWingArcMark, buildWingBlockMark, buildWingTitleImageMark } from './layouts/wing';
import { buildLadderBlockMark, buildLadderDiagonalMark, buildLadderHeadlineMark } from './layouts/ladder';

export class StorylineChartSpecTransformer extends CommonChartSpecTransformer<any> {
  transformSpec(spec: any): void {
    applyDefaultPadding(spec);
    const storylineSpec = {
      ...spec,
      data: [...(spec.data ?? [])]
    } as IStorylineSpec;

    spec.type = 'common' as any;
    spec.data = [];
    spec.series = [];
    spec.axes = [];
    spec.customMark = buildStorylineMarks(storylineSpec);
    delete spec.layout;
    delete spec.title;
    super.transformSpec(spec as any);
  }
}

/**
 * 图表默认 padding：
 * - arc up（dome 穹顶）：titleImage 贴底 + textBox 在弧线上方，所以默认底部留 100px、顶部留 280px 给 textBox + 弧线呼吸空间；
 * - arc down（bowl 碗形）：titleImage 贴顶 + textBox 在弧线下方，所以默认顶部留 100px、底部留 280px 给 textBox + 弧线呼吸空间；
 * - portrait：textBox 在 image 下方，最后一个 block 的 content 容易超出 region。底部 padding 默认 = 单个 block 的 content 高度
 *   （即 regionHeight / count * 0.6），保证最后一个 block 有完整的 content 展示空间；
 * - ladder：四周默认留出 content 文本宽度，避免 block 沿对角线"挤"到画布边缘；
 * 用户在 spec.padding 中显式指定的值会被保留；顶部 titleImage 会额外保证最小 top padding，避免覆盖 region 内容。
 */
const applyDefaultPadding = (spec: any) => {
  const LARGE = 100;
  const SMALL = 20;
  // 给 textBox（240px）+ 一定呼吸空间，避免内容超出画布
  const TEXT_RESERVE = 280;
  const arc = isArc(spec as IStorylineSpec);
  const arcDown = arc && normalizeLayout((spec as IStorylineSpec).layout).direction === 'down';
  const arcUp = arc && !arcDown;
  const portrait = isPortrait(spec as IStorylineSpec);
  const ladder = isLadder(spec as IStorylineSpec);
  const wing = isWing(spec as IStorylineSpec);
  const clock = isClock(spec as IStorylineSpec);
  const topTitleImageReserve = (() => {
    if (
      arc ||
      ladder ||
      !(spec as IStorylineSpec).titleImage?.image ||
      (spec as IStorylineSpec).titleImage?.visible === false
    ) {
      return 0;
    }
    return getTitleImageReservedHeight(
      spec as IStorylineSpec,
      Number((spec as IStorylineSpec).width ?? 1000),
      Number((spec as IStorylineSpec).height ?? 600)
    );
  })();
  // clock 辐射式布局：底部和顶部 blocks 的文字会向外延伸，需要在四周围留空间
  // portrait 底部 padding：精准预留最后一个 block 的 content 展示空间。
  // portrait 几何（layouts/portrait.ts）：
  //   - 每个 block center.y 等距放置
  //   - image 中心 = block center；imageHeight ≈ slotHeight * PORTRAIT_IMAGE_HEIGHT_RATIO
  //   - content 紧贴 image 下方：textY = image 底 + textGap；textHeight = titleLine + titleGap + contentHeight
  //   - contentHeight ≈ slotHeight * PORTRAIT_CONTENT_HEIGHT_RATIO
  // 最后一个 block center 到 canvas 底部需要至少 imageH/2 + textGap + titleLine + titleGap + contentH。
  // transformSpec 阶段无法获得真实 region，使用 spec.height 估算 slotHeight；缺省回退到 LARGE。
  const portraitBottomReserve = (() => {
    if (!portrait) {
      return 0;
    }
    const count = (spec as IStorylineSpec).data?.length ?? 0;
    const canvasHeight = (spec as IStorylineSpec).height as number | undefined;
    if (!count || !canvasHeight) {
      return LARGE;
    }
    // 在 transformSpec 阶段还没经过 region 减去 padding 等步骤，
    // 这里直接用 canvasHeight / (count + 1) 作为 slotHeight 的近似上界，
    // 后续 layout 逻辑会基于真实 region 重新计算 imageH / contentH。
    const slotHeight = canvasHeight / (count + 1);
    const imageHeight = (spec as IStorylineSpec).image?.height ?? slotHeight * PORTRAIT_IMAGE_HEIGHT_RATIO;
    const contentHeight = slotHeight * PORTRAIT_CONTENT_HEIGHT_RATIO;
    const titleFontSize = Number((spec.title?.style as any)?.fontSize ?? 26);
    const titleLineHeight = Number((spec.title?.style as any)?.lineHeight ?? Math.round(titleFontSize * 1.35));
    const textGap = 8; // PORTRAIT_TEXT_GAP_FROM_IMAGE
    const titleToContentGap = 4; // PORTRAIT_TITLE_TO_CONTENT_GAP
    const breath = 16; // 额外呼吸空间
    return Math.max(
      LARGE,
      Math.round(imageHeight / 2 + textGap + titleLineHeight + titleToContentGap + contentHeight + breath)
    );
  })();
  // ladder：
  // - 左右 padding ≈ block content 宽度 × 2（保证两端 block 沿对角线水平有呼吸）
  // - 上下 padding ≈ block 高度 × 3（保证两端 block 沿对角线垂直留出充足画布留白）
  // 由于 transformSpec 阶段还无法获取真实 viewWidth，这里直接用 spec 中的估值。
  // 同时限制 padding 不超过 canvas 对应维度的 30%，否则 inner 区域会被挤压到不可见。
  const ladderHorizontalPadding = (() => {
    if (!ladder) {
      return 0;
    }
    const blockWidth = (spec as IStorylineSpec).block?.minWidth ?? resolveBlockWidth(spec as IStorylineSpec, 0);
    const imageWidth = (spec as IStorylineSpec).image?.width ?? 96; // UP_LADDER_BLOCK_IMAGE_SIZE
    const imageGap = (spec as IStorylineSpec).image?.gap ?? DEFAULT_IMAGE_GAP;
    const innerPadding = 12 * 2; // up-ladder 默认 block padding 12，左右共 24
    const contentWidth = Math.max(blockWidth - imageWidth - imageGap - innerPadding, DEFAULT_BLOCK_WIDTH * 0.5);
    const ideal = Math.round(contentWidth * 2);
    const canvasWidth = (spec as IStorylineSpec).width as number | undefined;
    const cap = canvasWidth ? Math.floor(canvasWidth * 0.3) : ideal;
    return Math.min(ideal, cap);
  })();
  const ladderVerticalPadding = (() => {
    if (!ladder) {
      return 0;
    }
    const blockHeight = (spec as IStorylineSpec).block?.height ?? 132;
    const ideal = Math.round(blockHeight * 3);
    const canvasHeight = (spec as IStorylineSpec).height as number | undefined;
    const cap = canvasHeight ? Math.floor(canvasHeight * 0.3) : ideal;
    return Math.min(ideal, cap);
  })();
  // arc up（dome）: 顶部留给 textBox，底部紧贴（不要额外 padding）
  // arc down（bowl）: 底部留给 textBox，顶部紧贴（不要额外 padding）
  // portrait: 底部留给最后一个 block 的 content
  // ladder: 四周均为 content 宽度
  // 其它：保持原默认 [SMALL, SMALL, LARGE, SMALL]
  const defaultTop = Math.max(
    topTitleImageReserve,
    clock ? 40 : ladder ? ladderVerticalPadding : arcDown ? 0 : arcUp ? TEXT_RESERVE : SMALL
  );
  const defaultBottom = clock
    ? 60
    : portrait
      ? portraitBottomReserve
      : wing
        ? 300
        : arcUp
          ? 0
          : arcDown
            ? TEXT_RESERVE
            : LARGE;
  // arc：左右 padding = content 宽度（canvasWidth / (count + 1)），保证内容沿弧线均匀分布
  const arcHorizontalPadding = (() => {
    if (!arc) {
      return SMALL;
    }
    const count = Math.max((spec as IStorylineSpec).data?.length ?? 0, 1);
    const canvasWidth = (spec as IStorylineSpec).width as number | undefined;
    if (!canvasWidth) {
      return SMALL;
    }
    return Math.round(canvasWidth / (count + 1));
  })();
  const defaultLeft = clock ? 40 : ladder ? ladderHorizontalPadding : arcHorizontalPadding;
  const defaultRight = clock ? 40 : ladder ? ladderHorizontalPadding : arcHorizontalPadding;

  const p = spec.padding;
  if (p == null) {
    spec.padding = [defaultTop, defaultRight, defaultBottom, defaultLeft];
    return;
  }
  if (typeof p === 'number') {
    spec.padding = [Math.max(p, topTitleImageReserve), p, p, p];
    return;
  }
  if (Array.isArray(p)) {
    const [t, r = defaultRight, b, l = defaultLeft] = p;
    spec.padding = [Math.max(t ?? defaultTop, topTitleImageReserve), r, b ?? defaultBottom, l];
    return;
  }
  if (typeof p === 'object') {
    spec.padding = {
      top: Math.max(p.top ?? defaultTop, topTitleImageReserve),
      right: p.right ?? defaultRight,
      bottom: p.bottom ?? defaultBottom,
      left: p.left ?? defaultLeft
    };
  }
};

const buildStorylineMarks = (spec: IStorylineSpec) => {
  const lineMark = buildLineMark(spec);
  const blockMarks = (spec.data ?? []).map((block, index) => buildBlockMark(spec, block, index));
  const titleImageMark = buildTopTitleImageMark(spec);
  // landscape：连接曲线绘制在所有 block 之上，避免被 image 遮挡
  if (isLandscape(spec)) {
    return [titleImageMark, ...blockMarks, lineMark].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // portrait：lineMark 是中轴 rect，作为底层背景先绘制
  if (isPortrait(spec)) {
    return [lineMark, titleImageMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // arc：先绘制 titleImage（视觉锚点），再绘制贯穿 block 的弧线，最后绘制 block；
  // arc 不绘制 block 之间默认的连接线。direction = 'up' 时 titleImage 贴底（穹顶），
  // direction = 'down' 时 titleImage 贴顶（碗形）
  if (isArc(spec)) {
    const arcTitleImageMark = buildArcTitleImageMark(spec);
    const arcMark = buildArcMark(spec);
    return [arcTitleImageMark, arcMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // clock：辐射式信息盘 —— 圆环骨架 + 径向分隔线 + blocks（楔形 + 外圈文字）
  if (isClock(spec)) {
    const ringsMark = buildClockArcMark(spec);
    return [titleImageMark, ringsMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // wing：椭圆弧脉络 + 弧线上的圆形 image + 左右交替排列的 title/content；
  // 通过 layout.direction 控制翅膀朝向（'left' | 'right'）
  if (isWing(spec)) {
    const arcMark = buildWingArcMark(spec);
    const wingTitleImageMark = buildWingTitleImageMark(spec);
    return [arcMark, wingTitleImageMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // ladder：参考 Bauhaus 信息图 —— 对角线 + 沿对角线倾斜的 headline 大字 + 两侧错落 block
  if (isLadder(spec)) {
    const diagonalMark = buildLadderDiagonalMark(spec);
    const headlineMark = buildLadderHeadlineMark(spec);
    return [diagonalMark, headlineMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  return [titleImageMark, lineMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
};

const buildLineMark = (spec: IStorylineSpec): IExtensionGroupMarkSpec | null => {
  if (spec.line?.visible === false || (spec.data?.length ?? 0) <= 1) {
    return null;
  }
  if (isLandscape(spec)) {
    return buildLandscapeConnectingCurve(spec);
  }
  if (isPortrait(spec)) {
    return buildPortraitAxisMark(spec);
  }
  return buildDefaultLineMark(spec);
};

const buildBlockMark = (spec: IStorylineSpec, block: IStorylineBlock, index: number): IExtensionGroupMarkSpec => {
  if (isLandscape(spec)) {
    return buildLandscapeBlockMark(spec, block, index);
  }
  if (isPortrait(spec)) {
    return buildPortraitBlockMark(spec, block, index);
  }
  if (isArc(spec)) {
    return buildArcBlockMark(spec, block, index);
  }
  if (isClock(spec)) {
    return buildClockBlockMark(spec, block, index);
  }
  if (isWing(spec)) {
    return buildWingBlockMark(spec, block, index);
  }
  if (isLadder(spec)) {
    return buildLadderBlockMark(spec, block, index);
  }

  return buildDefaultBlockMark(spec, block, index);
};
