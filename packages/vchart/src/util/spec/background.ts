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
  const { x, y, width, height, x1, y1, image, ...rest } = bg;
  rest.background = image;
  return rest;
}
