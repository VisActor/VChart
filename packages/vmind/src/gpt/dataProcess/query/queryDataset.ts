import { DataItem, ILLMOptions, SimpleFieldInfo } from '../../../typings';
import NodeSQLParser from 'node-sql-parser';
import { parseRespondField, preprocessSQL } from './utils';
import { parseSqlAST } from './parseSqlAST';
import { isArray } from 'lodash';
import { DataQueryResponse, SQLAst } from './type';
import { Query, query } from '../../../calculator';
import { parseGPTResponse, requestGPT } from '../../utils';
import { getQueryDatasetPrompt } from '../prompts';

/**
 * query the source dataset according to user's input and fieldInfo to get aggregated dataset
 *
 * @param userInput
 * @param fieldInfo
 * @param sourceDataset
 */
export const queryDatasetWithGPT = async (
  userInput: string,
  fieldInfo: SimpleFieldInfo[],
  sourceDataset: DataItem[],
  options: ILLMOptions
) => {
  const { SQL, fieldInfo: responseFieldInfo } = await getQuerySQL(userInput, fieldInfo, options);
  const { validStr, replaceMap } = preprocessSQL(SQL);
  console.log(validStr, replaceMap, responseFieldInfo);
  const parser = new NodeSQLParser.Parser();
  const ast = parser.astify(validStr);
  const queryObject = parseSqlAST((isArray(ast) ? ast[0] : ast) as SQLAst, sourceDataset, fieldInfo, replaceMap);
  console.log(ast);
  console.log(queryObject);
  const dataset = query(queryObject as Query);
  console.log(dataset);
  const fieldInfoNew = parseRespondField(responseFieldInfo, dataset);
  console.log(fieldInfoNew);
  return { dataset, fieldInfo: fieldInfoNew };
};

/**
 * call gpt to get the query sql according to user's input and data field.
 * @param userInput
 * @param fieldInfo
 */
const getQuerySQL = async (userInput: string, fieldInfo: SimpleFieldInfo[], options: ILLMOptions) => {
  const queryDatasetMessage = `User's Command: ${userInput}\nData field description: ${JSON.stringify(fieldInfo)}`;

  const requestFunc = options.customRequestFunc?.dataQuery ?? requestGPT;
  const QueryDatasetPrompt = getQueryDatasetPrompt(options.showThoughts);
  const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, options);

  const dataQueryResponse: DataQueryResponse = parseGPTResponse(dataProcessRes);
  console.log(dataQueryResponse);
  return dataQueryResponse;
};
