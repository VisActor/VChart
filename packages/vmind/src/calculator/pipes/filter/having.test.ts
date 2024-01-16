import {
  type GroupedData,
  AggregateType,
  FilterNodeType,
  FilterOperator,
} from '../../types'
import { of } from '../../pipe'
import { mockSimpleTable } from '../../mocks'
import { group } from '../group'
import { removeAggregateCache } from '../aggregate'
import { having } from './having'


test('having without filter config', () => {
  const grouped: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject'],
    }),
  )
  const result: GroupedData = having({})(grouped)
  expect(result).toBe(grouped)
})


test('simple having filter', () => {
  const result: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject'],
    }),
    having({
      source: mockSimpleTable,
      filter: {
        type: FilterNodeType.And,
        conditions: [
          {
            type: FilterNodeType.Condition,
            column: 'age',
            operator: FilterOperator.GreaterThan,
            value: 50,
            aggregate: {
              distinct: true,
              method: AggregateType.Sum,
            },
          },
          {
            type: FilterNodeType.Condition,
            column: 'age',
            operator: FilterOperator.LessOrEqual,
            value: 200,
          },
        ],
      },
    }),
    removeAggregateCache,
  )

  expect(result).toEqual([
    {
      by: {
        subject: 'System',
      },
      rows: [
        { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
        { name: 'Admin', subject: 'System', score: 1000, age: 300 },
      ],
    },
  ])
})


test('having filter with expression', () => {
  const result: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: [function getSubject({ row }) { return row.subject }],
    }),
    having({
      source: mockSimpleTable,
      filter: {
        type: FilterNodeType.And,
        conditions: [
          {
            type: FilterNodeType.Condition,
            aggregate: ({ group }) => (
              Array
                .from(new Set(
                  group.rows
                  .map(row => row.age as number)
                ))
                .reduce((sum, age) => sum + age, 0)
            ),
            operator: FilterOperator.GreaterThan,
            value: 50,
          },
          {
            type: FilterNodeType.Condition,
            column: ({ row }) => row.age,
            operator: FilterOperator.LessOrEqual,
            value: 200,
          },
        ],
      },
    }),
    removeAggregateCache,
  )

  expect(result).toEqual([
    {
      by: {
        getSubject: 'System',
      },
      rows: [
        { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
        { name: 'Admin', subject: 'System', score: 1000, age: 300 },
      ],
    },
  ])
})
