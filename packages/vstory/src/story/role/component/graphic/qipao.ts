import type { ISymbol } from '@visactor/vrender-core';
import { createSymbol } from '@visactor/vrender-core';
import { Graphic } from './graphic';

export class GraphicQipao extends Graphic {
  protected _graphic: ISymbol;

  getInitialAttributes() {
    return {
      x: 0,
      y: 0,
      symbolType:
        'M649.6 812.8l-114.976 114.944a32 32 0 0 1-45.248 0L374.4 812.8H128a64 64 0 0 1-64-64V160a64 64 0 0 1 64-64h768a64 64 0 0 1 64 64v588.8a64 64 0 0 1-64 64h-246.4z',
      angle: 0,
      size: 40,
      lineWidth: 2,
      stroke: 'pink'
    };
  }

  init() {
    if (!this._graphic) {
      this._graphic = createSymbol({
        ...this._transformAttributes({
          ...this.getInitialAttributes(),
          ...(this._role.spec.options?.graphic ?? {})
        })
      });
      console.log(this._graphic);
      this._graphic.name = `graphic-qipao-${this._role.id}`;
      this._role.getGraphicParent().add(this._graphic);
    }
  }
}
