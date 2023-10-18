import type { IModelOption } from '../model/interface';
import { getThemeFromOption } from '../theme/util';
import type { ComponentTypeEnum } from './interface';
import type { IComponentTheme } from './interface/theme';

export function getComponentThemeFromOption(
  type: keyof IComponentTheme | ComponentTypeEnum,
  option: Partial<IModelOption>
) {
  return getThemeFromOption(`component.${type}`, option);
}
