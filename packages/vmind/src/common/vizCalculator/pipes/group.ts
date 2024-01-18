import type { ColumnName, ColumnConfig, ColumnEvaluate, Row, TableData, GroupMap, GroupedData } from '../types';
import { OrderedMap } from '../utils';
import { evaluateRowColumnValue, getColumnIdentityName } from './select';

export type GroupPipe = (params: {
  groupBy?: (ColumnName | ColumnEvaluate)[];
  source: TableData;
}) => (tableData: TableData) => GroupedData;

/**
 * 有 groupBy 配置或 select 中有聚合函数时都做 group 分组，
 *
 * 区别时，当「groupBy 为空，且仅 select 中有聚合函数」时，等同于全表聚合为一整个 group，
 *    此时的「仅 select 中有聚合函数」这点由外部 pipe 流程保证
 */
export const group: GroupPipe = ({
  groupBy,
  source
}: {
  groupBy?: (ColumnName | ColumnEvaluate)[];
  source: TableData;
}): ((tableData: TableData) => GroupedData) => {
  return tableData => {
    /**
     * 走到 group 分组逻辑中来，但没有 groupBy 配置，
     * 则为在外层 pipe 流程中确定「select 中有聚合函数」，
     * 全表聚合为一整个 group
     */
    if (!groupBy?.length) {
      return [
        {
          by: {},
          rows: tableData
        }
      ];
    }

    const groupMap: GroupMap = buildGroupsMap({
      tableData,
      groupBy,
      source
    });

    // 多层透视结构转为分组后输出的明细表结构
    const grouped = traverseToGrouped({
      groupMapOrRows: groupMap,
      groupBy
    });

    return grouped;
  };
};

/**
 * 构建 group 阶段执行用的，在 group by 多个字段时，内部做分组用的是多层透视结构
 * - 每层 map 顺序依次为 group-by columns 顺序
 * - 每层 map key 为 column 对应值，key 按插入顺序(行顺序)排列
 * - 最内层为原始数据行 chunk
 */
export const buildGroupsMap = ({
  tableData,
  groupBy,
  source = tableData
}: {
  tableData: TableData;
  groupBy: (ColumnName | ColumnEvaluate)[];
  source?: TableData;
}): GroupMap => {
  const groupMap: GroupMap = new OrderedMap();
  tableData.forEach(row => {
    let currentMap = groupMap;

    groupBy.forEach((column, index) => {
      const value = evaluateRowColumnValue({
        row,
        source,
        column: { column }
      });
      if (index === groupBy.length - 1) {
        if (!currentMap.has(value)) {
          currentMap.set(value, []);
        }
        const rows = currentMap.get(value) as Row[];
        rows.push(row);
      } else {
        if (!currentMap.has(value)) {
          currentMap.set(value, new OrderedMap());
        }
        currentMap = currentMap.get(value) as GroupMap;
      }
    });
  });

  return groupMap;
};

/**
 * Depth-first traverse
 * transform GroupMap to GroupData
 */
const traverseToGrouped = (params: {
  groupMapOrRows: GroupMap | Row[];
  groupBy: (ColumnName | ColumnEvaluate)[];
  /**
   * from 0 to `groupBy.length`
   * @default 0
   */
  depth?: number;
  by?: Partial<Row>;
  /** 遍历中累加的分组结果 */
  grouped?: GroupedData;
}): GroupedData => {
  const { groupMapOrRows, groupBy, grouped = [], depth = 0, by = {} } = params;

  if (depth === groupBy.length) {
    const rows = groupMapOrRows as Row[];
    grouped.push({
      by,
      rows
    });
    return grouped;
  }

  const column = groupBy[depth];
  const groupMap = groupMapOrRows as GroupMap;

  // OrderedMap
  groupMap.forEach((mapOrList, value) => {
    const columnConfig = { column } as ColumnConfig;
    by[getColumnIdentityName(columnConfig)] = value;

    traverseToGrouped({
      groupMapOrRows: mapOrList,
      groupBy,
      depth: depth + 1,
      by: { ...by },
      grouped
    });
  });

  return grouped;
};
