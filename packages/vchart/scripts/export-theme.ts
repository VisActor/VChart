/**
 * 导出全量 theme json
 */
import fs from 'fs';
import path from 'path';
import { themes } from '../src/theme/builtin';

const VCHART_PROJECT_ROOT = process.cwd();
const targetPath = `${VCHART_PROJECT_ROOT}/../../docs/assets/themes`;

const result: string[] = [];
themes.forEach((value, key) => {
  try {
    const fileName = path.resolve(targetPath, `${key}.json`);
    const themeJson = JSON.stringify(value);
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
    fs.writeFileSync(path.resolve(targetPath, `${key}.json`), themeJson);
    result.push(key);
  } catch {}
});

console.warn(`\x1B[33m
  主题 ${result.join(', ')} 已导出
\x1B[0m`);
