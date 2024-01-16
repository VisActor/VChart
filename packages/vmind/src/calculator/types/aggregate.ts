import type { ColumnName, Value } from './data'

/**
 * Simple aggregation methods
 */
export enum AggregateType {
  Count = 'Count',
  Max = 'Max',
  Min = 'Min',
  Sum = 'Sum',
  Avg = 'Avg',
}

/**
 * Aggregation method provided by the user
 */
export type AggregateMethod = {
  (params: {
    /** Column name to be aggregated, used as metadata */
    column: ColumnName;
    /** Extracted data for the column */
    values: Value[];
  }): Value;

  /**
   * Custom function name, must not be empty (non-anonymous function)
   * Used for calculating cache key and generating default column name after aggregation
   */
  name: string;
}

/**
 * Aggregation configuration
 */
export interface Aggregation {
  /**
   * Whether to remove duplicates, executed before the aggregation method,
   * e.g. `count(distinct <column>)`, `avg(distinct <column>)`
   */
  distinct?: boolean;
  method: AggregateType | AggregateMethod;
}

/**
 * Cache for the calculation results of different aggregation functions in each group
 * The mapping at each level is as follows:
 *   Column name -> (Whether to remove duplicates -> (Aggregation function -> Aggregated value))
 */
export type AggregationMap = Record<
  ColumnName,
  WhetherDistinctCache
>

export type WhetherDistinctCache = {
  distinct?: AggregationCache;
  all?: AggregationCache;
}

export type AggregationCache = Map<
  AggregateType | AggregateMethod['name'],
  Value
>
