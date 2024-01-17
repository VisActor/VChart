import { AggregateType, query } from '../../../common/vizCalculator/index';
import { DataItem, SimpleFieldInfo } from '../../../typings';
import NodeSQLParser, { AST } from 'node-sql-parser';
import { addQuotes, preprocessSQL } from './utils';
import { parseSqlAST } from './parseSqlAST';
import { isArray } from 'lodash';
import { SQLAst } from './type';

/**
 * query the source dataset according to user's input and fieldInfo to get aggregated dataset
 *
 * @param userInput
 * @param fieldInfo
 * @param sourceDataset
 */
export const queryDataset = (userInput: string, fieldInfo: SimpleFieldInfo[], sourceDataset: DataItem[]) => {
  const querySQL = getQuerySQL(userInput, fieldInfo);
  const sqlString = preprocessSQL(querySQL);
  const parser = new NodeSQLParser.Parser();
  const ast = parser.astify(sqlString);
  const query = parseSqlAST((isArray(ast) ? ast[0] : ast) as SQLAst);
  console.log(ast);
  console.log(query);
};

/**
 * call gpt to get the query sql according to user's input and data field.
 * @param userInput
 * @param fieldInfo
 */
const getQuerySQL = (userInput: string, fieldInfo: SimpleFieldInfo[]) => {
  return `
SELECT DISTINCT customer_name, order_date, product_id
FROM orders
WHERE product_id IN (101, 102) AND customer_name LIKE 'A%' AND customer_name NOT LIKE 'B%' AND order_date BETWEEN '2022-01-01' AND '2022-12-31' AND total_amount >= 500 AND order_status != 'Cancelled'
GROUP BY customer_name, order_date, product_id
HAVING COUNT(order_id) > 2
ORDER BY product_id ASC, order_date DESC
LIMIT 10;`;
  return `SELECT DISTINCT customer_name, order_date, product_id
FROM orders
WHERE product_id = 101 OR product_id = 102 AND NOT product_id=103 OR product_id > 1000
GROUP BY customer_name, order_date, product_id
HAVING COUNT(order_id) > 2
ORDER BY product_id ASC, order_date DESC
LIMIT 10;`;
};
