import {
  type TableData,
  FilterNodeType,
  FilterOperator,
} from '../../types'
import { of } from '../../pipe'
import { mockSimpleTable } from '../../mocks'
import { where } from './where'


test('where without filter config', () => {
  const result: TableData = of(mockSimpleTable).pipe(
    where({
      source: mockSimpleTable
    }),
  )

  expect(result).toBe(mockSimpleTable)
})


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
            value: 9,
          },
          {
            type: FilterNodeType.Condition,
            column: 'score',
            operator: FilterOperator.GreaterThan,
            value: 100,
          },
        ],
      },
    }),
  )

  expect(result).toEqual([
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
  ])
})


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
                conditions: [],
              },
              {
                type: FilterNodeType.Condition,
                column: 'age',
                operator: FilterOperator.GreaterThan,
                value: 9,
              },
              {
                type: FilterNodeType.Condition,
                column: 'score',
                operator: FilterOperator.GreaterOrEqual,
                value: 100,
              },
              {
                type: FilterNodeType.Or,
                conditions: [
                  {
                    type: FilterNodeType.Condition,
                    column: 'subject',
                    operator: FilterOperator.In,
                    value: ['System'],
                  },
                  {
                    type: FilterNodeType.Condition,
                    column: 'name',
                    operator: FilterOperator.Like,
                    value: 'A%',
                  },
                  {
                    type: FilterNodeType.Condition,
                    column: 'name',
                    operator: FilterOperator.Like,
                    value: '%u%',
                  }
                ],
              },
            ],
          },
        ],
      },
    }),
  )

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
  ])
})

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
            value: 9,
          },
          {
            type: FilterNodeType.Condition,
            column: 'score',
            operator: FilterOperator.GreaterThan,
            value: 100,
          },
          {
            type: FilterNodeType.Or,
            not: true,
            conditions: [
              {
                type: FilterNodeType.Condition,
                column: 'subject',
                operator: FilterOperator.In,
                value: ['System'],
              },
              {
                type: FilterNodeType.Condition,
                column: 'name',
                operator: FilterOperator.Like,
                value: 'A%',
              },
            ],
          },
        ],
      },
    }),
  )

  expect(result).toEqual([
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
  ])
})
