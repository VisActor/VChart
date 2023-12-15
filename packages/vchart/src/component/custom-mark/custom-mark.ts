import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IComponentOption } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import { LayoutLevel, LayoutZIndex, PREFIX } from '../../constant';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec } from '../../typings';
import type { IGroupMark } from '../../mark/group';
import type { MarkTypeEnum } from '../../mark/interface';
import type { Maybe } from '@visactor/vutils';
import { isEqual, isNil, isValid, isValidNumber } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import { ImageMark, registerImageMark } from '../../mark/image';
import type { IGraphic } from '@visactor/vrender-core';

export class CustomMark extends BaseComponent<any> {
  static type = ComponentTypeEnum.customMark;
  type = ComponentTypeEnum.customMark;

  static specKey = 'customMark';
  specKey = 'customMark';

  layoutType: 'none' = 'none';
  layoutZIndex: number = LayoutZIndex.CustomMark;
  layoutLevel: number = LayoutLevel.CustomMark;

  protected declare _spec: (ICustomMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | ICustomMarkGroupSpec)[];

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const spec = chartSpec[this.specKey];
    if (!spec) {
      return null;
    }
    return [
      {
        spec,
        specIndex: 0,
        specPath: [this.specKey],
        type: ComponentTypeEnum.customMark
      }
    ];
  }

  static createComponent(specInfo: IModelSpecInfo, options: IComponentOption) {
    const { spec, ...others } = specInfo;
    return new CustomMark(spec, {
      ...options,
      ...others
    });
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
        // 避免二次dataflow
        skipBeforeLayouted: true,
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

  protected _getNeedClearVRenderComponents(): IGraphic[] {
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
  registerImageMark();
  Factory.registerComponent(CustomMark.type, CustomMark);
};
