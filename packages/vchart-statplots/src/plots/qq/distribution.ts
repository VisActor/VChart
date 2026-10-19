import { normalQuantile, quantileSorted, ordinaryLeastSquares } from '@visactor/vutils';
import type { QqPlotSpec } from './types';
import { seriesGroups, issue } from '../../common/validation';
import { StatPlotValidationError } from '../../errors';

interface QqPoint {
  theoreticalQuantile: number;
  sampleQuantile: number;
  probability: number;
  series?: string;
}
interface QqLine {
  theoreticalQuantile: number;
  sampleQuantile: number;
  series?: string;
  slope: number;
  intercept: number;
}

export function computeQq(spec: QqPlotSpec) {
  const points: QqPoint[] = [];
  const referenceLines: QqLine[] = [];
  const mean = spec.distribution?.mean ?? 0;
  const sd = spec.distribution?.standardDeviation ?? 1;
  for (const [series, group] of seriesGroups(spec.data)) {
    const sample = group.map(({ row }) => row.value).sort((a, b) => a - b);
    const theory = sample.map((_, i) => mean + sd * normalQuantile((i + 1) / (sample.length + 1)));
    for (let i = 0; i < sample.length; i++) {
      if (!Number.isFinite(theory[i]) || (i > 0 && !(theory[i] > theory[i - 1]))) {
        throw new StatPlotValidationError([
          issue('INVALID_RANGE', '/distribution', '理论分位点不可区分，请调整分布参数或数值单位')
        ]);
      }
      points.push({
        theoreticalQuantile: theory[i],
        sampleQuantile: sample[i],
        probability: (i + 1) / (sample.length + 1),
        series
      });
    }
    let slope: number;
    let intercept: number;
    if (spec.referenceLine === 'quartiles') {
      slope =
        (quantileSorted(sample, 0.75) - quantileSorted(sample, 0.25)) /
        (sd * (normalQuantile(0.75) - normalQuantile(0.25)));
      intercept = quantileSorted(sample, 0.25) - slope * (mean + sd * normalQuantile(0.25));
    } else if (spec.referenceLine === 'regression') {
      // 先中心化、缩放再调用标准 OLS，避免大坐标乘积溢出。
      const cx = theory[0] / 2 + theory[theory.length - 1] / 2;
      const cy = sample[0] / 2 + sample[sample.length - 1] / 2;
      const sx = Math.max(Math.abs(theory[0] - cx), Math.abs(theory[theory.length - 1] - cx));
      const sy = Math.max(Math.abs(sample[0] - cy), Math.abs(sample[sample.length - 1] - cy));
      let ux = 0,
        uy = 0,
        uxy = 0,
        ux2 = 0;
      for (let i = 0; i < sample.length; i++) {
        const x = (theory[i] - cx) / sx;
        const y = sy === 0 ? 0 : (sample[i] - cy) / sy;
        ux += x / sample.length;
        uy += y / sample.length;
        uxy += (x * y) / sample.length;
        ux2 += (x * x) / sample.length;
      }
      const coef = ordinaryLeastSquares(ux, uy, uxy, ux2);
      slope = (coef.b * sy) / sx;
      intercept = cy + coef.a * sy - slope * cx;
    } else continue;
    for (const x of [theory[0], theory[theory.length - 1]]) {
      const y = intercept + slope * x;
      if (!Number.isFinite(slope) || !Number.isFinite(intercept) || !Number.isFinite(y)) {
        throw new StatPlotValidationError([issue('INVALID_RANGE', '/referenceLine', '参考线不可表示，请转换数值单位')]);
      }
      referenceLines.push({ theoreticalQuantile: x, sampleQuantile: y, series, slope, intercept });
    }
  }
  if (spec.referenceLine === 'identity' && points.length) {
    let min = Infinity,
      max = -Infinity;
    for (const point of points) {
      min = Math.min(min, point.theoreticalQuantile, point.sampleQuantile);
      max = Math.max(max, point.theoreticalQuantile, point.sampleQuantile);
    }
    if (min === max) {
      const margin = Math.max(0.5, Math.abs(min) * 0.05);
      min -= margin;
      max += margin;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(max - min)) {
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', '/referenceLine', '参考线范围不可表示，请转换数值单位')
      ]);
    }
    referenceLines.push(
      ...[min, max].map(x => ({ theoreticalQuantile: x, sampleQuantile: x, slope: 1, intercept: 0 }))
    );
  }
  return { points, referenceLines };
}
