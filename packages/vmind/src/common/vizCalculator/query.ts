import type { Query, TableData } from './types';
import { of } from './pipe';
import * as pipes from './pipes';

/**
 * 根据大屏分析使用场景简化版 SQL-like 查询计算
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
export const query = (query: Query): TableData => {
  const { from, select, where, groupBy, having, orderBy, limit } = query;

  if (!from.length) return [];

  /**
   * 按照 SQL 执行定义，除了 group by 之外，
   * 如果 select 列中有聚合函数，也做聚合计算(聚合成一行)
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
