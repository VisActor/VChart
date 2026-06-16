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
  DEFAULT_BLOCK_HEIGHT,
  DEFAULT_IMAGE_GAP
} from './layouts/common';
import { buildClockArcMark, buildClockBlockMark, buildClockCenterImageMark } from './layouts/clock';
import { buildDefaultBlockMark, buildDefaultLineMark } from './layouts/default';
import { buildLandscapeBlockMark, buildLandscapeConnectingCurve } from './layouts/landscape';
import { buildPortraitAxisMark, buildPortraitBlockMark } from './layouts/portrait';
import { buildArcBlockMark, buildArcCenterImageMark, buildArcMark } from './layouts/arc';
import { buildWingArcMark, buildWingBlockMark } from './layouts/wing';
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
 * - arc up（dome 穹顶）：centerImage 贴底 + textBox 在弧线上方，所以默认底部留 100px、顶部留 280px 给 textBox + 弧线呼吸空间；
 * - arc down（bowl 碗形）：centerImage 贴顶 + textBox 在弧线下方，所以默认顶部留 100px、底部留 280px 给 textBox + 弧线呼吸空间；
 * - portrait：textBox 在 image 下方，最后一个 block 的 content 容易溢出，底部留 160px；
 * - ladder：四周默认留出 content 文本宽度，避免 block 沿对角线"挤"到画布边缘；
 * 用户在 spec.padding 中显式指定的值会被保留，仅在缺省时生效。
 */
const applyDefaultPadding = (spec: any) => {
  const LARGE = 100;
  const SMALL = 20;
  // 给 textBox（240px）+ 一定呼吸空间，避免内容超出画布
  const TEXT_RESERVE = 280;
  // portrait 最后一个 block 下方的 textBox 大约 60-80px，加 image 半高、间距，预留 160px
  const PORTRAIT_BOTTOM_RESERVE = 160;
  const arc = isArc(spec as IStorylineSpec);
  const arcDown = arc && normalizeLayout((spec as IStorylineSpec).layout).direction === 'down';
  const arcUp = arc && !arcDown;
  const portrait = isPortrait(spec as IStorylineSpec);
  const ladder = isLadder(spec as IStorylineSpec);
  // ladder：
  // - 左右 padding ≈ block content 宽度 × 2（保证两端 block 沿对角线水平有呼吸）
  // - 上下 padding ≈ block 高度 × 3（保证两端 block 沿对角线垂直留出充足画布留白）
  // 由于 transformSpec 阶段还无法获取真实 viewWidth，这里直接用 spec 中的估值
  const ladderHorizontalPadding = (() => {
    if (!ladder) {
      return 0;
    }
    const blockWidth = (spec as IStorylineSpec).block?.minWidth ?? resolveBlockWidth(spec as IStorylineSpec, 0);
    const imageWidth = (spec as IStorylineSpec).image?.width ?? 96; // UP_LADDER_BLOCK_IMAGE_SIZE
    const imageGap = (spec as IStorylineSpec).image?.gap ?? DEFAULT_IMAGE_GAP;
    const innerPadding = 12 * 2; // up-ladder 默认 block padding 12，左右共 24
    const contentWidth = Math.max(blockWidth - imageWidth - imageGap - innerPadding, DEFAULT_BLOCK_WIDTH * 0.5);
    return Math.round(contentWidth * 2);
  })();
  const ladderVerticalPadding = (() => {
    if (!ladder) {
      return 0;
    }
    const blockHeight = (spec as IStorylineSpec).block?.height ?? DEFAULT_BLOCK_HEIGHT;
    const chartHeight = (spec as IStorylineSpec).height;
    const heightCap =
      typeof chartHeight === 'number' && chartHeight > 0 ? Math.max(SMALL, Math.round(chartHeight * 0.18)) : Infinity;
    return Math.round(Math.min(blockHeight * 3, heightCap));
  })();
  // arc up（dome）: 底部贴 centerImage（LARGE），顶部留给 textBox（TEXT_RESERVE）
  // arc down（bowl）: 顶部贴 centerImage（LARGE），底部留给 textBox（TEXT_RESERVE）
  // portrait: 底部留给最后一个 block 的 textBox（PORTRAIT_BOTTOM_RESERVE）
  // ladder: 四周均为 content 宽度
  // 其它：保持原默认 [SMALL, SMALL, LARGE, SMALL]
  const defaultTop = ladder ? ladderVerticalPadding : arcDown ? LARGE : arcUp ? TEXT_RESERVE : SMALL;
  const defaultBottom = ladder
    ? ladderVerticalPadding
    : arcDown
      ? TEXT_RESERVE
      : portrait
        ? PORTRAIT_BOTTOM_RESERVE
        : LARGE;
  const defaultLeft = ladder ? ladderHorizontalPadding : SMALL;
  const defaultRight = ladder ? ladderHorizontalPadding : SMALL;
  const p = spec.padding;
  if (p === undefined || p === null) {
    spec.padding = [defaultTop, defaultRight, defaultBottom, defaultLeft];
    return;
  }
  if (typeof p === 'number') {
    spec.padding = [
      Math.max(p, defaultTop),
      Math.max(p, defaultRight),
      Math.max(p, defaultBottom),
      Math.max(p, defaultLeft)
    ];
    return;
  }
  if (Array.isArray(p)) {
    const [t, r = defaultRight, b, l = defaultLeft] = p;
    spec.padding = [t ?? defaultTop, r, b ?? defaultBottom, l];
    return;
  }
  if (typeof p === 'object') {
    spec.padding = {
      top: p.top ?? defaultTop,
      right: p.right ?? defaultRight,
      bottom: p.bottom ?? defaultBottom,
      left: p.left ?? defaultLeft
    };
  }
};

