import type { CorrelationMatrixSpec } from '../../src/types';
export const names = ['A', 'B', 'C', 'D', '常量'];
export const coefficients = [
  [1, 0.5, -0.5, 0, null],
  [0.5, 1, 0, -0.5, null],
  [-0.5, 0, 1, 0.5, null],
  [0, -0.5, 0.5, 1, null],
  [null, null, null, null, null]
];
/** 四个独立二值观测变量的确定性组合；系数由库从这 16 条观测计算。 */
export const correlationExample: CorrelationMatrixSpec = {
  type: 'correlationMatrix',
  method: 'pearson',
  title: '相关矩阵',
  variables: names,
  data: {
    observations: Array.from({ length: 16 }, (_, i) => {
      const [x, y, z, w] = [0, 1, 2, 3].map(bit => ((i >> bit) & 1 ? 1 : -1));
      return { id: String(i), values: { A: x + y, B: x + z, C: -y + w, D: -z + w, 常量: 5 } };
    })
  }
};
/** 公共二值变量与不同 Walsh 列组合，生成有原始样本的稠密显示 fixture。 */
export function denseCorrelation(size: number): CorrelationMatrixSpec {
  const variables = Array.from({ length: size }, (_, i) => `变量${i + 1}`);
  const count = 2 ** Math.ceil(Math.log2(size + 2));
  return {
    type: 'correlationMatrix',
    method: 'pearson',
    variables,
    data: {
      observations: Array.from({ length: count }, (_, i) => ({
        id: String(i),
        values: Object.fromEntries(
          variables.map((v, j) => {
            let bits = i & (j + 2),
              parity = 0;
            while (bits) {
              parity ^= bits & 1;
              bits >>= 1;
            }
            return [v, (i & 1 ? 1 : -1) + (parity ? 1 : -1)];
          })
        )
      }))
    }
  };
}
