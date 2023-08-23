import { BaseComponent } from '../base';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import { LayoutZIndex } from '../../constant';
import type { ILabelSpec } from './interface';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';

export abstract class BaseLabelComponent extends BaseComponent {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Label;

  constructor(spec: ILabelSpec, options: IComponentOption) {
    super(spec, options);
    this._regions = options.getRegionsInIndex([options.specIndex]);
    this.layoutBindRegionID = this._regions.map(x => x.id);
  }

  protected _interactiveConfig(labelSpec: ILabelSpec) {
    const { interactive } = labelSpec;
    if (interactive !== true) {
      return { hover: false, select: false };
    }
    const result = { hover: false, select: false, state: labelSpec.state };

    const { hover, select } = this._option.getChart().getSpec();
    if (hover !== false || (hover as unknown as IHoverSpec).enable !== false) {
      result.hover = true;
    }
    if (select !== false || (select as unknown as ISelectSpec).enable !== false) {
      result.select = true;
    }
    return result;
  }

  setLayoutStartPosition() {
    // do nothing
  }

  /** Update API **/
  updateSpec(spec: any) {
    const result = super.updateSpec(spec);
    result.reRender = true;
    result.reMake = true;
    return result;
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  clear(): void {
    super.clear();

    this._marks.forEach(mark => {
      if (mark.getProduct()) {
        mark.getProduct().release();
      }
    });
  }
}
