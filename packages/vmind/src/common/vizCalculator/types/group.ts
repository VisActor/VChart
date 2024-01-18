import type { ColumnName, Row, Value } from './data';
import type { AggregationMap } from './aggregate';
import type { OrderedMap } from '../utils';

/**
 * group by 之后输出的将原始数据分组后数据格式
 */
export type GroupedData = GroupChunk[];

/**
 * 每个 group chunk 数据格式
 */
export type GroupChunk = {
  /**
   * 分组的依据信息，记录本组 group by 的对应几个字段与它们的原始值
   */
  by: Partial<Row>;
  /** 指向此组内包含的原始行 */
  rows: Row[];

  /**
   * 缓存用于聚合计算的列式存储数据
   * 每个字段列懒加载
   */
  columns?: Record<ColumnName, Value[]>;
  /**
   * 缓存用于聚合计算的列式存储的 distinct 数据
   * 每个字段列懒加载
   */
  distinctColumns?: Record<ColumnName, Value[]>;
  /**
   * 缓存对当前组的不同字段、不同聚合计算结果的值
   */
  aggregations?: AggregationMap;
};

/**
 * group 阶段执行用的 group by 多个字段时，内部做分组用的是多层透视结构，
 * - 每层 map 顺序依次为 group-by columns 顺序
 * - 每层 map key 为 column 对应值，key 按插入顺序(行顺序)排列
 * - 最内层为原始数据行 chunk
 *
 * 用 OrderedMap 使索引保持原始行顺序，同时 null / undefined 值也能作为索引
 */
export type GroupMap = OrderedMap<Value, GroupMap | Row[]>;
