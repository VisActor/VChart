import {
  type Value,
  type FilterOperation,
  type Row,
  type GroupChunk,
  type FilterNode,
  type FilterCondition,
  type WhereCondition,
  type HavingCondition,
  FilterNodeType,
  FilterOperator
} from '../../types';
import { includes } from '../../utils';

export const judgeFilterTree = <
  T extends Row | GroupChunk,
  Condition extends FilterCondition = T extends Row ? WhereCondition : HavingCondition
>(params: {
  filterNode: FilterNode<Condition> | FilterCondition;
  item: T;
  getValue: (params: { item: T; condition: Condition }) => Value;
}): boolean => {
  const { filterNode, item, getValue } = params;

  switch (filterNode.type) {
    case FilterNodeType.And: {
      const valid = filterNode.conditions.every(filterNode => judgeFilterTree({ filterNode, item, getValue }));
      return filterNode.not ? !valid : valid;
    }

    case FilterNodeType.Or: {
      if (!filterNode.conditions.length) return true;

      const valid = filterNode.conditions.some(filterNode => judgeFilterTree({ filterNode, item, getValue }));
      return filterNode.not ? !valid : valid;
    }

    case FilterNodeType.Condition: {
      const value = getValue({
        item,
        condition: filterNode as Condition
      });
      const valid = judge({
        value,
        filter: filterNode
      });
      return filterNode.not ? !valid : valid;
    }
  }
};

/**
 * 判断某字段值是否满足筛选条件
 *
 * - null 值比较处理与 SQL 中相同，仅 'is null' 的操作能命中，其他比较均为 false
 * - between 比较与 SQL 中相同，闭区间
 * - 包含 number / string 比较时的类型转换
 */
export const judge = ({ value, filter }: { value: Value; filter: FilterOperation }): boolean => {
  // 对标 SQL 中 null 值比较处理，仅 'is null' 的操作能命中
  if (value === null) {
    if (filter.operator === FilterOperator.IsNull) return true;
    return false;
  }

  switch (filter.operator) {
    case FilterOperator.GreaterThan:
      return value > filter.value;
    case FilterOperator.GreaterOrEqual:
      return value >= filter.value;

    case FilterOperator.LessThan:
      return value < filter.value;
    case FilterOperator.LessOrEqual:
      return value <= filter.value;

    case FilterOperator.Equal:
      // 包含 number / string 比较时的类型转换
      return value == filter.value;
    case FilterOperator.NotEqual:
      // 包含 number / string 比较时的类型转换
      return value != filter.value;

    case FilterOperator.In:
      return includes(filter.value, value);
    case FilterOperator.NotIn:
      return !includes(filter.value, value);

    case FilterOperator.IsNull:
      // null 值已提前处理
      return false;
    case FilterOperator.IsNotNull:
      return true;

    // between 比较与 SQL 中相同，闭区间
    case FilterOperator.Between:
      return filter.value[0] <= value && value <= filter.value[1];
    case FilterOperator.NotBetween:
      return value < filter.value[0] || value > filter.value[1];

    case FilterOperator.Like: {
      // like 转为正则执行
      const regex = getLikeRegex(filter.value);
      return regex.test(value as string);
    }
    case FilterOperator.NotLike: {
      const regex = getLikeRegex(filter.value);
      return !regex.test(value as string);
    }
  }

  return false;
};

/**
 * SQL like pattern 转为 js RegExp
 * - like pattern 为整行全文匹配，对应 RegExp `^ $`
 * - like pattern 中 `%` 为任意长度字符匹配，non-greedy
 * - like pattern 中 `_` 为一个字符长度匹配
 */
const getLikeRegex = (like: string): RegExp => {
  if (!likePatternCache.has(like)) {
    const string = escapeRegExp(like);
    const regexString = `^${string.replace(/%/g, '.*?').replace(/_/g, '.')}$`;
    likePatternCache.set(like, new RegExp(regexString));
  }
  return likePatternCache.get(like)!;
};

const likePatternCache: Map<string, RegExp> = new Map();

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(text: string) {
  // $& means the whole matched string
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
