import { AST, Select } from 'node-sql-parser';
import { Query } from '../../../calculator';
import { DataItem, SimpleFieldInfo } from '../../../typings';

export type SQLAst = Select;
export type ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => Partial<Query>;

export type ASTParserContext = {
  ast: SQLAst;
  dataSource: DataItem[];
  fieldInfo: SimpleFieldInfo[];
};
