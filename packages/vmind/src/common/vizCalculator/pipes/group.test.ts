import type { GroupedData } from '../types';
import { of } from '../pipe';
import { mockSimpleTable } from '../mocks';
import { group } from './group';

test('group simple data', () => {
  const result1: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject']
    })
  );

  expect(result1).toEqual([
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
    },
    {
      by: {
        subject: 'System'
      },
      rows: [
        { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
        { name: 'Admin', subject: 'System', score: 1000, age: 300 }
      ]
    }
  ]);

  const result2: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject', 'score']
    })
  );

  expect(result2).toEqual([
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
        subject: 'Sword',
        score: 200
      },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
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
    }
  ]);
});

test('group without groupBy (aka group select)', () => {
  const result: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable
    })
  );

  expect(result).toEqual([
    {
      by: {},
      rows: [...mockSimpleTable]
    }
  ]);
});

test('group all columns', () => {
  const result1: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['age', 'subject', 'score', 'name']
    })
  );
  expect(result1).toEqual([
    {
      by: { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
      rows: [{ name: 'Alice', subject: 'Sword', score: 100, age: 11 }]
    },
    {
      by: { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
      rows: [{ name: 'Eugeo', subject: 'Sword', score: 100, age: 11 }]
    },
    {
      by: { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
    {
      by: { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },
      rows: [{ name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }]
    },
    {
      by: { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
      rows: [{ name: 'Cardinal', subject: 'System', score: 500, age: 200 }]
    },
    {
      by: { name: 'Admin', subject: 'System', score: 1000, age: 300 },
      rows: [{ name: 'Admin', subject: 'System', score: 1000, age: 300 }]
    }
  ]);

  const result2: GroupedData = of(mockSimpleTable).pipe(
    group({
      source: mockSimpleTable,
      groupBy: ['subject', 'score', 'name', 'age']
    })
  );
  expect(result2).toEqual([
    {
      by: { name: 'Alice', subject: 'Sword', score: 100, age: 11 },
      rows: [{ name: 'Alice', subject: 'Sword', score: 100, age: 11 }]
    },
    {
      by: { name: 'Eugeo', subject: 'Sword', score: 100, age: 11 },
      rows: [{ name: 'Eugeo', subject: 'Sword', score: 100, age: 11 }]
    },
    {
      by: { name: 'Fanatio', subject: 'Sword', score: 100, age: 20 },
      rows: [{ name: 'Fanatio', subject: 'Sword', score: 100, age: 20 }]
    },
    {
      by: { name: 'Kirito', subject: 'Sword', score: 200, age: 17 },
      rows: [{ name: 'Kirito', subject: 'Sword', score: 200, age: 17 }]
    },
    {
      by: { name: 'Cardinal', subject: 'System', score: 500, age: 200 },
      rows: [{ name: 'Cardinal', subject: 'System', score: 500, age: 200 }]
    },
    {
      by: { name: 'Admin', subject: 'System', score: 1000, age: 300 },
      rows: [{ name: 'Admin', subject: 'System', score: 1000, age: 300 }]
    }
  ]);
});
