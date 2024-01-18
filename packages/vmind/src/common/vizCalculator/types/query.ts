import type { TableData, ColumnName, Value } from './data';
import type { Select, ColumnEvaluate, ColumnConfig } from './select';
import type { WhereFilterNode, HavingFilterNode } from './filter';

/**
 * 根据大屏分析使用场景简化版 SQL-like 查询格式
 *
 * 简化内容:
 *   `from` 部分:
 *     - 不支持子查询；对于需要子查询的情况，可由使用方多次调用实现
 *     - 不支持 `join`，不是目标使用场景
 *
 *   `select` 部分:
 *     - 只支持 `select` 列举字段，不支持 `select *`
 *     - 不支持 `case when`，不支持字段为表达式
 *     - `select` 中直接建立字段别名 `alias`，但其他查询配置中字段不支持引用别名
 *
 *   聚合函数:
 *     - 字段级别 `distinct` 在聚合计算前完成，如 `count(distinct <column>)`
 *     - 只支持简单聚合函数，不支持多层嵌套聚合如 `count(sum(<column>))`
 *     - 不支持计算表达式如 `count(id + 2) * 10 + 5`
 *     - 需要时，可以由使用方传入「自定义聚合处理函数」
 *
 *   数据格式:
 *     - 只支持 `string` / `number` 格式字段
 *     - 不支持 `Date` / `boolean` 类型字段 (不做任何特殊判断和处理)
 *     - 需要时，可由使用方将 `Date` 类型转为 ISO 8601 基本字符串格式 `YYYY-MM-DD`， 等同 `string` 做计算
 *     - 不支持 JSON 格式字段 (Map / Array)
 *
 *
 * 特殊支持:
 *   - `order by` 中增加支持自定义排序 (有使用场景，非标准 SQL 支持)
 *     - 不支持对「聚合计算值」做自定义排序 (没有使用场景)
 *
 * 对标 SQL 处理:
 *   - 聚合计算、筛选、排序 中对 `null` 值的处理对标 SQL
 *     - 求和/平均 只限于数值计算，对非数字求和当作 0 值
 *       空行数据没有计算结果，直接为空(`null`)
 *     - 筛选中只有 `is null` 操作符号能匹配 `null` 值 (`=/!=` 均无效)
 *     - 升降序排序中 `null` 值遵循 SQL 默认规则 (NULLS LAST)
 *
 *   - 筛选项中
 *     - `between` 比较与 SQL 中相同，闭区间
 *     - 比较操作中包含 `number` / `string` 比较时的类型转换
 *     - 只有 `having` 能对字段做聚合计算
 *
 *   - 除了 `group by` 之外， 如果 `select` 列中有聚合函数，也做聚合计算(聚合成一行)
 *     - 没有 `group by`、且 `select` 中也没有聚合函数时，`order by` 中不能单独使用聚合计算
 */
export interface Query {
  /** 原始数据，一维行对象格式 */
  from: TableData;
  /**
   * 对应 SQL select
   * 多个同名字段在最终数据中被覆盖为一个
   */
  select: Select;
  where?: WhereFilterNode;
  /** 对应 SQL group by */
  groupBy?: (ColumnName | ColumnEvaluate)[];
  having?: HavingFilterNode;
  orderBy?: OrderColumn[];
  limit?: number;
}

export type OrderColumn = ColumnConfig & Ordering;

export type Ordering =
  | {
      /**
       * 排序方式，默认使用升序
       */
      type?: OrderType.Asc | OrderType.Desc;
    }
  | {
      /** 手动排序 */
      type: OrderType.Manual;
      /**
       * 对该字段的值手动排序的 list
       * 当有手动排序时，命中项按 list 中顺序排列，未命中项在之后按出现行顺序排列
       * 没有对聚合计算值做手动排序的场景，因此不做支持
       */
      manualList: Value[];
    };

export enum OrderType {
  /**
   * ascending 升序，默认类型
   */
  Asc = 'Asc',
  /**
   * descending 降序
   */
  Desc = 'Desc',
  /**
   * 手动排序，根据传入的列表顺序做排序
   * 为扩展功能，并非标准 SQL 支持功能
   */
  Manual = 'Manual'
}
