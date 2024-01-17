import { AggregateType, query } from '../../calculator';
import { DataItem } from '../../typings';
import NodeSQLParser from 'node-sql-parser';
export const queryDataset = (dataset: DataItem[]) => {
  const salesResult = query({
    from: dataset.map(d => ({ ...d, 销售额: Number(d['销售额']) })),
    select: {
      columns: [
        { column: '商品名称' },
        { column: 'region' },
        {
          column: '销售额',
          alias: '销售总额',
          aggregate: {
            method: AggregateType.Sum
          }
        }
      ]
    },
    groupBy: ['商品名称', 'region']
  });
  console.log(salesResult);
  const parser = new NodeSQLParser.Parser();
  const ast = parser.astify(
    `SELECT "商品名称", region, SUM("销售额") AS "总销售额" FROM TABLE GROUP BY "商品名称", region ORDER BY "总销售额" DESC`
  );
  console.log(ast);
};
