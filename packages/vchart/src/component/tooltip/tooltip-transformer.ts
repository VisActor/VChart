import { mergeSpec } from '../../util';
import { BaseComponentSpecTransformer } from '../base';

export class TooltipSpecTransformer extends BaseComponentSpecTransformer<any> {
  protected _shouldMergeThemeToSpec() {
    return false;
  }

  protected _initTheme(spec: any, chartSpec: any): { spec: any; theme: any } {
    const { spec: newSpec, theme } = super._initTheme(spec, chartSpec);
    newSpec.style = mergeSpec({}, this._theme, newSpec.style);
    return { spec: newSpec, theme };
  }
}
