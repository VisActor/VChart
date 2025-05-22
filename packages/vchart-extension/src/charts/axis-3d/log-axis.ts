import type { ICartesianLogAxisSpec } from '@visactor/vchart';
import { LinearAxisMixin, CartesianLogAxis, Factory, isZAxis } from '@visactor/vchart';
import { mixin } from '@visactor/vutils';
import { getUpdateAttributeOfZAxis } from './util';
import { axisZ } from './theme';

export interface CartesianLogAxis3d<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition'>,
    CartesianLogAxis<T> {}

export class CartesianLogAxis3d<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec> extends CartesianLogAxis<T> {
  static readonly builtInTheme = {
    ...CartesianLogAxis.builtInTheme,
    axisZ: {
      ...CartesianLogAxis.builtInTheme.axisX,
      ...axisZ
    }
  };

  layout3dBox?: { width: number; height: number; length: number };

  setLayout3dBox(box3d: { width: number; height: number; length: number }) {
    this.layout3dBox = box3d;
  }

  protected _getUpdateAttribute(ignoreGrid: boolean) {
    const isZ = isZAxis(this._orient);

    if (!isZ) {
      return super._getUpdateAttribute(ignoreGrid);
    }

    return getUpdateAttributeOfZAxis(this, ignoreGrid);
  }
}

mixin(CartesianLogAxis3d, LinearAxisMixin);

export const registerCartesianLogAxis3d = () => {
  Factory.registerComponent(CartesianLogAxis.type, CartesianLogAxis3d, false);
};
