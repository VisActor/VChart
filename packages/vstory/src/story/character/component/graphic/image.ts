import type { IImage } from '@visactor/vrender-core';
import { createImage } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { Graphic } from './graphic';

export class GraphicImage extends Graphic {
  protected _graphic: IImage;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      image: '',
      angle: 0,
      anchor: [60, 40],
      shapePoints: [] as IPointLike[]
    };
  }

  init() {
    if (!this._graphic) {
      this._graphic = createImage(
        this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._character.spec.options?.graphic ?? {})
        })
      );
      this._graphic.name = `graphic-image-${this._character.id}`;
      this._character.getGraphicParent().add(this._graphic);
    }
  }
}
