import { Direction } from '../../../typings';
import { BaseComponentSpecTransformer } from '../../base';
import type { ICartesianAxisCommonSpec } from './interface';
import { transformInverse } from './util';

export class CartesianAxisSpecTransformer<
  T extends ICartesianAxisCommonSpec = ICartesianAxisCommonSpec
> extends BaseComponentSpecTransformer<T> {
  protected _transformSpec(spec: T, chartSpec: any) {
    // change spec by default logic
    spec.inverse = transformInverse(spec, chartSpec.direction === Direction.horizontal);
  }
}
