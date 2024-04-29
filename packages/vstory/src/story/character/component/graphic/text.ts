import type { IText } from '@visactor/vrender-core';
import { createText } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { Graphic } from './graphic';
import { IWidgetData } from '../../dsl-interface';
import { getLayoutFromWidget } from '../../../utils/layout';

export class GraphicPureText extends Graphic {
  protected _graphic: IText;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      angle: 0,
      fontSize: 16,
      textAlign: 'center',
      textBaseline: 'middle',
      fill: '#000000',
      lineWidth: 2,
      ignoreBuf: true,
      stroke: false,
      shapePoints: [] as IPointLike[]
    };
  }

  init() {
    if (!this._graphic) {
      this._graphic = createText(
        this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._character.spec.options?.graphic ?? {})
        })
      );
      this._graphic.name = `graphic-text-${this._character.id}`;
      this._character.getGraphicParent().add(this._graphic);
    }
  }

  applyLayoutData(w: Partial<IWidgetData>) {
    const { x, y, width, height, angle } = getLayoutFromWidget(w);
    this._graphic.setAttributes(
      this._transformAttributes({
        x,
        y,
        angle,
        maxLineWidth: width,
        heightLimit: height
      })
    );
  }
}
