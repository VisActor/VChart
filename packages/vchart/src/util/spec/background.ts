import { pickWithout } from '@visactor/vutils';
import type { IBackgroundSpec, IBackgroundStyleSpec } from '../../typings';

export function convertBackgroundSpec(
  bg: IBackgroundSpec
): Omit<IBackgroundStyleSpec, 'image'> & { background?: IBackgroundStyleSpec['image'] } {
  if (!bg) {
    return null;
  }
  if (typeof bg === 'string') {
    return {
      fill: bg,
      fillOpacity: 1
    };
  }
  if (typeof bg !== 'object') {
    return null;
  }
  const result = pickWithout(bg, ['x', 'y', 'width', 'height', 'x1', 'y1', 'image']);
  result.background = bg.image;
  return result;
}
