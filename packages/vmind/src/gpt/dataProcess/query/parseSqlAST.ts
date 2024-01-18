import { DataItem, SimpleFieldInfo } from '../../../typings';
import { select, from, groupBy, having, limit, orderBy, where } from './astPipes';
import { ASTParserPipe, SQLAst } from './type';
import { execPipeline } from './utils';

const Pipelines: ASTParserPipe[] = [from, select, where, groupBy, having, orderBy, limit];

/**
 * convert the SQL AST to vizCalculator query CST(Concrete Syntax Tree).
 * @param ast AST of the SQL from node-sql-parser
 */
export const parseSqlAST = (
  ast: SQLAst,
  dataSource: DataItem[],
  fieldInfo: SimpleFieldInfo[],
  replaceMap: Map<string, string>
) => {
  const query = execPipeline({}, Pipelines, { ast, dataSource, fieldInfo, replaceMap });
  return query;
};
