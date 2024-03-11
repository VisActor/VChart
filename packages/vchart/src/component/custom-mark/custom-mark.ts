import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IComponentOption } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import { LayoutLevel, LayoutZIndex, PREFIX } from '../../constant';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec } from '../../typings';
import type { IGroupMark } from '../../mark/group';
import type { IMark, MarkTypeEnum } from '../../mark/interface';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEqual, isNil, isValid, isValidNumber } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import { registerImageMark } from '../../mark/image';
import type { IGraphic } from '@visactor/vrender-core';

// TODO: 规范范型
export class CustomMark<T = any> extends BaseComponent<any> {
  static type = ComponentTypeEnum.customMark;
  type = ComponentTypeEnum.customMark;

  static specKey = 'customMark';
  specKey = 'customMark';

  layoutType: 'none' = 'none';
  layoutZIndex: number = LayoutZIndex.CustomMark;
  layoutLevel: number = LayoutLevel.CustomMark;

  protected declare _spec: (ICustomMarkSpec<Exclude<EnableMarkType, 'group'>> | ICustomMarkGroupSpec)[];

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const spec = chartSpec[this.specKey];
    if (!spec) {
      return null;
    }
    return [
      {
        spec,
        specPath: [this.specKey],
        specInfoPath: ['component', this.specKey, 0],
        type: ComponentTypeEnum.customMark
      }
    ];
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
    const series = this._option && this._option.getAllSeries();
    const depend: IMark[] = [];

    if (series && series.length) {
      series.forEach(s => {
        const marks = s && s.getMarksWithoutRoot();

        if (marks && marks.length) {
          marks.forEach(mark => {
            depend.push(mark);
          });
        }
      });
    }

    this._spec.forEach((m, i) => {
      this._createExtensionMark(m, null, `${PREFIX}_series_${this.id}_extensionMark`, i, { depend });
    });
  }

  private _createExtensionMark(
    spec: ICustomMarkSpec<Exclude<EnableMarkType, 'group'>> | ICustomMarkGroupSpec,
    parentMark: null | IGroupMark,
    namePrefix: string,
    index: number,
    options: { hasAnimation?: boolean; depend?: IMark[] }
  ) {
    const mark = this._createMark(
      {
        type: spec.type,
        name: `${PREFIX}_${index}`
      },
      {
        // 避免二次dataflow
        skipBeforeLayouted: true,
        attributeContext: this._getMarkAttributeContext(),
        componentType: spec.componentType,
        key: spec.dataKey
      }
    ) as IGroupMark;
    if (!mark) {
      return;
    }

    if (options.depend && options.depend.length) {
      mark.setDepend(...options.depend);
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
        this._createExtensionMark(s as any, mark, namePrefix, i, options);
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
  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    if (!isEqual(prevSpec, spec)) {
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
