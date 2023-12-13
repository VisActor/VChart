import { mergeSpec } from '../../util';
import { BaseComponentSpecTransformer } from '../base';

export class TooltipSpecTransformer extends BaseComponentSpecTransformer<any> {
  protected _shouldMergeThemeToSpec() {
    return false;
  }

  protected _initTheme(spec: any, chartSpec: any): any {
    super._initTheme(spec, chartSpec);
    spec.style = mergeSpec({}, this._theme, spec.style);
    return spec;
  }
}
