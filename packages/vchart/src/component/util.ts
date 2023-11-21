import { get } from '@visactor/vutils';
import type { IModelOption } from '../model/interface';

export function getComponentThemeFromOption(type: string, option: Partial<IModelOption>) {
  return get(option.getTheme(), `component.${type}`);
}
