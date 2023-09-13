import type { ILayoutItem } from '@visactor/vchart';
import type { ILayoutAttribute } from './../../typings/space';
import type { IEditorElement } from './../../core/interface';
import type { EditorChart } from './chart';
import { EditorLayer } from '../../core/editor-layer';
import { LayoutRectToRect } from '../../utils/space';
import { getAxisLayoutInRegionRect, transformModelRect } from './utils/layout';
export class ChartLayer extends EditorLayer {
  type: string = 'chart';

  protected _onEvent(e: Event) {
    super._onEvent(e);
    if (e.target === this._stage) {
      return;
    }
    if (this._isInActive) {
      this._activeElement = null;
      // @ts-ignore
      const point = { x: e.x, y: e.y };
      const chart = this._elements[0] as EditorChart;
      const layoutMeta = chart.layout.getOverModel(point);
      if (!layoutMeta) {
        return;
      }
      const items = chart.vchart.getChart().getAllRegions().concat(chart.vchart.getChart().getAllComponents());
      const model = items.find((item: any) => item.userId === layoutMeta.id);

      if (model.type.includes('Axis')) {
        return;
      }

      this._activeElement = {
        type: 'chart',
        layer: this,
        id: layoutMeta.id,
        rect: transformModelRect(model, LayoutRectToRect(layoutMeta.layout)),
        part: model.type,
        editProperties: {
          move: true,
          rotate: false,
          resize: false
        },
        updateAttribute: attr => {
          if (attr.layout) {
            const layoutData = attr.layout as Partial<ILayoutAttribute>;
            chart.layout.setModelLayoutData({
              id: layoutMeta.id,
              layout: {
                x: { offset: layoutData.x as number },
                y: { offset: layoutData.y as number },
                width: { offset: layoutData.width as number },
                height: { offset: layoutData.height as number }
              }
            });
            if (model.type === 'region' && model.coordinate === 'cartesian') {
              const axes = items.filter(
                (_i: ILayoutItem) =>
                  _i.layoutBindRegionID && _i.layoutBindRegionID[0] === model.id && _i.type.includes('Axis')
              );
              axes.forEach((_a: ILayoutItem) => {
                chart.layout.setModelLayoutData({
                  id: _a.userId,
                  layout: getAxisLayoutInRegionRect(_a, { ..._a.getLayoutRect(), ...layoutData })
                });
              });
            }
            chart.vchart.getChart().setLayoutTag(true);
          }
          return false;
        }
      } as IEditorElement;
    }
  }

  release(): void {
    super.release();
  }
}
