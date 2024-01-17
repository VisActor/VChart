import {
  type TableData,
  type ColumnName,
  type ColumnEvaluate,
  type AggregateEvaluate,
  type GroupedData,
  type GroupChunk,
  type Value,
  type Row,
  type OrderColumn,
  OrderType
} from '../types';
import { evaluateRowColumnValue, evaluateGroupColumnValue, getColumnIdentity } from './select';

export type OrderPipe = (param: { orderBy?: OrderColumn[]; source: TableData }) => (tableData: TableData) => TableData;

export type OrderGroupPipe = (param: {
  orderBy?: OrderColumn[];
  source: TableData;
}) => (grouped: GroupedData) => GroupedData;

/**
 * 对非聚合数据的行排序，
 * 对非聚合结果的排序字段中不应存在聚合计算 (由使用方保证)
 *
 * 升降序排序中的 null 值遵循 clickhouse 默认规则 (NULLS LAST)
 */
export const order: OrderPipe = ({
  orderBy,
  source
}: {
  orderBy?: OrderColumn[];
  source: TableData;
}): ((tableData: TableData) => TableData) => {
  return tableData => {
    if (!orderBy?.length) return tableData;

    // 不改动可能为整个 query from 入参的原始数据对象
    const rows = [...tableData];

    // 用于手动排序时用的 {值 -> 顺序} map 映射
    const manualListMaps: ManualListMaps = getManualListMaps(orderBy);

    const compare: CompareFn<Row> = definedCompare<Row>({
      orderBy,
      manualListMaps,
      getValue: (row, order) =>
        evaluateRowColumnValue({
          row,
          source: rows,
          column: order as OrderColumn & { aggregate: undefined }
        })
    });

    return rows.sort(compare);
  };
};

/**
 * 对聚合数据的「组排序」
 * 排序字段可能存在聚合计算，
 * 不使用聚合计算时，则 group 的第一条数据代表整个 group
 *
 * 升降序排序中的 null 值遵循 clickhouse 默认规则 (NULLS LAST)
 */
export const orderGroup: OrderGroupPipe = ({
  orderBy,
  source
}: {
  orderBy?: OrderColumn[];
  source: TableData;
}): ((grouped: GroupedData) => GroupedData) => {
  return grouped => {
    if (!orderBy?.length) return grouped;

    // 用于手动排序时用的 {值 -> 顺序} map 映射
    const manualListMaps: ManualListMaps = getManualListMaps(orderBy);

    const compare: CompareFn<GroupChunk> = definedCompare<GroupChunk>({
      orderBy,
      manualListMaps,
      getValue: (group, order) => {
        return evaluateGroupColumnValue({
          group,
          source,
          column: order
        });
      }
    });

    return grouped.sort(compare);
  };
};

type Index = number;
/** 由「手动排序项」的值和值所在的顺序构成的 {值 -> 顺序} map 映射*/
type ManualListMap = Map<Value, Index>;
type ManualListMaps = Map<ColumnName | ColumnEvaluate | AggregateEvaluate, ManualListMap>;

/**
 * 构建用于手动排序时用的 {值 -> 顺序} map 映射
 */
const getManualListMaps = (orderBy: OrderColumn[]): ManualListMaps => {
  const manualListMaps: ManualListMaps = new Map();
  orderBy.forEach(order => {
    if (order.type == OrderType.Manual) {
      manualListMaps.set(getColumnIdentity(order), new Map(order.manualList.map((value, index) => [value, index])));
    }
  });
  return manualListMaps;
};

/**
 * 如果 return < 0，则 item1 在 item2 之前，升序
 * 如果 return > 0，则 item1 在 item2 之后，降序
 * 如果 return = 0，则 item1, item2 相对位置不变
 */
type CompareFn<T> = (item1: T, item2: T) => -1 | 0 | 1;

const definedCompare = <T>(params: {
  orderBy: OrderColumn[];
  manualListMaps: ManualListMaps;
  getValue: (item: T, order: OrderColumn) => Value;
}): CompareFn<T> => {
  const { orderBy, getValue, manualListMaps } = params;

  return (item1: T, item2: T) => {
    for (const order of orderBy) {
      let compareResult: -1 | 0 | 1 = 0;

      if (!order.type || order.type === OrderType.Asc) {
        compareResult = compareValue(getValue(item1, order), getValue(item2, order));
      } else if (order.type === OrderType.Desc) {
        compareResult = compareValue(getValue(item2, order), getValue(item1, order));
      } else {
        // 只剩手动排序，通过已构建 {手动设置值 -> 顺序} 映射做对比
        const manualMap = manualListMaps.get(getColumnIdentity(order))!;
        compareResult = compareInManualList(manualMap, getValue(item1, order), getValue(item2, order));
      }

      // 如果当前字段比较相等，则比较下一个 orderBy 字段
      if (compareResult !== 0) return compareResult;
    }

    return 0;
  };
};

/**
 * value1 < value2  => -1
 * value1 > value2  => 1
 * value1 = value2  => 0
 * 处理 null 值，遵循 clickhouse 默认规则 (NULLS LAST)
 */
const compareValue: CompareFn<Value> = (value1, value2): -1 | 0 | 1 => {
  if (value1 === null || value2 === null) {
    if (value1 === null && value2 !== null) return 1;
    if (value1 !== null && value2 === null) return -1;
    // value1 = value2 = null
    return 0;
  }
  if (value1 < value2) return -1;
  if (value1 > value2) return 1;
  // value1 = value2
  return 0;
};

/**
 * 通过 manualMap 获得当前值在「手动排序列表」中的顺序，
 * 进而直接比较顺序大小
 */
const compareInManualList = (manualMap: ManualListMap, value1: Value, value2: Value): -1 | 0 | 1 => {
  if (value1 === value2) return 0;
  if (manualMap.has(value1) && !manualMap.has(value2)) return -1;
  if (!manualMap.has(value1) && manualMap.has(value2)) return 1;
  if (!manualMap.has(value1) && !manualMap.has(value2)) return 0;

  const diff = manualMap.get(value1)! - manualMap.get(value2)!;
  return diff > 0 ? 1 : -1;
};
