import type { DataView } from '@visactor/vdataset';
/**
 * @description 针对某个数组进行数据展开，将数组中的每个元素拆出来加入数据集
 */
export const objFlat = (data: Array<DataView>, op: string) => {
  // 数据处理
  const dataCollect = data[0].latestData ? data[0].latestData : data || [];
  const result: any[] = [];
  dataCollect.forEach((datum: any) => {
    const dataKey: any = {};
    for (const key in datum) {
      if (key !== op) {
        dataKey[key] = datum[key];
      }
    }
    const dataOp = datum[op];
    dataOp?.forEach((d: any) => {
      result.push(Object.assign({}, dataKey, d));
    });
  });
  return result;
};
