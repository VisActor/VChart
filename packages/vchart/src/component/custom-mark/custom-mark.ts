import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import { LayoutLevel, LayoutZIndex, PREFIX } from '../../constant';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec, ILayoutRect } from '../../typings';
import type { IGroupMark } from '../../mark/group';
import type { IMark } from '../../mark/interface';
import type { LooseFunction, Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { Bounds, isArray, isEqual, isNil, isValid, isValidNumber } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import type { IGraphic } from '@visactor/vrender-core';
import { HOOK_EVENT } from '@visactor/vgrammar-core';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { IModelMarkAttributeContext } from '../../compile/mark/interface';

// TODO: 规范范型
export class CustomMark extends BaseComponent<ICustomMarkSpec<EnableMarkType>> {
  static type = ComponentTypeEnum.customMark;
  type = ComponentTypeEnum.customMark;

  static specKey = 'customMark';
  specKey = 'customMark';

  layoutType: 'none' = 'none';
  layoutZIndex: number = LayoutZIndex.CustomMark;
  layoutLevel: number = LayoutLevel.CustomMark;

  protected declare _spec: ICustomMarkSpec<Exclude<EnableMarkType, 'group'>> | ICustomMarkGroupSpec;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const spec = chartSpec[this.specKey];
    if (!spec) {
      return null;
    }

    if (!isArray(spec)) {
      return [
        {
          spec,
          specPath: [this.specKey],
          specInfoPath: ['component', this.specKey, 0],
          type: ComponentTypeEnum.customMark
        }
      ];
    }

    return (spec as ICustomMarkSpec<EnableMarkType>[]).map((specItem, i) => {
      return {
        spec: specItem,
        specPath: [this.specKey, i],
        specInfoPath: ['component', this.specKey, i],
        type: ComponentTypeEnum.customMark
      };
    });
  }

  created() {
    super.created();
    this.initMarks();
    this.initEvent();
  }

  protected _markAttributeContext: IModelMarkAttributeContext;
  getMarkAttributeContext() {
    return this._markAttributeContext;
  }

  protected _buildMarkAttributeContext() {
    this._markAttributeContext = {
      vchart: this._option.globalInstance,
      globalScale: (key: string, value: string | number) => {
        return this._option.globalScale.getScale(key)?.scale(value);
      }
    };
  }

  protected initMarks() {
    if (!this._spec) {
      return;
    }
    const series = this._option && this._option.getAllSeries();
    const hasAnimation = this._option.animation !== false;
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

    this._createExtensionMark(this._spec, null, `${PREFIX}_series_${this.id}_extensionMark`, 0, {
      depend,
      hasAnimation
    });
  }

  private _createExtensionMark(
    spec: ICustomMarkSpec<Exclude<EnableMarkType, 'group'>> | ICustomMarkGroupSpec,
    parentMark: null | IGroupMark,
    namePrefix: string,
    index: number = 0,
    options: { hasAnimation?: boolean; depend?: IMark[] }
  ) {
    const mark = this._createMark(
      {
        type: spec.type,
        name: `${namePrefix}_${index}`
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

    if (options.hasAnimation) {
      // 自定义图元默认不添加动画
      const config = animationConfig({}, userAnimationConfig(spec.type, spec as any, this._markAttributeContext));
      mark.setAnimationConfig(config);
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
  _compareSpec(spec: ICustomMarkSpec<EnableMarkType>, prevSpec: ICustomMarkSpec<EnableMarkType>) {
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

  afterCompile() {
    this.getMarks().forEach(mark => {
      const product = mark.getProduct();
      if (product) {
        product.addEventListener(HOOK_EVENT.AFTER_ELEMENT_ENCODE, () => {
          if (this._isLayout === false) {
            const component = product.getGroupGraphicItem();
            // TODO: 待 vgrammar 提供接口后进行优化 @zwx
            if (component.listenerCount('*') === 0) {
              component.addEventListener('*', ((event: any, type: string) =>
                this._delegateEvent(component as unknown as IGraphic, event, type)) as LooseFunction);
            }
          }
        });
      }
    });
  }
  private _getMarkAttributeContext() {
    return {
      vchart: this._option.globalInstance,
      chart: this.getChart(),
      globalScale: (key: string, value: string | number) => {
        return this._option.globalScale.getScale(key)?.scale(value);
      },
      getLayoutBounds: () => {
        const { x, y } = this.getLayoutStartPoint();
        const { width, height } = this.getLayoutRect();
        return new Bounds().set(x, y, x + width, y + height);
      }
    };
  }

  private _getLayoutRect() {
    const bounds = new Bounds();

    this.getMarks().forEach(mark => {
      const product = mark.getProduct();

      if (product) {
        bounds.union(product.getBounds());
      }
    });

    if (bounds.empty()) {
      return {
        width: 0,
        height: 0
      };
    }

    return {
      width: bounds.width(),
      height: bounds.height()
    };
  }

  getBoundsInRect(rect: ILayoutRect) {
    this.setLayoutRect(rect);

    const result = this._getLayoutRect();
    const { x, y } = this.getLayoutStartPoint();
    return {
      x1: x,
      y1: y,
      x2: x + result.width,
      y2: y + result.height
    };
  }
}

export const registerCustomMark = () => {
  Factory.registerComponent(CustomMark.type, CustomMark);
};
