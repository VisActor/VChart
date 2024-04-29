import type { IRect } from '@visactor/vrender-core';
import { createRect } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { Graphic } from './graphic';

export class GraphicRect extends Graphic {
  protected _graphic: IRect;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      angle: 0,
      anchor: [60, 40],
      lineWidth: 2,
      stroke: '#000000',
      shapePoints: [] as IPointLike[]
    };
  }

  init() {
    if (!this._graphic) {
      this._graphic = createRect(
        this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._character.spec.options?.graphic ?? {})
        })
      );
      this._graphic.name = `graphic-rect-${this._character.id}`;
      this._character.getGraphicParent().add(this._graphic);
    }
  }
}
