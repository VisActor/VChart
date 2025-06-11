import type { IAxis } from '@visactor/vchart';
import { isZAxis } from '@visactor/vchart';
import { getUpdateAttributeOfZAxis } from './util';

export class Axis3dMixin {
  layout3dBox?: { width: number; height: number; length: number };

  setLayout3dBox(box3d: { width: number; height: number; length: number }) {
    this.layout3dBox = box3d;
  }

  protected _afterUpdateAttribute(attrs: any, ignoreGrid: boolean) {
    const isZ = isZAxis((this as any)._orient);

    if (!isZ) {
      return attrs;
    }

    return getUpdateAttributeOfZAxis(this as unknown as IAxis, ignoreGrid);
  }
}
