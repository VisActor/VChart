import { match, P } from 'ts-pattern';
import type {
  TableData,
  GroupedData,
  GroupChunk,
  Select,
  SelectColumn,
  ColumnName,
  ColumnConfig,
  ColumnEvaluate,
  AggregateEvaluate,
  Value,
  Row
} from '../types';
import { aggregateGroupColumn, getAggregationName } from './aggregate';

export type SelectPipe = (params: { select: Select; source: TableData }) => (tableData: TableData) => TableData;

export type SelectGroupPipe = (params: { select: Select; source: TableData }) => (grouped: GroupedData) => TableData;

/**
 * 对非聚合数据的 select
 * 只是简单的抽取字段
 */
export const select: SelectPipe = ({ select: { columns }, source }): ((tableData: TableData) => TableData) => {
  return tableData =>
    tableData.map(row =>
      Object.fromEntries(
        columns.map(selectColumn => [
          // new column name
          getSelectColumnName(selectColumn),
          // value
          evaluateRowColumnValue({
            row,
            source,
            column: selectColumn as SelectColumn & { aggregate: undefined }
          })
        ])
      )
    );
};

/**
 * 对分组数据的 select
 * 把每个分组聚合成一行数据，字段没有聚合计算则取第一行
 */
export const selectGroup: SelectGroupPipe = ({
  select: { columns },
  source
}): ((grouped: GroupedData) => TableData) => {
  return grouped =>
    grouped.map(group =>
      Object.fromEntries(
        columns.map((selectColumn: SelectColumn) => [
          // new column name
          getSelectColumnName(selectColumn),
          // value
          evaluateGroupColumnValue({
            group,
            source,
            column: selectColumn
          })
        ])
      )
    );
};

export const getSelectColumnName = (selectColumn: SelectColumn): ColumnName => {
  return match(selectColumn)
    .with({ alias: P.string }, ({ alias }) => alias)
    .with({ aggregate: P.optional(P.nullish) }, ({ column }) => column)
    .with(
      { aggregate: { distinct: P.optional(P.nullish) } },
      ({ column, aggregate }) => `${getAggregationName(aggregate)}(${column})`
    )
    .with(
      { aggregate: P.not(P.nullish) },
      ({ column, aggregate }) => `${getAggregationName(aggregate)}(distinct ${column})`
    )
    .exhaustive();
};

export const evaluateRowColumnValue = ({
  column,
  row,
  source
}: {
  column: { column: ColumnName | ColumnEvaluate };
  row: Row;
  source: TableData;
}): Value => {
  return match(column)
    .with({ column: P.string }, ({ column }) => row[column])
    .with({ column: P.instanceOf(Function) }, ({ column }) => column({ row, source }))
    .exhaustive();
};

export const evaluateGroupColumnValue = ({
  column,
  group,
  source
}: {
  column: ColumnConfig;
  group: GroupChunk;
  source: TableData;
}): Value => {
  return match(column)
    .with({ column: P.string }, ({ column, aggregate }) => aggregateGroupColumn({ group, column, aggregate }))
    .with({ aggregate: P.instanceOf(Function) }, ({ aggregate }) => aggregate({ group, source }))
    .with({ column: P.instanceOf(Function) }, ({ column }) => column({ row: group.rows[0], source }))
    .exhaustive();
};

export const getColumnIdentity = (column: ColumnConfig): ColumnName | ColumnEvaluate | AggregateEvaluate =>
  match(column)
    .with({ column: P.any }, ({ column }) => column)
    .with({ aggregate: P.any }, ({ aggregate }) => aggregate)
    .exhaustive();

export const getColumnIdentityName = (column: ColumnConfig): string => {
  const identity = getColumnIdentity(column);
  return match(identity)
    .with(P.string, name => name)
    .with(P.instanceOf(Function), evaluate => evaluate.name)
    .exhaustive();
};
