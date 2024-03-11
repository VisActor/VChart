import { get } from '@visactor/vutils';
import type { ITheme } from '../theme';
import type { Datum } from '../typings';
import { Factory } from '../core/factory';

export function getComponentThemeFromOption(type: string, chartTheme: ITheme) {
  return get(chartTheme, `component.${type}`);
}

export function getFormatFunction(
  formatMethod?: any,
  formatter?: string | string[],
  text?: string | number,
  datum?: Datum
) {
  if (formatMethod) {
    return { formatFunc: formatMethod, args: [text, datum] };
  }
  const formatterImpl = Factory.getFormatter();
  if (formatter && formatterImpl) {
    return { formatFunc: formatterImpl, args: [text, datum, formatter] };
  }
  return {};
}