const buildStorylineMarks = (spec: IStorylineSpec) => {
  const lineMark = buildLineMark(spec);
  const blockMarks = (spec.data ?? []).map((block, index) => buildBlockMark(spec, block, index));
  // landscape：连接曲线绘制在所有 block 之上，避免被 image 遮挡
  if (isLandscape(spec)) {
    return [...blockMarks, lineMark].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // portrait：lineMark 是中轴 rect，作为底层背景先绘制
  if (isPortrait(spec)) {
    return [lineMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // arc：先绘制 centerImage（最底层视觉锚点），再绘制贯穿 block 的弧线，最后绘制 block；
  // arc 不绘制 block 之间默认的连接线。direction = 'up' 时 centerImage 贴底（穹顶），
  // direction = 'down' 时 centerImage 贴顶（碗形）
  if (isArc(spec)) {
    const centerImageMark = buildArcCenterImageMark(spec);
    const arcMark = buildArcMark(spec);
    return [centerImageMark, arcMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // clock：辐射式信息盘 —— 圆环骨架 + 径向分隔线 → centerImage（盘心）→ blocks（楔形 + 外圈文字）
  if (isClock(spec)) {
    const ringsMark = buildClockArcMark(spec);
    const centerImageMark = buildClockCenterImageMark(spec);
    return [ringsMark, ...blockMarks, centerImageMark].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // wing：椭圆弧脉络 + 弧线上的圆形 image + 左右交替排列的 title/content；
  // 通过 layout.direction 控制翅膀朝向（'left' | 'right'）
  if (isWing(spec)) {
    const arcMark = buildWingArcMark(spec);
    return [arcMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // ladder：参考 Bauhaus 信息图 —— 对角线 + 沿对角线倾斜的 headline 大字 + 两侧错落 block
  if (isLadder(spec)) {
    const diagonalMark = buildLadderDiagonalMark(spec);
    const headlineMark = buildLadderHeadlineMark(spec);
    return [diagonalMark, headlineMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  return [lineMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
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
