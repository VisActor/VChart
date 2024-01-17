import type { TableData, ColumnName, Value, Row } from './data';
import type { GroupChunk } from './group';
import type { Aggregation } from './aggregate';

export interface Select {
  columns: SelectColumn[];
  /**
   * 是否对 select 结果去重
   * `SELECT DISTINCT`
   */
  distinct?: boolean;
}

export type SelectColumn =
  | {
      /** 选择的原始数据列名 */
      column: ColumnName;
      /**
       * 输出时对原始数据列名的重命名，
       * 通常用于聚合/计算函数之后的名字，
       *
       * 没有 alias 字段时
       *   - 默认都使用 column 作为名字，
       *   - 有聚合函数时，默认使用函数名拼接
       */
      alias?: ColumnName;
      /**
       * 简单聚合方式
       * 无此字段不做聚合计算，则对于 group by 之后结果取第一项值
       */
      aggregate?: Aggregation;
    }
  /**
   * 选择函数计算结果作为列数据
   * 聚合过程也在内部计算
   */
  | {
      alias: ColumnName;
      column: ColumnEvaluate;
    }
  /**
   * 选择函数计算结果作为字段列数据
   * 仅当有 group by 时能做聚合计算
   */
  | {
      alias: ColumnName;
      aggregate: AggregateEvaluate;
    };

/** 非聚合字段计算函数 */
export type ColumnEvaluate = (params: { row: Row; source: TableData }) => Value;
/** 聚合字段计算函数 */
export type AggregateEvaluate = (params: { group: GroupChunk; source: TableData }) => Value;

export type ColumnConfig =
  | {
      /** 要排序的字段名 */
      column: ColumnName;
      /**
       * 排序字段的聚合函数
       * 排序中使用有聚合时，必须有 group by 字段
       */
      aggregate?: Aggregation;
    }
  | { column: ColumnEvaluate }
  /**
   * 排序字段的聚合函数
   * 排序中使用有聚合时，必须有 group by 字段
   */
  | { aggregate: AggregateEvaluate };
