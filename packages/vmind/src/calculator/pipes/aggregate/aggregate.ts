import {
  type ColumnName,
  type Value,
  type GroupChunk,
  type GroupedData,
  type Aggregation,
  AggregateType,
  type AggregateMethod,
  type AggregationCache,
  type WhetherDistinctCache,
} from '../../types'
import { OrderedSet } from '../../utils'
import {
  count,
  sum,
  avg,
  max,
  min,
} from './methods'

/**
 * Aggregate calculation of a column field within a group.
 * If no aggregation configuration is provided, the first row of the column represents the aggregated result of the entire column.
 */
export const aggregateGroupColumn = (params: {
  group: GroupChunk;
  /** The original data column name to be aggregated */
  column: ColumnName;
  aggregate?: Aggregation;
}): Value => {
  const {
    group,
    column,
    aggregate,
  } = params

  if (!aggregate) {
    return group.rows[0][column]
  }

  return aggregateWithCache({
    group,
    column,
    aggregate,
  })
}

/**
 * Perform aggregation calculation and set cache on the group structure.
 * - Get the cache Map (aggregation function -> aggregation value) based on "Aggregation Field" -> "Whether Distinct".
 * - If there is a cache, return the cached value.
 * - If there is no cache, get the aggregation calculation function, pass in the column data to calculate the aggregation value, and update the cache.
 */
export const aggregateWithCache = (params: {
  group: GroupChunk;
  /** The original data column name to be aggregated */
  column: ColumnName;
  aggregate: Aggregation;
}): Value => {
  const {
    group,
    column,
    aggregate,
  } = params

  const cacheMap = getAggregateCacheMap({
    column,
    aggregate,
    group,
  })

  const aggregation = getAggregationName(aggregate)

  if (!cacheMap.has(aggregation)) {
    const aggregateMethod = getAggregateMethod(aggregate)
    const columnValues = extractColumnValues({
      group,
      column,
      distinct: aggregate.distinct
    })

    cacheMap.set(aggregation, aggregateMethod({
      column,
      values: columnValues,
    }))
  }

  return cacheMap.get(aggregation)!
}

/**
 * Get the cache map that does not exist in the cache path and create the path. It will modify the cache fields in the group.
 * Each mapping layer is as follows:
 *   Column Field -> (Whether Distinct -> (Aggregation Function -> Aggregation Value))
 */
export const getAggregateCacheMap = (params: {
  group: GroupChunk;
  /** The original data column name to be aggregated */
  column: ColumnName;
  aggregate: Aggregation;
}): AggregationCache => {
  const {
    column,
    aggregate,
    group,
  } = params

  if (!group.aggregations) {
    group.aggregations = {}
  }

  if (!group.aggregations[column]) {
    group.aggregations[column] = {}
  }
  const aggregationMap = group.aggregations[column]
  if (!aggregationMap[whetherDistinct(aggregate)]) {
    aggregationMap[whetherDistinct(aggregate)] = new Map()
  }

  const cacheMap: AggregationCache = aggregationMap[whetherDistinct(aggregate)]!
  return cacheMap
}

/**
 * Extract a column data from a group. It will modify the cache fields in the group.
 * And remove duplicates based on whether distinct.
 */
export const extractColumnValues = (params: {
  group: GroupChunk;
  column: ColumnName;
  distinct?: boolean;
}): Value[] => {
  const {
    column,
    group,
    distinct,
  } = params

  if (!group.columns) {
    group.columns = {}
  }

  if (!group.columns[column]) {
    group.columns[column] = group.rows.map(row => row[column])
  }

  const values = group.columns[column]
  if (!distinct) {
    return values
  }

  if (!group.distinctColumns) {
    group.distinctColumns = {}
  }

  if (!group.distinctColumns[column]) {
    const set = new OrderedSet(values)
    group.distinctColumns[column] = [...set]
  }

  return group.distinctColumns[column]
}

export const whetherDistinct = (aggregate: Aggregation): keyof WhetherDistinctCache => (
  aggregate.distinct ? 'distinct' : 'all'
)

export const getAggregationName = (aggregate: Aggregation): AggregateType | AggregateMethod['name'] => {
  const { method } = aggregate
  if (typeof method === 'function') {
    return method.name
  }
  return method
}

export const aggregateTypeMap: Record<AggregateType, AggregateMethod>= {
  [AggregateType.Count]: count,
  [AggregateType.Sum]: sum,
  [AggregateType.Avg]: avg,
  [AggregateType.Max]: max,
  [AggregateType.Min]: min,
}

export const getAggregateMethod = (aggregate: Aggregation): AggregateMethod => {
  const { method } = aggregate
  if (typeof method === 'function') {
    return method
  }
  return aggregateTypeMap[method]
}

/**
 * Remove cache data fields on grouped data, used for testing.
 */
export const removeAggregateCache = (grouped: GroupedData): GroupedData =>
  grouped.map(group => ({
    by: group.by,
    rows: group.rows,
  }))
