import {
  OrderType,
  AggregateType,
} from './types'
import { query } from './query'
import { mockSimpleTable } from './mocks'


test('query with empty data', () => {
  const result = query({
    from: [],
    select: {
      columns: [{ column: 'subject' }],
    },
    limit: 10,
  })

  expect(result).toEqual([])
})


test('query with simple select', () => {
  const result = query({
    from: mockSimpleTable,
    select: {
      columns: [{ column: 'subject' }],
    },
    orderBy: [{ column: 'score', type: OrderType.Desc }],
    limit: 3,
  })

  expect(result).toEqual([
    { subject: 'System' },
    { subject: 'System' },
    { subject: 'Sword' },
  ])
})

test('query with only select aggregate', () => {
  const result = query({
    from: mockSimpleTable,
    select: {
      columns: [
        { column: 'subject' },
        { column: 'subject', aggregate: { method: AggregateType.Count } },
        {
          column: 'subject',
          aggregate: { method: AggregateType.Count, distinct: true },
        },
      ],
    },
    limit: 3,
  })

  expect(result).toEqual([{
    subject: 'Sword',
    'Count(subject)': 6,
    'Count(distinct subject)': 2,
  }])
})

