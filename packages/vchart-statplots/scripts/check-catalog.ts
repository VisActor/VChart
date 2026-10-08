import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { validateStatPlot } from '../src/validate';
import { compileStatPlot } from '../src/compile';
import type { StatPlotSpec } from '../src/types';

interface CatalogVariant {
  name: string;
  aliases: string[];
  options: Record<string, string | number | boolean>;
  example: string;
}
interface CatalogEntry {
  type: StatPlotSpec['type'];
  name: string;
  englishName: string;
  group: string;
  aliases: string[];
  useWhen: string;
  avoidWhen: string[];
  schema: string;
  example: string;
  variants: CatalogVariant[];
}
const root = path.resolve(__dirname, '..');
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const catalog: CatalogEntry[] = read('docs/plot-catalog.json');
const schemaTypes = fs
  .readdirSync(path.join(root, 'schema/plots'))
  .map(file => file.replace('.schema.json', ''))
  .sort();
assert.strictEqual(catalog.length, 28);
assert.deepStrictEqual(catalog.map(entry => entry.type).sort(), schemaTypes);
const byType = new Map(catalog.map(entry => [entry.type, entry]));
function checkExample(file: string, type: string, options: CatalogVariant['options'] = {}) {
  const spec = read(file);
  assert.strictEqual(spec.type, type, file);
  for (const [key, value] of Object.entries(options)) assert.strictEqual(spec[key], value, `${file}: ${key}`);
  const result = validateStatPlot(spec);
  assert(result.valid, `${file}: ${JSON.stringify(result.errors)}`);
  compileStatPlot(spec);
  return spec;
}
for (const entry of catalog) {
  assert(/[\u4e00-\u9fff]/.test(entry.name), entry.type);
  for (const text of [
    entry.name,
    entry.englishName,
    entry.group,
    entry.useWhen,
    ...entry.aliases,
    ...entry.avoidWhen
  ]) {
    assert(typeof text === 'string' && text.trim(), entry.type);
  }
  assert(entry.aliases.length && entry.avoidWhen.length, entry.type);
  const schema = read(entry.schema);
  const discriminator = schema.properties.type;
  assert.strictEqual(discriminator.const ?? discriminator.enum[0], entry.type);
  assert(fs.existsSync(path.join(root, `docs/plots/${entry.type}.md`)), entry.type);
  checkExample(entry.example, entry.type);
  for (const variant of entry.variants) {
    assert(variant.name && variant.aliases.length && Object.keys(variant.options).length, entry.type);
    checkExample(variant.example, entry.type, variant.options);
  }
}
const intents: {
  prompt: string;
  expected: { type: StatPlotSpec['type']; options: CatalogVariant['options'] } | null;
  reason?: string;
}[] = read('__tests__/fixtures/chart-intents.json');
for (const item of intents) {
  assert(item.prompt.trim());
  if (!item.expected) {
    assert(item.reason?.trim());
    continue;
  }
  const entry = byType.get(item.expected.type);
  assert(entry, item.prompt);
  const variants = [{ options: {}, example: entry.example }, ...entry.variants];
  const variant = variants.find(candidate =>
    Object.entries(item.expected!.options).every(([key, value]) => candidate.options[key] === value)
  );
  assert(variant, `${item.prompt}: 未声明的变体选项`);
  const spec = { ...read(variant.example), ...item.expected.options };
  assert(validateStatPlot(spec).valid, item.prompt);
}
for (const type of schemaTypes) {
  const matches = intents.filter(item => item.expected?.type === type);
  assert(
    matches.some(item => /[\u4e00-\u9fff]/.test(item.prompt)),
    type
  );
  assert(
    matches.some(item => !/[\u4e00-\u9fff]/.test(item.prompt)),
    type
  );
}
// eslint-disable-next-line no-console
console.log(`${catalog.length} 类目录、${intents.length} 条意图预期及全部变体与 Schema 一致（不是模型命中率评测）`);
