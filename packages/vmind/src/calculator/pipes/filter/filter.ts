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
  FilterOperator,
} from '../../types'
import {
  includes,
} from '../../utils'


export const judgeFilterTree = <
  T extends Row | GroupChunk,
  Condition extends FilterCondition = T extends Row ? WhereCondition : HavingCondition
>(params: {
  filterNode: FilterNode<Condition> | FilterCondition,
  item: T
  getValue: (params: {
    item: T;
    condition: Condition;
  }) => Value;
}): boolean => {
  const {
    filterNode,
    item,
    getValue,
  } = params

  switch (filterNode.type) {
    case (FilterNodeType.And): {
      const valid = filterNode.conditions.every(
        filterNode => judgeFilterTree({ filterNode, item, getValue })
      )
      return filterNode.not ? !valid : valid
    }

    case (FilterNodeType.Or): {
      if (!filterNode.conditions.length) return true

      const valid = filterNode.conditions.some(
        filterNode => judgeFilterTree({ filterNode, item, getValue })
      )
      return filterNode.not ? !valid : valid
    }

    case (FilterNodeType.Condition): {
      const value = getValue({
        item,
        condition: filterNode as Condition,
      })
      const valid = judge({
        value,
        filter: filterNode,
      })
      return filterNode.not ? !valid : valid
    }
  }
}


/**
 * Determine whether a field value meets the filtering condition
 *
 * - Null value comparison is handled the same as in SQL, only 'is null' operation can match, other comparisons are false
 * - Between comparison is the same as in SQL, closed interval
 * - Type conversion when comparing number / string inclusion
 */
export const judge = ({ value, filter }: {
  value: Value;
  filter: FilterOperation;
}): boolean => {
  // Handle null value comparison the same as in SQL, only 'is null' operation can match
  if (value === null) {
    if (filter.operator === FilterOperator.IsNull) return true
    return false
  }

  switch (filter.operator) {
    case FilterOperator.GreaterThan:
      return value > filter.value
    case FilterOperator.GreaterOrEqual:
      return value >= filter.value

    case FilterOperator.LessThan:
      return value < filter.value
    case FilterOperator.LessOrEqual:
      return value <= filter.value

    case FilterOperator.Equal:
      // Type conversion when comparing number / string
      return value == filter.value
    case FilterOperator.NotEqual:
      // Type conversion when comparing number / string
      return value != filter.value

    case FilterOperator.In:
      return includes(filter.value, value)
    case FilterOperator.NotIn:
      return !includes(filter.value, value)

    case FilterOperator.IsNull:
      // Null value is handled earlier
      return false
    case FilterOperator.IsNotNull:
      return true

    // Between comparison is the same as in SQL, closed interval
    case FilterOperator.Between:
      return (filter.value[0] <= value) && (value <= filter.value[1])
    case FilterOperator.NotBetween:
      return (value < filter.value[0]) || (value > filter.value[1])

    case FilterOperator.Like: {
      // Convert like to regular expression
      const regex = getLikeRegex(filter.value)
      return regex.test(value as string)
    }
    case FilterOperator.NotLike: {
      const regex = getLikeRegex(filter.value)
      return !regex.test(value as string)
    }
  }

  return false
}

/**
 * Convert SQL like pattern to js RegExp
 * - like pattern matches the entire line, corresponding to RegExp `^ $`
 * - like pattern '%' matches any length of characters, non-greedy
 * - like pattern '_' matches a single character
 */
const getLikeRegex = (like: string): RegExp => {
  if (!likePatternCache.has(like)) {
    const string = escapeRegExp(like)
    const regexString = `^${string.replace(/%/g, '.*?').replace(/_/g, '.')}$`
    likePatternCache.set(like, new RegExp(regexString))
  }
  return likePatternCache.get(like)!
}

const likePatternCache: Map<string, RegExp> = new Map()


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(text: string) {
  // $& means the whole matched string
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
