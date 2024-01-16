import type {
  TableData,
  ColumnName,
  Value,
  Row,
} from './data'
import type { GroupChunk } from './group'
import type { Aggregation } from './aggregate'


export interface Select {
  columns: SelectColumn[];
  /**
   * Whether to remove duplicates from the select result
   * `SELECT DISTINCT`
   */
  distinct?: boolean;
}

export type SelectColumn =
  | {
    /** The name of the selected original data column */
    column: ColumnName;
    /**
     * The renamed output name for the original data column,
     * usually used for aggregated/computed functions,
     *
     * If there is no alias field:
     *   - The default name is the column name,
     *   - If there is an aggregation function, the default name is the function name concatenated
     */
    alias?: ColumnName;
    /**
     * Simple aggregation method
     * If this field is not present, no aggregation calculation is performed, and the first value of the result after group by is taken
     */
    aggregate?: Aggregation;
  }
  /**
   * Select the function calculation result as column data
   * Aggregation process is also calculated internally
   */
  | {
    alias: ColumnName;
    column: ColumnEvaluate;
  }
  /**
   * Select the function calculation result as field column data
   * Can only perform aggregation calculation when there is a group by
   */
  | {
    alias: ColumnName;
    aggregate: AggregateEvaluate;
  }

/** Non-aggregated field calculation function */
export type ColumnEvaluate = (params: { row: Row; source: TableData }) => Value
/** Aggregated field calculation function */
export type AggregateEvaluate = (params: { group: GroupChunk; source: TableData }) => Value

export type ColumnConfig =
  | {
    /** The name of the field to be sorted */
    column: ColumnName;
    /**
     * Aggregation function of the sorting field
     * When using aggregation in sorting, there must be a group by field
     */
    aggregate?: Aggregation;
  }
  | { column: ColumnEvaluate }
  /**
   * Aggregation function of the sorting field
   * When using aggregation in sorting, there must be a group by field
   */
  | { aggregate: AggregateEvaluate }
