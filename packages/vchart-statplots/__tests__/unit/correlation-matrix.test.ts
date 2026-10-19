import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { CorrelationMatrixSpec } from '../../src/types';
import { names, coefficients, correlationExample as example } from '../fixtures/correlation-matrix';

describe('correlation matrix display semantics', () => {
  it.each(['full', 'lower', 'upper'] as const)(
    '%s preserves coefficients, null and the full ordered domain',
    triangle => {
      const spec = { ...example, triangle, variables: names.slice().reverse() };
      const before = JSON.stringify(spec);
      expect(validateStatPlot(spec).valid).toBe(true);
      const native = compileStatPlot(spec);
      const rows = native.series!.flatMap(series => (series as any).data.values);
      expect(rows).toHaveLength(triangle === 'full' ? 25 : 15);
      expect(native.axes!.map(axis => (axis as any).domain)).toEqual([spec.variables, spec.variables]);
      for (const row of rows) {
        expect(row.correlation).toBe(coefficients[names.indexOf(row.row)][names.indexOf(row.column)]);
        const r = spec.variables.indexOf(row.row);
        const c = spec.variables.indexOf(row.column);
        if (triangle === 'lower') expect(r).toBeGreaterThanOrEqual(c);
        if (triangle === 'upper') expect(r).toBeLessThanOrEqual(c);
      }
      expect(rows.filter(row => row.row === row.column)).toHaveLength(5);
      expect(rows.find(row => row.row === '常量' && row.column === '常量').correlation).toBeNull();
      expect(JSON.stringify(spec)).toBe(before);
    }
  );

  it.each(['pearson', 'spearman', 'kendall'] as const)(
    '%s retains method metadata and a fixed color domain',
    method => {
      const native = compileStatPlot({ ...example, method });
      const rows = native.series!.flatMap(series => (series as any).data.values);
      expect(rows.every(row => row.method === method)).toBe(true);
      const domain = native.scales![0].domain as number[];
      expect([domain[0], domain[(domain.length - 1) / 2], domain[domain.length - 1]]).toEqual([-1, 0, 1]);
    }
  );

  it('does not reinterpret an all-null matrix as zero or empty', () => {
    const spec: CorrelationMatrixSpec = {
      ...example,
      data: {
        observations: example.data.observations.map(row => ({
          ...row,
          values: Object.fromEntries(names.map(name => [name, null]))
        }))
      }
    };
    expect(validateStatPlot(spec).valid).toBe(true);
    const native = compileStatPlot(spec);
    expect((native.series![0] as any).data.values).toHaveLength(0);
    expect((native.series![1] as any).data.values).toHaveLength(25);
    expect(native.customMark).toHaveLength(1);
    expect(native.title!.subtext ?? '').not.toContain('暂无可绘制数据');
  });

  it('empty data keeps the empty-state message without a colorbar', () => {
    const native = compileStatPlot({ ...example, data: { observations: [] } });
    expect(native.customMark).toBeUndefined();
    expect(native.title!.subtext).toContain('暂无可绘制数据');
  });

  it('the colorbar uses the same custom palette stops as the cell scale without mutating colors', () => {
    const colors = ['#0000ff', '#ffffff', '#ff0000'];
    const native = compileStatPlot({ ...example, colors: { diverging: colors } });
    const rail = (native.customMark![0] as any).children.find((mark: any) => mark.name === 'correlation-colorbar-rail');
    expect(rail.style.fill.stops).toEqual([
      { offset: 0, color: '#0000ff' },
      { offset: 0.5, color: '#ffffff' },
      { offset: 1, color: '#ff0000' }
    ]);
    expect(native.scales![0].range).toEqual(colors);
    expect(native.scales![0].range).not.toBe(colors);
    expect(colors).toEqual(['#0000ff', '#ffffff', '#ff0000']);
  });
});
