import fs from 'fs';
import path from 'path';
import { validateStatPlot } from '../src/validate';
import { compileStatPlot } from '../src/compile';
const directory = path.resolve(__dirname, '../examples/specs');
const files = fs.readdirSync(directory).filter(name => name.endsWith('.json') && name !== 'index.json');
for (const file of files) {
  const spec = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
  const result = validateStatPlot(spec);
  if (!result.valid) {
    throw new Error(`${file}: ${JSON.stringify(result.errors)}`);
  }
  compileStatPlot(spec);
}
// eslint-disable-next-line no-console
console.log(`${files.length} 份语义 spec 示例通过校验`);

const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'index.json'), 'utf8'));
for (const item of manifest.valid) {
  const spec = JSON.parse(fs.readFileSync(path.join(directory, item.file), 'utf8'));
  const result = validateStatPlot(spec);
  if (!result.valid) {
    throw new Error(`${item.file}: ${JSON.stringify(result.errors)}`);
  }
  compileStatPlot(spec);
}
for (const item of manifest.invalid) {
  const result = validateStatPlot(JSON.parse(fs.readFileSync(path.join(directory, item.file), 'utf8')));
  if (result.valid || !result.errors.some(error => error.path === item.path && error.code === item.code)) {
    throw new Error(`无效示例未按契约失败：${item.file}`);
  }
}

// eslint-disable-next-line no-console
console.log(`${manifest.valid.length} 份变体通过校验与编译，${manifest.invalid.length} 份反例按预期拒绝`);
