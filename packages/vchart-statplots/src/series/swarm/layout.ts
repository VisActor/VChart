export interface SwarmPoint {
  id: string;
  valuePosition: number;
  radius: number;
}
export interface SwarmPlacement {
  id: string;
  offset: number;
  overflow: boolean;
}
/** 像素空间排布。只扫描仍可能碰撞的邻域；溢出点不加入占位集合，避免密集重合退化为全量两两比较。 */
export function layoutSwarm(
  points: SwarmPoint[],
  halfWidth: number
): { placements: SwarmPlacement[]; overflow: number } {
  const ordered = points
    .slice()
    .sort((a, b) => a.valuePosition - b.valuePosition || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const maxRadius = ordered.reduce((r, p) => Math.max(r, p.radius), 0);
  let active: (SwarmPoint & { offset: number })[] = [];
  let overflow = 0;
  const placements: SwarmPlacement[] = [];
  for (const point of ordered) {
    active = active.filter(other => point.valuePosition - other.valuePosition <= point.radius + maxRadius);
    const candidates = [0];
    for (const other of active) {
      const distance = point.radius + other.radius + 0.5;
      const dy = point.valuePosition - other.valuePosition;
      if (Math.abs(dy) < distance) {
        const dx = Math.sqrt(distance * distance - dy * dy);
        candidates.push(other.offset + dx, other.offset - dx);
      }
    }
    candidates.sort((a, b) => Math.abs(a) - Math.abs(b) || a - b);
    let chosen: number | undefined;
    for (const candidate of candidates) {
      if (Math.abs(candidate) + point.radius > halfWidth) {
        continue;
      }
      if (
        active.every(
          other =>
            (candidate - other.offset) ** 2 + (point.valuePosition - other.valuePosition) ** 2 >=
            (point.radius + other.radius + 0.49) ** 2
        )
      ) {
        chosen = candidate;
        break;
      }
    }
    const crowded = chosen === undefined;
    if (crowded) {
      overflow++;
    } else {
      active.push({ ...point, offset: chosen! });
    }
    placements.push({ id: point.id, offset: chosen ?? 0, overflow: crowded });
  }
  return { placements, overflow };
}
