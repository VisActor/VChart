import type { TableData, FilterNode, WhereCondition } from '../../types';
import { judgeFilterTree } from './filter';
import { evaluateRowColumnValue } from '../select';

export type WherePipe = (params: {
  filter?: FilterNode<WhereCondition>;
  source: TableData;
}) => (tableData: TableData) => TableData;

export const where: WherePipe = ({
  filter,
  source
}: {
  filter?: FilterNode<WhereCondition>;
  source: TableData;
}): ((tableData: TableData) => TableData) => {
  if (!filter?.conditions.length) return tableData => tableData;

  return tableData =>
    tableData.filter(row => {
      return judgeFilterTree({
        filterNode: filter,
        item: row,
        getValue: ({ item, condition }) =>
          evaluateRowColumnValue({
            row: item,
            source,
            column: condition
          })
      });
    });
};
