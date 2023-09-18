import { isArray } from '@visactor/vutils';
import { registerTransform } from '@visactor/vgrammar';

export const correlation = (data: any, op: any) => {
  if (!data || !op?.view || !isArray(data)) {
    return data;
  }

  const view = op.view();

  //   console.log('op', op);

  if (
    view.x1 - view.x0 === 0 ||
    view.y1 - view.y0 === 0 ||
    view.x1 - view.x0 === -Infinity ||
    view.x1 - view.x0 === Infinity ||
    view.y1 - view.y0 === -Infinity ||
    view.y1 - view.y0 === Infinity
  ) {
    return data;
  }

  //   registerTransform(op, data, type:'circularRelation' );

  const result = [];
  return result;
};
