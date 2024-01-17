import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import { LayoutZIndex } from '../../constant';
import type { ILabelSpec } from './interface';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';
import { isEqual } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';

export abstract class BaseLabelComponent<T = any> extends BaseComponent<T> {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  layoutType: 'none' = 'none';
  layoutZIndex: number = LayoutZIndex.Label;

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._regions = options.getRegionsInIndex(options.regionIndexes);
  }

  protected _interactiveConfig(labelSpec: ILabelSpec) {
    const { interactive } = labelSpec;
    const result = { hover: false, select: false, state: labelSpec.state };
    if (interactive !== true) {
      return result;
    }

    const { hover, select } = this._option.getChart().getSpec();
    if (hover !== false || (hover as unknown as IHoverSpec).enable !== false) {
      result.hover = true;
    }
    if (select !== false || (select as unknown as ISelectSpec).enable !== false) {
      result.select = true;
    }
    return result;
  }

  /** Update API **/
  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    result.reRender = true;
    if (!isEqual(prevSpec, spec)) {
      result.reMake = true;
    }

    return result;
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }
  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [];
  }
}
