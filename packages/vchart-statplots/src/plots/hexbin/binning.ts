interface Point {
  x: number;
  y: number;
}
interface AxisSpace {
  origin: number;
  span: number;
}
export interface HexbinBin extends Point {
  id: string;
  q: number;
  s: number;
  count: number;
  vertices: Point[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
export interface HexbinResult {
  bins: HexbinBin[];
  xDomain: [number, number];
  yDomain: [number, number];
  normalizedAspect: number;
}

/** 只扫描范围，供公共边界校验和编译共用；不进行分箱。 */
export function hexbinSpace(points: readonly Point[]): { x: AxisSpace; y: AxisSpace } {
  let xMin = Infinity,
    xMax = -Infinity,
    yMin = Infinity,
    yMax = -Infinity;
  for (const point of points) {
    xMin = Math.min(xMin, point.x);
    xMax = Math.max(xMax, point.x);
    yMin = Math.min(yMin, point.y);
    yMax = Math.max(yMax, point.y);
  }
  const axis = (min: number, max: number): AxisSpace => {
    if (!points.length) return { origin: 0, span: 1 };
    const span = min === max ? Math.max(1, Math.abs(min)) : max - min;
    return { origin: min === max ? min - span / 2 : min, span };
  };
  return { x: axis(xMin, xMax), y: axis(yMin, yMax) };
}

/** 顶点安全包络及半径偏移必须可表示，不能将溢出或塌缩推迟到图元运行时。 */
export function isHexbinSpaceRepresentable(space: ReturnType<typeof hexbinSpace>, xBins: number): boolean {
  const radius = 2 / (3 * xBins);
  return [space.x, space.y].every(({ origin, span }) => {
    if (!Number.isFinite(origin) || !Number.isFinite(span) || span <= 0 || !Number.isFinite((1 + 4 * radius) * span))
      return false;
    const offset = span * (radius / 2);
    return [-2 * radius, 1 + 2 * radius].every(value => {
      const edge = origin + value * span;
      return (
        Number.isFinite(edge - offset) && Number.isFinite(edge + offset) && edge - offset < edge && edge + offset > edge
      );
    });
  });
}

/** 平顶轴向网格；调用方已校验有限坐标、分辨率和可表示范围。 */
export function binHexagons(points: readonly Point[], xBins: number): HexbinResult {
  if (!points.length) return { bins: [], xDomain: [0, 1], yDomain: [0, 1], normalizedAspect: 1 };
  const space = hexbinSpace(points);
  const radius = 2 / (3 * xBins),
    stepY = Math.sqrt(3) * radius;
  const counts = new Map<string, { q: number; s: number; count: number }>();
  for (const point of points) {
    const u = (point.x - space.x.origin) / space.x.span;
    const v = (point.y - space.y.origin) / space.y.span;
    const qFloat = (2 * u) / (3 * radius),
      sFloat = v / stepY - qFloat / 2;
    const tFloat = -qFloat - sFloat;
    let q = Math.round(qFloat),
      s = Math.round(sFloat);
    const t = Math.round(tFloat);
    const dq = Math.abs(q - qFloat),
      ds = Math.abs(s - sFloat),
      dt = Math.abs(t - tFloat);
    // cube 约束 q+s+t=0；相等误差按 q、s、t 的固定优先级修正。
    if (dq >= ds && dq >= dt) q = -s - t;
    else if (ds >= dt) s = -q - t;
    q = q === 0 ? 0 : q;
    s = s === 0 ? 0 : s;
    const id = `${q}:${s}`;
    const bin = counts.get(id);
    if (bin) bin.count++;
    else counts.set(id, { q, s, count: 1 });
  }
  const offsets = [
    [radius, 0],
    [radius / 2, stepY / 2],
    [-radius / 2, stepY / 2],
    [-radius, 0],
    [-radius / 2, -stepY / 2],
    [radius / 2, -stepY / 2]
  ];
  let uMin = Infinity,
    uMax = -Infinity,
    vMin = Infinity,
    vMax = -Infinity;
  const bins = [...counts.values()]
    .sort((a, b) => a.q - b.q || a.s - b.s)
    .map(bin => {
      const u = 1.5 * radius * bin.q,
        v = stepY * (bin.s + bin.q / 2);
      const vertices = offsets.map(([du, dv]) => {
        const vertexU = u + du,
          vertexV = v + dv;
        uMin = Math.min(uMin, vertexU);
        uMax = Math.max(uMax, vertexU);
        vMin = Math.min(vMin, vertexV);
        vMax = Math.max(vMax, vertexV);
        return { x: space.x.origin + vertexU * space.x.span, y: space.y.origin + vertexV * space.y.span };
      });
      return {
        ...bin,
        id: `${bin.q}:${bin.s}`,
        x: space.x.origin + u * space.x.span,
        y: space.y.origin + v * space.y.span,
        vertices,
        xMin: vertices[3].x,
        xMax: vertices[0].x,
        yMin: vertices[4].y,
        yMax: vertices[1].y
      };
    });
  return {
    bins,
    xDomain: [space.x.origin + uMin * space.x.span, space.x.origin + uMax * space.x.span],
    yDomain: [space.y.origin + vMin * space.y.span, space.y.origin + vMax * space.y.span],
    normalizedAspect: (uMax - uMin) / (vMax - vMin)
  };
}
