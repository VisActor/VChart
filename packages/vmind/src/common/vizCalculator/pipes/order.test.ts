import { type TableData, type GroupedData, AggregateType, OrderType } from '../types';
import { of } from '../pipe';
import { mockSimpleTable } from '../mocks';
import { group } from './group';
import { removeAggregateCache } from './aggregate';
import { order, orderGroup } from './order';

test('order table data', () => {
  const result1: TableData = of(mockSimpleTable).pipe(
    order({
      source: mockSimpleTable,
      orderBy: [{ column: 'name' }]
    })
  );
  expect(result1).toEqual([
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 }
  ]);

  const result2: TableData = of(mockSimpleTable).pipe(
    order({
      source: mockSimpleTable,
      orderBy: [{ column: 'score', type: OrderType.Desc }]
    })
  );
  expect(result2).toEqual([
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }
  ]);

  const result3: TableData = of(mockSimpleTable).pipe(
    order({
      source: mockSimpleTable,
      orderBy: [
        { column: 'score', type: OrderType.Desc },
        { column: 'subject' },
        { column: 'age', type: OrderType.Desc },
        { column: 'name', type: OrderType.Desc }
      ]
    })
  );
  expect(result3).toEqual([
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 }
  ]);
});

test('order grouped data without aggregate', () => {
  const result1: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject']
    }),
    orderGroup({
      source: mockSimpleTable,
      orderBy: [{ column: 'score', type: OrderType.Desc }]
    })
  );
  expect(result1).toEqual([
    {
      by: {
        subject: 'System'
      },
      rows: [
        { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
        { name: 'Admin', subject: 'System', score: 1000, age: 300 }
      ]
    },
    {
      by: {
        subject: 'Sword'
      },
      rows: [
        { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
        { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
        { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
        { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }
      ]
    }
  ]);

  const result2: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject', 'score']
    }),
    orderGroup({
      source: mockSimpleTable,
      orderBy: [
        { column: 'subject', type: OrderType.Asc },
        { column: 'score', type: OrderType.Desc }
      ]
    })
  );
  expect(result2).toEqual([
    {
      by: {
        subject: 'Sword',
        score: 200
      },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
    {
      by: {
        subject: 'Sword',
        score: 100
      },
      rows: [
        { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
        { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
        { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }
      ]
    },
    {
      by: {
        subject: 'System',
        score: 1000
      },
      rows: [{ name: 'Admin', subject: 'System', score: 1000, age: 300 }]
    },
    {
      by: {
        subject: 'System',
        score: 500
      },
      rows: [{ name: 'Cardinal', subject: 'System', score: 500, age: 200 }]
    }
  ]);
});

test('order grouped data with aggregate', () => {
  const result1: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject']
    }),
    orderGroup({
      source: mockSimpleTable,
      orderBy: [
        {
          column: 'score',
          type: OrderType.Desc,
          aggregate: {
            method: AggregateType.Sum
          }
        }
      ]
    }),
    removeAggregateCache
  );
  expect(result1).toEqual([
    {
      by: {
        subject: 'System'
      },
      rows: [
        { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
        { name: 'Admin', subject: 'System', score: 1000, age: 300 }
      ]
    },
    {
      by: {
        subject: 'Sword'
      },
      rows: [
        { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
        { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
        { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
        { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }
      ]
    }
  ]);

  const result2: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject', 'score']
    }),
    orderGroup({
      source: mockSimpleTable,
      orderBy: [
        { column: 'subject', type: OrderType.Desc },
        {
          column: 'age',
          aggregate: {
            method: AggregateType.Sum
          }
        }
      ]
    }),
    removeAggregateCache
  );
  expect(result2).toEqual([
    {
      by: {
        subject: 'System',
        score: 500
      },
      rows: [{ name: 'Cardinal', subject: 'System', score: 500, age: 200 }]
    },
    {
      by: {
        subject: 'System',
        score: 1000
      },
      rows: [{ name: 'Admin', subject: 'System', score: 1000, age: 300 }]
    },
    {
      by: {
        subject: 'Sword',
        score: 200
      },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
    {
      by: {
        subject: 'Sword',
        score: 100
      },
      rows: [
        { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
        { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
        { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }
      ]
    }
  ]);
});

test('order with manualList', () => {
  const result1: TableData = of(mockSimpleTable).pipe(
    order({
      source: mockSimpleTable,
      orderBy: [
        {
          column: 'name',
          type: OrderType.Manual,
          manualList: ['Kirito', 'Admin', 'Eugeo', 'Alice']
        }
      ]
    })
  );
  expect(result1).toEqual([
    { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
    { name: 'Admin', subject: 'System', score: 1000, age: 300 },
    { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
    { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
    { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },
    { name: 'Cardinal', subject: 'System', score: 500, age: 200 }
  ]);

  const result2: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['age']
    }),
    orderGroup({
      source: mockSimpleTable,
      orderBy: [
        {
          column: 'name',
          type: OrderType.Manual,
          manualList: ['Kirito', 'Eugeo', 'Fanatio', 'Admin']
        }
      ]
    }),
    removeAggregateCache
  );
  expect(result2).toEqual([
    {
      by: {
        age: 17
      },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
    {
      by: {
        age: 20
      },
      rows: [{ name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }]
    },
    {
      by: {
        age: 300
      },
      rows: [{ name: 'Admin', subject: 'System', score: 1000, age: 300 }]
    },
    {
      by: {
        age: 11
      },
      rows: [
        { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
        { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 }
      ]
    },
    {
      by: {
        age: 200
      },
      rows: [{ name: 'Cardinal', subject: 'System', score: 500, age: 200 }]
    }
  ]);
});
