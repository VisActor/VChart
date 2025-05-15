import type { ICartesianBandAxisSpec } from '@visactor/vchart';
import { BandAxisMixin, CartesianBandAxis, Factory, isZAxis } from '@visactor/vchart';
import { mixin } from '@visactor/vutils';
import { getUpdateAttributeOfZAxis } from './util';

export interface CartesianBandAxis3d<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec>
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    CartesianBandAxis<T> {}

export class CartesianBandAxis3d<
  T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec
> extends CartesianBandAxis<T> {
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

mixin(CartesianBandAxis3d, BandAxisMixin);

export const registerCartesianBandAxis3d = () => {
  Factory.registerComponent(CartesianBandAxis.type, CartesianBandAxis3d, false);
};
