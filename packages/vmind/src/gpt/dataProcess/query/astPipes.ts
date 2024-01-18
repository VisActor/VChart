import { AggrFunc, ColumnRef, Expr, Param, Value } from 'node-sql-parser';
import {
  Aggregation,
  ColumnConfig,
  FilterNode,
  FilterNodeType,
  FilterOperator,
  HavingCondition,
  Query,
  WhereCondition,
  WhereFilterNode
} from '../../../common/vizCalculator';
import { ASTParserContext, ASTParserPipe, SQLAst } from './type';
import { checkIsColumnNode, toFirstUpperCase } from './utils';
import { SimpleFieldInfo } from '../../../typings';

export const from: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { dataSource, fieldInfo } = context;
  return { ...query, from: dataSource };
};

/**
 * parse aggr_func node and convert to FilterCondition
 * @param aggrFunc
 */
const parseAggrFunc = (
  aggrFunc: AggrFunc,
  columns: any,
  fieldInfo: SimpleFieldInfo[]
): { column?: ColumnConfig; type?: FilterNodeType; aggregate: Aggregation } => {
  const { name, args } = aggrFunc;
  const { distinct, expr } = args ?? ({} as any);
  const result: any = {
    type: FilterNodeType.Condition
  };
  if (expr && expr.type === 'aggr_func') {
    console.error('unsupported aggr func!');
  } else if (expr && checkIsColumnNode(expr, columns, fieldInfo)) {
    result.column = expr.column ?? expr.value;
  }
  result.aggregate = {
    distinct: Boolean(distinct),
    method: toFirstUpperCase(name)
  };

  return result;
};

/**
 * recursively parse the where conditions in ast.
 * @param astWhere
 * @param whereFilterNode
 */
const parseSQLExpr = (
  astWhere: Expr | ColumnRef | Param | Value,
  columns: any,
  fieldInfo: SimpleFieldInfo[],
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
      (result as FilterNode<WhereCondition>).conditions = [
        parseSQLExpr(left, columns, fieldInfo),
        parseSQLExpr(right, columns, fieldInfo)
      ];
    } else if (
      Object.values(FilterOperator)
        .map(v => v.toUpperCase())
        .includes(operator as any)
    ) {
      result.type = FilterNodeType.Condition;
      const columnNode = [left, right].find(n => checkIsColumnNode(n, columns, fieldInfo));
      if (columnNode) {
        result.column = (columnNode as ColumnRef).column ?? (columnNode as any).value;
      }
      const valueNode = [left, right].find(n => !checkIsColumnNode(n, columns, fieldInfo) && n.type !== 'aggr_func');
      if (valueNode) {
        result.value = (valueNode as Value).value;
      }
      const aggrNode: any = [left, right].find(n => n.type === 'aggr_func');
      if (aggrNode) {
        const aggrFuncConfig: any = parseAggrFunc(aggrNode, columns, fieldInfo);
        result.column = aggrFuncConfig.column;
        result.aggregate = aggrFuncConfig.aggregate;
      }
      result.operator = operator.toLowerCase();
    } else {
      console.error('unsupported operator in expr!');
    }
  } else if (type === 'unary_expr') {
    const { expr, operator } = astWhere as any;
    return parseSQLExpr(expr, columns, fieldInfo, operator === 'NOT');
  } else {
    console.error('unsupported type in expr!');
  }

  return result;
};

export const where: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo } = context;
  const { where } = ast;
  if (!where) {
    return query;
  }
  const whereList: any = parseSQLExpr(where as Expr, query.select.columns, fieldInfo);
  return { ...query, where: whereList.conditions ? whereList : { conditions: [whereList] } };
};

export const groupBy: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast } = context;
  const { groupby } = ast;
  if (!groupby) {
    return query;
  }
  return {
    ...query,
    groupBy: (groupby ?? []).map((group: any) => group.column ?? group.value)
  };
};

export const select: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo } = context;
  const { columns, distinct } = ast;
  if (!columns) {
    return query;
  }
  const columnAlias = columns.map(c => ({
    alias: c.as
  }));
  return {
    ...query,
    select: {
      columns: (columns ?? []).map(column => {
        const result: any = {};
        const { as, expr } = column;
        if (checkIsColumnNode(expr, columnAlias, fieldInfo)) {
          // If it is a column from data source, it can be check by fieldInfo
          // If it is a derived column, it can be check by columnAlias
          result.column = expr.column ?? expr.value;
        } else if (expr.type === 'aggr_func') {
          const aggrFuncConf: any = parseAggrFunc(expr, columnAlias, fieldInfo);
          result.column = aggrFuncConf.column;
          result.aggregate = aggrFuncConf.aggregate;
        }
        if (as) {
          result.alias = as;
        }
        return result;
      }),
      distinct: Boolean(distinct)
    }
  };
};

export const having: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo } = context;
  const { having } = ast;
  if (!having) {
    return query;
  }
  return {
    ...query,
    having: parseSQLExpr(having as unknown as Expr, query.select.columns, fieldInfo)
  };
};

export const orderBy: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo } = context;
  const { orderby } = ast;
  if (!orderby) {
    return query;
  }
  return {
    ...query,
    orderBy: (orderby ?? []).map(orderInfo => {
      const result: any = {};
      const { type, expr } = orderInfo;
      if (checkIsColumnNode(expr, query.select.columns, fieldInfo)) {
        result.column = expr.column ?? expr.value;
      } else {
        const orderConfig = parseAggrFunc(expr, query.select.columns, fieldInfo);
        result.column = orderConfig.column;
        result.aggregate = orderConfig.aggregate;
      }
      return {
        type: toFirstUpperCase(type),
        ...result
      };
    })
  };
};

export const limit: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast } = context;
  const { limit } = ast;
  if (!limit) {
    return query;
  }
  return {
    ...query,
    limit: limit.value[0].value
  };
};
