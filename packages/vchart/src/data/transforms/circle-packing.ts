import type { Datum } from '../../typings';
import type { CirclePackingOptions } from '@visactor/vgrammar-hierarchy';

// eslint-disable-next-line no-duplicate-imports
import { CirclePackingLayout } from '@visactor/vgrammar-hierarchy';

export interface ICirclePackingOpt extends CirclePackingOptions {
  width: number;
  height: number;
}

/**
 * CirclePacking布局算法，VGrammar 提供.
 */
export const circlePackingLayout = (data: Array<Datum>, op: () => ICirclePackingOpt) => {
  if (!data) {
    return data;
  }
  const options = op();
  const { width, height } = options;
  if (width === 0 || height === 0) {
    return data;
  }
  const layout = new CirclePackingLayout(options);
  return layout.layout(data, { width, height });
};
