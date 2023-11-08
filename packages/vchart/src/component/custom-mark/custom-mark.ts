import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IComponentOption } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import { LayoutLevel, LayoutZIndex, PREFIX } from '../../constant';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec } from '../../typings';
import type { IGroupMark } from '../../mark/group';
import type { MarkTypeEnum } from '../../mark/interface';
import { isEqual, isNil, isValid, isValidNumber } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import { ImageMark } from '../../mark/image';
import type { IGraphic } from '@visactor/vrender-core';

export class CustomMark extends BaseComponent<any> {
  static type = ComponentTypeEnum.customMark;
  type = ComponentTypeEnum.customMark;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.CustomMark;
  layoutLevel: number = LayoutLevel.CustomMark;

  protected declare _spec: (ICustomMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | ICustomMarkGroupSpec)[];

  static createComponent(spec: any, options: IComponentOption) {
    const customMarkSpec = spec.customMark;
    if (!customMarkSpec) {
      return null;
    }
    return [new CustomMark(customMarkSpec, { ...options, specIndex: 0 })];
  }

  created() {
    super.created();
    this.initMarks();
    this.initEvent();
  }

  protected initMarks() {
    if (!this._spec) {
      return;
    }
    this._spec.forEach((m, i) => {
      this._createExtensionMark(m, null, `${PREFIX}_series_${this.id}_extensionMark`, i);
    });
  }

  private _createExtensionMark(
    spec: ICustomMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | ICustomMarkGroupSpec,
    parentMark: null | IGroupMark,
    namePrefix: string,
    index: number
  ) {
    const mark = this._createMark(
      {
        type: spec.type,
        name: `${PREFIX}_${index}`
      },
      {
        attributeContext: this._getMarkAttributeContext()
      }
    ) as IGroupMark;
    if (!mark) {
      return;
    }
    if (isNil(parentMark)) {
      this._marks.addMark(mark);
    } else if (parentMark) {
      parentMark.addMark(mark);
    }
    // set style
    this.initMarkStyleWithSpec(mark, spec);
    if (spec.type === 'group') {
      namePrefix = `${namePrefix}_${index}`;
      spec.children?.forEach((s, i) => {
        this._createExtensionMark(s as any, mark, namePrefix, i);
      });
    }

    if (isValid(spec.dataId) || isValidNumber(spec.dataIndex)) {
      const dataview = this.getChart().getSeriesData(spec.dataId, spec.dataIndex);
      if (dataview) {
        dataview.target.addListener('change', () => {
          mark.getData().updateData();
        });
        mark.setDataView(dataview);
      }
    }
  }

  initEvent() {
    // do nothing
  }

  /**
   * updateSpec
   */
  _compareSpec() {
    const result = super._compareSpec();
    if (!isEqual(this._originalSpec, this._spec)) {
      result.reMake = true;
    }

    result.change = true;
    result.reRender = true;
    return result;
  }

  changeRegions(regions: IRegion[]): void {
    // do nothing;
  }

  getVRenderComponents(): IGraphic[] {
    return [];
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing;
  }
  private _getMarkAttributeContext() {
    return {
      vchart: this._option.globalInstance,
      globalScale: (key: string, value: string | number) => {
        return this._option.globalScale.getScale(key)?.scale(value);
      }
    };
  }
}

export const registerCustomMark = () => {
  Factory.registerMark(ImageMark.type, ImageMark); // image mark is only needed In extension-mark component
  Factory.registerComponent(CustomMark.type, CustomMark);
};
