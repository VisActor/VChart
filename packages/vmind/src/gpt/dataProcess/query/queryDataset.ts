import { DataItem, SimpleFieldInfo } from '../../../typings';
import NodeSQLParser from 'node-sql-parser';
import { preprocessSQL } from './utils';
import { parseSqlAST } from './parseSqlAST';
import { isArray } from 'lodash';
import { SQLAst } from './type';
import { Query, query } from '../../../calculator';

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
  console.log(sqlString);
  const parser = new NodeSQLParser.Parser();
  const ast = parser.astify(sqlString);
  const queryObject = parseSqlAST((isArray(ast) ? ast[0] : ast) as SQLAst, sourceDataset, fieldInfo);
  console.log(ast);
  console.log(queryObject);
  const dataset = query(queryObject as Query);
  console.log(dataset);
};

/**
 * call gpt to get the query sql according to user's input and data field.
 * @param userInput
 * @param fieldInfo
 */
const getQuerySQL = (userInput: string, fieldInfo: SimpleFieldInfo[]) => {
  return `SELECT 商品名称, SUM(销售额) AS 总销售额 FROM dataSource WHERE region = 'north' GROUP BY 商品名称
HAVING SUM(销售额)>100
ORDER BY 总销售额 DESC, COUNT(商品名称) DESC`;
  return `
SELECT distinct customer_name, MIN(order_date) AS first_order_date, MAX(order_date) AS latest_order_date, COUNT(DISTINCT product_id), AVG(total_amount)
FROM orders
WHERE product_id IN (101, 102) AND customer_name LIKE 'A%' AND customer_name NOT LIKE 'B%' AND order_date BETWEEN '2022-01-01' AND '2022-12-31' AND total_amount >= 500 AND order_status != 'Cancelled'
GROUP BY customer_name
HAVING COUNT(order_id) > 2 AND SUM(product_id)>100
ORDER BY latest_order_date DESC, COUNT(order_id) DESC
LIMIT 10;`;
  return `SELECT DISTINCT customer_name, order_date, product_id
FROM orders
WHERE product_id = 101 OR product_id = 102 AND NOT product_id=103 OR product_id > 1000
GROUP BY customer_name, order_date, product_id
HAVING COUNT(order_id) > 2
ORDER BY product_id ASC, order_date DESC
LIMIT 10;`;
};
