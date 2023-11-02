import { isArray } from '@visactor/vutils';

// todo 以目前的场景来看，并没有递归的需要。
// 考虑到不确定性，还是递归处理spec对象，时间消耗很少
export function specTransform(
  spec: unknown,
  special: {
    [key: string]: (v: unknown) => unknown;
  } = {
    data: v => v
  }
): unknown {
  if (!spec) {
    return spec;
  }
  // 如果是普通对象
  if (spec.constructor === Object) {
    const result: any = {};
    for (const key in spec as any) {
      if (Object.prototype.hasOwnProperty.call(spec, key)) {
        // todo 特殊处理怎样更合理?
        if (special[key]) {
          result[key] = special[key](spec[key]);
          continue;
        }
        result[key] = specTransform(spec[key], special);
      }
    }
    return result;
  }
  // 如果是数组
  if (isArray(spec)) {
    return spec.map(s => specTransform(s, special));
  }
  return spec;
}
