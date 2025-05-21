import type { ICartesianSymlogAxisSpec } from '@visactor/vchart';
import { LinearAxisMixin, Factory, isZAxis, CartesianSymlogAxis } from '@visactor/vchart';
import { mixin } from '@visactor/vutils';
import { getUpdateAttributeOfZAxis } from './util';

export interface CartesianSymlogAxis3d<T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition'>,
    CartesianSymlogAxis<T> {}

export class CartesianSymlogAxis3d<
  T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec
> extends CartesianSymlogAxis<T> {
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

mixin(CartesianSymlogAxis3d, LinearAxisMixin);

export const registerCartesianSymlogAxis3d = () => {
  Factory.registerComponent(CartesianSymlogAxis.type, CartesianSymlogAxis3d, false);
};
