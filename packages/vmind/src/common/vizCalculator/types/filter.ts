import type { ColumnEvaluate, AggregateEvaluate } from './select';
import type { ColumnName } from './data';
import type { Aggregation } from './aggregate';

export type WhereFilterNode = FilterNode<WhereCondition>;
export type HavingFilterNode = FilterNode<HavingCondition>;

export interface FilterNode<Condition extends FilterCondition = WhereCondition> {
  type: FilterNodeType.And | FilterNodeType.Or;
  /**
   * Logical negation
   * `逻辑非`，对应 SQL `not (多项条件)`
   */
  not?: boolean;
  conditions: (Condition | FilterNode<Condition>)[];
}

export type FilterCondition = {
  type: FilterNodeType.Condition;
  /**
   * Logical negation
   * `逻辑非`，对应 SQL `not 单项条件`
   */
  not?: boolean;
} & FilterOperation;

export type WhereCondition = FilterCondition & {
  column: ColumnName | ColumnEvaluate;
};
/** 仅 having 时能使用聚合计算筛选 */
export type HavingCondition = FilterCondition &
  (
    | {
        column: ColumnName;
        /**
         * 简单聚合方式
         * 无此字段不做聚合计算，则取第一项值
         */
        aggregate?: Aggregation;
      }
    | { column: ColumnEvaluate }
    | { aggregate: AggregateEvaluate }
  );

export enum FilterNodeType {
  Condition = 'Condition',
  And = 'And',
  Or = 'Or'
}

export type FilterOperationWithConditionType = {
  conditionType: FilterNodeType.And | FilterNodeType.Or;
  operations: FilterOperation[];
};

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
      operator: FilterOperator.In | FilterOperator.NotIn;
      value: (string | number)[];
    }
  | {
      operator: FilterOperator.IsNull | FilterOperator.IsNotNull;
    }
  | {
      operator: FilterOperator.Between | FilterOperator.NotBetween;
      value: [string, string] | [number, number];
    }
  | {
      operator: FilterOperator.Like | FilterOperator.NotLike;
      value: string;
    };

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
  NotLike = 'not like'
}
