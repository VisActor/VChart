export interface PixelRow {
  y: number;
  size: [number, number];
}

/** 全部行共享一次量化后的边界；独立取整中心和高度会重新产生间隙。 */
export function layoutPixelRows(
  domain: string[],
  range: number[],
  offsetY: number,
  dpr: number,
  width: number
): Map<string, PixelRow> {
  const rows = new Map<string, PixelRow>();
  const start = range[0];
  const length = range[1] - start;
  let previous = Math.round((start + offsetY) * dpr) / dpr - offsetY;
  for (let i = 0; i < domain.length; i++) {
    const next = Math.round((start + (length * (i + 1)) / domain.length + offsetY) * dpr) / dpr - offsetY;
    rows.set(domain[i], { y: (previous + next) / 2, size: [width, Math.abs(next - previous)] });
    previous = next;
  }
  return rows;
}
