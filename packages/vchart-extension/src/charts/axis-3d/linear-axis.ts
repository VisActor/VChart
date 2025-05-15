import type { ICartesianLinearAxisSpec } from '@visactor/vchart';
import { LinearAxisMixin, CartesianLinearAxis, Factory, isZAxis } from '@visactor/vchart';
import { mixin } from '@visactor/vutils';
import { getUpdateAttributeOfZAxis } from './util';

export interface CartesianLinearAxis3d<T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      | 'setExtraAttrFromSpec'
      | 'computeLinearDomain'
      | 'valueToPosition'
      | 'setScaleNice'
      | '_domain'
      | 'transformScaleDomain'
      | 'setExtendDomain'
      | '_break'
    >,
    CartesianLinearAxis<T> {}

export class CartesianLinearAxis3d<
  T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec
> extends CartesianLinearAxis<T> {
  layout3dBox?: { width: number; height: number; length: number };

  setLayout3dBox(box3d: { width: number; height: number; length: number }) {
    this.layout3dBox = box3d;
  }

  protected _getUpdateAttribute(ignoreGrid: boolean) {
    const isZ = isZAxis(this._orient);

    if (!isZ) {
      const attrs = super._getUpdateAttribute(ignoreGrid);

      if (!ignoreGrid) {
        attrs.grid.depth = this.layout3dBox ? this.layout3dBox.length : 0;
      }

      return attrs;
    }

    return getUpdateAttributeOfZAxis(this, ignoreGrid);
  }
}

mixin(CartesianLinearAxis3d, LinearAxisMixin);

export const registerCartesianLinearAxis3d = () => {
  Factory.registerComponent(CartesianLinearAxis.type, CartesianLinearAxis3d, false);
};
