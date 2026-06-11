import { CommonChartSpecTransformer, type IExtensionGroupMarkSpec } from '@visactor/vchart';
import type { IStorylineBlock, IStorylineSpec } from './interface';
import { isBowl, isClock, isDome, isLandscape, isPortrait } from './layouts/common';
import { buildClockArcMark, buildClockBlockMark, buildClockCenterImageMark } from './layouts/clock';
import { buildDefaultBlockMark, buildDefaultLineMark } from './layouts/default';
import { buildLandscapeBlockMark, buildLandscapeConnectingCurve } from './layouts/landscape';
import { buildPortraitAxisMark, buildPortraitBlockMark } from './layouts/portrait';
import { buildDomeArcMark, buildDomeBlockMark, buildDomeCenterImageMark } from './layouts/dome';
import { buildBowlArcMark, buildBowlBlockMark, buildBowlCenterImageMark } from './layouts/bowl';

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
 * 图表默认 padding：所有 storyline 布局底部默认留 100px，
 * 给 dome 的 centerImage / 其它布局的引导线留出呼吸空间。
 * 用户在 spec.padding 中显式指定的值会被保留，仅在缺省时生效。
 */
const applyDefaultPadding = (spec: any) => {
  const DEFAULT_BOTTOM = 100;
  const DEFAULT_OTHER = 20;
  const p = spec.padding;
  if (p === undefined || p === null) {
    spec.padding = [DEFAULT_OTHER, DEFAULT_OTHER, DEFAULT_BOTTOM, DEFAULT_OTHER];
    return;
  }
  if (typeof p === 'number') {
    spec.padding = [p, p, Math.max(p, DEFAULT_BOTTOM), p];
    return;
  }
  if (Array.isArray(p)) {
    const [t = DEFAULT_OTHER, r = DEFAULT_OTHER, b, l = DEFAULT_OTHER] = p;
    spec.padding = [t, r, b ?? DEFAULT_BOTTOM, l];
    return;
  }
  if (typeof p === 'object') {
    spec.padding = {
      top: p.top ?? DEFAULT_OTHER,
      right: p.right ?? DEFAULT_OTHER,
      bottom: p.bottom ?? DEFAULT_BOTTOM,
      left: p.left ?? DEFAULT_OTHER
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
  // dome：先绘制 centerImage（最底层视觉锚点），再绘制贯穿 block 的弧线，最后绘制 block；
  // dome 不绘制 block 之间默认的连接线
  if (isDome(spec)) {
    const centerImageMark = buildDomeCenterImageMark(spec);
    const arcMark = buildDomeArcMark(spec);
    return [centerImageMark, arcMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // bowl：dome 的上下镜像 —— centerImage 贴顶，弧线 + block 在下方
  if (isBowl(spec)) {
    const centerImageMark = buildBowlCenterImageMark(spec);
    const arcMark = buildBowlArcMark(spec);
    return [centerImageMark, arcMark, ...blockMarks].filter(Boolean) as IExtensionGroupMarkSpec[];
  }
  // clock：辐射式信息盘 —— 圆环骨架 + 径向分隔线 → centerImage（盘心）→ blocks（楔形 + 外圈文字）
  if (isClock(spec)) {
    const ringsMark = buildClockArcMark(spec);
    const centerImageMark = buildClockCenterImageMark(spec);
    return [ringsMark, ...blockMarks, centerImageMark].filter(Boolean) as IExtensionGroupMarkSpec[];
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
  if (isDome(spec)) {
    return buildDomeBlockMark(spec, block, index);
  }
  if (isBowl(spec)) {
    return buildBowlBlockMark(spec, block, index);
  }
  if (isClock(spec)) {
    return buildClockBlockMark(spec, block, index);
  }

  return buildDefaultBlockMark(spec, block, index);
};
