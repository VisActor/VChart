import type { IStackCacheNode } from '../../util/data';
import { valueInScaleRange } from '../../util/scale';

export function stackWithMinHeight(
  stackCache: IStackCacheNode,
  stackInverse: boolean,
  context: {
    isVertical: boolean;
    start: string;
    end: string;
    startMethod: string;
    endMethod: string;
    axisHelper: string;
  }
) {
  if (stackCache.values.length > 0) {
    // stack one group
    let seriesInfo = stackCache.series;
    if (stackInverse) {
      seriesInfo = seriesInfo.slice().reverse();
    }
    // temp
    let lastY: number;
    seriesInfo.forEach(({ s, values }, sIndex) => {
      // stack info in series
      const barMinHeight = s.getSpec().barMinHeight;
      const seriesScale = s[context.axisHelper].getScale?.(0);
      const inverse = s[context.axisHelper].isInverse();

      // stack
      for (let index = 0; index < values.length; index++) {
        const obj = values[stackInverse ? values.length - 1 - index : index];
        const y1 = valueInScaleRange(s[context.startMethod](obj), seriesScale);
        let y = valueInScaleRange(s[context.endMethod](obj), seriesScale);

        if (index === 0 && sIndex === 0) {
          lastY = y1;
        }

        let height = Math.abs(y1 - y);
        if (height < barMinHeight) {
          height = barMinHeight;
        }

        let flag = 1;
        if (y < y1) {
          flag = -1;
        } else if (y === y1) {
          flag = context.isVertical ? (inverse ? 1 : -1) : inverse ? -1 : 1;
        }
        y = lastY + flag * height;
        obj[context.start] = lastY;
        obj[context.end] = y;
        lastY = y;
      }
    });
  }
  for (const key in stackCache.nodes) {
    stackWithMinHeight(stackCache.nodes[key], stackInverse, context);
  }
}
