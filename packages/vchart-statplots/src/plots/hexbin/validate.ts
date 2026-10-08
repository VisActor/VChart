import type { HexbinPlotSpec } from './types';
import { checkUnique, checkCount, issue } from '../../common/validation';
export function validateHexbin(spec: HexbinPlotSpec) {
  const errors = checkUnique(spec.data, row => row.id);
  spec.data.forEach((row, i) => {
    errors.push(...checkCount(row.count, `/data/${i}/count`));
    const v = row.vertices;
    if (v.length !== 6) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/vertices`, '每箱须有六个顶点'));
      return;
    }
    let sign = 0;
    let valid = true;
    for (let j = 0; j < 6; j++) {
      const a = v[j],
        b = v[(j + 1) % 6];
      // 凸多边形的其余顶点必须严格位于每条有向边的同侧；同时排除自交星形。
      for (let k = 2; k < 6; k++) {
        const c = v[(j + k) % 6];
        const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        if (!Number.isFinite(cross) || !cross || (sign && Math.sign(cross) !== sign)) {
          valid = false;
        }
        sign = Math.sign(cross);
      }
    }
    if (!valid) {
      errors.push(issue('INVALID_ORDER', `/data/${i}/vertices`, '顶点须按周界顺序组成非退化凸六边形'));
    }
  });
  return errors;
}
