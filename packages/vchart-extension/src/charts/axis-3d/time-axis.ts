import type { ICartesianTimeAxisSpec } from '@visactor/vchart';
import { LinearAxisMixin, CartesianTimeAxis, Factory, isZAxis } from '@visactor/vchart';
import { mixin } from '@visactor/vutils';
import { getUpdateAttributeOfZAxis } from './util';

export interface CartesianTimeAxis3d<T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition'>,
    CartesianTimeAxis<T> {}

export class CartesianTimeAxis3d<
  T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec
> extends CartesianTimeAxis<T> {
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

mixin(CartesianTimeAxis3d, LinearAxisMixin);

export const registerCartesianTimeAxis3d = () => {
  Factory.registerComponent(CartesianTimeAxis.type, CartesianTimeAxis3d, false);
};
