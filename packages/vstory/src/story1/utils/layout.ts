import { ILayoutAttribute, IWidgetData } from '../role';

export function getLayoutFromWidget(w: Partial<IWidgetData>): Partial<ILayoutAttribute> {
  return {
    x: w.left,
    y: w.top,
    width: 'width' in w ? w.width : <number>w.right - <number>w.left,
    height: 'height' in w ? w.height : <number>w.bottom - <number>w.top
  };
}
