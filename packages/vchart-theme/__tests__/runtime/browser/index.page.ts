/**
 * !important: 本地调试应该修改 local 文件内容
 */

import VChart, { ThemeManager } from '../../../../vchart/src';
import { defaultThemeName } from '../../../../vchart/src/theme';
import themeList from '../../../src/theme-list';

window['VChart'] = VChart;

// 注册所有主题
themeList.forEach((theme, name) => {
  ThemeManager.registerTheme(name, theme);
});
const themeOptions = [...ThemeManager.themes.keys()];

const params = new URLSearchParams(window.location.search);

// 应用默认主题
const defaultTheme = params.get('theme') || themeOptions[params.get('themeIndex') ?? -1] || defaultThemeName;
// eslint-disable-next-line no-console
console.log('当前主题：', defaultTheme, ThemeManager.getTheme(defaultTheme));
ThemeManager.setCurrentTheme(defaultTheme);

// 主题选择器
const selector = document.getElementById('themeSelector') as HTMLSelectElement;
selector.innerHTML = themeOptions
  .map(name => `<option value="${name}" ${name === defaultTheme ? 'selected' : ''}>${name}</option>`)
  .join('');
selector.addEventListener('change', function () {
  ThemeManager.setCurrentTheme(this.value);
  params.delete('themeIndex');
  params.set('theme', this.value);
  const newUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, document.title, newUrl);
});

import './index.page.local';
