import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import { LayoutZIndex } from '../../constant/layout';
import type { ILabelSpec } from './interface';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';
import type { LooseFunction } from '@visactor/vutils';
import { array, isEqual } from '@visactor/vutils';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import type { IComponentMark } from '../../mark/interface/mark';
import type { ICompilableMark } from '../../compile/mark/interface';
import { DiffState } from '../../mark/interface/enum';
import type { Datum } from '../../typings/common';
import { MarkTypeEnum } from '../../mark/interface/type';

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

  _getDataLabelType(baseMark: ICompilableMark, type?: string) {
    const markType = baseMark.type;

    if (markType === 'line' || markType === 'area') {
      return type ?? 'line-data';
    }
    if (markType === MarkTypeEnum.rect || markType === MarkTypeEnum.rect3d) {
      return 'rect';
    }

    if (markType === MarkTypeEnum.arc || markType === MarkTypeEnum.arc3d) {
      return 'arc';
    }

    if (markType === MarkTypeEnum.symbol || markType === MarkTypeEnum.cell) {
      return 'symbol';
    }
  }

  _setTransformOfComponent(labelComponent: IComponentMark, baseMark: ICompilableMark | ICompilableMark[]) {
    labelComponent.setAttributeTransform(({ labelStyle, size, itemEncoder }) => {
      const labelStyleRes = labelStyle();
      const dataLabels = array(baseMark).map(mark => {
        const labelData: any[] = [];
        const graphics = (mark as any).getGraphics();

        if (!graphics) {
          return;
        }

        graphics.forEach((g: IGraphic) => {
          const { data, diffState } = g.context;

          if (diffState !== DiffState.exit) {
            data.forEach((datum: Datum) => {
              labelData.push({
                data: datum,
                ...itemEncoder(datum)
              });
            });
          }
        });

        return {
          baseMarkGroupName: mark.getProductId(),
          getBaseMarks: () => graphics,
          ...labelStyleRes,
          type: this._getDataLabelType(mark, labelStyleRes.type),
          data: labelData
        };
      });

      return {
        dataLabels,
        size: size()
      };
    });
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
