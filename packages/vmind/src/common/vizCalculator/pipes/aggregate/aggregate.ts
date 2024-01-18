import {
  type ColumnName,
  type Value,
  type GroupChunk,
  type GroupedData,
  type Aggregation,
  AggregateType,
  type AggregateMethod,
  type AggregationCache,
  type WhetherDistinctCache
} from '../../types';
import { OrderedSet } from '../../utils';
import { count, sum, avg, max, min } from './methods';

/**
 * 聚合计算一个 group 分组中的一列字段，
 * 若没有聚合配置，则该列第一行数据代表整列聚合结果
 */
export const aggregateGroupColumn = (params: {
  group: GroupChunk;
  /** 要聚合字段的原始数据列名 */
  column: ColumnName;
  aggregate?: Aggregation;
}): Value => {
  const { group, column, aggregate } = params;

  if (!aggregate) {
    return group.rows[0][column];
  }

  return aggregateWithCache({
    group,
    column,
    aggregate
  });
};

/**
 * 执行聚合计算并在 group 结构上设置缓存
 * - 根据「聚合字段」->「是否去重」获取到缓存 Map (聚合函数 -> 聚合值)
 * - 如果有缓存，直接返回缓存值
 * - 如果没有缓存，那么获取聚合计算函数，传入列数据计算聚合值，并更新缓存
 */
export const aggregateWithCache = (params: {
  group: GroupChunk;
  /** 要聚合字段的原始数据列名 */
  column: ColumnName;
  aggregate: Aggregation;
}): Value => {
  const { group, column, aggregate } = params;

  const cacheMap = getAggregateCacheMap({
    column,
    aggregate,
    group
  });

  const aggregation = getAggregationName(aggregate);

  if (!cacheMap.has(aggregation)) {
    const aggregateMethod = getAggregateMethod(aggregate);
    const columnValues = extractColumnValues({
      group,
      column,
      distinct: aggregate.distinct
    });

    cacheMap.set(
      aggregation,
      aggregateMethod({
        column,
        values: columnValues
      })
    );
  }

  return cacheMap.get(aggregation)!;
};

/**
 * 获取缓存路径中不存在时同时创建路径，会修改 group 中缓存字段
 * 每层映射分别是
 *   字段列 -> (是否去重 -> (聚合函数 -> 聚合值))
 */
export const getAggregateCacheMap = (params: {
  group: GroupChunk;
  /** 要聚合字段的原始数据列名 */
  column: ColumnName;
  aggregate: Aggregation;
}): AggregationCache => {
  const { column, aggregate, group } = params;

  if (!group.aggregations) {
    group.aggregations = {};
  }

  if (!group.aggregations[column]) {
    group.aggregations[column] = {};
  }
  const aggregationMap = group.aggregations[column];
  if (!aggregationMap[whetherDistinct(aggregate)]) {
    aggregationMap[whetherDistinct(aggregate)] = new Map();
  }

  const cacheMap: AggregationCache = aggregationMap[whetherDistinct(aggregate)]!;
  return cacheMap;
};

/**
 * 抽取一组 group 中某一列数据，会修改 group 中缓存字段
 * 且根据是否 distinct 去重
 */
export const extractColumnValues = (params: { group: GroupChunk; column: ColumnName; distinct?: boolean }): Value[] => {
  const { column, group, distinct } = params;

  if (!group.columns) {
    group.columns = {};
  }

  if (!group.columns[column]) {
    group.columns[column] = group.rows.map(row => row[column]);
  }

  const values = group.columns[column];
  if (!distinct) {
    return values;
  }

  if (!group.distinctColumns) {
    group.distinctColumns = {};
  }

  if (!group.distinctColumns[column]) {
    const set = new OrderedSet(values);
    group.distinctColumns[column] = [...set];
  }

  return group.distinctColumns[column];
};

export const whetherDistinct = (aggregate: Aggregation): keyof WhetherDistinctCache =>
  aggregate.distinct ? 'distinct' : 'all';

export const getAggregationName = (aggregate: Aggregation): AggregateType | AggregateMethod['name'] => {
  const { method } = aggregate;
  if (typeof method === 'function') {
    return method.name;
  }
  return method;
};

export const aggregateTypeMap: Record<AggregateType, AggregateMethod> = {
  [AggregateType.Count]: count,
  [AggregateType.Sum]: sum,
  [AggregateType.Avg]: avg,
  [AggregateType.Max]: max,
  [AggregateType.Min]: min
};

export const getAggregateMethod = (aggregate: Aggregation): AggregateMethod => {
  const { method } = aggregate;
  if (typeof method === 'function') {
    return method;
  }
  return aggregateTypeMap[method];
};

/**
 * 移除分组数据上的缓存数据字段，用于测试
 */
export const removeAggregateCache = (grouped: GroupedData): GroupedData =>
  grouped.map(group => ({
    by: group.by,
    rows: group.rows
  }));
