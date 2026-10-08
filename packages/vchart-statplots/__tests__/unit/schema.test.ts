import fs from 'fs';
import path from 'path';
import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import { StatPlotValidationError } from '../../src/errors';
const directory = path.resolve(__dirname, '../../examples/specs');
test('uses the new public type and rejects its legacy spelling', () => {
  const data = [{ category: 'A', count: 3 }];
  expect(validateStatPlot({ type: 'countPlot', data })).toEqual({ valid: true, errors: [] });
  expect(validateStatPlot({ type: 'count', data }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/type' })])
  );
});
const examples = fs
  .readdirSync(directory)
  .filter(file => file.endsWith('.json') && file !== 'index.json')
  .map(file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
function freeze(value: any): void {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}
test.each(examples)('$type accepts frozen caller-owned input', spec => {
  freeze(spec);
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  expect(() => compileStatPlot(spec)).not.toThrow();
  expect(compileStatPlot(spec).theme).toBe('light');
});
test.each(examples)('$type rejects unknown options and produces an explicit empty state', spec => {
  const invalid = validateStatPlot({ ...spec, xField: 'guessed' });
  expect(invalid.valid).toBe(false);
  expect(invalid.errors.some(e => e.path === '/xField')).toBe(true);
  const empty = {
    ...spec,
    data:
      spec.type === 'pairPlot'
        ? { observations: [], diagonal: spec.variables.map((variable: string) => ({ variable, bins: [] })) }
        : []
  };
  delete empty.metrics;
  delete empty.variableOrder;
  if (empty.fit) {
    empty.fit = { ...empty.fit, data: [] };
  }
  expect(validateStatPlot(empty)).toEqual({ valid: true, errors: [] });
  const compiled = compileStatPlot(empty) as any;
  expect(compiled.title.subtext).toContain('暂无可绘制数据');
});
test.each([NaN, Infinity, -Infinity])('rejects non-JSON number %s', value => {
  expect(validateStatPlot({ type: 'rocCurve', data: [{ fpr: value, tpr: 0.5 }] }).valid).toBe(false);
});
test('compile exposes structured validation errors and runtime validator needs no eval', () => {
  try {
    compileStatPlot({ type: 'rocCurve', data: [{ fpr: 2, tpr: 0.5 }] });
    throw new Error('missing error');
  } catch (error) {
    expect(error).toBeInstanceOf(StatPlotValidationError);
    expect((error as StatPlotValidationError).issues[0].path).toBe('/data/0/fpr');
  }
  const generated = fs.readFileSync(path.resolve(__dirname, '../../src/generated/validate.js'), 'utf8');
  expect(generated).not.toMatch(/\beval\s*\(|new Function\s*\(/);
  expect(fs.readdirSync(path.resolve(__dirname, '../../schema/plots')).filter(f => f.endsWith('.json'))).toHaveLength(
    28
  );
});
