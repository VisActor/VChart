import { from, where } from './astPipes';
import { ASTParserPipe, SQLAst } from './type';
import { execPipeline } from './utils';

const Pipelines: ASTParserPipe[] = [from, where];

/**
 * convert the SQL AST to vizCalculator query DSL.
 * @param ast AST of the SQL from node-sql-parser
 */
export const parseSqlAST = (ast: SQLAst) => {
  const query = execPipeline({}, Pipelines, { ast });
  return query;
};
