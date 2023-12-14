import { BaseModelSpecTransformer } from '../model/spec-transformer';
import { cloneDeepSpec } from '../util';
import type { IRegionSpec } from './interface';

export class RegionSpecTransformer<T extends IRegionSpec = IRegionSpec> extends BaseModelSpecTransformer<T> {
  protected _initTheme(spec: T, chartSpec: any): { spec: T; theme: any } {
    // do nothing, region don't need to parse theme
    return {
      spec,
      theme: this._theme
    };
  }
}
