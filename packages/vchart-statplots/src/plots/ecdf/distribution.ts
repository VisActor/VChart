import { ecdf } from '@visactor/vutils';
import type { EcdfPlotRow } from './types';
import { seriesGroups } from '../../common/validation';

export interface EcdfCurveRow extends EcdfPlotRow {
  cumulativeProbability: number;
}

/** 只确定轴域；校验不执行排序和累计概率计算。 */
export function ecdfDomain(data: readonly EcdfPlotRow[]): [number, number] | null {
  if (!data.length) {
    return [-0.5, 0.5];
  }
  let min = Infinity,
    max = -Infinity;
  for (const row of data) {
    min = Math.min(min, row.value);
    max = Math.max(max, row.value);
  }
  const padding = min === max ? Math.max(0.5, Math.abs(min) * 0.05) : (max - min) * 0.05;
  const left = min - padding,
    right = max + padding;
  return Number.isFinite(left) && Number.isFinite(right) && left < min && right > max && Number.isFinite(right - left)
    ? [left, right]
    : null;
}

/** 坐标选择属于绘制；样本权重和累计概率由 vutils 的 evaluator 计算。 */
export function ecdfDistribution(data: readonly EcdfPlotRow[], domain: [number, number]): EcdfCurveRow[] {
  const rows: EcdfCurveRow[] = [];
  for (const [series, group] of seriesGroups(data)) {
    const samples = group.map(({ row }) => row.value);
    const model = ecdf(samples);
    const positions = Array.from(new Set(samples)).sort((a, b) => a - b);
    const probabilities = model.evaluate(positions) as number[];
    const label = series === undefined ? {} : { series };
    rows.push({ ...label, value: domain[0], cumulativeProbability: 0 });
    for (let i = 0; i < positions.length; i++) {
      rows.push({ ...label, value: positions[i], cumulativeProbability: probabilities[i] });
    }
    rows.push({ ...label, value: domain[1], cumulativeProbability: 1 });
  }
  return rows;
}
