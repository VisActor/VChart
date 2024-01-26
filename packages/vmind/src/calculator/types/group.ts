import type { ColumnName, Row, Value } from './data'
import type { AggregationMap } from './aggregate'
import type { OrderedMap } from '../utils'


/**
 * The format of the data after grouping by.
 */
export type GroupedData = GroupChunk[]

/**
 * The format of each group chunk.
 */
export type GroupChunk = {
  /**
   * The information about the grouping, which records the corresponding fields and their original values for this group.
   */
  by: Partial<Row>;
  /** Points to the original rows contained in this group. */
  rows: Row[];

  /**
   * Cached columnar storage data for aggregation calculations.
   * Each field column is lazily loaded.
   */
  columns?: Record<ColumnName, Value[]>;
  /**
   * Cached distinct columnar storage data for aggregation calculations.
   * Each field column is lazily loaded.
   */
  distinctColumns?: Record<ColumnName, Value[]>;
  /**
   * Cached values for different fields and different aggregation results for the current group.
   */
  aggregations?: AggregationMap;
}

/**
 * When performing the group stage with multiple group by fields, the internal grouping is done using a multi-level pivot structure.
 * - Each map layer corresponds to the order of group-by columns.
 * - Each map key is the value of the column, and the keys are arranged in the order of insertion (row order).
 * - The innermost layer is the original data row chunk.
 *
 * Using OrderedMap to maintain the original row order and allow null/undefined values to be used as keys.
 */
export type GroupMap = OrderedMap<Value, GroupMap | Row[]>
