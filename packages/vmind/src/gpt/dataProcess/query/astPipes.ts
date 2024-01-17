import { ColumnRef, Expr, Param, Value } from 'node-sql-parser';
import {
  FilterNode,
  FilterNodeType,
  FilterOperator,
  Query,
  WhereCondition,
  WhereFilterNode
} from '../../../common/vizCalculator';
import { ASTParserContext, SQLAst } from './type';

export const from = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast } = context;
  const DEFAULT_DATA_SOURCE = 'dataSource';
  return { ...query, from: ast?.from[0]?.table ?? DEFAULT_DATA_SOURCE };
};

/**
 * recursively parse the where conditions in ast.
 * @param astWhere
 * @param whereFilterNode
 */
const parseWhereCondition = (
  astWhere: Expr | ColumnRef | Param | Value,
  isNot?: boolean
): WhereCondition | FilterNode<WhereCondition> => {
  if (!astWhere) {
    return {} as FilterNode<WhereCondition>;
  }
  const result: any = {
    not: Boolean(isNot)
  };
  //parse this ast node
  const { type } = astWhere;

  if (type === 'binary_expr') {
    const { left, right, operator } = astWhere as Expr;
    if (['AND', 'OR'].includes(operator)) {
      result.type = operator === 'AND' ? FilterNodeType.And : FilterNodeType.Or;
      (result as FilterNode<WhereCondition>).conditions = [parseWhereCondition(left), parseWhereCondition(right)];
    }
    if (
      Object.values(FilterOperator)
        .map(v => v.toUpperCase())
        .includes(operator as any)
    ) {
      result.type = FilterNodeType.Condition;
      const columnNode = [left, right].find(n => n.type === 'column_ref');
      if (columnNode) {
        result.column = (columnNode as ColumnRef).column;
      }
      const valueNode = [left, right].find(n => n.type !== 'column_ref');
      if (valueNode) {
        result.value = (valueNode as Value).value;
      }
      result.operator = operator.toLocaleLowerCase();
    }
  } else if (type === 'unary_expr') {
    const { expr, operator } = astWhere as any;
    return parseWhereCondition(expr, operator === 'NOT');
  }

  return result;
};

export const where: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast } = context;
  const { where } = ast;
  return { ...query, where: parseWhereCondition(where as Expr) };
};
