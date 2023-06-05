import { LinearScale } from '@visactor/vgrammar-scale';

/**
 * scale的测试在底层库有较详细的测试用例
 * chartspace可以不做单测
 */
describe('linear', () => {
  it('basic function', () => {
    const scale = new LinearScale();
    scale.domain([0, 100]).range([0, 1000]);
    expect(scale.scale(50)).toBe(500);
  });

  it('nice', () => {
    const scale = new LinearScale();
    scale.domain([0, 92]).range([0, 1000]).nice();
    expect(scale.scale(50)).toBe(500);
  });
});
