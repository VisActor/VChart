import type {
  TableData,
  ColumnName,
  Value,
} from './data'
import type {
  Select,
  ColumnEvaluate,
  ColumnConfig,
} from './select'
import type {
  WhereFilterNode,
  HavingFilterNode
} from './filter'

/**
 * Simplified SQL-like query calculation based on analysis use cases
 *
 * Simplified content:
 *   `from` section:
 *     - Does not support subqueries; for cases requiring subqueries, they can be implemented by the caller making multiple calls
 *     - Does not support `join`, as it is not the target use case
 *
 *   `select` section:
 *     - Only supports listing fields in `select`, does not support `select *`
 *     - Does not support `case when`, does not support fields as expressions
 *     - Allows creating field aliases `alias` directly in `select`, but other query configurations do not support referencing aliases
 *
 *   Aggregation functions:
 *     - Field-level `distinct` is performed before aggregation calculation, such as `count(distinct <column>)`
 *     - Only supports simple aggregation functions, does not support nested aggregations like `count(sum(<column>))`
 *     - Does not support computing expressions like `count(id + 2) * 10 + 5`
 *     - Custom aggregation processing functions can be passed in by the caller if needed
 *
 *   Data format:
 *     - Only supports `string` / `number` format fields
 *     - Does not support `Date` / `boolean` type fields (no special handling or processing)
 *     - If needed, `Date` types can be converted to ISO 8601 basic string format `YYYY-MM-DD`, treated as `string` for calculations
 *     - Does not support JSON format fields (Map / Array)
 *
 *
 * Special support:
 *   - Added support for custom sorting in `order by` (has use cases, not standard SQL support)
 *     - Does not support custom sorting of "aggregated computed values" (no use cases)
 *
 * SQL handling:
 *   - Handling of `null` values in aggregation calculations, filtering, and sorting follows SQL conventions
 *     - Sum/average is limited to numerical calculations, non-numeric values are treated as 0
 *     - Empty row data has no calculation result and is directly null
 *     - Only the `is null` operator can match `null` values in filtering (`=/!=` are ineffective)
 *     - `null` values in ascending/descending order follow SQL default rules (NULLS LAST)
 *
 *   - In the filter section
 *     - `between` comparison is the same as in SQL, closed interval
 *     - Type conversion for `number` / `string` comparisons
 *     - Only `having` can perform aggregation calculations on fields
 *
 *   - Except for `group by`, if there are aggregation functions in the `select` columns, they are also aggregated into one row
 *     - If there is no `group by` and no aggregation functions in `select`, aggregation calculations cannot be used independently in `order by`
 */
export interface Query {
  /** Original data in one-dimensional row object format */
  from: TableData;
  /**
   * Corresponds to SQL select
   * Multiple fields with the same name are overwritten as one in the final data
   */
  select: Select;
  where?: WhereFilterNode;
  /** Corresponds to SQL group by */
  groupBy?: (ColumnName | ColumnEvaluate)[];
  having?: HavingFilterNode;
  orderBy?: OrderColumn[];
  limit?: number;
}


export type OrderColumn = ColumnConfig & Ordering

export type Ordering =
  | {
    /**
     * Sorting method, default is ascending
     */
    type?: OrderType.Asc | OrderType.Desc
  }
  | {
    /** Manual sorting */
    type: OrderType.Manual;
    /**
     * List of values for manual sorting of this field
     * When there is manual sorting, matching items are arranged in the order of the list, and unmatched items are arranged in the order of appearance afterwards
     * There is no support for manual sorting of "aggregated computed values" as there are no use cases for it
     */
    manualList: Value[];
  }


export enum OrderType {
  /**
   * Ascending order, default type
   */
  Asc = 'Asc',
  /**
   * Descending order
   */
  Desc = 'Desc',
  /**
   * Manual sorting, based on the order of the list passed in
   * It is an extension feature and not a standard SQL supported feature
   */
  Manual = 'Manual',
}
