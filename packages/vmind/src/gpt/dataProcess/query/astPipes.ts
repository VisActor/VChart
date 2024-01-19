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
} from '../../../calculator';
import { ASTParserContext, ASTParserPipe, SQLAst } from './type';
import { checkIsColumnNode, getOriginalString, toFirstUpperCase } from './utils';
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
  fieldInfo: SimpleFieldInfo[],
  replaceMap: Map<string, string>
): { column?: ColumnConfig; type?: FilterNodeType; aggregate: Aggregation } => {
  const { name, args } = aggrFunc;
  const { distinct, expr } = args ?? ({} as any);
  const result: any = {
    type: FilterNodeType.Condition
  };
  if (expr && expr.type === 'aggr_func') {
    console.error('unsupported aggr func!');
  } else if (expr && checkIsColumnNode(expr, columns, fieldInfo)) {
    const columnName = expr.column ?? expr.value;
    result.column = getOriginalString(columnName, replaceMap);
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
  replaceMap: Map<string, string>,
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
        parseSQLExpr(left, columns, fieldInfo, replaceMap),
        parseSQLExpr(right, columns, fieldInfo, replaceMap)
      ];
    } else if (
      Object.values(FilterOperator)
        .map(v => v.toUpperCase())
        .includes(operator as any)
    ) {
      result.type = FilterNodeType.Condition;
      const columnNode = [left, right].find(n => checkIsColumnNode(n, columns, fieldInfo));
      if (columnNode) {
        const columnName = (columnNode as ColumnRef).column ?? (columnNode as any).value;
        result.column = getOriginalString(columnName, replaceMap);
      }
      const valueNode = [left, right].find(n => !checkIsColumnNode(n, columns, fieldInfo) && n.type !== 'aggr_func');
      if (valueNode) {
        const valueName = (valueNode as Value).value;
        result.value = getOriginalString(valueName, replaceMap);
      }
      const aggrNode: any = [left, right].find(n => n.type === 'aggr_func');
      if (aggrNode) {
        const aggrFuncConfig: any = parseAggrFunc(aggrNode, columns, fieldInfo, replaceMap);
        result.column = aggrFuncConfig.column;
        result.aggregate = aggrFuncConfig.aggregate;
      }
      result.operator = operator.toLowerCase();
    } else {
      console.error('unsupported operator in expr!');
    }
  } else if (type === 'unary_expr') {
    const { expr, operator } = astWhere as any;
    return parseSQLExpr(expr, columns, fieldInfo, replaceMap, operator === 'NOT');
  } else {
    console.error('unsupported type in expr!');
  }

  return result;
};

export const where: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo, replaceMap } = context;
  const { where } = ast;
  if (!where) {
    return query;
  }
  const whereList: any = parseSQLExpr(where as Expr, query.select.columns, fieldInfo, replaceMap);
  return {
    ...query,
    where: whereList.conditions ? whereList : { not: false, type: FilterNodeType.And, conditions: [whereList] }
  };
};

export const groupBy: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, replaceMap } = context;
  const { groupby } = ast;
  if (!groupby) {
    return query;
  }
  return {
    ...query,
    groupBy: (groupby ?? []).map((group: any) => getOriginalString(group.column ?? group.value, replaceMap))
  };
};

export const select: ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo, replaceMap } = context;
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
          result.column = getOriginalString(expr.column ?? expr.value, replaceMap);
        } else if (expr.type === 'aggr_func') {
          const aggrFuncConf: any = parseAggrFunc(expr, columnAlias, fieldInfo, replaceMap);
          result.column = aggrFuncConf.column;
          result.aggregate = aggrFuncConf.aggregate;
        }
        if (as) {
          result.alias = getOriginalString(as, replaceMap);
        }
        return result;
      }),
      distinct: Boolean(distinct)
    }
  };
};

export const having: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo, replaceMap } = context;
  const { having } = ast;
  if (!having) {
    return query;
  }
  const havingList: any = parseSQLExpr(having as unknown as Expr, query.select.columns, fieldInfo, replaceMap);
  return {
    ...query,
    having: havingList.conditions ? havingList : { not: false, type: FilterNodeType.And, conditions: [havingList] }
  };
};

export const orderBy: any = (query: Partial<Query>, context: ASTParserContext) => {
  const { ast, fieldInfo, replaceMap } = context;
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
        const columnName = expr.column ?? expr.value;
        result.column = getOriginalString(columnName, replaceMap);
      } else {
        const orderConfig = parseAggrFunc(expr, query.select.columns, fieldInfo, replaceMap);
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
