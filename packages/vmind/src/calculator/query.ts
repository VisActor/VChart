import type { Query, TableData } from './types';
import { of } from './pipe';
import * as pipes from './pipes';

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
export const query = (query: Query): TableData => {
  const { from, select, where, groupBy, having, orderBy, limit } = query;

  if (!from.length) return [];

  /**
   * According to the SQL execution definition, except for group by,
   * if there are aggregation functions in the select columns, they are also aggregated into one row
   */
  const needGroup = Boolean(
    groupBy?.length || select.columns.some(column => 'aggregate' in column && column.aggregate)
  );

  if (needGroup) {
    return of(from).pipe(
      pipes.where({ filter: where, source: from }),
      pipes.group({ groupBy, source: from }),
      pipes.having({ filter: having, source: from }),
      pipes.orderGroup({ orderBy, source: from }),
      pipes.selectGroup({ select, source: from }),
      pipes.distinct({ select }),
      pipes.limit({ limit })
    );
  }

  return of(from).pipe(
    pipes.where({ filter: where, source: from }),
    pipes.order({ orderBy, source: from }),
    pipes.select({ select, source: from }),
    pipes.distinct({ select }),
    pipes.limit({ limit })
  );
};
