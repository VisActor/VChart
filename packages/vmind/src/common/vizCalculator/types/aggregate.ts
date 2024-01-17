import type { ColumnName, Value } from './data';

/**
 * 简单聚合方式
 */
export enum AggregateType {
  Count = 'Count',
  Max = 'Max',
  Min = 'Min',
  Sum = 'Sum',
  Avg = 'Avg'
}

/**
 * 外层传入的聚合处理函数
 */
export type AggregateMethod = {
  (params: {
    /** 要聚合计算的字段列名，作为元信息 */
    column: ColumnName;
    /** 抽取的该字段列数据 */
    values: Value[];
  }): Value;

  /**
   * 自定义函数名必须有，且不能为空 (非匿名函数)
   * 用于计算缓存 key 与生成聚合后默认列名
   */
  name: string;
};

/**
 * 聚合配置
 */
export interface Aggregation {
  /**
   * 是否去重，在聚合方式前执行，
   * 如 `count(distinct <column>)`, `avg(distinct <column>)`
   */
  distinct?: boolean;
  method: AggregateType | AggregateMethod;
}

/**
 * 对每个分组里不同聚合函数的计算结果缓存
 * 每层映射分别是
 *   字段列 -> (是否去重 -> (聚合函数 -> 聚合值))
 */
export type AggregationMap = Record<ColumnName, WhetherDistinctCache>;

export type WhetherDistinctCache = {
  distinct?: AggregationCache;
  all?: AggregationCache;
};

export type AggregationCache = Map<AggregateType | AggregateMethod['name'], Value>;
