import {
  type TableData,
  type AggregateMethod,
  AggregateType,
} from '../types'
import { of } from '../pipe'
import { mockSimpleTable } from '../mocks'
import { group } from './group'
import { select, selectGroup } from './select'


test('select table data', () => {
  const result1: TableData = of(mockSimpleTable).pipe(
    select({
      select: {
        columns: [{ column: 'subject' }],
      },
      source: mockSimpleTable,
    }),
  )
  expect(result1).toEqual([
    { subject: 'Sword' },
    { subject: 'Sword' },
    { subject: 'Sword' },
    { subject: 'Sword' },
    { subject: 'System' },
    { subject: 'System' },
  ])

  const result2: TableData = of(mockSimpleTable).pipe(
    select({
      select: {
        columns: [{ column: 'name' }, { column: 'subject' }],
      },
      source: mockSimpleTable,
    }),
  )
  expect(result2).toEqual([
    { name: 'Alice', subject: 'Sword' },
    { name: 'Eugeo', subject: 'Sword' },
    { name: 'Kirito', subject: 'Sword' },
    { name: 'Fanatio', subject: 'Sword' },
    { name: 'Cardinal', subject: 'System' },
    { name: 'Admin', subject: 'System' },
  ])
})

test('select grouped data without aggregate', () => {
  const result1: TableData = of(mockSimpleTable).pipe(
    group({
      groupBy: ['subject'],
      source: mockSimpleTable,
    }),
    selectGroup({
      select: {
        columns: [{ column: 'subject' }],
      },
      source: mockSimpleTable,
    }),
  )
  expect(result1).toEqual([
    { subject: 'Sword' },
    { subject: 'System' },
  ])

  const result2: TableData = of(mockSimpleTable).pipe(
    group({
      groupBy: ['subject', 'score'],
      source: mockSimpleTable,
    }),
    selectGroup({
      select: {
        columns: [{ column: 'subject' }],
      },
      source: mockSimpleTable,
    }),
  )
  expect(result2).toEqual([
    { subject: 'Sword' },
    { subject: 'Sword' },
    { subject: 'System' },
    { subject: 'System' },
  ])

  const result3: TableData = of(mockSimpleTable).pipe(
    group({
      groupBy: ['subject', 'score'],
      source: mockSimpleTable,
    }),
    selectGroup({
      select: {
        columns: [{ column: 'name' }, { column: 'subject' }],
      },
      source: mockSimpleTable,
    }),
  )
  expect(result3).toEqual([
    { name: 'Alice', subject: 'Sword' },
    { name: 'Kirito', subject: 'Sword' },
    { name: 'Cardinal', subject: 'System' },
    { name: 'Admin', subject: 'System' },
  ])
})

test('select grouped data and aggregate', () => {
  const result1: TableData = of(mockSimpleTable).pipe(
    group({
      groupBy: ['subject'],
      source: mockSimpleTable,
    }),
    selectGroup({
      source: mockSimpleTable,
      select: {
        columns: [
          { column: 'subject' },
          {
            column: 'subject',
            aggregate: { method: AggregateType.Count },
          },
          {
            column: 'subject',
            alias: 'distinct count',
            aggregate: {
              distinct: true,
              method: AggregateType.Count
            },
          },
          {
            column: 'score',
            aggregate: { method: AggregateType.Sum },
          },
          {
            column: 'score',
            alias: 'distinct sum',
            aggregate: {
              distinct: true,
              method: AggregateType.Sum
            },
          },
        ],
      },
    }),
  )
  expect(result1).toEqual([
    {
      subject: 'Sword',
      'Count(subject)': 4,
      'distinct count': 1,
      'Sum(score)': 500,
      'distinct sum': 300,
    },
    {
      subject: 'System',
      'Count(subject)': 2,
      'distinct count': 1,
      'Sum(score)': 1500,
      'distinct sum': 1500,
    },
  ])

  const result2: TableData = of(mockSimpleTable).pipe(
    group({
      groupBy: ['subject', 'score', 'age'],
      source: mockSimpleTable,
    }),
    selectGroup({
      source: mockSimpleTable,
      select: {
        columns: [
          {
            column: 'name',
            aggregate: { method: AggregateType.Max },
          },
          { column: 'subject' },
          { column: 'score' },
          { column: 'age' },
        ],
      },
    }),
  )
  expect(result2).toEqual([
    { 'Max(name)': 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { 'Max(name)': 'Fanatio', subject: 'Sword', score: 100, age: 20 },
    { 'Max(name)': 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { 'Max(name)': 'Cardinal', subject: 'System', score: 500, age: 200 },
    { 'Max(name)': 'Admin', subject: 'System', score: 1000, age: 300 },
  ])
})

test('select with custom aggregation method', () => {
  const customNameAggregate: AggregateMethod = ({ values }) => {
    return (values as string[])
      .map((name) => name.slice(0, 1))
      .join(' ')
  }

  const result: TableData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
    }),
    selectGroup({
      source: mockSimpleTable,
      select: {
        columns: [
          {
            column: 'name',
            alias: 'Initial Letters',
            aggregate: {
              distinct: true,
              method: customNameAggregate,
            },
          },
        ],
      },
    }),
  )

  expect(result).toEqual([
    { 'Initial Letters': 'A E K F C A' },
  ])
})
