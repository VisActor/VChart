import { type TableData, FilterNodeType, FilterOperator, AggregateType, OrderType } from '../../types';
import { of } from '../../pipe';
import { mockSimpleTable } from '../../mocks';
import { where } from './where';
import { query } from '../../query';

test('where without filter config', () => {
  const result: TableData = of(mockSimpleTable).pipe(
    where({
      source: mockSimpleTable
    })
  );

  expect(result).toBe(mockSimpleTable);
});

test('simple where filter', () => {
  const result: TableData = of(mockSimpleTable).pipe(
    where({
      source: mockSimpleTable,
      filter: {
        type: FilterNodeType.And,
        conditions: [
          {
            type: FilterNodeType.Condition,
            column: 'age',
            operator: FilterOperator.GreaterThan,
            value: 9
          },
          {
            type: FilterNodeType.Condition,
            column: 'score',
            operator: FilterOperator.GreaterThan,
            value: 100
          }
        ]
      }
    })
  );

  expect(result).toEqual([
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Admin', subject: 'System', score: 1000, age: 300 }
  ]);
});

test('nested where filter', () => {
  const result: TableData = of(mockSimpleTable).pipe(
    where({
      source: mockSimpleTable,
      filter: {
        type: FilterNodeType.Or,
        conditions: [
          {
            type: FilterNodeType.And,
            conditions: [
              {
                type: FilterNodeType.And,
                conditions: []
              },
              {
                type: FilterNodeType.Condition,
                column: 'age',
                operator: FilterOperator.GreaterThan,
                value: 9
              },
              {
                type: FilterNodeType.Condition,
                column: 'score',
                operator: FilterOperator.GreaterOrEqual,
                value: 100
              },
              {
                type: FilterNodeType.Or,
                conditions: [
                  {
                    type: FilterNodeType.Condition,
                    column: 'subject',
                    operator: FilterOperator.In,
                    value: ['System']
                  },
                  {
                    type: FilterNodeType.Condition,
                    column: 'name',
                    operator: FilterOperator.Like,
                    value: 'A%'
                  },
                  {
                    type: FilterNodeType.Condition,
                    column: 'name',
                    operator: FilterOperator.Like,
                    value: '%u%'
                  }
                ]
              }
            ]
          }
        ]
      }
    })
  );

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Admin', subject: 'System', score: 1000, age: 300 }
  ]);
});

test('nested where filter with logical negation', () => {
  const result: TableData = of(mockSimpleTable).pipe(
    where({
      source: mockSimpleTable,
      filter: {
        type: FilterNodeType.And,
        conditions: [
          {
            type: FilterNodeType.Condition,
            not: true,
            column: 'age',
            operator: FilterOperator.LessThan,
            value: 9
          },
          {
            type: FilterNodeType.Condition,
            column: 'score',
            operator: FilterOperator.GreaterThan,
            value: 100
          },
          {
            type: FilterNodeType.Or,
            not: true,
            conditions: [
              {
                type: FilterNodeType.Condition,
                column: 'subject',
                operator: FilterOperator.In,
                value: ['System']
              },
              {
                type: FilterNodeType.Condition,
                column: 'name',
                operator: FilterOperator.Like,
                value: 'A%'
              }
            ]
          }
        ]
      }
    })
  );

  expect(result).toEqual([{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]);
});

test('query with group by/having', () => {
  const rawData = [
    {
      商品名称: '可乐',
      region: 'south',
      销售额: 2350
    },
    {
      商品名称: '可乐',
      region: 'east',
      销售额: 1027
    },
    {
      商品名称: '可乐',
      region: 'west',
      销售额: 1027
    },
    {
      商品名称: '可乐',
      region: 'north',
      销售额: 1027
    },
    {
      商品名称: '雪碧',
      region: 'south',
      销售额: 215
    },
    {
      商品名称: '雪碧',
      region: 'east',
      销售额: 654
    },
    {
      商品名称: '雪碧',
      region: 'west',
      销售额: 159
    },
    {
      商品名称: '雪碧',
      region: 'north',
      销售额: 28
    },
    {
      商品名称: '芬达',
      region: 'south',
      销售额: 345
    },
    {
      商品名称: '芬达',
      region: 'east',
      销售额: 654
    },
    {
      商品名称: '芬达',
      region: 'west',
      销售额: 2100
    },
    {
      商品名称: '芬达',
      region: 'north',
      销售额: 1679
    },
    {
      商品名称: '醒目',
      region: 'south',
      销售额: 1476
    },
    {
      商品名称: '醒目',
      region: 'east',
      销售额: 830
    },
    {
      商品名称: '醒目',
      region: 'west',
      销售额: 532
    },
    {
      商品名称: '醒目',
      region: 'north',
      销售额: 498
    }
  ];
  const result = query({
    from: rawData,
    select: {
      columns: [
        {
          column: '商品名称'
        },
        {
          column: '销售额',
          aggregate: {
            method: AggregateType.Sum
          },
          alias: '总销售额'
        },
        {
          column: '销售额',
          aggregate: {
            method: AggregateType.Count
          }
        }
      ]
    },
    where: {
      type: FilterNodeType.And,
      conditions: [
        {
          type: FilterNodeType.Condition,
          column: 'region',
          operator: FilterOperator.Equal,
          value: 'north'
        }
      ]
    },
    groupBy: ['商品名称'],
    having: {
      not: false,
      type: FilterNodeType.And,
      conditions: [
        {
          type: FilterNodeType.Condition,
          column: '销售额',
          aggregate: {
            method: AggregateType.Count
          },
          operator: FilterOperator.GreaterOrEqual,
          value: 1
        },
        {
          type: FilterNodeType.Condition,
          column: '销售额',
          aggregate: {
            method: AggregateType.Sum
          },
          operator: FilterOperator.GreaterThan,
          value: 100
        }
      ]
    },
    orderBy: [
      {
        type: OrderType.Desc,
        column: '总销售额'
      },
      {
        type: OrderType.Desc,
        column: '商品名称',
        aggregate: {
          method: AggregateType.Count
        }
      }
    ]
  });
  expect(result).toEqual([
    {
      商品名称: '可乐',
      总销售额: 1027,
      'Count(销售额)': 1
    },
    {
      商品名称: '芬达',
      总销售额: 1679,
      'Count(销售额)': 1
    },
    {
      商品名称: '醒目',
      总销售额: 498,
      'Count(销售额)': 1
    }
  ]);
});
