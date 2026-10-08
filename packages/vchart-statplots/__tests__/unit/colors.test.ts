import fs from 'fs';
import path from 'path';
import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';

const count = { type: 'countPlot' as const, data: [{ category: 'A', count: 1 }] };
const colors = {
  categorical: ['#123456', '#abcdef'],
  sequential: ['#000000', '#ffffff'],
  diverging: ['#0000ff', '#ffffff', '#ff0000']
};

test('defaults use colorblind and native categorical colors remain available', () => {
  expect(compileStatPlot(count).color).toEqual([
    '#0173B2',
    '#DE8F05',
    '#029E73',
    '#D55E00',
    '#CC78BC',
    '#CA9161',
    '#FBAFE4',
    '#949494',
    '#ECE133',
    '#56B4E9'
  ]);
  expect(compileStatPlot({ ...count, colors: { categorical: 'vchart' } }).color).toBeUndefined();
  expect(compileStatPlot({ ...count, colors: { categorical: 'deep' } }).color).toEqual(
    expect.arrayContaining(['#4C72B0', '#DD8452'])
  );
});

test.each([
  { categorical: [] },
  { sequential: ['#123456'] },
  { diverging: ['#123456', '#abcdef'] },
  { categorical: 'unknown' },
  { sequential: 'deep' },
  { diverging: 'viridis' },
  { categorical: ['red'] },
  { sequential: ['#000000', 'var(--color)'] },
  { categorical: ['#12345G'] },
  { categorical: ['#00000080'] },
  { category: 'deep' },
  { categorical: [123] },
  { categorical: [null] },
  { sequential: ['#000000', {}] }
])('rejects invalid shared colors %j at the public boundary', colors => {
  const result = validateStatPlot({ ...count, colors });
  expect(result.valid).toBe(false);
  expect(result.errors.some(error => error.path.startsWith('/colors'))).toBe(true);
  expect(() => compileStatPlot({ ...count, colors } as any)).toThrow();
});

const directory = path.resolve(__dirname, '../../examples/specs');
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
test.each(examples)('$type accepts a shared custom palette without mutating caller data', example => {
  const spec = { ...example, colors };
  freeze(spec);
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  const chart = compileStatPlot(spec);
  expect(chart.color).toEqual(colors.categorical);
  expect(chart.color).not.toBe(colors.categorical);
});

test('continuous scales preserve every stop, direction, center and input independence', () => {
  const example = examples.find(spec => spec.type === 'correlationMatrix');
  const chart = compileStatPlot({ ...example, colors });
  const scale = chart.scales!.find(scale => scale.id === 'correlation')!;
  expect(scale.domain).toEqual([-1, 0, 1]);
  expect(scale.range).toEqual(colors.diverging);
  expect(scale.range).not.toBe(colors.diverging);
  const intensity = compileStatPlot(examples.find(spec => spec.type === 'confusionMatrix')).scales![0];
  expect(intensity.domain).toHaveLength(256);
  expect(intensity.range).toHaveLength(256);
  expect((intensity.range as string[])[0]).toBe('#440154');
  expect((intensity.range as string[])[255]).toBe('#FDE725');
  const diverging = compileStatPlot(example).scales![0].range as string[];
  expect([diverging[0], diverging[5], diverging[10]]).toEqual(['#053061', '#F7F7F7', '#67001F']);
  const cividis = compileStatPlot({
    ...examples.find(spec => spec.type === 'hexbinPlot'),
    colors: { sequential: 'cividis' }
  }).scales![0].range as string[];
  expect([cividis[0], cividis[255]]).toEqual(['#00224E', '#FEE838']);
});
