import type { IRichText, IRichTextAttribute } from '@visactor/vrender-core';
import { createRichText } from '@visactor/vrender-core';
import { Graphic } from './graphic';
import { IWidgetData } from '../../dsl-interface';
import { getLayoutFromWidget } from '../../../utils/layout';

export class GraphicRichText extends Graphic {
  protected _graphic: IRichText;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      maxWidth: 120,
      maxHeight: 80,
      angle: 0,
      fontSize: 16,
      textAlign: 'center',
      textBaseline: 'middle',
      fill: '#000000',
      lineWidth: 2,
      ignoreBuf: true,
      stroke: false,
      ellipsis: true,
      textConfig: []
    } as Partial<IRichTextAttribute>;
  }

  init() {
    if (!this._graphic) {
      this._graphic = createRichText(
        this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._role.spec.options?.graphic ?? {})
        })
      );
      this._graphic.name = `graphic-richtext-${this._role.id}`;
      this._role.getGraphicParent().add(this._graphic);
    }
  }

  applyLayoutData(w: Partial<IWidgetData>) {
    const { x, y, width, height, angle } = getLayoutFromWidget(w);
    this._graphic.setAttributes(
      this._transformAttributes({
        x,
        y,
        angle,
        maxWidth: width,
        maxHeight: height
      })
    );
  }
}
