import type { CorrelationMatrixSpec } from '../../src/types';

export const names = ['A', 'B', 'C', 'D', '常量'];
const coefficients = [
  [1, 0.5, -0.5, 0, null],
  [0.5, 1, 0, -0.5, null],
  [-0.5, 0, 1, 0.5, null],
  [0, -0.5, 0.5, 1, null],
  [null, null, null, null, null]
];
/** 合成 fixture 只验证显示语义，不代表从样本估计的相关矩阵。 */
export const correlationExample: CorrelationMatrixSpec = {
  type: 'correlationMatrix',
  method: 'pearson',
  title: '相关矩阵',
  data: names.flatMap((row, r) => names.map((column, c) => ({ row, column, correlation: coefficients[r][c] })))
};

/** 等相关矩阵；对角为 1，其他为 0.5，所有规模均为有效对称矩阵。 */
export function denseCorrelation(size: number): CorrelationMatrixSpec {
  const variables = Array.from({ length: size }, (_, i) => `变量${i + 1}`);
  return {
    type: 'correlationMatrix',
    method: 'pearson',
    data: variables.flatMap((row, r) => variables.map((column, c) => ({ row, column, correlation: r === c ? 1 : 0.5 })))
  };
}
