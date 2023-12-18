import { DataView } from '@visactor/vdataset';
import type { IComponentOption } from '../interface';
import { LayoutLevel, LayoutZIndex } from '../../constant';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import { BaseComponent } from '../base/base-component';
import type { IRegion } from '../../region/interface';
import type { IIndicator, IIndicatorItemSpec, IIndicatorSpec, IIndicatorTheme } from './interface';
import type { Maybe } from '../../typings';
import { mergeSpec } from '../../util/spec/merge-spec';
import { eachSeries } from '../../util/model';
import { transformToGraphic } from '../../util/style';
import { getActualNumValue } from '../../util/space';
import { isEqual, isValid, isFunction, array, isArray } from '@visactor/vutils';
import { indicatorMapper } from './util';
import type { IModel, IModelSpecInfo } from '../../model/interface';
import { registerDataSetInstanceTransform } from '../../data/register';
import { CompilableData } from '../../compile/data/compilable-data';
import { Indicator as IndicatorComponents } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { IndicatorAttributes } from '@visactor/vrender-components';
import type { IGraphic, INode, IGroup } from '@visactor/vrender-core';
import type { FunctionType } from '../../typings/visual';
import { Factory } from '../../core/factory';
// eslint-disable-next-line no-duplicate-imports
import type { IRichTextCharacter } from '@visactor/vrender-core';

export class Indicator<T extends IIndicatorSpec> extends BaseComponent<T> implements IIndicator {
  static type = ComponentTypeEnum.indicator;
  type = ComponentTypeEnum.indicator;
  name: string = ComponentTypeEnum.indicator;

  static specKey = 'indicator';
  specKey = 'indicator';

  layoutType: 'none' = 'none';
  layoutZIndex: number = LayoutZIndex.Indicator;
  layoutLevel: number = LayoutLevel.Indicator;

  private _gap: number = 0;

  private _activeDatum: any = null;
  private _displayData!: CompilableData;

  private _title: IIndicatorItemSpec;
  private _content: IIndicatorItemSpec[];

  private _indicatorComponent: IndicatorComponents;
  private _cacheAttrs: IndicatorAttributes;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    if (this.type !== Indicator.type) {
      return null;
    }
    const indicatorSpec = chartSpec[this.specKey];
    if (!isArray(indicatorSpec)) {
      if (indicatorSpec.visible === false) {
        return [];
      }
      return [
        {
          spec: indicatorSpec,
          specPath: [this.specKey],
          type: ComponentTypeEnum.indicator
        }
      ];
    }

