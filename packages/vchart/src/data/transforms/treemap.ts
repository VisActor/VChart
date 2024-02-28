// TODO: delete
// import type { TreemapOptions } from '@visactor/vgrammar-hierarchy';
// import { TreemapLayout } from '@visactor/vgrammar-hierarchy';
// import type { Datum } from '../../typings';

// export interface ITreemapOpt extends TreemapOptions {
//   range: () => { x0: number; x1: number; y0: number; y1: number };
// }

// export const treemap = (data: Array<Datum>, op: ITreemapOpt) => {
//   if (!data || !op?.range) {
//     return data;
//   }

//   const range = op.range();

//   if (range.x1 - range.x0 === 0 || range.y1 - range.y0 === 0) {
//     return data;
//   }

//   const layout = new TreemapLayout(op);
//   return layout.layout(data, range);
// };
