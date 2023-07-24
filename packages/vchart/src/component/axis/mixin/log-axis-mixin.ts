import { isNil, isValid } from '../../../util';
import { LinearAxisMixin } from './linear-axis-mixin';

export class LogAxisMixin extends LinearAxisMixin {
  setScaleNice() {
    if (isNil(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.nice();
    } else if (isValid(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.niceMax();
    } else if (isNil(this._domain?.min) && isValid(this._domain?.max)) {
      this._nice && this._scale.niceMin();
    }
  }
}
