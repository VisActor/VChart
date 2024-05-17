import type { ILine, ILineGraphicAttribute } from '@visactor/vrender-core';
import { createLine } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { Graphic } from './graphic';

export class GraphicLine extends Graphic {
  protected _graphic: ILine;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      points: [] as ILineGraphicAttribute['points'],
      angle: 0,
      lineWidth: 2,
      stroke: '#000000',
      shapePoints: [] as IPointLike[]
    };
  }

  init() {
    if (!this._graphic) {
      this._graphic = createLine(
        this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._character.spec.options?.graphic ?? {})
        })
      );
      this._graphic.name = `graphic-line-${this._character.id}`;
      this._character.getGraphicParent().add(this._graphic);
    }
  }
}