    const specInfos: IModelSpecInfo[] = [];
    indicatorSpec.forEach((s, i) => {
      if (s && s.visible !== false) {
        specInfos.push({
          spec: s,
          specIndex: i,
          specPath: [this.specKey, i],
          type: ComponentTypeEnum.indicator
        });
      }
    });
    return specInfos;
  }

  created() {
    super.created();
    // data
    this.initData();
    // event
    this.initEvent();
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._gap = this._spec.gap || 0;
    this._title = this._spec.title;
    this._content = array(this._spec.content);
    this._regions = this._option.getRegionsInUserIdOrIndex(array(this._spec.regionId), array(this._spec.regionIndex));
  }

  onRender(ctx: any): void {
    // do nothing
  }

  // region
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  // event
  protected initEvent() {
    const trigger = this._spec.trigger;
    if (trigger === 'none') {
      return;
    }

    if (this._spec.trigger === 'hover') {
      this.event.on('hovered', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(params.value[0]);
        }
      });
      this.event.on('unhovered', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(null);
        }
      });
    } else {
      this.event.on('selected', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(params.value[0]);
        }
      });
      this.event.on('unselected', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(null);
        }
      });
    }
  }

  private updateDatum(datum: any) {
    this._activeDatum = datum;
    this._displayData.updateData();
    const attrs = this._getIndicatorAttrs();
    this._createOrUpdateIndicatorComponent(attrs);
  }

  // data
  private initData() {
    registerDataSetInstanceTransform(this._option.dataSet, 'indicatorFilter', indicatorMapper);
    const displayData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    displayData.transform({
      type: 'indicatorFilter',
      options: {
        title: this._title,
        content: this._content,
        datum: () => this._activeDatum
      }
    });

    displayData.target.addListener('change', this.updateDatum.bind(this));

    this._displayData = new CompilableData(this._option, displayData);
  }

  updateLayoutAttribute(): void {
    const attrs = this._getIndicatorAttrs();
    this._createOrUpdateIndicatorComponent(attrs);

    super.updateLayoutAttribute();
  }

  private _getIndicatorAttrs() {
    const region = this._regions[0];
    const { width, height } = region.getLayoutRect();
    const { x, y } = region.getLayoutStartPoint();

    const contentComponentSpec: IIndicatorItemSpec[] = [];
    array(this._spec.content).forEach((eachItem: IIndicatorItemSpec) => {
      const contentSpec = mergeSpec({}, this._theme.content, eachItem);
      contentComponentSpec.push({
        visible: contentSpec.visible !== false && (contentSpec.field ? this._activeDatum !== null : true),
        space: contentSpec.space || this._gap,
        autoLimit: contentSpec.autoLimit,
        autoFit: contentSpec.autoFit,
        fitPercent: contentSpec.fitPercent,
        style: {
          ...transformToGraphic(contentSpec.style),
          text: this._createText(contentSpec.field, contentSpec.style.text)
        }
      });
    });

    return {
      visible: this._spec.visible !== false && (this._spec.fixed !== false || this._activeDatum !== null),
      size: {
        width: width,
        height: height
      },
      zIndex: this.layoutZIndex,
      x: x,
      y: y,
      dx: this._spec.offsetX ? getActualNumValue(this._spec.offsetX, this._computeLayoutRadius()) : 0,
      dy: this._spec.offsetY ? getActualNumValue(this._spec.offsetY, this._computeLayoutRadius()) : 0,
      limitRatio: this._spec.limitRatio || Infinity,
      title: {
        visible: this._spec.title.visible !== false && (!isValid(this._spec.title.field) || this._activeDatum !== null),
        space: this._spec.title.space || this._gap,
        autoLimit: this._spec.title.autoLimit,
        autoFit: this._spec.title.autoFit,
        fitPercent: this._spec.title.fitPercent,
        style: {
          ...transformToGraphic(this._spec.title.style),
          text: this._createText(this._spec.title.field, this._spec.title.style.text)
        }
      },
      content: contentComponentSpec
    } as IndicatorAttributes;
  }

  private _createOrUpdateIndicatorComponent(attrs: IndicatorAttributes): IndicatorComponents {
    if (this._indicatorComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._indicatorComponent.setAttributes(attrs);
      }
    } else {
      const container = this.getContainer();
      //FIXME:类型“IndicatorAttributes”的参数不能赋给类型“Required<IndicatorAttributes>”的参数
      const indicator = new IndicatorComponents(attrs as any);
      indicator.name = 'indicator';
      container.add(indicator as unknown as INode);
      this._indicatorComponent = indicator;
      this._indicatorComponent.on('*', (event: any, type: string) =>
        this._delegateEvent(this._indicatorComponent as unknown as IGraphic, event, type)
      );
    }
    this._cacheAttrs = attrs;
    return this._indicatorComponent;
  }

  private _createText(
    field: string | undefined,
    text:
      | string
      | number
      | string[]
      | number[]
      | IRichTextCharacter[]
      | FunctionType<number | number[] | string | string[] | IRichTextCharacter[]>
  ) {
    if (field) {
      return this._activeDatum ? this._activeDatum[field] : '';
    }
    if (isFunction(text)) {
      return text(this._activeDatum, undefined) ?? '';
    }
    return text ?? '';
  }

  private _computeLayoutRadius() {
    const region = this._regions[0];
    const { width, height } = region.getLayoutRect();
    return Math.min(width / 2, height / 2);
  }

  private isRelativeModel(model: IModel) {
    return eachSeries(this._regions, s => model === s) || this._regions.includes(model as IRegion);
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._indicatorComponent] as unknown as IGroup[];
  }

  clear(): void {
    this._cacheAttrs = null;
    super.clear();
  }
}

export const registerIndicator = () => {
  Factory.registerComponent(Indicator.type, Indicator);
};
