/**
 * 导出全量 theme json
 */
import fs from 'fs';
import path from 'path';
import { getTheme, registerTheme, themeExist, themes } from '../src/theme/builtin';
import { allThemeMap } from '../../vchart-theme/src';

const VCHART_PROJECT_ROOT = process.cwd();
const targetPaths = [
  path.resolve(VCHART_PROJECT_ROOT, './../vchart-theme/public'),
  path.resolve(VCHART_PROJECT_ROOT, './../../docs/assets/themes')
];

const result: string[] = [];
[themes, allThemeMap].forEach(themeMap =>
  themeMap.forEach((value, key) => {
    let success = true;
    if (!themeExist(key)) {
      registerTheme(key, value);
    }
    const theme = getTheme(value);
    const themeJson = JSON.stringify(theme);
    targetPaths.forEach(targetPath => {
      //try {
      const fileName = path.resolve(targetPath, `${key}.json`);
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
      }
      fs.writeFileSync(path.resolve(targetPath, `${key}.json`), themeJson);
      //} catch {
      //  success = false;
      //}
    });
    if (success) {
      result.push(key);
    }
  })
);

console.warn(`\x1B[33m
  主题 ${result.join(', ')} 已导出
\x1B[0m`);
