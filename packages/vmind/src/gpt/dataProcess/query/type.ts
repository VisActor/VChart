import { AST, Select } from 'node-sql-parser';
import { Query } from '../../../common/vizCalculator';

export type SQLAst = Select;
export type ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => Partial<Query>;

export type ASTParserContext = {
  ast: SQLAst;
};
