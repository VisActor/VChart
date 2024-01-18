import {
  leftJoin,
  innerJoin,
  crossJoin,
} from './join'
import { query } from './query'
import { mockSimpleTable } from './mocks'

/**
 * Join with using(`name`, `score`), each row is unique, no change in the result data.
 */
test('simple left join with two same tables', () => {
  const result = leftJoin({
    left: mockSimpleTable,
    right: mockSimpleTable,
    using: ['name', 'score'],
  })

  expect(result).toEqual(mockSimpleTable)
})

/**
 * Join with using(`score`), score: 100 data is repeated three times, resulting in 1-to-3 relationship for each row.
 * In the irrelevant fields of each result, the right table overrides the left table.
 */
test('simple left join with one-to-many (1:3)', () => {
  const result = leftJoin({
    left: mockSimpleTable,
    right: mockSimpleTable,
    using: ['score'],
  })

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },


    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },

    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },


    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },

    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },

    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
  ])
})


/**
 * Join with using(`score`, 'age'), (score: 100, age: 11) data is repeated twice,
 * resulting in 1-to-2 relationship for each row.
 */
 test('left join with one-to-many (1:2)', () => {
  const result = leftJoin({
    left: mockSimpleTable,
    right: mockSimpleTable,
    using: ['score', 'age'],
  })

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },


    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },

    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },

    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },

    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },

    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
  ])
})


test('cross join with N x N', () => {
  const result = crossJoin({
    left: mockSimpleTable,
    right: query({
      from: mockSimpleTable,
      select: {
        columns: [
          { column: 'name', alias: 'B.name' },
          { column: 'subject', alias: 'B.subject' },
        ],
      },
      limit: 3,
    }),
  })

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11, 'B.name': 'Kirito', 'B.subject': 'Sword' },

    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11, 'B.name': 'Kirito', 'B.subject': 'Sword' },

    { name: 'Kirito', subject: 'Sword', score: 200, age: 17, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17, 'B.name': 'Kirito', 'B.subject': 'Sword' },

    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20, 'B.name': 'Kirito', 'B.subject': 'Sword' },

    { name: 'Cardinal', subject: 'System', score: 500, age: 200, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200, 'B.name': 'Kirito', 'B.subject': 'Sword' },

    { name: 'Admin', subject: 'System', score: 1000, age: 300, 'B.name': 'Alice', 'B.subject': 'Sword' },
    { name: 'Admin', subject: 'System', score: 1000, age: 300, 'B.name': 'Eugeo', 'B.subject': 'Sword' },
    { name: 'Admin', subject: 'System', score: 1000, age: 300, 'B.name': 'Kirito', 'B.subject': 'Sword' },
  ])
})


test('inner join with N x N', () => {
  const result = innerJoin({
    left: mockSimpleTable,
    right: query({
      from: mockSimpleTable,
      select: {
        columns: [
          { column: 'name', alias: 'B.name' },
          { column: 'score', alias: 'B.score' },
          { column: 'score' },
        ],
      },
      limit: 3,
    }),
    using: ['score'],
  })

  expect(result).toEqual([
    { name: 'Alice', subject: 'Sword', score: 100, age: 11, 'B.name': 'Alice', 'B.score': 100 },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11, 'B.name': 'Eugeo', 'B.score': 100 },

    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11, 'B.name': 'Alice', 'B.score': 100 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11, 'B.name': 'Eugeo', 'B.score': 100 },

    { name: 'Kirito', subject: 'Sword', score: 200, age: 17, 'B.name': 'Kirito', 'B.score': 200 },

    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20, 'B.name': 'Alice', 'B.score': 100 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20, 'B.name': 'Eugeo', 'B.score': 100 },
  ])
})
