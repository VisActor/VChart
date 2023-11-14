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
    const theme = getTheme(key);
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

// 自动更新 readme
const readmePath = path.resolve(VCHART_PROJECT_ROOT, './../vchart-theme/README.md');
const readme = fs.readFileSync(readmePath, 'utf8');
const startTag = '<!-- ThemeListBegin -->';
const endTag = '<!-- ThemeListEnd -->';
const readmeThemeListStart = readme.indexOf(startTag) + startTag.length;
const readmeThemeListEnd = readme.indexOf(endTag);
const newReadme = `${readme.slice(0, readmeThemeListStart)}\n<!-- 以下为自动生成 -->\n${[...allThemeMap.keys()]
  .map(
    key =>
      `- [${key}](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/${key}.json) ${
        allThemeMap.get(key)?.description ?? ''
      }`
  )
  .join('\n')}\n<!-- 以上为自动生成 -->\n${readme.slice(readmeThemeListEnd)}`;
fs.writeFileSync(readmePath, newReadme);

console.warn(`\x1B[33m
  主题 ${result.join(', ')} 已导出
\x1B[0m`);
