import { isContinuous, type IBaseScale } from '@visactor/vscale';
import { isValid, last } from '@visactor/vutils';
import type { IDataFilterComponentSpec } from './interface';
import type { StringOrNumber } from '../../typings';
import { statePointToData } from './util';

type WindowMode = 'percent' | 'value';
interface WindowEndpoint {
  mode: WindowMode;
  value: StringOrNumber;
}
export interface DataFilterWindow {
  start: WindowEndpoint;
  end: WindowEndpoint;
}

export function windowFromSpec(spec: IDataFilterComponentSpec): DataFilterWindow {
  const endpoint = (key: 'start' | 'end', fallback: number): WindowEndpoint => {
    const mode =
      (spec.rangeMode?.[key === 'start' ? 0 : 1] as WindowMode | undefined) ??
      (isValid(spec[key]) || !isValid(spec[`${key}Value`]) ? 'percent' : 'value');
    return { mode, value: (mode === 'percent' ? spec[key] : spec[`${key}Value`]) ?? fallback };
  };
  return { start: endpoint('start', 0), end: endpoint('end', 1) };
}

/** 空域或暂时缺失的分类只影响手柄位置，不覆盖值锚点。 */
export function windowToRange(window: DataFilterWindow, scale: IBaseScale, reverse: boolean): [number, number] {
  const toPercent = ({ mode, value }: WindowEndpoint, fallback: number) => {
    if (mode === 'percent') {
      return Math.max(0, Math.min(1, value as number));
    }
    const domain = scale.domain();
    let percent: number;
    if (isContinuous(scale.type)) {
      percent = ((value as number) - domain[0]) / (last(domain) - domain[0]);
    } else {
      const range = scale.range();
      percent = (scale.scale(value) - range[0]) / (last(range) - range[0]);
    }
    if (!Number.isFinite(percent)) {
      return fallback;
    }
    return Math.max(0, Math.min(1, reverse ? 1 - percent : percent));
  };
  return [toPercent(window.start, 0), toPercent(window.end, 1)];
}

/** 交互只修改实际移动的端点；未移动的值端点保留原始锚点。 */
export function updateWindowFromRange(
  window: DataFilterWindow,
  start: number,
  end: number,
  scale: IBaseScale,
  reverse: boolean
) {
  const [previousStart, previousEnd] = windowToRange(window, scale, reverse);
  if (start !== previousStart) {
    window.start.value = window.start.mode === 'percent' ? start : statePointToData(start, scale, reverse);
  }
  if (end !== previousEnd) {
    window.end.value = window.end.mode === 'percent' ? end : statePointToData(end, scale, reverse);
  }
}
