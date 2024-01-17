import type { TableData } from '../types';
import { of } from '../pipe';
import { distinct } from './distinct';

const mockRepeatedData: TableData = [
  { A: 114, B: 514, C: 1919 },
  { A: 1551, B: 6655, C: null },
  { A: 5, B: 5, C: 5 },

  { A: 114, B: 514, C: 1919 },
  { A: 5, B: 5, C: 5 },
  { A: 1551, B: 6655, C: null }
];

const mockUniqueData: TableData = [
  { A: 114, B: 514, C: 1919 },
  { A: 5, B: 5, C: 5 },
  { A: 1551, B: 6655, C: null }
];

test('distinct with repeated data', () => {
  const result: TableData = of(mockRepeatedData).pipe(
    distinct({
      select: {
        distinct: true,
        columns: [{ column: 'A' }, { column: 'B' }, { column: 'C' }]
      }
    })
  );

  expect(result).toEqual([
    { A: 114, B: 514, C: 1919 },
    { A: 1551, B: 6655, C: null },
    { A: 5, B: 5, C: 5 }
  ]);
});

test('distinct with unique data', () => {
  const result: TableData = of(mockUniqueData).pipe(
    distinct({
      select: {
        distinct: true,
        columns: [{ column: 'A' }, { column: 'B' }, { column: 'C' }]
      }
    })
  );

  expect(result).toEqual([
    { A: 114, B: 514, C: 1919 },
    { A: 5, B: 5, C: 5 },
    { A: 1551, B: 6655, C: null }
  ]);
});

test('repeated data with out distinct', () => {
  const result: TableData = of(mockRepeatedData).pipe(
    distinct({
      select: {
        columns: [{ column: 'A' }, { column: 'B' }, { column: 'C' }]
      }
    })
  );

  // same as origin `mockRepeatedData`
  expect(result).toEqual([
    { A: 114, B: 514, C: 1919 },
    { A: 1551, B: 6655, C: null },
    { A: 5, B: 5, C: 5 },
    { A: 114, B: 514, C: 1919 },
    { A: 5, B: 5, C: 5 },
    { A: 1551, B: 6655, C: null }
  ]);
});
