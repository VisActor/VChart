import type { TableData, Value, Select } from '../types';
import { getSelectColumnName } from './select';

export type DistinctPipe = (param: { select: Select }) => (tableData: TableData) => TableData;

/**
 * 是否对 select 结果去重
 * `SELECT DISTINCT`
 *
 * 去重计算过程与 group by 过程基本一致
 */
export const distinct: DistinctPipe = ({ select }) => {
  if (!select.distinct) return tableData => tableData;

  return tableData => {
    const columns = select.columns.map(getSelectColumnName);
    const distinctRows: TableData = [];
    const distinctMap: DistinctMap = new Map();

    tableData.forEach(row => {
      let currentMap = distinctMap;

      columns.forEach((column, index) => {
        const value = row[column];
        if (index === columns.length - 1) {
          if (!currentMap.has(value)) {
            currentMap.set(value, new Set());
          }
          const values = currentMap.get(value) as Set<Value>;
          if (!values.has(value)) {
            values.add(value);
            distinctRows.push(row);
          }
        } else {
          if (!currentMap.has(value)) {
            currentMap.set(value, new Map());
          }

          currentMap = currentMap.get(value) as DistinctMap;
        }
      });
    });

    return distinctRows;
  };
};

/**
 * distinct 执行方式类似 group by 过程
 * - 每层 map 顺序依次为 select columns 顺序
 * - 每层 map key 为 column 对应值
 * - 最内层为最后一个 column 值组成的 set
 */
type DistinctMap = Map<Value, DistinctMap | Set<Value>>;
