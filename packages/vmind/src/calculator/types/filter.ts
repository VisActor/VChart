import type {
  ColumnEvaluate,
  AggregateEvaluate,
} from './select'
import type { ColumnName } from './data'
import type { Aggregation } from './aggregate'


export type WhereFilterNode = FilterNode<WhereCondition>
export type HavingFilterNode = FilterNode<HavingCondition>

export interface FilterNode<Condition extends FilterCondition = WhereCondition> {
  type: FilterNodeType.And | FilterNodeType.Or;
  /**
   * Logical negation
   * Corresponds to SQL `not (multiple conditions)`
   */
  not?: boolean;
  conditions: (Condition | FilterNode<Condition>)[];
}

export type FilterCondition = {
  type: FilterNodeType.Condition;
  /**
   * Logical negation
   * Corresponds to SQL `not (single condition)`
   */
  not?: boolean;
} & FilterOperation

export type WhereCondition = FilterCondition & {
  column: ColumnName | ColumnEvaluate;
}
/** Can only use aggregation calculation when having */
export type HavingCondition = FilterCondition & (
  | {
    column: ColumnName;
    /**
     * Simple aggregation method
     * If this field is not present, no aggregation calculation will be performed and the first item value will be taken
     */
    aggregate?: Aggregation;
  }
  | { column: ColumnEvaluate }
  | { aggregate: AggregateEvaluate }
)

export enum FilterNodeType {
  Condition = 'Condition',
  And = 'And',
  Or = 'Or',
}

export type FilterOperation =
  | {
    operator:
      | FilterOperator.GreaterThan
      | FilterOperator.GreaterOrEqual
      | FilterOperator.LessThan
      | FilterOperator.LessOrEqual
      | FilterOperator.Equal
      | FilterOperator.NotEqual;
    value: string | number;
  }
  | {
    operator:
      | FilterOperator.In
      | FilterOperator.NotIn;
    value: (string | number)[];
  }
  | {
    operator:
      | FilterOperator.IsNull
      | FilterOperator.IsNotNull;
  }
  | {
    operator:
      | FilterOperator.Between
      | FilterOperator.NotBetween;
    value: [string, string] | [number, number];
  }
  | {
    operator:
      | FilterOperator.Like
      | FilterOperator.NotLike;
    value: string;
  }

export enum FilterOperator {
  GreaterThan = '>',
  GreaterOrEqual = '>=',
  LessThan = '<',
  LessOrEqual = '<=',
  Equal = '=',
  NotEqual = '!=',
  In = 'in',
  NotIn = 'not in',
  IsNull = 'is null',
  IsNotNull = 'is not null',
  Between = 'between',
  NotBetween = 'not between',
  Like = 'like',
  NotLike = 'not like',
}
